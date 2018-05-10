const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const { SOCKET_PORT } = require('../config')

const app = express()
const server = http.Server(app)
const websocket = socketio(server)
const io = websocket.of('/io')

const log = (...args) => {
  console.log('='.repeat(50))
  console.log(...args)
}
const idUserMap = {}

io.use((socket, next) => {
  const { from, to } = socket.handshake.query
  /* check from to exist in db */
  // return next(new Error('authentication error'))
  idUserMap[socket.id] = { from, to}

  return next()
})

io.on('connection', function (socket) {
  log('USER CONNECTED:', idUserMap[socket.id].from)

  socket.on('disconnect', function () {
    log('USER DISCONNECTED:', idUserMap[socket.id].from)
    idUserMap[socket.id] = null
  })

  socket.on('message', function (message) {
    log(`FROM USER ${idUserMap[socket.id].from}:`, message)
  })
})

const stdin = process.openStdin()
let restaurant_id = 0
stdin.addListener('data', (message) => {
  const msg = {
    _id: restaurant_id++,
    text: message.toString().trim(),
    createdAt: new Date(),
    user: { _id: 'restaurant_owner' }
  }

  io.emit('message', msg)

  log(`SEND TO USER: ${msg}`)
})

app.use('*', (req, res) => {
  res.status(404).json({
    message: 'page cannot be found.'
  })
})

app.use((err, req, res, next) => {
  // console.log(err)
  res.status(err.status || 500).json({
    message: err.toString()
  })
})

server.listen(SOCKET_PORT, () => {
  console.log(`socket started at port: ${SOCKET_PORT}`)
})
