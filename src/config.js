const path = require('path')
const config = require('rc')('app', {

  // db defaults
  db: {
    driver: 'sqlite', 
    storage: path.join(__dirname, '../app.db'), // only sqlite
    host: undefined,
    user: undefined,
    password: undefined,
    name: 'app',
  },

  // secret for jwt
  secret: 's3cret',
});

module.exports = config;