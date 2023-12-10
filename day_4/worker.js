const { parentPort } = require("worker_threads");

let cardMap;
let queue = [];
let outQueue = [];
let workerId;

parentPort.on("message", (message) => {
  if (message.type === "init") {
    cardMap = message.cardMap;
    parentPort.postMessage({ type: "ready" });
  } else if (message.type === "newTask") {
    queue.push(...message.taskChunk);
    while (queue.length > 0) {
      const cardNum = queue.pop();

      let winCount = getWinCount(cardNum);
      if (winCount === 0) continue;

      for (i = 0; i < winCount; i++) {
        outQueue.push(cardNum + i + 1);
      }
    }
    parentPort.postMessage({ type: "addCards", cards: outQueue });
    outQueue = [];
  } else if (message.type === "setId") {
    workerId = message.workerId;
  }
});

function getWinCount(cardNum) {
  const game = cardMap.get(cardNum);
  if (typeof game === "number") return game;
  const { winningNums, playerNums } = game;
  const intersection = new Set(
    [...winningNums].filter((x) => playerNums.has(x))
  );
  cardMap.set(cardNum, intersection.size);
  return intersection.size;
}
