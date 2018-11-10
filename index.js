const Discord = require('discord.js');
const Dungeon = require('./map')

const client = new Discord.Client();

const config = require('./config.json')

function getChannel() {
  return client.channels.get("510773738393042986");
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content === 'ping') {
    Dungeon.generateDungeon().forEach(message => getChannel().send(message))
  }
});

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

client.login(config.token);
