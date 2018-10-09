#!/usr/bin/env node

import mongoose from 'mongoose';
import app from 'commander';

import Marvin from './lib/Marvin';
import logger from './lib/util/logger';
import MongoStore from './lib/stores/MongoStore';
import MongoCache from './lib/caches/MongoCache';

export default function runMain() {
  app
    .version('0.0.1')
    .option('-U, --uri [uri]', 'Mongo URI to use', 'mongodb://localhost/test')
    .option(
      '-M, --min-interval [mSecs]',
      'The minimum interval between requests, in milliseconds',
      20
    )
    .option(
      '-m, --rand-interval [mSecs]',
      'The random interval to use between requests, in milliseconds',
      20
    )
    .option('-n, --numJobs [numJobs]', 'The number of workers to spawn', 2)
    .option(
      '-i, --jobIntervalMs [ms]',
      'The number of milliseconds to wait before launching each job',
      2000
    )
    .option(
      '-s, --scrapeUrl [url]',
      'The URL to start scraping.  If not specified, pulls one from the dsitributed queue.'
    )
    .parse(process.argv);

  const uri = 'mongodb://localhost/test';
  mongoose.connect(uri);

  console.log(app);

  const marvin = new Marvin({
    // rootUrl: 'https://www.kompasiana.com/',
    rootUrl: app.scrapeUrl,
    store: new MongoStore(mongoose),
    cache: new MongoCache(mongoose),
    minInterval: app.minInterval,
    randInterval: app.randInterval,
    numJobs: app.numJobs,
    jobsIntervalMaxSeedMs: app.jobsIntervalMs
  });
  marvin.start();
}

if (require.main === module) {
  runMain();
}
