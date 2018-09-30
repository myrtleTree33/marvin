import PriorityQueue from 'priorityqueue';

class Queue {
  constructor() {
    this.queue = new PriorityQueue({
      comparator: (a, b) => a.priority < b.priority
    });
    this.urls = {}; // maintain a set for comparison
  }

  add(item) {
    if (this.explored(item)) {
      return false;
    }
    this.queue.push(item);
    const { url } = item;
    this.urls = { ...this.urls, url };
    return true;
  }

  explored(item) {
    const { url } = item;
    if (!url) {
      return false;
    }
    return url in this.urls;
  }

  next() {
    const item = this.queue.pop();
    if (!item) {
      return null;
    }
    return item;
  }

  size() {
    return this.queue.size();
  }

  empty() {
    return this.queue.size() === 0;
  }
}

export default Queue;
