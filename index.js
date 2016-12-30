var Game = require('./game');

var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var connections = 0;

io.on('connection', function(socket){
  connections += 1;
  io.emit('connections', connections);
  io.emit('target', emojiRacer.display());
  console.log('a user connected');
  // socket.broadcast.emit('hi');
  socket.on('chat message', function(msg){
    io.emit('chat message', msg)
  });

  socket.on('guess', (emoji, name) => {
    if (emojiRacer.guess(emoji, name)) {
      io.emit('correct guess', emoji, name);
      io.emit('target', emojiRacer.display());
    } else {
      if (!"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(emoji)) {
        io.emit('guess', emoji, name);
      }
    }
  });
  socket.on('disconnect', function(){
    connections -= 1;
    io.emit('connections', connections);
    console.log('user disconnected');
  });

  socket.on('cheating', (name) => {
    io.emit('cheating', name);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

var emojiRacer = new Game();
