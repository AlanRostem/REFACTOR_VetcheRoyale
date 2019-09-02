const EntityManager = require("../Entity/Management/EntityManager.js");
const TeamManager = require("./TeamManager.js");
const Tile = require("../TileBased/Tile");
const ClientList = require("../../Networking/ClientList.js");
const TileMapConfigs = require("../../../shared/code/TileBased/STileMapConfigs.js");
const ONMap = require("../../../shared/code/DataStructures/SObjectNotationMap.js");
const LootCrate = require("../Entity/Loot/Boxes/LootCrate.js");
const Portal = require("../Entity/Portal/Portal.js");
const GameDataLinker = require("../Entity/Player/GameDataLinker.js");
const GameRules = require("./GameRules.js");

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
    constructor(serverSocket, name, gameMap) {
        super(true, gameMap);
        this._settings = new GameRules();
        this.teamManager = new TeamManager(this);
        this.dataPacket = {};

        this._clients = new PlayerList();
        this._id = name;
        this._portals = new ONMap();

        this.spawner.spawnAll(this);
    }

    get id() {
        return this._id;
    }

    getGameRule(key) {
        return this._settings.getRule(key);
    }

    setGameRules(object) {
        this._settings.configure(object);
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
        if (entity instanceof Portal) {
            if (this._portals.has(entity.portalTileID)) {
                this._portals.get(entity.portalTileID).push(entity);
                this._portals.get(entity.portalTileID)[0].link(
                    this._portals.get(entity.portalTileID)[1]);
            } else {
                this._portals.set(entity.portalTileID, [entity]);
            }
        }
        return super.spawnEntity(x, y, entity);
    }


    get spawner() {
        return this.tileMap._spawner;
    }

    get maxPlayers() {
        return this.getGameRule("maxPlayers");
    }

    get playerCount() {
        return this._clients.length;
    }

    get isFull() {
        return this.playerCount === this.getGameRule("maxPlayers");
    }

    spawnPlayer(client) {
        this._clients.addClient(client.id, client);
        // TODO: Add teams back later
        this.teamManager.addPlayer(client.player, this);
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

    setGameData(key, value) {
        this.dataPacket[key] = value;
    }

    update(deltaTime) {
        // Update the entities, then create data packs
        super.update(deltaTime);
        this.dataPacket.mapName = this.tileMap.name;
        this.dataPacket.playerCount = this.playerCount;
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