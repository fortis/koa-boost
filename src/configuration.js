'use strict'

const Joi = require('joi')

const CacheProviders = {
  APP: 'APP',
  REDIS: 'REDIS'
}

/**
 * Validation schema.
 */
const schema = Joi.object().keys({
  ttl: Joi.number().integer(), // 60 seconds
  method: Joi.any().allow('GET', 'POST', 'PUT', 'DELETE', 'PATCH'),
  statuses: Joi.array(),
  prefix: [Joi.string(), Joi.func()],
  pattern: [Joi.string(), Joi.array().items(Joi.string())],
  exclude: [Joi.string(), Joi.array()],
  maxLength: Joi.number().min(0),
  minLength: Joi.number().min(0),
  fromCacheOnly: Joi.boolean(),
  provider: Joi.any().allow(CacheProviders.APP),
  onError: Joi.func()
})

class Configuration {
  /**
   * @see RFC7231 https://tools.ietf.org/html/rfc7231#section-6.1
   * @returns Object
   */
  static get defaults () {
    return {
      ttl: 60, // 60 seconds
      method: 'GET',
      statuses: [200, 203, 204, 206, 300, 301, 404, 405, 410, 414],
      prefix: 'koa-boost:',
      pattern: null,
      exclude: [],
      maxLength: Infinity,
      minLength: 0,
      fromCacheOnly: false,
      provider: Configuration.CacheProviders.APP,
      onError: (ctx) => {}
    }
  }

  static get CacheProviders () {
    return CacheProviders
  }

  constructor (options) {
    Joi.assert(options, schema)
    this.options = Object.assign({}, Configuration.defaults, options)
  }

  resolveKey (ctx) {
    const resolvedPrefix = typeof this.options.prefix === 'function'
      ? this.options.prefix.call(ctx, ctx)
      : this.options.prefix

    return resolvedPrefix + ctx.request.url
  }

  get ttl () {
    return 1000 * this.options.ttl
  }

  get fromCacheOnly () {
    return this.options.fromCacheOnly
  }

  get cacheableStatuses () {
    return this.options.statuses
  }

  getPattern () {
    return this.options.pattern
  }

  onError (ctx) { return this.options.onError(ctx) }
}

module.exports = Configuration
