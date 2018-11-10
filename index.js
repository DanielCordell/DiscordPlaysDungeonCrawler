const Discord = require('discord.js');
const Dungeon = require('random-dungeon-generator')
const client = new Discord.Client();
const config = require('./config.json')

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('pong');
  }
});

client.login(config.token);

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

