// https://socket.io/get-started/chat

const path = require('path')
const express = require('express');
const http = require('http');
const socketio = require("socket.io");
const formatMessage = require('./utils/messages')
const { userJoin,
  getCurrentUser,
  userLeft,
  getRoomUsers } = require('./utils/users')

//initialization
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// set static folder
// home = index.html
// form action = chat .html
app.use(express.static(path.join(__dirname, 'public')))

const botName = 'CharCord Bot'

// Handling of all events
// emit : self , broadcaset.emit : all except self , io.emit : all

io.on('connection', socket => {

  // add user to room array

  socket.on('join-room', ({ username, room }) => {

    const user = userJoin(socket.id, username, room)
    socket.join(user.room);

    // Welcome user
    socket.emit('showMessage', formatMessage(botName, `Welcome to ChatCord ${username} 🥰`))

    // Nofifying others
    socket.broadcast
      .to(user.room)
      .emit('showMessage', formatMessage(botName, `${username} has joined the chat 😍`))

    // send user and room info
    io.to(user.room).emit('show-Room-users', {
      room: user.room,
      users: getRoomUsers(user.room)
    })

  })


  // Listen message : sent event
  // output to all : showMessage event
  // cant include it above coz msg can be from different user
  // need to find source of sent message

  socket.on('send', message => {
    const user = getCurrentUser(socket.id)
    io.to(user.room).emit('showMessage', formatMessage(user.username, message))
  })

  // Run when client disconnect
  // find left user
  socket.on('disconnect', () => {
    const user = userLeft(socket.id)

    if (user) {
      io.to(user.room).emit('showMessage', formatMessage(botName, `${user.username} left the chat 💔`))
    }

    // send user and room info
    io.to(user.room).emit('show-Room-users', {
      room: user.room,
      users: getRoomUsers(user.room)
    })

  })

});

const PORT = process.env.PORT || 3000
server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
