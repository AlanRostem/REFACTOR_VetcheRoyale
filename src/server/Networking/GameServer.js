const EntityManager = require("../Game/Entity/Management/EntityManager.js");
const WebSocket = require("./WebSocket.js");
const STileMap = require("../Game/TileBased/STileMap.js");
const MatchMaker = require("../Game/Matches/Matchmaker.js");

// Class composition of matches
class GameServer {
    constructor(socket) {
        this.entityManager = new EntityManager(true, new STileMap("shared/res/tilemaps/MegaMap.json"));
        this.matchMaker = new MatchMaker(socket);
        this.mainSocket = new WebSocket(socket, this.matchMaker);
        this._deltaTime = 0;
        this._lastTime = 0;
        this._tickRate = 60; // Hz
    }

    get deltaTime() {
        return this._deltaTime;
    }

    update() {
        if (Date.now() > 0)
            this._deltaTime = (Date.now() - this._lastTime) / 1000;

        if (this._deltaTime > 1)
            this._deltaTime = 0;

        // Update the entities, then create data packs
        this.matchMaker.update(this.mainSocket, this);


        if (Date.now() > 0)
            this._lastTime = Date.now();

    }

    start() {
        setInterval(() => this.update(), 1000 / this._tickRate);
    }
}

module.exports = GameServer;