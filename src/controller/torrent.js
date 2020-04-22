const fs = require('fs')
const parseTorrent = require('parse-torrent')

const tracker = require('../tracker')
const Torrent = require('../model/torrent')

module.exports.get = async ctx => {

  const torrents = await Torrent.findAll()

  const data = torrents.map(torrent => {
  
    torrent.dataValues.swarm = tracker.getSwarmInfo(torrent.infoHash)
    
    return torrent.dataValues
  })
  
  ctx.body = data
}

module.exports.getById = async ctx => {
  
  const id = ctx.params.id

  const torrent = await Torrent.scope('withFile').findOne({ where: { id } })

  if (!torrent) {
    return ctx.throw(404)
  }

  // copy data
  const data = { ...torrent.dataValues }

  // delete file 
  delete data.file

  // get parsed torrent information
  // TODO: catch parsing error
  const parsed = parseTorrent(torrent.dataValues.file)

  ctx.body = { ...data, files: parsed.files }
}

module.exports.getDownloadById = async ctx => {
  
  const id = ctx.params.id

  const torrent = await Torrent.scope('withFile').findOne({ where: { id } })

  if (!torrent) {
    return ctx.throw(404)
  }

  // set torrent content type 
  ctx.set({ 'Content-Type': 'application/x-bittorrent' })
  
  // set filename for download
  ctx.attachment(`${torrent.dataValues.name}.torrent`)
  
  ctx.body = torrent.dataValues.file
}

module.exports.postMultipart = async ctx => {

  const files = ctx.request.files
  const title = ctx.request.body.title ? ctx.request.body.title.trim() : ''

  if (title === '') 
    return ctx.throw(400, 'Missing title')

  if (!files || !files.torrent || files.torrent.size <= 0)
    return ctx.throw(400, 'Missing file')

  if (files.torrent.type !== 'application/x-bittorrent')
    return ctx.throw(415, 'Wrong mime. No torrent')

  const file = fs.readFileSync(files.torrent.path)

  let torrent

  try {

    torrent = parseTorrent(file)
  
  } catch(err) {
    return ctx.throw(415, 'Torrent not parsable')
  } 

  try {
   
    const t = await Torrent.create({
      file,
      name: torrent.name,
      infoHash: torrent.infoHash,
      size: torrent.length,
      ...ctx.request.body
    })
  
    ctx.body = t.id
  
  } catch(err) {

    ctx.throw(500, err.message)
  }
}

