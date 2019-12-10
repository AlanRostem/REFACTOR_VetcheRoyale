const EntityManager = require("../Entity/Management/EntityManager.js");
const TeamManager = require("./TeamManager.js");
const Tile = require("../TileBased/Tile.js");
const ClientList = require("../../Networking/ClientList.js");
const TileMapConfigs = require("../../../shared/code/TileBased/STileMapConfigs.js");
const ONMap = require("../../../shared/code/DataStructures/SObjectNotationMap.js");
const LootCrate = require("../Entity/Loot/Boxes/LootCrate.js");
const Portal = require("../Entity/Portal/Portal.js");
const GameDataLinker = require("../Entity/Player/GameDataLinker.js");
const GameRules = require("./GameRules.js");
const EventManager = require("./Matches/SEventManager.js");
const PacketBuffer = require("../../Networking/PacketBuffer.js");

// Simulation of an entire game world.
class GameWorld extends EntityManager {
    constructor(name, gameMap) {
        super(true, gameMap);
        this.settings = new GameRules();
        this.teamManager = new TeamManager(this);
        this.eventManager = new EventManager(gameMap);
        this.dataPacket = {};
        this.players = 0;

        this.id = name;
        this.portals = new ONMap();
        this.bridgedData = new ONMap();

        this.recentlySpawnedEntities = new ONMap();
        this.spawner.spawnAll(this);
        this.debugData = {};
    }

    get mapName() {
        return this.tileMap.name;
    }

    get entityCount() {
        return Object.keys(this.container).length;
    }

    getGameRule(key) {
        return this.settings.getRule(key);
    }

    setGameRules(object) {
        this.settings.configure(object);
    }



    spawnEntity(x, y, entity) {
        entity.setWorld(this);
        this.recentlySpawnedEntities.set(entity.id, 1);
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

    // TODO: Fix
    get playerCount() {
        return this.players;
    }

    get isFull() {
        return this.playerCount === this.getGameRule("maxPlayers");
    }

    spawnPlayer(player) {
        //this.clients.addClient(player.id, player);
        this.players++;
        this.teamManager.addPlayer(player, this);
        this.spawner.spawnSpecificAtPos(105, player, this);

       /* this.eventManager.addGlobal(
            "Welcome", "announcement", "Green", 0, {
                string: "Welcome to Dome24",
            }, true
        );*/
    }

    removePlayer(id) {
        this.removeEntity(id);
        this.players--;
    }

    setGameData(key, value) {
        this.dataPacket[key] = value;
    }

    exportData() {

    }

    update(deltaTime, worldManager) {
        this.teamManager.update();
        // Update the entities, then create data packs
        super.update(deltaTime);
        this.dataPacket.mapName = this.tileMap.name;
        this.dataPacket.playerCount = this.playerCount;
        this.eventManager.update(this, deltaTime);
        this.recentlySpawnedEntities.clear();
    }
}

module.exports = GameWorld;