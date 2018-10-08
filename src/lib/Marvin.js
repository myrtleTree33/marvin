import cheerio from 'cheerio';
import axios from 'axios';
import sleep from 'await-sleep';

import MemoryCache from './caches/MemoryCache';
import { resolveUrl, getBaseUrl } from './UrlUtils';
import MemoryStore from './stores/MemoryStore';
import logger from './util/logger';
import { genNumArray } from './Utils';

class Marvin {
  constructor({
    cache = new MemoryCache(),
    store = new MemoryStore(),
    rootUrl = null,
    minInterval = 200,
    randInterval = 2000,
    numJobs = 1,
    jobsIntervalMaxSeedMs = 2000
  }) {
    this.cache = cache;
    this.store = store;
    this.minInterval = minInterval;
    this.randInterval = randInterval;
    this.numJobs = numJobs;
    this.jobsIntervalMaxSeedMs = jobsIntervalMaxSeedMs;

    // load URL by default, if specified.
    if (rootUrl) {
      this.load({ rootUrl, priority: -1 });
      logger.info(`URL=${rootUrl} specified, adding to queue.`);
      return;
    }
    logger.info('No rootURL specified; proceeding to draw from queue.');
  }

  loadUrl({ rootUrl, priority = -1 }) {
    (async () => {
      await this.cache.add({ url: rootUrl, rootUrl, priority });
    })();
    return this;
  }

  start() {
    const { cache, minInterval, randInterval } = this;
    const timeDelay = minInterval + Math.random() * randInterval;

    const runJob = jobId => {
      (async () => {
        let currItem = await cache.next();
        while (!currItem) {
          currItem = await cache.next();
          if (!currItem) {
            // this is to prevent overpolling
            // if there is no item to retrieve
            logger.info(`[jobId=${jobId}] No item in queue, sleeping..`);
            sleep(timeDelay);
          }
        }

        try {
          await this.scrapePage(jobId, currItem);
        } catch (e) {}
        setTimeout(() => {
          runJob(jobId);
        }, timeDelay);
      })();
    };

    // create an array to pass index to each worker
    const numArray = genNumArray(this.numJobs);
    numArray.forEach(i => {
      logger.info(`Started job ${i}..`);
      (async () => {
        const sleepIntervalMs = Math.random() * this.jobsIntervalMaxSeedMs;
        await sleep(sleepIntervalMs);
        runJob(i);
      })();
    });
  }

  async scrapePage(jobId, item) {
    const { url, rootUrl } = item;
    try {
      const result = await axios.get(url);
      const $ = cheerio.load(result.data);
      // store the page asynchronously
      this.store.upsert({ url, htmlText: result.data });
      const numLinks = $('a').length;
      logger.info(
        `[JobId=${jobId}] Scraping url=${url} ${numLinks} links found`
      );

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
              logger.info(`[JobId=${jobId}] Added ${expandedUrl}`);
            }
          }
        })();
      });
      await this.cache.delist(item);
    } catch (e) {
      logger.error(`Unable to retrieve page ${url}`);
      logger.error(e);
      // TODO put link in the retry queue, if need be.
    }
  }
}

export default Marvin;
