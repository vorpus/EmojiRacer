var Game = require('./game');

var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var connections = 0;

var score = {};

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
      if (score[name]) {
        score[name] += 1;
      } else {
        score[name] = 1;
      }
      io.emit('correct guess', emoji, name, score[name]);
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

http.listen(port, function(){
  console.log('listening on *:'+port);
});

var emojiRacer = new Game();
