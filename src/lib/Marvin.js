import cheerio from 'cheerio';
import axios from 'axios';
import MemoryCache from './caches/MemoryCache';
import { resolveUrl, getBaseUrl } from './UrlUtils';
import MemoryStore from './stores/MemoryStore';

import sleep from 'await-sleep';

class Marvin {
  constructor({
    cache = new MemoryCache(),
    store = new MemoryStore(),
    url = null,
    minInterval = 200,
    randInterval = 2000
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
    const timeDelay = Math.random(minInterval) + randInterval;

    const runJob = () => {
      console.log('runing task..');
      (async () => {
        const currItem = await cache.next();
        if (!currItem) {
          console.log('got here');
          setTimeout(runJob, timeDelay);
          return;
        }
        const { url } = currItem;
        try {
          console.log(`Scraping ${url}`);
          await this.scrapePage(currItem);
        } catch (e) {}
        setTimeout(runJob, timeDelay);
      })();
    };
    runJob();

    // setInterval(() => {
    //   (async () => {
    //     const currItem = await cache.next();
    //     if (!currItem) {
    //       return;
    //     }
    //     const { url } = currItem;
    //     try {
    //       console.log(`Scraping ${url}`);
    //       await this.scrapePage(currItem);
    //     } catch (e) {}
    //   })();
    // }, 500);
    // return this;
  }

  async scrapePage(item) {
    const { url } = item;
    console.log('scraped.');
    try {
      console.log('------------------');
      console.log(url);
      console.log('------------------');
      const result = await axios.get(url);
      const $ = cheerio.load(result.data);

      // store the page asynchronously
      this.store.upsert({ url, htmlText: result.data });
      console.log($('a').length + ' links found');

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
