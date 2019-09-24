const { workerData, parentPort, MessageChannel, receiveMessageOnPort  } = require('worker_threads');
const Tile = require("./server/Game/TileBased/Tile.js");

function sendMessage(message) {
    parentPort.postMessage(message);
}

//setInterval(() => sendMessage(true), 1000);
