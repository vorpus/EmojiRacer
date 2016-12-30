var emoji = require('node-emoji')

function Game () {


  this.display = function() {
    return this.answer;
  }

  this.newEmoji = function() {
    this.answer = this.getEmoji();
  }

  this.getEmoji = function() {
    var freshEmoji = emoji.random();
    while (freshEmoji.key.includes('flag-')) {
      console.log(`its a flag ${freshEmoji.emoji}`)
      freshEmoji = emoji.random();
    }
    return freshEmoji.emoji;
  }

  this.guess = function(guess, name) {
    console.log(`${name} guesses ${guess} for ${this.answer}`)
    if (guess === this.answer) {
      this.newEmoji();
      return true;
    } else {
      return false;
    }
  }

  this.answer = this.getEmoji();
}

module.exports = Game;
