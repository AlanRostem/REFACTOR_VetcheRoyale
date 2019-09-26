const worker = require('worker_threads');
const {workerData, parentPort, MessageChannel, receiveMessageOnPort} = worker;
const WorldManager = require("./World/WorldManager.js");



const worldManager = new WorldManager();
parentPort.on("message", data => {
    worldManager.importDataBridge(data);
});

setInterval(() => {
    worldManager.update();
    sendMessage(worldManager.exportDataBridge());
}, 0.0167);


function sendMessage(message) {
    parentPort.postMessage(message);
}