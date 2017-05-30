'use strict'

class BaseProvider {
  constructor () {
    this.name = this.constructor.name
  }
}

module.exports = BaseProvider
