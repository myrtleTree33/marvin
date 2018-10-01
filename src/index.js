import Marvin from './lib/Marvin';

const marvin = new Marvin({});
marvin.load({
  // url: 'http://channelnewsasia.com/'
  // url: 'http://malaysiakini.com/'
  // url: 'http://voiz.asia/'
  url: 'https://www.kompasiana.com/'
});
marvin.start();

export default function app() {
  //begin writing your code here
}

if (require.main === module) {
  app();
}
