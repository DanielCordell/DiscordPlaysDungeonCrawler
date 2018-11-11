
          default:
            console.log("Couldn't move enemy, ignoring.");
          // give up
        if (randomDir == 0) { //up
          if (dungeon[y-1][x] !== 0) continue;
          var temp = dungeon[y-1][x];
          dungeon[y-1][x] = dungeon[y][x];
          dungeon[y][x] = temp;
          console.log("up");
          break;
        } else if (randomDir == 1) { // right
          if (dungeon[y][x+1] !== 0) continue;
          var temp = dungeon[y][x+1];
          dungeon[y][x+1] = dungeon[y][x];
          dungeon[y][x] = temp;
          console.log("down");
          break;
        } else if (randomDir == 2) { // down
          if (dungeon[y+1][x] !== 0) continue;
          var temp = dungeon[y+1][x];
          dungeon[y+1][x] = dungeon[y][x];
          dungeon[y][x] = temp;
          console.log("left");
          break;
        } else { // left
          if (dungeon[y][x-1] !== 0) continue;
          var temp = dungeon[y][x-1];
          dungeon[y][x-1] = dungeon[y][x];
          dungeon[y][x] = temp;
          console.log("right");
          break;
        }
      }
    }
  }
  return dungeon;
}


function getChannel() {
  return client.channels.get("510773738393042986");
}

client.login(config.token);
