const worker = require('worker_threads');
const {workerData, parentPort, MessageChannel, receiveMessageOnPort} = worker;
const WorldManager = require("./World/WorldManager.js");

let dataSpoofArray = [];
const worldManager = new WorldManager();
parentPort.on("message", data => {
    worldManager.importDataBridge(data);
});

setInterval(() => {
    worldManager.update();
    dataSpoofArray.push(worldManager.dataBridge.outboundData);
    sendMessage(dataSpoofArray[0]);
    dataSpoofArray.splice(0);
    worldManager.dataBridge.update();
}, 1000/60);


function sendMessage(message) {
    parentPort.postMessage(message);
}