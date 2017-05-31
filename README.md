# koa-boost

[![Greenkeeper badge](https://badges.greenkeeper.io/fortis/koa-boost.svg)](https://greenkeeper.io/)

<p align="center">
  <a href="https://travis-ci.org/fortis/koa-boost"><img src="https://travis-ci.org/fortis/koa-boost.svg?branch=master" alt="travis-ci status"></a>
  <a href="https://coveralls.io/github/fortis/koa-boost"><img src="https://coveralls.io/repos/github/fortis/koa-boost/badge.svg" alt="coverage status"></a>
  <a href="https://www.npmjs.com/package/koa-boost"><img src="https://img.shields.io/npm/v/koa-boost.svg" alt="npm version"></a>
  <a href="https://standardjs.com"><img src="https://img.shields.io/badge/code_style-standard-brightgreen.svg" alt="Standard - JavaScript Style Guide"></a>
</p>

Cache middleware for [koa](https://github.com/koajs/koa).

## Installation

```sh
npm install koa-boost --save
```

## Usage

##### Store Cache in Application Memory
```js
const Koa = require('koa')
const boost = require('koa-boost')

const app = new Koa()
app.use(boost({
  pattern: '/api/*',
  ttl: 60 // 60 seconds
}));
```

##### Use Redis as Cache Provider
```js
const Koa = require('koa')
const boost = require('koa-boost')
const Redis = require('ioredis')

const app = new Koa()
const redis = new Redis()
app.use(boost({
  provider: redis,
  pattern: '/api/*',
  ttl: 60 // 60 seconds
}));
```

### Options

* `pattern {string|array}` &mdash;  pattern to match incoming request paths against. Supports glob matching and other
features provided by highly optimized wildcard and glob matching library [micromatch](https://github.com/micromatch/micromatch). Defaults to `null` &mdash; all requests will be cached.
* `ttl {integer}` &mdash; time in seconds that cached response should remain in the cache. Defaults to `60` seconds.
