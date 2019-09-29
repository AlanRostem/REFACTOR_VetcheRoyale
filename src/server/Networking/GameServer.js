const WebSocket = require("./WebSocket.js");
const MatchMaker = require("./Matchmaker.js");
const WorldManager = require("../Game/World/WorldManager.js");
const Thread = require("../Multithreading/Thread.js");
const DBClientEventListener = require("../Multithreading/DBClientEventListener.js");

// Class for the main server
class GameServer {
    constructor(sio) {
        this.matchMaker = new MatchMaker();
        this.mainSocket = new WebSocket(sio, this.matchMaker, this);
        this.lastWorldName = "playground"; // TODO: Automate
        const _this = this;
        this.dataBridge = new DBClientEventListener();

        this.thread = new class extends Thread {
            onGetMessage(message) {
                _this.importDataBridge(message);
            }
        }({}, "./src/server/Game/SimulationSide.js");

        this.defineClientResponseEvents();

        this.deltaTime = 0;
        this.lastTime = 0;
        this.tickRate = 60; // Hz (TEMPORARY)
        this.started = false;

        this.dataSpoofArray = [];
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

        this.dataSpoofArray.push(this.dataBridge.outboundData);
        this.thread.sendDataToParent(this.dataSpoofArray[0]);
        this.dataSpoofArray.splice(0);
        this.dataBridge.update();

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

    start() {
        this.thread.run();
        setInterval(() => this.update(), 1000 / this.tickRate);
    }

    defineClientResponseEvents() {
        this.dataBridge.addClientResponseListener("clientInWorld", data => {
            if (!this.mainSocket.cl.getClient(data.id)) {
                return;
            }
            this.mainSocket.cl.getClient(data.id).worldID = data.worldID;
            console.log("--- Simulation thread: Receiving client", data.id + "... ---");
        });

        this.dataBridge.addClientResponseListener("initEntity", (data, id) => {
            if (!this.mainSocket.cl.getClient(id)) {
                return;
            }
            this.mainSocket.cl.getClient(id).emit("initEntity", data);
            //console.log("Init entity data to client:", id);
        });

        this.dataBridge.addClientResponseListener("spawnEntity", (data, id) => {
            if (!this.mainSocket.cl.getClient(id)) {
                return;
            }
            this.mainSocket.cl.getClient(id).emit("spawnEntity", data);
            //console.log("Added:", "\x1b[33m" + data.eType + "\x1b[0m", "with ID:", '\x1b[36m' + data.id + "\x1b[0m");
        });

        this.dataBridge.addClientResponseListener("removeEntity", (data, id) => {
            if (!this.mainSocket.cl.getClient(id)) {
                return;
            }
            this.mainSocket.cl.getClient(id).emit("removeEntity", data);
            //console.log("Deleting entity with ID:", '\x1b[36m' + id + "\x1b[0m");
        });

        this.dataBridge.addClientResponseListener("removeOutOfBoundsEntity", (data, id) => {
            if (!this.mainSocket.cl.getClient(id)) {
                return;
            }
            this.mainSocket.cl.getClient(id).emit("removeOutOfBoundsEntity", data);
            //console.log("Throwing entity out of bounds with ID:", '\x1b[36m' + id + "\x1b[0m");
        })
    }
}

module.exports = GameServer;