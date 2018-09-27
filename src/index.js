import axios from 'axios';
import cheerio from 'cheerio';

(async () => {
  const result = await axios.get('http://www.channelnewsasia.com');
  const $ = cheerio.load(result.data);
  //   console.log(result);
  $('a').each((i, link) => {
    console.log($(link).attr('href'));
  });
})();

export default function app() {
  //begin writing your code here
}

if (require.main === module) {
  app();
}
