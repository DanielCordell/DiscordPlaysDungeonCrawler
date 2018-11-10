const Dungeon = require('random-dungeon-generator')
var rn = require('random-number');

const settings = {
  width: 28,
  height: 24,
  minRoomSize: 2,
  maxRoomSize: 6
}

const heightGen = rn.generator({min: 0, max: settings.height - 1, integer: true});
const widthGen = rn.generator({min:0, max: settings.width - 1, integer: true});
const itemGen = rn.generator({min: 5, max:  8, integer: true})

function generateDungeon() {
  var dungeon = normaliseDungeon(Dungeon.NewDungeon(settings));
  var populated = populateDungeon(dungeon)
  return parseDungeon(populated)
}

function parseDungeon(dungeon){
  console.log("Parsing")
  var dungeonMessages = [];
  var dungeonMessage = "";
  var count = 0;

  const subway = client.emojis.find(emoji => emoji.name === "subway")

  dungeon.forEach(row => {
    row.forEach(cell => {
      switch (cell) {
        case 4:
          dungeonMessage += "🐉";
          break;
        case 3:
          dungeonMessage += "🍎";
          break;
        case 2:
          dungeonMessage += subway;
          break;
        case 1:         
          dungeonMessage += "⬛";
          break;
        case 0:         
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
  console.log("Finished Parsing")
  return dungeonMessages;
}

// turn all room numbers into 0s
function normaliseDungeon(dungeon){
  console.log("Normalising")
  for (y = 0; y < dungeon.length; ++y) {
    for (x = 0; x < dungeon[y].length; ++x) {
      switch (dungeon[y][x]) {
        case 1:         
          break;
        default:         
          dungeon[y][x] = 0;
          break;
      }
    }
  }
  console.log("Finished Normalising")
  return dungeon
}

function populateDungeon(dungeon){
  console.log(dungeon);
  console.log("Populating")
  var numberOfPointBoosts = itemGen()
  var numberOfEnemies = itemGen() + 1
  dungeon = runUntilPopulate(dungeon, 2);
  for (var i = 0; i < numberOfPointBoosts; ++i){
    dungeon = runUntilPopulate(dungeon, 3);
  }
  for (var i = 0; i < numberOfEnemies; ++i){
    dungeon = runUntilPopulate(dungeon, 4);
  }
  console.log("Finished Populating");
  console.log(dungeon);
  return dungeon;
}

function runUntilPopulate(dungeon, value){
  while (true){
    var y = heightGen();
    var x = widthGen();
    if (dungeon[y][x] === 0){
      dungeon[y][x] = value;
      return dungeon
    }
  }
}