const EntityManager = require("../Entity/Management/EntityManager.js");
const TeamManager = require("./TeamManager.js");
const Tile = require("../TileBased/Tile");
const LootCrate = require("../Entity/Loot/Boxes/LootCrate.js");
const ClientList = require("../../Networking/ClientList.js");
const TileMapConfigs = require("../../../shared/code/TileBased/STileMapConfigs.js");

class PlayerList extends ClientList {
    constructor() {
        super();
    }

    removeClient(id) {
        this.getClient(id).player.remove();
        super.removeClient(id);
    }
}

const DEFAULT_MAP = TileMapConfigs.getMap("lobby");

class GameWorld extends EntityManager {
    constructor(serverSocket, maxPlayers = 4, gameMap = DEFAULT_MAP) {
        super(true, gameMap);
        this.teamManager = new TeamManager();
        this._clients = new PlayerList();
        this._maxPlayers = maxPlayers;

        for (var i = 0; i < 5; i++) {
            this.spawnEntity(
                61 * Tile.SIZE + Tile.SIZE * 8 * i,
                105 * Tile.SIZE,
                new LootCrate(0, 0, 3));
        }
    }

    get maxPlayers() {
        return this._maxPlayers;
    }

    get playerCount() {
        return this._clients.length;
    }

    get isFull() {
        return this.playerCount === this.maxPlayers;
    }

    spawnPlayer(client) {
        this._clients.addClient(client.id, client);
        this.teamManager.addPlayer(client.player);
        this.spawnEntity(
            61 * Tile.SIZE,
            105 * Tile.SIZE,
            client.player);
    }

    update(deltaTime) {
        // Update the entities, then create data packs
        super.update(deltaTime);
        for (var id in this._clients.getContainer()) {
            var client = this._clients.getClient(id);
            // After the entities have been updated and
            // the data packs have been supplied, they
            // are queried to the client socket and then
            // emitted to the client.
            client.update(this);
            if (client.removed) {
                this._clients.removeClient(client.id);
            }
        }
    }
}

module.exports = GameWorld;