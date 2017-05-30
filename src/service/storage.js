'use strict'

class Storage {
  constructor (provider) {
    const Provider = provider ? require('../providers/redis') : require('../providers/app')
    this.provider = new Provider(provider)
  }

  /**
   * Get value from storage.
   * @param key
   */
  async get (key) {
    return await this.provider.get(key)
  }

  /**
   * Set value in storage.
   * @param key
   * @param value
   * @param ttl
   */
  set (key, value, ttl) {
    this.provider.set(key, value, ttl)
  }
}

module.exports = Storage
