const { log } = require("console")
const fs = require("fs")

const input = fs.readFileSync("./input.txt", "utf8")
const inputArr = input.split("\n")

const games = inputArr.map((line) => {
  const game = line.split(":")[1].trim()
  const [winningNumStr, playerNumStr] = game.split("|")
  const winningNums = new Set(winningNumStr.split(" ").filter((num) => num !== ""))
  const playerNums = new Set(playerNumStr.split(" ").filter((num) => num !== ""))
  return { winningNums, playerNums }
})

const winCount = games.map((game) => {
  const { winningNums, playerNums } = game
  const intersection = new Set([...winningNums].filter((x) => playerNums.has(x)))
  console.log(intersection)
  return intersection.size
})

console.log(winCount)

console.log(
  winCount.reduce((a, b) => {
    let val = 0
    if (b >= 1) val = 1
    if (b > 1) {
      for (let i = 2; i <= b; i++) {
        val = val * 2
      }
    }
    console.log(val)
    return a + val
  }, 0)
)
