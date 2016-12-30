var emoji = require('node-emoji')

function Game () {
  this.answer = emoji.random().emoji;

  this.display = function() {
    return this.answer;
  }

  this.newEmoji = function() {
    this.answer = emoji.random().emoji;
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
}

module.exports = Game;
