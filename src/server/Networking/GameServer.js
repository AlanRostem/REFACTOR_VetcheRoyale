const WebSocket = require("./WebSocket.js");
const MatchMaker = require("../Game/Matches/Matchmaker.js");

// Class for the main server
class GameServer {
    constructor(socket) {
        this.matchMaker = new MatchMaker(socket);
        this.mainSocket = new WebSocket(socket, this.matchMaker);
        this._deltaTime = 0;
        this._lastTime = 0;
        this._tickRate = 60; // Hz (TEMPORARY)
        this._started = false;
    }

    get deltaTime() {
        return this._deltaTime;
    }

    update() {
        if (Date.now() > 0)
            this._deltaTime = (Date.now() - this._lastTime) / 1000;

        if (this._deltaTime > 1) {
            if (this._started)
                console.warn("High throttling! Check logs.");
            else
                this._started = true;
            this._deltaTime = 0;
        }

        this.matchMaker.update(this.mainSocket.ioInstance, this);

        if (Date.now() > 0)
            this._lastTime = Date.now();
    }

    start() {
        setInterval(() => this.update(), 1000 / this._tickRate);
    }
}

module.exports = GameServer;