'use strict'

const micromatch = require('micromatch')
const Configuration = require('./src/configuration')
const Storage = require('./src/service/storage')

module.exports = function (options) {
  let configuration
  let storage

  try {
    configuration = new Configuration(options)
    storage = new Storage(configuration.provider)
  } catch (err) {
    throw err
  }

  return async function (ctx, next) {
    const key = configuration.resolveKey(ctx)
    const match = patternMatchPath(configuration.pattern, ctx.request.path)
    try {
      if (!match || ctx.method !== 'GET') {
        await next()
        return null
      }

      let cached = await storage.get(key)
      const isPromise = Promise.resolve(cached) === cached

      if (match && cached && !isPromise) {
        ctx.body = cached.body
        ctx.status = cached.status
        ctx.set('Content-Type', cached.type)
        ctx.set('X-Boost', 'HIT')
        return null
      } else if (match && configuration.fromCacheOnly) {
        ctx.throw('Not found in cache', 404)
      }

      ctx.set('X-Boost', 'MISS')
      await next()

      if (match && ctx.body && configuration.statuses.indexOf(ctx.status) !== -1) {
        storage.set(key, {
          body: ctx.body,
          status: ctx.status,
          type: ctx.request.type
        }, configuration.ttl)
      }
    } catch (err) {
      ctx.set('X-Boost', 'MISS')
      configuration.onError(ctx)

      throw err
    }
  }
}

const patternMatchPath = (pattern, path) => {
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
