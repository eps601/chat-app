const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')
const demosDirectoryPath = path.join(__dirname, '../demos')

app.use(express.static(publicDirectoryPath))
app.use(express.static(demosDirectoryPath))
 
io.on('connection', (socket) => {
  console.log('New WebSocket connection')

  socket.emit('message', 'Welcome')
 
  io.on('content', (content) => {
    
    console.log('io.on index', content)
    io.emit('text', content)
    
  })

  let count = 0
  socket.emit('countUpdated', count)

  socket.on('increment', () => {
    count++
    io.emit('countUpdated', count)
  })
})

server.listen(port, () => {
  console.log(`Server is up on port ${port}`)
})