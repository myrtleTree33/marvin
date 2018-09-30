import axios from 'axios';
import cheerio from 'cheerio';
import Queue from './lib/Queue';
import Marvin from './lib/Marvin';
import {
  getAbsoluteUrl,
  isBaseOf,
  resolveUrl,
  isAbsoluteUrl
} from './lib/Util';
import { isAbsolute } from 'path';

// (async () => {
//   const result = await axios.get('http://www.channelnewsasia.com');
//   const $ = cheerio.load(result.data);
//   //   console.log(result);
//   $('a').each((i, link) => {
//     console.log($(link).attr('href'));
//   });

// console.log(
//   await getAbsoluteUrl(
//     'http://www.lego.com/cars',
//     'http:www.google.com/engine'
//   )
// );
// console.log(
//   await isBaseOf('http://www.google.com', 'http://www.google.com/cars')
// );
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
  // url: 'http://channelnewsasia.com/'
  url: 'http://malaysiakini.com/'
});
marvin.start();

// (async () => {
// })();

export default function app() {
  //begin writing your code here
}

if (require.main === module) {
  app();
}
