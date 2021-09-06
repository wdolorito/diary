const NodeCache = require('node-cache')

class Cache {
  constructor(name, ttlSeconds) {
    this.name = name
    this.cache = new NodeCache({ stdTTL: ttlSeconds, checkperiod: ttlSeconds * 0.2, useClones: false })
    this.cache.on('set', (key, val) => {
      console.log('setting', key)
    })
    this.cache.on('del', (key, val) => {
      console.log('deleting', key)
    })
    this.cache.on('expired', (key, val) => {
      console.log('expiring old data:', key)
    })
    this.cache.on('flush', () => {
      console.log('manually flushed', name)
    })
  }

  get(key, storeFunction) {
    const value = this.cache.get(key)
    if (value) {
      console.log('\t', this.name, 'hit', key)
      return Promise.resolve(value)
    }

    return storeFunction().then((result) => {
      console.log('\t', this.name, 'missed', key)
      this.cache.set(key, result)
      return result
    })
  }

  del(keys) {
    this.cache.del(keys)
  }

  flush() {
    this.cache.flushAll()
  }

  stats() {
    const stats = {}
    stats.keys = this.cache.keys()
    stats.stats = this.cache.getStats()
    return stats
  }
}

module.exports = Cache
