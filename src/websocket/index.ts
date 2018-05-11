import http from 'http'
import express from 'express'
import socketio from 'socket.io'
import { SOCKET_PORT } from '../config'

const app = express()
const server = new http.Server(app)
const websocket = socketio(server)
const io = websocket.of('/io')

const log = (...args: any[]) => {
  console.log('='.repeat(50))
  console.log(...args)
}

interface IdUserMapV {
  from: string
  to: string
}

interface IdUserMap {
  [id: string]: IdUserMapV | null
}
const idUserMap: IdUserMap = {}

io.use((socket, next) => {
  const { from, to } = socket.handshake.query
  /* check from to exist in db */
  // return next(new Error('authentication error'))
  idUserMap[socket.id] = { from, to }

  return next()
})

io.on('connection', function (socket) {
  log('USER CONNECTED:', (<IdUserMapV>idUserMap[socket.id]).from)

  socket.on('disconnect', function () {
    log('USER DISCONNECTED:', (<IdUserMapV>idUserMap[socket.id]).from)
    idUserMap[socket.id] = null
  })

  socket.on('message', function (message) {
    log(`FROM USER ${(<IdUserMapV>idUserMap[socket.id]).from}:`, message)
  })
})

const stdin = process.openStdin()
let restaurantId = 0
stdin.addListener('data', (message) => {
  const msg = {
    _id: restaurantId++,
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
