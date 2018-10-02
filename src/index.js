import Marvin from './lib/Marvin';
import mongoose from 'mongoose';
import MemoryStore from './lib/stores/MemoryStore';
import MongoStore from './lib/stores/MongoStore';
import MongoCache from './lib/caches/MongoCache';

const uri = 'mongodb://localhost/test';
mongoose.connect(uri);

const marvin = new Marvin({
  store: new MongoStore(mongoose),
  cache: new MongoCache(mongoose),
  url: 'https://www.kompasiana.com/'
});
marvin.start();

export default function app() {
  //begin writing your code here
}

if (require.main === module) {
  app();
}
