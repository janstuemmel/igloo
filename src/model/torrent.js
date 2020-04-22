const Sequelize = require('sequelize')
const db = require('../db')

const Torrent = db.define('torrent', {
  file: { type: Sequelize.BLOB, allowNull: false },
  infoHash: { type: Sequelize.STRING, allowNull: false, unique: true },
  name: { type: Sequelize.STRING, allowNull: false },
  size: { type: Sequelize.NUMBER, allowNull: false },
  title: { type: Sequelize.NUMBER, allowNull: false },
  description: { type: Sequelize.NUMBER },
}, {
  defaultScope: { attributes: { exclude: [ 'file' ] } },
  scopes: { withFile: {} }  
})

module.exports = Torrent