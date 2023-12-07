const fs = require("fs")

const input = fs.readFileSync("./input.txt", "utf8")
const inputArr = input.split("\n")

const numberCoords = getNumberCoords(inputArr)
const partNumbers = detectPartNumbers(numberCoords, inputArr)
console.log(partNumbers.reduce((a, b) => a + b))

/**
 *
 * @param {[number, number[]][]} coords
 * @param {string[]} lines
 *
 */
function detectPartNumbers(coords, lines) {
  let partNumbers = []
  for (let coord of coords) {
    const [row, xArr] = coord
    const start = xArr[0]
    const end = xArr.at(-1)

    //scan above
    let above = lines[row - 1]

    if (above) {
      let topNeighbors = above.slice(start !== 0 ? start - 1 : start, end + 2)

      for (let char of topNeighbors) {
        if (char.charCodeAt(0) !== 46) {
          const val = []

          for (let x of xArr) {
            val.push(lines[row][x])
          }
          partNumbers.push(Number(val.join("")))
        }
      }
    }
    //scan below
    let below = lines[row + 1]
    if (below) {
      let bottomNeighbors = below.slice(start !== 0 ? start - 1 : start, end + 2)
      for (let char of bottomNeighbors) {
        if (char.charCodeAt(0) !== 46) {
          const val = []
          for (let x of xArr) {
            val.push(lines[row][x])
          }
          partNumbers.push(Number(val.join("")))
        }
      }
    }
    //scan sides
    let sides = [lines[row][start - 1], lines[row][end + 1]]

    for (let char of sides) {
      if (char !== undefined && char.charCodeAt(0) !== 46) {
        const val = []
        for (let x of xArr) {
          val.push(lines[row][x])
        }
        partNumbers.push(Number(val.join("")))
      }
    }
  }
  return partNumbers
}

/**
 *
 * @param {string[]} lines
 * @returns {[number, number[]][]}
 */
function getNumberCoords(lines) {
  const numberIndices = []
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
        numberIndices.push([index, number])
      }
    }
  }
  return numberIndices
}

/**
 *
 * @param {string} char
 * @returns boolean
 */
function isDigit(char) {
  return char.charCodeAt(0) >= 48 && char.charCodeAt(0) <= 57
}
