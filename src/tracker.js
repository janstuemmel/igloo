const { Server: Tracker } = require('bittorrent-tracker')
const Torrent = require('./model/torrent')

const filter = async (infoHash, params, callback) => {

  const torrent = await Torrent.findOne({ where: { infoHash } })

  if (!torrent) {
    return callback(new Error('torrent does not exist')) 
  }

  callback(null)
}

const tracker = new Tracker({ filter, http: false, udp: false, ws: false })

module.exports = tracker

module.exports.getSwarmInfo = infoHash => {

  const swarm = tracker.torrents[infoHash]
  let info = { complete: 0, incomplete: 0 }  

  if (swarm) {
    info = {
      complete: swarm.complete,
      incomplete: swarm.complete,
    }    
  }

  return info
}
 