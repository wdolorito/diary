const NodeCache = require('node-cache')

class Cache {
  constructor(name, ttlSeconds) {
    this.name = name
    this.cache = new NodeCache({ stdTTL: ttlSeconds, checkperiod: ttlSeconds * 0.2, useClones: false })
    this.cache.on('set', (key, val) => {
      console.log('setting', key, 'to:')
      console.log(val)
    })
    this.cache.on('del', (key, val) => {
      console.log('deleting', key)
      console.log(val)
    })
    this.cache.on('expired', (key, val) => {
      console.log(key, 'expiring old data:')
      console.log(val)
    })
    this.cache.on('flush', () => {
      console.log(name, 'manually flushed')
    })
  }

  get(key, storeFunction) {
    const value = this.cache.get(key)
    if (value) {
      console.log(this.name, 'hit', key)
      return Promise.resolve(value)
    }

    return storeFunction().then((result) => {
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
