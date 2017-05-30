'use strict'

const BaseProvider = require('./base')

class RedisProvider extends BaseProvider {
  constructor (client) {
    super()
    this.client = client
  }

  /**
   * Get value from redis.
   * @param key
   */
  get (key) {
    return this.client.get(key).then(response => JSON.parse(response))
  }

  /**
   * Set value in redis.
   * @param key
   * @param value
   * @param ttl
   */
  set (key, value, ttl) {
    this.client.set(key, JSON.stringify(value), 'ex', ttl / 1000)
  }
}

module.exports = RedisProvider
