const Discord = require('discord.js');
const Dungeon = require('./map')
const client = new Discord.Client();
const config = require('./config.json')

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
          console.log(`Collected ${emoji.emoji.name}  ${emoji.count}  times`);
          results.push({"emoji":emoji.emoji.name,"count":emoji.count});
        });
        max = results[0]
        for (i=0; i<results.length; i++){
          if (max.count < results[i].count){
            max = results[i]
          }
        }
        console.log(max.emoji, " wins the vote!");

      });

      //var reactionCollector = message.createReactionCollector((reaction, user) => true, {time: 20000})
      //reactionCollector.on("end", (collected, reason) => {
      //getVotes(collected);
      //});
    });
  }
  if (msg.content === 'ping') {
    Dungeon(client).forEach(message => getChannel().send(message));
  }
});

client.login(config.token);


//console.log(collected.find(reaction => reaction.emoji.name === '👍').count) ;
//var counter = collected.filter(item => item.emoji.name === '👍' || item.emoji.name  === '👎').length;
//console.log(counter);



function getChannel() {
  return client.channels.get("510773738393042986");
}
