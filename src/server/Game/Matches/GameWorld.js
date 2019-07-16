const EntityManager = require("../Entity/Management/EntityManager.js");
const STileMap = require("../TileBased/STileMap.js");
const TeamManager = require("./TeamManager.js");
const Tile = require("../TileBased/Tile");
const LootCrate = require("../Entity/Loot/Boxes/LootCrate.js");
const ClientList = require("../../Networking/ClientList.js");


class PlayerList extends ClientList {
    constructor() {
        super();
    }

    removeClient(id) {
        this.getClient(id).player.remove();
        super.removeClient(id);
    }
}

const DEFAULT_MAP = new STileMap("shared/res/tilemaps/MegaMap.json");

class GameWorld extends EntityManager {
    constructor(serverSocket, gameMap = DEFAULT_MAP) {
        super(true, gameMap);
        this.teamManager = new TeamManager();
        this._clients = new PlayerList();

        for (var i = 0; i < 5; i++) {
            this.spawnEntity(
                142 * Tile.SIZE + Tile.SIZE * 8 * i,
                202 * Tile.SIZE,
                new LootCrate(0, 0, 3));
        }
    }

    spawnPlayer(client) {
        this._clients.addClient(client.id, client);
        this.teamManager.addPlayer(client.player);
        this.spawnEntity(
            145 * Tile.SIZE,
            202 * Tile.SIZE,
            client.player);
    }

    update(deltaTime) {
        super.update(deltaTime);
        for (var id in this._clients.getContainer()) {
            var client = this._clients.getClient(id);
            // After the entities have been updated and
            // the data packs have been supplied, they
            // are queried to the client socket and then
            // emitted to the client.
            client.update(this.entityManager);
            if (client.removed) {
                this._clients.removeClient(client.id)
            }
        }
    }
}

module.exports = GameWorld;