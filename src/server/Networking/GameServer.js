const WebSocket = require("./WebSocket.js");
const MatchMaker = require("./Matchmaker.js");
const Thread = require("../Multithreading/Thread.js");
const DataBridge = require("../Multithreading/DataBridge.js");


// Class for the main server
class GameServer {
    constructor(sio) {
        this.matchMaker = new MatchMaker();
        this.mainSocket = new WebSocket(sio, this.matchMaker, this);

        this.tickRate = 64; // Hz (TEMPORARY)

        this.thread = new Thread({
            tickRate: this.tickRate
        }, "./src/server/Game/SimulationSide.js");

        this.dataBridge = null;

        this.deltaTime = 0;
        this.lastTime = 0;
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

        if (Date.now() > 0)
            this.lastTime = Date.now();
    }

    disconnectAll() {
        for (let id in this.mainSocket.clientList) {
            this.mainSocket.clientList[id].disconnect("Admin kicked all");
        }
    }

    start() {
        this.thread.run();
        this.dataBridge = new DataBridge(this.thread.worker);
        this.defineClientResponseEvents();
        setInterval(() => this.update(), 1000 / this.tickRate);
    }

    defineClientResponseEvents() {
        this.dataBridge.addClientResponseListener("clientInWorld", data => {
            if (!this.mainSocket.cl.getClient(data.id)) {
                //console.log("\x1b[33m" + "clientInWorld" + "\x1b[0m");
                return;
            }
            this.mainSocket.cl.getClient(data.id).worldID = data.worldID;
            console.log("--- Simulation thread: Receiving client", data.id + "... ---");
        });

        this.dataBridge.addClientResponseListener("initEntity", (data) => {
            if (!this.mainSocket.cl.getClient(data.id)) {
                //console.log("\x1b[33m" + "initEntity" + "\x1b[0m");
                return;
            }
            this.mainSocket.cl.getClient(data.id).emit("initEntity", data.data);
            //console.log("Init entity data to client:", id);
        });

        this.dataBridge.addClientResponseListener("spawnEntity", (data) => {
            if (!this.mainSocket.cl.getClient(data.id)) {
                //console.log("\x1b[33m" + "spawnEntity" + "\x1b[0m");
                return;
            }
            this.mainSocket.cl.getClient(data.id).emit("spawnEntity", data.data);
            //console.log("Added:", "\x1b[33m" + data.eType + "\x1b[0m", "with ID:", '\x1b[36m' + data.id + "\x1b[0m");
        });

        this.dataBridge.addClientResponseListener("addEntity", (data) => {
            if (!this.mainSocket.cl.getClient(data.id)) {
                //console.log("\x1b[33m" + "addEntity" + "\x1b[0m");

                return;
            }
            this.mainSocket.cl.getClient(data.id).emit("addEntity", data.data);
            //console.log("Added:", "\x1b[33m" + data.eType + "\x1b[0m", "with ID:", '\x1b[36m' + data.id + "\x1b[0m");
        });

        this.dataBridge.addClientResponseListener("removeEntity", (data) => {
            if (!this.mainSocket.cl.getClient(data.id)) {
                //console.log("\x1b[33m" + "removeEntity" + "\x1b[0m");
                return;
            }
            this.mainSocket.cl.getClient(data.id).emit("removeEntity", data.data);
            //console.log("Deleting entity with ID:", '\x1b[36m' + id + "\x1b[0m");
        });

        this.dataBridge.addClientResponseListener("removeOutOfBoundsEntity", (data) => {
            if (!this.mainSocket.cl.getClient(data.id)) {
                //console.log("\x1b[33m" + "removeOutOfBoundsEntity" + "\x1b[0m");
                return;
            }
            this.mainSocket.cl.getClient(data.id).emit("removeOutOfBoundsEntity", data.data);
            //console.log("Throwing entity out of bounds with ID:", '\x1b[36m' + id + "\x1b[0m");
        });

        this.dataBridge.addClientResponseListener("serverUpdateTick", (data) => {
            if (!this.mainSocket.cl.getClient(data.id)) {
                //console.log("\x1b[33m" + "serverUpdateTick" + "\x1b[0m");
                return;
            }
            this.mainSocket.cl.getClient(data.id).networkedUpdate(data.data, this);
            //console.log("Throwing entity out of bounds with ID:", '\x1b[36m' + id + "\x1b[0m");
        });
    }


}

module.exports = GameServer;