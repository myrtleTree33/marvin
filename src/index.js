import Marvin from './lib/Marvin';
import mongoose from 'mongoose';
import logger from './lib/util/logger';
import MemoryStore from './lib/stores/MemoryStore';
import MongoStore from './lib/stores/MongoStore';
import MongoCache from './lib/caches/MongoCache';

const uri = 'mongodb://localhost/test';
mongoose.connect(uri);

const marvin = new Marvin({
  rootUrl: 'https://www.kompasiana.com/',
  store: new MongoStore(mongoose),
  cache: new MongoCache(mongoose),
  minInterval: 20,
  randInterval: 50
});
marvin.start();
logger.info('Marvin started.');

export default function app() {
  //begin writing your code here
}

if (require.main === module) {
  app();
}
