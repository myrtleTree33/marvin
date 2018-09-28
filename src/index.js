import axios from 'axios';
import cheerio from 'cheerio';
import Queue from './lib/Queue';
import Marvin from './lib/Marvin';

// (async () => {
//   const result = await axios.get('http://www.channelnewsasia.com');
//   const $ = cheerio.load(result.data);
//   //   console.log(result);
//   $('a').each((i, link) => {
//     console.log($(link).attr('href'));
//   });
// })();

// const q = new Queue();
// q.add({ url: 'http://asbc.com', priority: 1 });
// q.add({ url: 'http://111.com', priority: 1 });
// q.add({ url: 'http://333.com', priority: 1 });

// while (!q.empty()) {
//   console.log(q.next());
// }

const marvin = new Marvin({});
marvin.load({
  url: 'http://channelnewsasia.com/'
});
marvin.start();

export default function app() {
  //begin writing your code here
}

if (require.main === module) {
  app();
}
