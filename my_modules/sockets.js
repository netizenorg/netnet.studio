function someoneLoggedOff (socket, io) {
  console.log(`${socket.id} is gone!`)
}

function clientSentMessage (socket, io, msg) {
  console.log(`${socket.id} said: ${msg}`)
}

module.exports = (socket, io) => {
  // console.log('a user connected')
  // connected = io.sockets.clients().connected
  console.log(`${socket.id} connected!`)
  socket.on('disconnect', () => { someoneLoggedOff(socket, io) })
  socket.on('new-message', (m) => { clientSentMessage(socket, io, m) })
}
