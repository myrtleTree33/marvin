import axios from 'axios';
import cheerio from 'cheerio';
import Queue from './Queue';
import { getAbsoluteUrl, isBaseOf, isAbsoluteUrl, resolveUrl } from './Util';

class Marvin {
  constructor({ queue = new Queue() }) {
    this.queue = queue;
  }

  load({ url }) {
    this.rootUrl = url;
    this.queue.add({ url, priority: -1 });
  }

  start() {
    setInterval(() => {
      (async () => {
        const curr = this.queue.next();
        if (!curr) {
          return;
        }
        console.log('retrieving');
        const { url } = curr;
        try {
          this.scrapePage(url);
        } catch (e) {}
      })();
    }, 0);
  }

  async scrapePage(url) {
    try {
      const result = await axios.get(url);
      const $ = cheerio.load(result.data);
      $('a').each((i, link) => {
        const expandedRelUrl = $(link).attr('href');
        const expandedUrl = resolveUrl(this.rootUrl, expandedRelUrl);
        if (expandedUrl) {
          const isAdded = this.queue.add({ url: expandedUrl, priority: 1 });
          // TODO there is issue with duplicate URLs
          if (isAdded) {
            console.log(`expanding ${expandedUrl}`);
          }
        }
      });
    } catch (e) {
      console.error(`Unable to retrieve page ${url}`);
    }
  }
}

export default Marvin;

// (async () => {
//   const nextLink = this.queue.next();
//   if (nextLink == null) {
//     return null;
//   }
//   const { url } = nextLink;
//   try {
//   } catch (e) {}
// })();
