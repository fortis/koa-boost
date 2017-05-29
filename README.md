# koa-boost
[![Build Status](https://travis-ci.org/fortis/koa-boost.svg?branch=master)](https://travis-ci.org/fortis/koa-boost)
[![Coverage Status](https://coveralls.io/repos/github/fortis/koa-boost/badge.svg)](https://coveralls.io/github/fortis/koa-boost)

Cache middleware for [koa](https://github.com/koajs/koa). It stores the responses matching a given pattern.

## Installation

```sh
npm install koa-boost --save
```

## Usage

```js
const Koa = require('koa')
const boost = require('koa-boost')

const app = new Koa()
app.use(boost({
  pattern: '/api/*',
  ttl: 60 // 60 seconds
}));
```

### Options

* `pattern {string|array}` &mdash;  pattern to match incoming request paths against. Supports glob matching and other
features provided by highly optimized wildcard and glob matching library [micromatch](https://github.com/micromatch/micromatch). Defaults to `null` &mdash; all requests will be cached.
* `ttl {integer}` &mdash; time in seconds that cached response should remain in the cache. Defaults to `60` seconds.
