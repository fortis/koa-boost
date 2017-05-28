'use strict'

const Configuration = require('./src/configuration')
const Storage = require('./src/storage')
const Boost = require('./src/boost')

module.exports = function (options) {
  let configuration
  let cacheStorage
  try {
    configuration = new Configuration(options)
    cacheStorage = new Storage()
  } catch (err) {
    throw err
  }

  return async function (ctx, next) {
    const boost = new Boost(ctx, configuration)
    const key = configuration.resolveKey(ctx)
    const match = boost.isMatch()

    try {
      if (boost.method !== 'GET' || !match) {
        await next()
        return null
      }

      if (match && cacheStorage.get(key)) {
        ctx.body = cacheStorage.get(key)
        ctx.boost = true
        ctx.set('X-Boost', 'HIT')
        ctx.status = 200
        return null
      } else if (match && configuration.fromCacheOnly) {
        ctx.throw('Not found in cache', 404)
      }

      await next()

      ctx.boost = false
      ctx.set('X-Boost', 'MISS')
      if (boost.isCacheableStatus(ctx.status) && match && ctx.body) {
        cacheStorage.set(key, ctx.body, configuration.ttl)
      }
    } catch (err) {
      ctx.boost = false
      ctx.set('X-Boost', 'MISS')
      configuration.onError(ctx)

      throw err
    }
  }
}
