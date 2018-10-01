import PriorityQueue from 'priorityqueue';

class MemoryCache {
  constructor() {
    this.queue = new PriorityQueue({
      comparator: (a, b) => a.priority < b.priority
    });
    this.urls = {}; // maintain a set for comparison
  }

  async add(item) {
    if (await this.explored(item)) {
      return Promise.resolve(false);
    }
    this.queue.push(item);
    const { url } = item;
    this.urls[url] = item;
    return Promise.resolve(true);
  }

  async explored(item) {
    const { url } = item;
    if (!url) {
      return Promise.resolve(false);
    }
    return Promise.resolve(url in this.urls);
  }

  async next() {
    const item = this.queue.pop();
    if (!item) {
      return Promise.resolve(null);
    }
    return Promise.resolve(item);
  }

  async size() {
    return Promise.resolve(this.queue.size());
  }

  async empty() {
    return Promise.resolve(this.queue.size() === 0);
  }
}

export default MemoryCache;
