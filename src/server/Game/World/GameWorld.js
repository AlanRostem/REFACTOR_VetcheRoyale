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
        if (id === this.getClient(id).player.id) {
            this.getClient(id).player.remove();
        }
        super.removeClient(id);
    }
}

// Simulation of an entire game world.
class GameWorld extends EntityManager {
    constructor(name, gameMap) {
        super(true, gameMap);
        this.settings = new GameRules();
        this.teamManager = new TeamManager(this);
        this.dataPacket = {};

        this.clients = new PlayerList();
        this.id = name;
        this.portals = new ONMap();

        this.spawner.spawnAll(this);
    }


    getGameRule(key) {
        return this.settings.getRule(key);
    }

    setGameRules(object) {
        this.settings.configure(object);
    }

    changeMap(name) {
        this.tileMap = TileMapConfigs.getMap(name);
        this.clients.forEach(client => {
            client.emit("gameEvent-changeMap", {
                mapName: name
            });
        });
    }

    spawnEntity(x, y, entity) {
        entity.setWorld(this);
        if (entity instanceof GameDataLinker) {
            entity.gameData.mapName = this.tileMap.name;
            entity.gameData.playerCount = this.playerCount;
        }
        if (entity instanceof Portal) {
            if (this.portals.has(entity.portalTileID)) {
                this.portals.get(entity.portalTileID).push(entity);
                this.portals.get(entity.portalTileID)[0].link(
                    this.portals.get(entity.portalTileID)[1]);
            } else {
                this.portals.set(entity.portalTileID, [entity]);
            }
        }
        return super.spawnEntity(x, y, entity);
    }


    get spawner() {
        return this.tileMap.spawner;
    }

    get maxPlayers() {
        return this.getGameRule("maxPlayers");
    }

    get playerCount() {
        return this.clients.length;
    }

    get isFull() {
        return this.playerCount === this.getGameRule("maxPlayers");
    }

    spawnPlayer(player) {
        this.clients.addClient(player.id, player);
        this.teamManager.addPlayer(player, this);
        this.spawner.spawnSpecificAtPos(105, player, this);
        /*this.spawnEntity(
            61 * Tile.SIZE,
            105 * Tile.SIZE,
            client.player);
         */
    }

    removePlayer(id) {
        this.removeEntity(id);
    }

    setGameData(key, value) {
        this.dataPacket[key] = value;
    }

    update(deltaTime) {
        // Update the entities, then create data packs
        super.update(deltaTime);
        this.dataPacket.mapName = this.tileMap.name;
        this.dataPacket.playerCount = this.playerCount;
    }
}

module.exports = GameWorld;