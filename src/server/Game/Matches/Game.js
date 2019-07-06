const EntityManager = require("../Entity/Management/EntityManager.js");
const WebSocket = require("../../Networking/WebSocket.js");
const Entity = require("../Entity/SEntity.js");
const Tile = require("../TileBased/Tile");
const STileMap = require("../TileBased/STileMap.js");
const TeamManager = require("../Matches/TeamManager.js");
const Ammo = require("../Entity/Loot/Multanium/Ammo.js");

// Class composition of matches
class Game {
    constructor(socket) {
        this.entityManager = new EntityManager(true, new STileMap("shared/res/tilemaps/MegaMap.json"));
        this.teamManager = new TeamManager();
        this.mainSocket = new WebSocket(socket, this.entityManager, this);
        this._deltaTime = 0;
        this._lastTime = 0;
        this._tickRate = 60; // Hz

        this.entityManager.spawnEntity(
            142 * Tile.SIZE,
            202 * Tile.SIZE,
            new Ammo(0, 0)
        )
    }

    update() {
        if (Date.now() > 0)
            this._deltaTime = (Date.now() - this._lastTime) / 1000;

        if (this._deltaTime > 1)
            this._deltaTime = 0;

        // Update the entities, then create data packs
        this.entityManager.update(this._deltaTime);
        for (var id in this.mainSocket.clientList) {
            var client = this.mainSocket.clientList[id];
            // After the entities have been updated and
            // the data packs have been supplied, they
            // are queried to the client socket and then
            // emitted to the client.
            client.update(this.entityManager);
        }

        if (Date.now() > 0)
            this._lastTime = Date.now();

    }

    start() {
        setInterval(() => this.update(), 1000 / this._tickRate);
    }
}

module.exports = Game;