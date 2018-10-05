import Marvin from './lib/Marvin';
import mongoose from 'mongoose';
import logger from './lib/util/logger';
import MemoryStore from './lib/stores/MemoryStore';
import MongoStore from './lib/stores/MongoStore';
import MongoCache from './lib/caches/MongoCache';

const uri = 'mongodb://localhost/test';
mongoose.connect(uri);

const marvin = new Marvin({
  store: new MongoStore(mongoose),
  cache: new MongoCache(mongoose),
  minInterval: 20,
  randInterval: 50,
  url: 'https://www.kompasiana.com/'
});
marvin.start();
logger.info('Marvin started.');

export default function app() {
  //begin writing your code here
}

if (require.main === module) {
  app();
}
