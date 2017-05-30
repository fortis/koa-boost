/* global sinon expect it beforeEach describe */
'use strict'

const Koa = require('koa')
const boost = require('../index')

/* Testing toolkit. */
const request = require('supertest')
const util = require('./util')

describe('default options', () => {
  let spy
  let agent

  beforeEach(() => {
    const app = new Koa()
    spy = sinon.spy(function () {
      this.body = {path: this.request.path}
    })

    app.use(boost())
    app.use(async ctx => {
      spy.bind(ctx)(ctx.request.path)
    })

    agent = request(app.callback())
  })

  it('should match all requests', () => {
    const testPaths = ['/', '/api/user', '/api/user/1']
    const requests = util.assertAllCached(agent, spy, testPaths)

    return Promise.all(requests).then(() => {
      expect(spy).to.have.callCount(3)
    })
  })
})
