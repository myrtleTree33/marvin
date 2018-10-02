import Marvin from './lib/Marvin';
import MemoryStore from './lib/stores/MemoryStore';
import MongoStore from './lib/stores/MongoStore';

const marvin = new Marvin({
  store: new MongoStore('mongodb://localhost/test')
});
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
