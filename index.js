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
var ids = {};

io.on('connection', function(socket){
  connections += 1;
  var clientId = socket.id;
  io.emit('online players', onlinePlayers());

  io.emit('connections', connections);
  io.emit('target', emojiRacer.display());
  console.log(`${socket.id} connected`);
  // socket.broadcast.emit('hi');
  socket.on('chat message', function(msg){
    io.emit('chat message', msg)
  });

  socket.on('guess', (emoji, name) => {
    var guesserId = arguments[0].client.id;
    if (emojiRacer.guess(emoji)) {
      if (score[guesserId]) {
        score[guesserId] += 1;
      } else {
        score[guesserId] = 1;
        ids[guesserId] = name;
      }
      remainingTime = MAX_TIME;
      io.emit('correct guess', emoji, name, score[guesserId]);
      io.emit('online players', onlinePlayers());
      io.emit('target', emojiRacer.display());
    } else {
      if (!"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(emoji)) {
        io.emit('guess', emoji, name);
      }
    }
  });

  socket.on('disconnect', function(){
    connections -= 1;
    delete ids[clientId]
    io.emit('connections', connections);
    io.emit('online players', onlinePlayers());
    console.log(`${socket.id} disconnected!`);
  });

  socket.on('cheating', (name) => {
    io.emit('cheating', name);
  });
});

http.listen(port, function(){
  console.log('listening on *:'+port);
});

var emojiRacer = new Game();

var MAX_TIME = 30;
var remainingTime = MAX_TIME;

var onlinePlayers = () => {
  var playerList = [];
  Object.keys(ids).map((id) => {
    playerList.push(`[${score[id]}] ${ids[id]}`)
  })
  return playerList.join(", ")
}

var interval = setInterval(function() {
  remainingTime -= 1;
  if (remainingTime < 0) {
    emojiRacer.newEmoji();
    io.emit('target', emojiRacer.display());
    remainingTime = MAX_TIME;
  }
  io.emit('timer', remainingTime);
}, 1000);
