var socket = io();
var name = '';
var wins = 0;

$('#username').val(`u${Math.floor(Math.random()*1000)}`)

$('#m').on('input', () => {
  name = $('#username').val()
  socket.emit('guess', $('#m').val(), name);
  $('#m').val('');
});

$('form').submit(function(e){
  e.preventDefault();
});

$('body').bind('copy paste',function(e) {
  socket.emit('cheating', $('#username').val());
  e.preventDefault(); return false;
});

$('.the-world').on('click', () => {
  $('#m').focus();
  setTimeout(function() { window.scrollTo(0, 0); }, 100);
})

// $('.modal').addClass('show-modal');

$('.start-game').on('click', () => {
  $('.modal').removeClass('show-modal');
  $('#m').focus();
  setTimeout(function() { window.scrollTo(0, 0); }, 100);
});

$('.help').on('click', () => {
  $('.help').removeClass('show-modal');
  $('.keyboard-instructions').addClass('show-modal');
});

socket.on('guess', function(msg, name){
  $('<li>').text(`${name}: ${msg}`).appendTo('#messages')
    .animate({opacity: 1.0}, 1000)
    .addClass('guess-val')
    .fadeOut('fast');
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
  if (num <= 1) {
    $('.connections').html(`👤 You're racing solo!`);
  } else {
    $('.connections').html(`${num} 👫 racing right now!`);
  }
});

socket.on('online players', (num) => {
  $('.online-users').html(num);
});

socket.on('target', (targetEmoji) => {
  $('.target').html(targetEmoji);
});

socket.on('cheating', (name) => {
  $('<li>').text(`${name} tried to cheat!`).appendTo('#messages').addClass('cheater')
    .fadeIn('slow')
    .animate({opacity: 1.0}, 5000)
    .fadeOut('slow');
})
