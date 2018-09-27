import { relativeTimeThreshold } from 'moment';

class Queue {
  constructor() {
    this.items = [];
    this.urls = {};
  }

  add(item) {
    this.items.push(item);
    const { url } = item;
    this.urls = { ...this.urls, url };
  }

  contains(item) {
    const { url } = item;
    return url in this.urls;
  }

  next() {
    const item = this.items.shift();
    delete this.urls[item.url];
    return item;
  }
}

export default Queue;
