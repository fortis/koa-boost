/* global sinon expect it beforeEach describe */
'use strict'

const Koa = require('koa')
const boost = require('../index')
const Redis = require('ioredis-mock').default

/* Testing toolkit. */
const request = require('supertest')
const util = require('./util')

describe('providers', () => {
  let spy
  let agent

  beforeEach(() => {
    const app = new Koa()
    spy = sinon.spy(function () {
      this.body = {path: this.request.path}
    })

    const redis = new Redis()
    // redis.multi({pipeline: false})

    app.use(boost({provider: redis}))
    app.use(async ctx => {
      spy.bind(ctx)(ctx.request.path)
    })

    agent = request(app.callback())
  })

  it('should be cached if redis provider present', () => {
    const testPaths = ['/', '/api/user', '/api/user/1']
    const requests = util.assertAllCached(agent, spy, testPaths)

    return Promise.all(requests).then(() => {
      expect(spy).to.have.callCount(3)
    })
  })
})
