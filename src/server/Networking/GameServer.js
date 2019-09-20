const WebSocket = require("./WebSocket.js");
const MatchMaker = require("../Game/World/Matches/Matchmaker.js");

// Class for the main server
class GameServer {
    constructor(socket) {
        this.matchMaker = new MatchMaker(socket);
        this.mainSocket = new WebSocket(socket, this.matchMaker);
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

        this.matchMaker.update(this.mainSocket.ioInstance, this);
        this.mainSocket.cl.update();

        if (Date.now() > 0)
            this.lastTime = Date.now();
    }

    disconnectAll() {
        for (let id in this.mainSocket.clientList) {
            this.mainSocket.clientList[id].disconnect("Admin kicked all");
        }
    }

    start() {
        setInterval(() => this.update(), 1000 / this.tickRate);
    }
}

module.exports = GameServer;