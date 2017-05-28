/* global expect */
'use strict'

const requestTwice = (agent, testPath, firstRequestCb, secondRequestCb) => {
  agent.get(testPath)
    .end((err, res) => {
      firstRequestCb(err, res)
      agent.get(testPath)
        .end((err, res) => {
          secondRequestCb(err, res)
        })
    })
}

const commonUseCase = (agent, spy, testPath, secondRequestCb) => {
  spy.withArgs(testPath)
  return new Promise((resolve) => {
    requestTwice(agent, testPath, () => {
      expect(spy.withArgs(testPath)).to.have.been.calledOnce
    }, () => {
      secondRequestCb()
      resolve()
    })
  })
}

const assertCached = (agent, spy, testPath) => {
  return commonUseCase(agent, spy, testPath, () => {
    expect(spy.withArgs(testPath)).to.have.been.calledOnce
  })
}

const assertAllCached = (agent, spy, testPaths) => {
  return testPaths.map((testPath) => {
    return assertCached(agent, spy, testPath)
  })
}

const assertNotCached = (agent, spy, testPath) => {
  return commonUseCase(agent, spy, testPath, () => {
    expect(spy.withArgs(testPath)).to.have.been.calledTwice
  })
}

const assertAllNotCached = (agent, spy, testPaths) => {
  return testPaths.map((testPath) => {
    return assertNotCached(agent, spy, testPath)
  })
}

module.exports = {
  requestTwice,
  assertCached,
  assertAllCached,
  assertNotCached,
  assertAllNotCached
}
