const rn = require('random-number');

enemyEmojis = [{name:"Rat", emoji:"🐀"},{name:"Snake", emoji:"🐍"},
              {name:"Tiger", emoji:"🐅"},{name:"Leopard", emoji:"🐆"},
              {name:"Dragon", emoji:"🐉"}]

module.exports = class Enemy {
  constructor(multiplier = 1){
    var index = rn({min:0,max:4,integer:true});
    var enemyType = enemyEmojis[index]

    this.name = enemyType.name;
    this.emoji = enemyType.emoji;
    this.multiplier = multiplier + index/4.0;
    this.health = parseInt(rn({min: 10, max: 50, integer: true}) * multiplier);
    this.strength = rn.generator({min: 3, max: 10});
    this.moved = false;
  }

  //Returns new health
  //Will die if health <= 0
  hit(damage) {
    this.health -= damage;
    return this.health;
  }

  //Returns damage to deal
  hitPlayer() {
    return parseInt(this.strength() * this.multiplier);
  }
}