import cheerio from 'cheerio';
import axios from 'axios';
import MemoryCache from './caches/MemoryCache';
import { resolveUrl, getBaseUrl } from './UrlUtils';
import MemoryStore from './stores/MemoryStore';
import logger from './util/logger';

class Marvin {
  constructor({
    cache = new MemoryCache(),
    store = new MemoryStore(),
    rootUrl = null,
    minInterval = 200,
    randInterval = 2000
  }) {
    this.cache = cache;
    this.store = store;
    this.minInterval = minInterval;
    this.randInterval = randInterval;

    // load URL by default, if specified.
    if (rootUrl) {
      this.load({ rootUrl, priority: -1 });
      logger.info(`URL=${rootUrl} specified, adding to queue.`);
      return;
    }
    logger.info('No rootURL specified; proceeding to draw from queue.');
  }

  load({ rootUrl, priority = -1 }) {
    (async () => {
      await this.cache.add({ url: rootUrl, rootUrl, priority });
    })();
    return this;
  }

  start() {
    const { cache, minInterval, randInterval } = this;
    const timeDelay = Math.random(minInterval) + randInterval;

    const runJob = () => {
      (async () => {
        let currItem = await cache.next();
        while (!currItem) {
          currItem = await cache.next();
        }

        try {
          await this.scrapePage(currItem);
        } catch (e) {}
        setTimeout(runJob, timeDelay);
      })();
    };
    runJob();
  }

  async scrapePage(item) {
    const { url, rootUrl } = item;
    try {
      const result = await axios.get(url);
      const $ = cheerio.load(result.data);
      // store the page asynchronously
      this.store.upsert({ url, htmlText: result.data });
      const numLinks = $('a').length;
      logger.info(`Scraping url=${url} ${numLinks} links found`);

      $('a').each((i, link) => {
        (async () => {
          const expandedRelUrl = $(link).attr('href');
          const expandedUrl = resolveUrl(rootUrl, expandedRelUrl);
          if (expandedUrl) {
            const isAdded = await this.cache.add({
              url: expandedUrl,
              rootUrl: getBaseUrl(expandedUrl),
              priority: 1
            });
            // TODO there is issue with duplicate URLs
            if (isAdded) {
              console.log(`Added ${expandedUrl}`);
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
