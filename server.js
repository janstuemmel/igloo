const express = require('express')
const path = require('path')
const db = require('./src/db')
const app = require('./src')

// mount frontend
app.use(express.static('./frontend/dist'))

// mount index for router
app.get('*', (_, res) => res.sendFile(path.resolve('frontend', 'dist', 'index.html')))

// listen
app.listen(8080)

// sync database
; (async function () {
  await db.sync()
})()