import cheerio from 'cheerio';
import axios from 'axios';
import MemoryCache from './caches/MemoryCache';
import { resolveUrl } from './UrlUtils';

class Marvin {
  constructor({
    cache = new MemoryCache(),
    minInterval = 2000,
    randInterval = 5000
  }) {
    this.cache = cache;
    this.minInterval = minInterval;
    this.randInterval = randInterval;
  }

  load({ url }) {
    (async () => {
      this.rootUrl = url;
      await this.cache.add({ url, priority: -1 });
    })();
  }

  start() {
    const { cache, minInterval, randInterval } = this;
    const timeout = Math.random(minInterval) + randInterval;
    setInterval(() => {
      (async () => {
        const curr = await cache.next();
        if (!curr) {
          return;
        }
        const { url } = curr;
        try {
          console.log(`Scraping ${url}`);
          await this.scrapePage(url);
        } catch (e) {}
      })();
    }, 200);
  }

  async scrapePage(url) {
    console.log('scraped.');
    try {
      console.log('awaiting..');
      const result = await axios.get(url);
      const $ = cheerio.load(result.data);
      $('a').each((i, link) => {
        (async () => {
          const expandedRelUrl = $(link).attr('href');
          const expandedUrl = resolveUrl(this.rootUrl, expandedRelUrl);
          if (expandedUrl) {
            const isAdded = await this.cache.add({
              url: expandedUrl,
              priority: 1
            });
            // TODO there is issue with duplicate URLs
            if (isAdded) {
              // console.log(`Added ${expandedUrl}`);
            }
          }
        })();
      });
    } catch (e) {
      console.error(`Unable to retrieve page ${url}`);
    }
  }
}

export default Marvin;
