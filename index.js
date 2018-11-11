const Discord = require('discord.js');
const rn = require('random-number');

const config = require('./config.json');
const Dungeon = require('./map');
const Enemy = require('./enemies')

const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content === `!!start`){
    start()
  }
});

var PlayerStats = {
  health: 0,
  maxHealth: 0,
  score: 0,
}

async function start() {
  var dungeon = Dungeon.generateDungeon();
  var level = 0;

  PlayerStats.maxHealth = 100;

  getChannel().send("You are trapped in the Lincoln Castle Dungeons! See if you can make it out alive, together!")
  while (true) {
    if (level != Dungeon.getLevel() ) {
      PlayerStats.health = PlayerStats.maxHealth;
      level = Dungeon.getLevel()
      getChannel().send(`Level **${level}**\nHealth: **${PlayerStats.health}**\nScore: **${PlayerStats.score}**`)
    }
    Dungeon.parseDungeon(dungeon, client).forEach(message => getChannel().send(message));
    var msg = await getChannel().send("Vote on **this** message to move the player.\n* Either ⬆️ ➡️ ⬇️ or ⬅️.")
    var voteResult = await performVote(msg, dungeon);
    if (voteResult.shouldQuit){
      getChannel().send("Game Over!");
      return;
    }
    if (voteResult.shouldLevel) {
      Dungeon.setLevel(level+1);
      dungeon = Dungeon.generateDungeon();
      PlayerStats.maxHealth = parseInt(PlayerStats.maxHealth * 1.2);
      PlayerStats.score += 1000;
    }
    else dungeon = moveEnemies(voteResult.dungeon);
  }
}

function performVote(msg, dungeon) {
  var timerStarted = false;
  const collector = msg.createReactionCollector((reaction, user) => true, {});
  const testStr = "⬆️➡️⬇️⬅️";

  return new Promise(function(resolve) {
    collector.on('collect', (reaction, collector) => {
      if (!timerStarted && testStr.includes(reaction.emoji.name)) {
        msg.edit(msg.content + "\n**Someone has voted, 5 second timer stating.**");
        setTimeout(() => {collector.stop()}, 5000)
        timerStarted = true;
        console.log(`Collected ${reaction.emoji.name}`);
      }
    });

    collector.on('end', collected => {
      var results = [];
      collected.forEach(emoji => {
        if (testStr.includes(emoji.emoji.name)) {
          console.log(`Collected ${emoji.emoji.name}  ${emoji.count}  times`);
          results.push({"emoji":emoji.emoji.name,"count":emoji.count});
        }
      });
      max = results[0]
      for (i=0; i<results.length; i++){
        if (max.count < results[i].count){
          max = results[i]
        }
      }
      console.log(max.emoji, " wins the vote!");
      getChannel().send(`${max.emoji} wins the vote!`);
      resolve(movePlayer(max.emoji, dungeon));
    });
  })
}

function movePlayer(emoji, dungeon){
  // dungeon is just an array
  var playerCurrI = 0; var playerCurrJ = 0; var playerNewI = 0; var playerNewJ = 0;
  // find 9 (player) in dungeon array
  for (i=0; i < dungeon.length; i++){
    if (playerCurrI !== 0 || playerCurrJ !== 0){
      break;
    }
    for (j=0; j < dungeon[i].length; j++){
      if (dungeon[i][j] === 9){
        playerCurrI = i;
        playerCurrJ = j;
        switch(emoji){
          case "⬅" :
            playerNewI = i;
            playerNewJ = playerCurrJ-1;
            break;
          case "➡" :
            playerNewI = i;
            playerNewJ = playerCurrJ+1;
            break;
          case "⬇" :
            playerNewI = i+1;
            playerNewJ = playerCurrJ;
            break;
          case "⬆" :
            playerNewI = i-1;
            playerNewJ = playerCurrJ;
            break;
        } // end of switch

      }
    }
  }

  if (dungeon[playerNewI][playerNewJ] === 3){
    PlayerStats.score += 100;
    PlayerStats.health = PlayerStats.maxHealth;
    getChannel().send(`Health: **${PlayerStats.health}**\nScore: **${PlayerStats.score}**`);
    dungeon[playerNewI][playerNewJ] = 0;
  }
  if (dungeon[playerNewI][playerNewJ] === 0){
    dungeon[playerNewI][playerNewJ] = 9;
    dungeon[playerCurrI][playerCurrJ] = 0;
  } else {
    getChannel().send("Invalid move, please select another move and try again.")
  }
  return {"dungeon":dungeon, "shouldLevel":false, "shouldQuit":false};
}

function moveEnemies(dungeon) {
  for (y = 1; y < dungeon.length - 1; ++y){
    for (x = 1; x < dungeon[y].length - 1; ++x){
      if (!(dungeon[y][x] instanceof Enemy)) continue;
      if (dungeon[y][x].moved) continue;
      var randomDir = rn({min:0, max:3, integer:true});
      for (i = 0; i < 4; ++i) {
        // Next direction
        randomDir += i;
        randomDir = randomDir % 4;
        if (randomDir == 0) { //up
          if (dungeon[y-1][x] !== 0) continue;
          dungeon[y][x].moved = true;
          var temp = dungeon[y-1][x];
          dungeon[y-1][x] = dungeon[y][x];
          dungeon[y][x] = temp;
          break;
        } else if (randomDir == 1) { // right
          if (dungeon[y][x+1] !== 0) continue;
          dungeon[y][x].moved = true;
          var temp = dungeon[y][x+1];
          dungeon[y][x+1] = dungeon[y][x];
          dungeon[y][x] = temp;
          break;
        } else if (randomDir == 2) { // down
          if (dungeon[y+1][x] !== 0) continue;
          dungeon[y][x].moved = true;
          var temp = dungeon[y+1][x];
          dungeon[y+1][x] = dungeon[y][x];
          dungeon[y][x] = temp;
          break;
        } else if (randomDir == 3) { // left
          if (dungeon[y][x-1] !== 0) continue;
          dungeon[y][x].moved = true;
          var temp = dungeon[y][x-1];
          dungeon[y][x-1] = dungeon[y][x];
          dungeon[y][x] = temp;
          break;
        }
      }
    }
  }
  for (y = 1; y < dungeon.length - 1; ++y) {
    for (x = 1; x < dungeon[y].length - 1; ++x) {
      if (dungeon[y][x] instanceof Enemy) dungeon[y][x].moved = false;
    }
  }
  return dungeon;
}


function getChannel() {
  return client.channels.get("510773738393042986");
}

client.login(config.token);
