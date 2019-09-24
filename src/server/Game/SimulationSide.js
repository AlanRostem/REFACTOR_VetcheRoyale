const {workerData, parentPort, MessageChannel, receiveMessageOnPort} = require('worker_threads');
const WorldManager = require("./World/WorldManager.js");

const worldManager = new WorldManager();
setInterval(() => {
    worldManager.update(receiveMessageOnPort(parentPort));
    sendMessage(worldManager.dataBridge.outboundData);
}, 1000);


function sendMessage(message) {
    parentPort.postMessage(message);
}