const WebSocket = require("./WebSocket.js");
const MatchMaker = require("./Matchmaker.js");
const WorldManager = require("../Game/World/WorldManager.js");
const Thread = require("../Multithreading/Thread.js");
const DataBridge = require("../Multithreading/DataBridge.js");

// Class for the main server
class GameServer {
    constructor(sio) {
        this.worldManager = new WorldManager();
        this.matchMaker = new MatchMaker();
        this.mainSocket = new WebSocket(sio, this.matchMaker);
        this.dataBridge = new class extends DataBridge {
            onDataReceived(data) {

            }
        };

        this.deltaTime = 0;
        this.lastTime = 0;
        this.tickRate = 60; // Hz (TEMPORARY)
        this.started = false;
    }

    update() {
        if (Date.now() > 0)
            this.deltaTime = (Date.now() - this.lastTime) / 1000;

        if (this.deltaTime > 1) {
            if (this.started)
                console.warn("High throttling! DT:", this.deltaTime * 1000 + "ms");
            else
                this.started = true;
            this.deltaTime = 0;
        }

        this.matchMaker.update(this);
        this.mainSocket.cl.update(this);

        // TODO: Parameter should be workerData on the thread code
        this.importDataBridge(this.worldManager.exportDataBridge());
        this.dataBridge.update();


        // /--- On a different thread ---\

        this.worldManager.update();
        this.worldManager.importDataBridge(this.exportDataBridge());

        // \--- On a different thread ---/

        if (Date.now() > 0)
            this.lastTime = Date.now();
    }

    disconnectAll() {
        for (let id in this.mainSocket.clientList) {
            this.mainSocket.clientList[id].disconnect("Admin kicked all");
        }
    }

    importDataBridge(data) {
        this.dataBridge.receivedData = data;
    }

    exportDataBridge() {
        return this.dataBridge.outboundData;
    }

    start() {
        new Thread({}, "./src/test.js").run();
        setInterval(() => this.update(), 1000 / this.tickRate);
    }
}

module.exports = GameServer;