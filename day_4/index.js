const fs = require("fs");
const { Worker } = require("worker_threads");

const input = fs.readFileSync("./input.txt", "utf8");
const inputArr = input.split("\n");

const cardMap = parseInput(inputArr);
const queue = [...cardMap.keys()];
let cardCount = queue.length;
const logCount = setInterval(() => console.log(cardCount, queue.length), 500);

const numWorkers = 4;
let workers = new Set();

for (let i = 0; i < numWorkers; i++) {
  const worker = new Worker("./worker.js");
  workers.add(worker);

  worker.postMessage({ type: "setId", workerId: i });
  worker.postMessage({ type: "init", cardMap });

  worker.on("message", (message) => {
    if (message.type === "ready") {
      distributeTask(worker);
    } else if (message.type === "addCards") {
      queue.push(...message.cards);
      cardCount += message.cards.length;
      distributeTask(worker);
    }
  });
}

function distributeTask(worker) {
  if (queue.length > 0 && queue.length < 100000) {
    const taskChunk = queue.splice(0, 50);
    worker.postMessage({ type: "newTaskChunk", taskChunk });
  } else if (queue.length >= 100000) {
    const taskChunk = queue.splice(0, 10000);
    worker.postMessage({ type: "newTaskChunk", taskChunk });
  } else {
    worker.terminate();
    clearInterval(logCount);
    console.log("Result:", cardCount);
  }
}

function parseInput(inputArr) {
  const cardKV = inputArr.map((line, i) => {
    const game = line.split(":")[1].trim();
    const [winningNumStr, playerNumStr] = game.split("|");
    const winningNums = new Set(
      winningNumStr.split(" ").filter((num) => num !== "")
    );
    const playerNums = new Set(
      playerNumStr.split(" ").filter((num) => num !== "")
    );
    return [i, { winningNums, playerNums }];
  });
  return new Map(cardKV);
}
