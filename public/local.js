var socket = io();
var wins = 0;

$('#username').val(`user${Math.floor(Math.random()*100000)}`)

$('#m').on('input', () => {
  socket.emit('guess', $('#m').val(), $('#username').val());
  $('#m').val('');
});

$('form').submit(function(e){
  e.preventDefault();
});

socket.on('guess', function(msg, name){
  $('<li>').text(`${name}: ${msg}`).appendTo('#messages')
    .fadeIn('slow')
    .animate({opacity: 1.0}, 1000)
    .fadeOut('slow');
});

socket.on('correct guess', function(msg, name, score){
  $('<li>').text(`[${score}] ${name}: ${msg}`).appendTo('#messages').addClass('correct')
    .fadeIn('slow')
    .animate({opacity: 1.0}, 10000)
    .fadeOut('slow');
});

socket.on('timer', (num) => {
  $('.timer').html(num);
});

socket.on('connections', (num) => {
  $('.connections').html(num);
});

socket.on('target', (targetEmoji) => {
  $('.target').html(targetEmoji);
});

socket.on('change name', (newName) => {

});

socket.on('cheating', (name) => {
  $('<li>').text(`${name} tried to cheat!`).appendTo('#messages').addClass('cheater')
    .fadeIn('slow')
    .animate({opacity: 1.0}, 5000)
    .fadeOut('slow');
})

$('body').bind('copy paste',function(e) {
  socket.emit('cheating', $('#username').val());
  e.preventDefault(); return false;
});

$('.the-world').on('click', () => {
  $('#m').focus();
})
