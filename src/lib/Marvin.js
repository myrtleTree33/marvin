import axios from 'axios';
import cheerio from 'cheerio';
import Queue from './Queue';

class Marvin {
  constructor({ queue = new Queue() }) {
    this.queue = queue;
  }

  load({ url }) {
    this.queue.add({ url, priority: -1 });
  }

  start() {
    setInterval(() => {
      (async () => {
        const curr = this.queue.next();
        if (curr == null) {
          return;
        }
        const { url } = curr;
        try {
          this.scrapePage(url);
        } catch (e) {}
      })();
    }, 0);
  }

  async scrapePage(url) {
    const result = await axios.get(url);
    const $ = cheerio.load(result.data);
    // console.log(`expanded ${url}`);
    $('a').each((i, link) => {
      const expandedUrl = $(link).attr('href');
      console.log(`expanding ${expandedUrl}`);
      this.queue.add({ url: expandedUrl, priority: 1 });
    });
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
