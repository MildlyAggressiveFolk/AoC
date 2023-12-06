const fs = require("fs")

const input = fs.readFileSync("./input.txt", "utf8")
sumPowers(input)

/**
 * @param {string} input
 * @returns {number}
 */
function sumPowers(input) {
  const games = input.split("\n")
  let possibleGames = 0

  let parsedGames = games.map((game) => {
    const parsedGame = game
      .split(":")[1]
      .trim()
      .split(";")
      .map((round) => {
        return round
          .trim()
          .split(",")
          .map((count) => count.trim().split(" "))
      })
    return parsedGame.flat(2)
  })

  const gameObjects = parsedGames.map((game, i) => {
    const parsedGame = parseGameArray(game)
    if (parsedGame.red <= 13 && parsedGame.green <= 14 && parsedGame.blue <= 15) {
      possibleGames += i + 1
    }
    return parsedGame
  })

  const sumOfPowers = gameObjects.reduce((acc, game) => {
    return acc + game.getPower()
  }, 0)

  console.log(sumOfPowers)
}

/**
 * @param {string[]} gameArray
 * @returns {{red: number, green: number, blue: number, getPower: () => number}}
 */

function parseGameArray(gameArray) {
  const game = {
    red: 0,
    green: 0,
    blue: 0,
    updateColor: (color, count) => (game[color] = game[color] > count ? game[color] : count),
    getPower: () => game.red * game.green * game.blue,
  }

  function readArray(array) {
    let count = Number(array.shift())
    let color = array.shift()
    game.updateColor(color, count)
    if (array.length) readArray(array)
  }
  readArray(gameArray)
  delete game.updateColor
  return game
}
