var mongoose = require("mongoose");
var Users = require("../models/Users");
var ChatHistory = require("../models/ChatHistory");
var img_to_base64 = require('image-to-base64');

//////// SOCKET IO FUNCTIONS  ////////////////////
var clients = {};

module.exports = io => {
    io.on('connection', socket => {
  
        clients[socket.id] = socket;
        console.log(socket.id + ": CONNECTED!");
      
        //io.emit('socket-data', socket);
        socket.on('subscribe', room => {
          console.log("joining room: " + room);
          socket.join(room);
          });

        socket.on('private message', data => {
          let chat = new ChatHistory({
            chat_id: data.room,
            user_id: data.user_id,
            user_name: data.user_name,
            key: data.key,
            message: data.message,
            date: data.date
          });
          chat.save();

          console.log('sending room post', data.room);
          io.sockets.to(data.room).emit('private response', 
            {key: data.key, user_name: data.user_name, user_id: data.user_id,
              message: data.message, date: data.date}
          );
        });
        
        //socket.on('text', (text) => {
        //  let { message } = text;
        //  // once we get a 'change color' event from one of our clients, we will send it to the rest of the clients
        //  // we make use of the socket.emit method again with the argument given to use from the callback function above
        //  console.log(message);
        //  io.sockets.emit('socket-data', message);
        //})
         socket.on('disconnect', () => {
           delete clients[socket.id];
           console.log(socket.id + ": DISCONNECTED");
      })  
    })
}
