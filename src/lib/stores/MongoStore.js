import mongoose from 'mongoose';

const { Schema } = mongoose;

const itemSchema = new Schema({
  url: String,
  htmlText: String,
  dateScraped: { type: Date, default: Date.now }
});

class MongoStore {
  constructor(uri) {
    mongoose.connect(uri);
    this.Item = mongoose.model('Item', itemSchema);
  }

  async retrieve(url) {
    return this.Item.findOne({ url });
  }

  async upsert(item) {
    console.log('saved item!');
    const itemDb = new this.Item({
      url: item.url,
      htmlText: item.htmlText
    });
    return itemDb.save();
  }

  async remove(url) {
    return this.Item.remove({ url });
  }

  async size() {
    return this.Item.count({});
  }
}

export default MongoStore;
