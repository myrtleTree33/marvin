import mongoose from 'mongoose';

const { Schema } = mongoose;

const cacheItemSchema = new Schema({
  url: {
    type: String,
    unique: true
  },
  baseUrl: String,
  priority: Number,
  isScraping: {
    type: Boolean,
    default: false
  },
  dateAdded: { type: Date, default: Date.now }
});

class MongoCache {
  constructor(mongooseConn) {
    this.mongoose = mongooseConn;
    this.CacheItem = this.mongoose.model('CacheItem', cacheItemSchema);
  }

  async add(item) {
    // TODO there is some issue, casusing multiple add
    if (await this.explored(item)) {
      return Promise.resolve(false);
    }
    const { url, baseUrl, priority, dateAdded } = item;
    try {
      const cacheItem = await this.CacheItem({
        url,
        baseUrl,
        priority,
        dateAdded
      }).save();
      return Promise.resolve(true);
    } catch (e) {
      return Promise.resolve(false);
    }
  }

  async explored(item) {
    const { url } = item;
    return this.CacheItem.findOne({ url });
  }

  async next() {
    // TODO get data where isScraping is true,
    // but has not been scraped for a long time
    // as well.
    const cacheItems = await this.CacheItem.find({ isScraping: false }, null, {
      limit: 1,
      sort: { priority: 1 }
    });
    const cacheItem = cacheItems.length === 1 ? cacheItems[0] : null;
    const { url } = cacheItem;
    // return this.CacheItem.findOneAndUpdate({ url }, { isScraping: true });
    return this.CacheItem.findOne({ url });
  }

  async size() {
    return this.CacheItem.find({}).count();
  }

  async delist(item) {
    const { url } = item;
    return this.CacheItem.remove({ url });
  }

  async empty() {
    return Promise.resolve((await this.size()) === 0);
  }
}

export default MongoCache;
