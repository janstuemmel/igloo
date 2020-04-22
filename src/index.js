const Koa = require('koa')
const body = require('koa-body')
const server = require('express')()

const tracker = require('./tracker')
const router = require('./router')

// init the rest api
const app = new Koa()

// parse body with multipart support
app.use(body({ multipart: true }))

// add routes
app.use(router.routes())

// mount the tracker to server
server.get('/announce', tracker.onHttpRequest.bind(tracker))

// mount the rest api
server.use('/api', app.callback())

module.exports = server
