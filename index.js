const Discord = require('discord.js');
const Dungeon = require('./map')
const client = new Discord.Client();
const config = require('./config.json')

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content === `<@${client.user.id}> start`){
    start()
  }
});

function start() {
  var doQuit = false
  var dungeon = Dungeon.generateDungeon();
  getChannel().send("You are trapped in the Lincoln Castle Dungeons! See if you can make it out alive, together!")
  while (!doQuit) {
    Dungeon.parseDungeon(dungeon, client).forEach(message => getChannel().send(message));
    getChannel().send("Vote on **this** message to move the player.\n* Either ⬆️ ➡️ ⬇️ or ⬅️.").then(msg => performVote(msg, dungeon));
    return;
  }
}

function performVote(msg, dungeon) {
  var timerStarted = false;
  const collector = msg.createReactionCollector((reaction, user) => true, {});
  const testStr = "⬆️➡️⬇️⬅️";
  collector.on('collect', (reaction, collector) => {
    if (!timerStarted && testStr.includes(reaction.emoji.name)) {
      msg.edit(msg.content + "\n**Someone has voted, 15 second timer stating.**");
      setTimeout(() => {collector.stop()}, 15000)
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
    return movePlayer(max.emoji, dungeon)
  });
}

function movePlayer(emoji, dungeon){


  return newDungeon;
}

function getChannel() {
  return client.channels.get("510773738393042986");
}

client.login(config.token);
