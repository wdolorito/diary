const NodeCache = require('node-cache')

class Cache {
  constructor(ttlSeconds) {
    this.cache = new NodeCache({ stdTTL: ttlSeconds, checkperiod: ttlSeconds * 0.2, useClones: false })
  }

  get(key, storeFunction) {
    const value = this.cache.get(key)
    if (value) {
      console.log('cache hit ' + key)
      return Promise.resolve(value)
    }

    return storeFunction().then((result) => {
      console.log('cache miss ' + key)
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
}


module.exports = Cache
