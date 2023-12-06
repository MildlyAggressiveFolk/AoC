const fs = require("fs")

const input = fs.readFileSync("./input.txt", "utf8")

const dict = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
}

function getCalibrationCodes(input) {
  const lines = input.split("\n")
  const codes = []

  for (let line of lines) {
    let numbers = []

    for (let i = 0; i < line.length; i++) {
      const char = line.charCodeAt(i)
      if (char >= 48 && char <= 57) {
        numbers[i] = line[i]
      }
    }
    for (let word in dict) {
      const firstIndex = line.indexOf(word)

      if (firstIndex > -1) {
        numbers[firstIndex] = dict[word]
        const lastIndex = line.lastIndexOf(word)
        if (firstIndex !== lastIndex) {
          numbers[line.lastIndexOf(word)] = dict[word]
        }
      }
    }

    numbers = numbers.filter((n) => n !== undefined)

    if (numbers.length === 1) {
      codes.push(Number([numbers[0], numbers[0]].join("")))
    }

    if (numbers.length >= 2) {
      codes.push(Number([numbers[0], numbers[numbers.length - 1]].join("")))
    }
    console.log(codes[codes.length - 1])
  }

  const result = codes.reduce((acc, line) => {
    return acc + line
  }, 0)
  return result
}
console.time("getCalibrationCodes")
console.log(getCalibrationCodes(input))
console.timeEnd("getCalibrationCodes")
