const Router = require('@koa/router')
const {
  get,
  getById,
  getDownloadById,
  postMultipart,
} = require('../controller/torrent')

const router = new Router

module.exports = router

router.get('/', get)

router.get('/:id', getById)

router.post('/', postMultipart)

router.get('/:id/:name.torrent', getDownloadById)

