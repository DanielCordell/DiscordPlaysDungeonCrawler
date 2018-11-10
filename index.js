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
  if (msg.content === 'reacc') {
    msg.reply('pls')
    .then(message => {

      const collector = message.createReactionCollector((reaction, user) => true, { time: 15000 });
      collector.on('collect', (reaction, reactionCollector) => {
        console.log(`Collected ${reaction.emoji.name}`);
      });
      collector.on('end', collected => {
        var results = [];
        collected.forEach(emoji => {
          console.log(`Collected ${emoji.emoji} ${emoji.count} times`);
          results.push({"emoji":emoji.emoji,"count":emoji.count});
        });
        max = Math.max(results[0].count,results[1].count,results[2].count)

      });

      //var reactionCollector = message.createReactionCollector((reaction, user) => true, {time: 20000})
      //reactionCollector.on("end", (collected, reason) => {
      //getVotes(collected);
      //});
    });
  }
  if (msg.content === 'ping') {
    Dungeon.generateDungeon().forEach(message => getChannel().send(message));
  }
});

function getVotes(collected){
  // console.log(getEmojis(collected)); // list all reactions
  var reactionsList = getEmojis(collected);
/*  var up = 0;
  var down = 0;
  var right = 0;
  var left = 0;
  var max = 0;
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
  max = (up > down ? up : down);
  max = (left > right ? (left > max ? left : max) : (right > max ? right : max));
  console.log(max, ' wins!')
*/
}

function getEmojis(collected){
  return collected.map(item => item.emoji.name);
}



//console.log(collected.find(reaction => reaction.emoji.name === '👍').count) ;

//var counter = collected.filter(item => item.emoji.name === '👍' || item.emoji.name  === '👎').length;
//console.log(counter);


function getChannel() {
  return client.channels.get("510773738393042986");
}
