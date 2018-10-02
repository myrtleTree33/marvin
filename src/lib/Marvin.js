import cheerio from 'cheerio';
import axios from 'axios';
import MemoryCache from './caches/MemoryCache';
import { resolveUrl, getBaseUrl } from './UrlUtils';
import MemoryStore from './stores/MemoryStore';

class Marvin {
  constructor({
    cache = new MemoryCache(),
    store = new MemoryStore(),
    url = null,
    minInterval = 2000,
    randInterval = 5000
  }) {
    this.cache = cache;
    this.store = store;
    this.minInterval = minInterval;
    this.randInterval = randInterval;
    this.url = url;

    // load URL by default, if specified.
    if (this.url) {
      this.load({ url });
    }
  }

  load({ url }) {
    (async () => {
      this.rootUrl = url;
      await this.cache.add({ url, priority: -1 });
    })();
    return this;
  }

  start() {
    const { cache, minInterval, randInterval } = this;
    const timeout = Math.random(minInterval) + randInterval;
    setInterval(() => {
      (async () => {
        const currItem = await cache.next();
        if (!currItem) {
          return;
        }
        const { url } = currItem;
        try {
          console.log(`Scraping ${url}`);
          await this.scrapePage(currItem);
        } catch (e) {}
      })();
    }, 2000);
    return this;
  }

  async scrapePage(item) {
    const { url } = item;
    console.log('scraped.');
    try {
      const result = await axios.get(url);
      const $ = cheerio.load(result.data);

      // store the page asynchronously
      this.store.upsert({ url, htmlText: result.data });

      $('a').each((i, link) => {
        (async () => {
          const expandedRelUrl = $(link).attr('href');
          const expandedUrl = resolveUrl(this.rootUrl, expandedRelUrl);
          if (expandedUrl) {
            const isAdded = await this.cache.add({
              url: expandedUrl,
              baseUrl: getBaseUrl(expandedUrl),
              priority: 1
            });
            // TODO there is issue with duplicate URLs
            if (isAdded) {
              // console.log(`Added ${expandedUrl}`);
            }
          }
        })();
      });
      await this.cache.delist(item);
    } catch (e) {
      console.log(e);
      console.error(`Unable to retrieve page ${url}`);
    }
  }
}

export default Marvin;
