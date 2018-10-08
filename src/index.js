import mongoose from 'mongoose';

import Marvin from './lib/Marvin';
import logger from './lib/util/logger';
import MongoStore from './lib/stores/MongoStore';
import MongoCache from './lib/caches/MongoCache';

export default function app() {
  const uri = 'mongodb://localhost/test';
  mongoose.connect(uri);

  const marvin = new Marvin({
    rootUrl: 'https://www.kompasiana.com/',
    store: new MongoStore(mongoose),
    cache: new MongoCache(mongoose),
    minInterval: 20,
    randInterval: 20,
    numJobs: 2,
    jobsIntervalMaxSeedMs: 2000
  });
  marvin.start();
}

if (require.main === module) {
  app();
}
