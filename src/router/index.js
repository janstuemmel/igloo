const Router = require('@koa/router')
const torrent = require('./torrent')

const router = new Router

module.exports = router

router.use('/torrents', torrent.routes())