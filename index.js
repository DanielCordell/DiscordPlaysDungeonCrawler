const Discord = require('discord.js');
const Dungeon = require('random-dungeon-generator')
const client = new Discord.Client();
const config = require('./config.json')

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('pong')
    .then(message => {
      var reactionCollector = message.createReactionCollector((reaction, user) => true, {time: 20000})
      reactionCollector.on("end", (collected, reason) => {
        getVotes(collected);
      });
    });
  }
});

client.login(config.token);

function getVotes(collected){
  // console.log(getEmojis(collected)); // list all reactions
  var reactionsList = getEmojis(collected);
  var up = 0;
  var down = 0;
  var right = 0;
  var left = 0;
  
  for (i=0; i<reactionsList.length; i++){
    if (reactionsList[i] === '⬆️'){
      up++;
    } else if (reactionsList[i] === '⬇️'){
      down++;
    } else if (reactionsList[i] === '➡️'){
      right++;
    } else if (reactionsList[i] === '⬅️'){
      left++;
    }
  }
  if (up > down){
    console.log("Up wins!");
  } else if (down > up){
    console.log("Down wins!");
  } else console.log("Draw!");
}

function getEmojis(collected){
  return collected.map(item => item.emoji.name);
}



//console.log(collected.find(reaction => reaction.emoji.name === '👍').count) ;

//var counter = collected.filter(item => item.emoji.name === '👍' || item.emoji.name  === '👎').length;
//console.log(counter);


function generateDungeon() {
  const settings = {
    width: 40,
    height: 24,
    minRoomSize: 5,
    maxRoomSize: 10
  }
  console.log(settings)
  return dungeon = Dungeon.NewDungeon(settings);
}

function getChannel() {
  return client.channels.get("510773738393042986");
}

function parseDungeon(dungeon){
  var dungeonMessages = [];
  var dungeonMessage = "";
  var count = 0;
  dungeon.forEach(row => {
    row.forEach(cell => {
      switch (cell) {
        case 1:         
          dungeonMessage += "⬛";
          break;
        default:         
          dungeonMessage += "🔳";
          break;
      }
    });
    if (count == 3) {
      dungeonMessages.push(dungeonMessage);
      dungeonMessage = "";
      count = 0;
    }
    else {
      count++;
      dungeonMessage += "\n";
    }
  });
  return dungeonMessages;
}

