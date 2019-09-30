const worker = require('worker_threads');
const {workerData, parentPort, MessageChannel, receiveMessageOnPort} = worker;
const WorldManager = require("./World/WorldManager.js");

const worldManager = new WorldManager(parentPort);
setInterval(() => {
    worldManager.update();
}, 1000/60);