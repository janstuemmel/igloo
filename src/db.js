const Sequelize = require('sequelize')
const { db } = require('./config')

module.exports = new Sequelize(db.name, db.user, db.password, {

  operatorsAliases: 1,
  pool: { max: 1, min: 1 },
  logging: false,
  
  host: db.host,
  dialect: db.driver,
  storage: db.storage
})