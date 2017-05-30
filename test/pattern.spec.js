/* global sinon expect it beforeEach describe */
'use strict'

const Koa = require('koa')
const boost = require('../index')

/* Testing toolkit. */
const request = require('supertest')
const util = require('./util')

describe('patterns', () => {
  let app
  let spy
  let spyMiddleware

  beforeEach(() => {
    app = new Koa()
    spy = sinon.spy(function () {
      this.body = {path: this.request.path}
    })
    spyMiddleware = async ctx => {
      spy.bind(ctx)(ctx.request.path)
    }
  })

  it('should match all if no patterns present', () => {
    app.use(boost({}))
    app.use(spyMiddleware)

    const agent = request(app.callback())

    const testPaths = ['/', '/users', '/users/1']
    const requests = util.assertAllCached(agent, spy, testPaths)

    return Promise.all(requests).then(() => {
      expect(spy).to.have.callCount(3)
    })
  })

  it('should match a given pattern string', () => {
    app.use(boost({
      pattern: '/api/**/*'
    }))
    app.use(spyMiddleware)

    const agent = request(app.callback())

    const matchingPaths = ['/api/users', '/api/users/1']
    const nonMatchingPaths = ['/', '/users', '/users/1', '/api']

    let requests = util.assertAllCached(agent, spy, matchingPaths)
    requests = requests.concat(util.assertAllNotCached(agent, spy, nonMatchingPaths))

    return Promise.all(requests).then(() => {
      // once on each matching call, twice on each non matching call
      expect(spy).to.have.callCount(10)
    })
  })

  it('should match all patterns in a given pattern array', () => {
    app.use(boost({
      pattern: [
        '/api',
        '/api/v1/**/*',
        '/api/v2/**/*'
      ]
    }))
    app.use(spyMiddleware)

    const agent = request(app.callback())
    const matchingPaths = ['/api', '/api/v1/users', '/api/v2/users/1']
    const nonMatchingPaths = ['/', '/users', '/api/users', '/api/v0/users/1']

    let requests = util.assertAllCached(agent, spy, matchingPaths)
    requests = requests.concat(util.assertAllNotCached(agent, spy, nonMatchingPaths))

    return Promise.all(requests).then(() => {
      // once on each matching call, twice on each non matching call
      expect(spy).to.have.callCount(11)
    })
  })

  it('should throw an error if not an expected type', () => {
    expect(() => boost({
      pattern: {}
    })).to.throw()

    expect(() => boost({
      pattern: ['/api/user', {}]
    })).to.throw()
  })
})
