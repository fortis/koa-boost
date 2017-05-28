'use strict'

class Storage {
  constructor () {
    this.data = {}
  }

  /**
   * Get value from storage.
   * @param key
   */
  get (key) {
    return this.data[key]
  }

  /**
   * Set value in storage.
   * @param key
   * @param value
   * @param ttl
   */
  set (key, value, ttl) {
    this.data[key] = value
    setTimeout(() => {
      delete this.data[key]
    }, ttl)
  }
}

module.exports = Storage
