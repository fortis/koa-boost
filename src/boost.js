'use strict'

const micromatch = require('micromatch')
const Configuration = require('./configuration')

class Boost {
  constructor (ctx, configuration) {
    if (configuration instanceof Configuration === false) {
      throw Error('Configuration should be passed as 2 argument in constructor()')
    }

    this.ctx = ctx
    this.configuration = configuration
  }

  get method () { return this.ctx.request.method }

  isCacheableStatus (status) {
    return this.configuration.cacheableStatuses.indexOf(status) !== -1
  }

  isMatch () {
    const pattern = this.configuration.getPattern()
    const {path} = this.ctx.request

    if (!pattern) {
      return true
    }

    const isString = (object) => {
      return typeof object === 'string' || object instanceof String
    }

    if (isString(pattern)) {
      return micromatch.isMatch(path, pattern)
    }

    if (pattern instanceof Array) {
      return micromatch.any(path, pattern)
    }

    return false
  }

  /**
   * Sets headers which prevents caching across all clients and proxies.
   * @param ctx
   */
  // setNoCacheHeaders = (ctx) => {
  //   return ctx.set('Cache-Control', 'no-store, no-cache, must-revalidate')
  //   ctx.set('Pragma', 'no-cache')
  //   ctx.set('Expires', 0)
  // }
}

module.exports = Boost
