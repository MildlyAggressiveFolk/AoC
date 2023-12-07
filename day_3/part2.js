const fs = require("fs")

const input = fs.readFileSync("./input.txt", "utf8")
const inputArr = input.split("\n")

const [numCoords, gearCoords] = getCoords(inputArr)
console.log(findAndSumGearRatios(gearCoords))

/**
 * Takes array of gear coordinates and returns sum of gear ratios
 * @param {[number, number][]} gearCoords
 * @returns {number}
 */
function findAndSumGearRatios(gearCoords) {
  const gearRatios = []
  for (let gearCoord of gearCoords) {
    const neighborSet = new Set()
    const [row, col] = gearCoord
    const neighbors = getNeighbors(row, col)
    for (let neighbor of neighbors) {
      const numEntry = getNumEntry(...neighbor)
      if (numEntry) {
        neighborSet.add(numEntry)
      }
    }
    if (neighborSet.size === 2) {
      const vals = []
      neighborSet.forEach((numCoord) => {
        vals.push(getValueFromNumCoord(numCoord))
      })
      gearRatios.push(vals.reduce((a, b) => a * b))
    }
  }

  return gearRatios.reduce((a, b) => a + b)
}

function getValueFromNumCoord(numCoord) {
  const [row, colArr] = numCoord
  const val = []
  for (let col of colArr) {
    val.push(inputArr[row][col])
  }
  return Number(val.join(""))
}

/**
 * Takes row and column and returns number entry if it exists
 * @param {number} row
 * @param {number} col
 * @returns {[number, number[]] | false} numCoord | false
 */

function getNumEntry(row, col) {
  const numCoord = numCoords.find((entry) => entry[0] === row && entry[1].includes(col))
  if (numCoord) return numCoord
  return false
}

/**
 * Finds all neighbors of a given coordinate
 * @param {number} row
 * @param {number} col
 * @returns {[number, number][]}
 */
function getNeighbors(row, col) {
  const neighbors = []
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i !== 0 || j !== 0) neighbors.push([row + i, col + j])
    }
  }
  return neighbors
}

/**
 * Finds coordinates of all numbers and gears
 * @param {string[]} lines
 * @returns {[[number, number[]][], [number, number][]]} [numCoords, gearCoords]
 */
function getCoords(lines) {
  const numCoords = []
  const gearCoords = []
  for (let [index, line] of lines.entries()) {
    for (let i = 0; i < line.length; i++) {
      if (isDigit(line[i])) {
        const number = [i]
        for (let j = i + 1; j < line.length; j++) {
          if (isDigit(line[j])) {
            number.push(j)
            if (j === line.length - 1) {
              i = j
            }
          } else {
            i = j
            break
          }
        }
        numCoords.push([index, number])
      }
      if (line[i].charCodeAt(0) === 42) {
        gearCoords.push([index, i])
      }
    }
  }
  return [numCoords, gearCoords]
}

/**
 *
 * @param {string} char
 * @returns boolean
 */
function isDigit(char) {
  return char.charCodeAt(0) >= 48 && char.charCodeAt(0) <= 57
}
