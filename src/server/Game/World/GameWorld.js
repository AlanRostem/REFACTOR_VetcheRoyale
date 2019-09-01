const EntityManager = require("../Entity/Management/EntityManager.js");
const TeamManager = require("./TeamManager.js");
const Tile = require("../TileBased/Tile");
const ClientList = require("../../Networking/ClientList.js");
const TileMapConfigs = require("../../../shared/code/TileBased/STileMapConfigs.js");
const LootCrate = require("../Entity/Loot/Boxes/LootCrate.js");
const Portal = require("../Entity/Portal/Portal.js");
const GameDataLinker = require("../Entity/Player/GameDataLinker.js");

class PlayerList extends ClientList {
    constructor() {
        super();
    }

    removeClient(id) {
        this.getClient(id).player.remove();
        super.removeClient(id);
    }
}

// Simulation of an entire game world.
class GameWorld extends EntityManager {
    constructor(serverSocket, name, maxPlayers = 4, pvp = false, gameMap) {
        super(true, gameMap);
        this.teamManager = new TeamManager();
        this._clients = new PlayerList();
        this._maxPlayers = maxPlayers;
        this._id = name;
        this._pvp = pvp;

        for (var i = 0; i < 2; i++) {
            this.spawnEntity(
                66 * Tile.SIZE + Tile.SIZE * 10 * i,
                105 * Tile.SIZE,
                new LootCrate(0, 0, 3));
        }

        let p1 = this.spawnEntity(
            50 * Tile.SIZE,
            108 * Tile.SIZE,
            new Portal(0, 0, null));

        let p2 = this.spawnEntity(
            45 * Tile.SIZE,
            90 * Tile.SIZE,
            new Portal(0, 0, null));

        p1.link(p2);
    }

    get id() {
        return this._id;
    }

    changeMap(name) {
        this.tileMap = TileMapConfigs.getMap(name);
        this._clients.forEach(client => {
            client.emit("gameEvent-changeMap", {
                mapName: name
            });
        });
    }

    spawnEntity(x, y, entity) {
        entity.setWorld(this);
        if (entity instanceof GameDataLinker) {
            entity._gameData.mapName = this.tileMap.name;
            entity._gameData.playerCount = this.playerCount;
        }
        return super.spawnEntity(x, y, entity);
    }

    get pvpEnabled() {
        return this._pvp;
    }

    get spawner() {
        return this.tileMap._spawner;
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
        // TODO: Add teams back later
        this.teamManager.addPlayer(client.player);
        this.spawner.spawnSpecificAtPos(105, client.player, this);
        /*this.spawnEntity(
            61 * Tile.SIZE,
            105 * Tile.SIZE,
            client.player);
         */
    }

    removePlayer(id) {
        this.removeEntity(id);
        this._clients.removeClient(id);
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
            if (client.removed) {
                this._clients.removeClient(client.id);
            } else {
                client.update(this);
            }
        }
    }
}

module.exports = GameWorld;