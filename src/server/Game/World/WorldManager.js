const TileMapConfigs = require("../../../shared/code/TileBased/STileMapConfigs.js");
const ONMap = require("../../../shared/code/DataStructures/SObjectNotationMap.js");
const GameWorld = require("../../Game/World/GameWorld.js");
const HubWorld = require("../../Game/World/Matches/Hubs/HubWorld.js");
const PlayGround = require("../../Game/World/Matches/PlayGround/PlayGround.js");
const SPlayer = require("../Entity/Player/SPlayer.js");
const DataBridge = require("../../Multithreading/DataBridge.js");
const Player = require("../Entity/Player/SPlayer.js");

class WorldManager {
    constructor() {
        this.dataBridge = new class extends DataBridge {
            onDataReceived(data) {
                // TODO: Do shit
            }
        }();

        this.dataBridge.on("test", data => {
            console.log(data)
        });


        this.lastCreatedWorldID = -1;
        this.deltaTime = 0;
        this.lastTime = 0;

        this.gameWorlds = new ONMap();

        // TODO: FIX THIS HACK

        let megaMap = new GameWorld("MegaMap", TileMapConfigs.getMap("MegaMap"));
        this.addWorld(megaMap, "MegaMap");

        let lobby = new HubWorld(this.gameWorlds, "lobby", TileMapConfigs.getMap("lobby"));
        this.addWorld(lobby, "lobby");

        let hub = new HubWorld(this.gameWorlds, "hub", TileMapConfigs.getMap("hub"));
        this.addWorld(hub, "hub");

        let playground = new PlayGround(this.gameWorlds);
        this.playground = playground;

        this.addWorld(playground, "playground");
        playground.spawnPlayer(new Player(0, 0));
    }

    checkQueuedPlayers() {
        for (let id in this.queuedPlayers) {
            // TODO - TEST: Creating a new game instantly after it exceeds the player max count
            if (!this.gameWorlds.get(this.lastCreatedWorldID).isFull) {
                this.putPlayerInGame(id, this.lastCreatedWorldID);
            } else {
                this.createWorld();
            }
        }
    }

    setBridgedData(key, value) {
        this.dataBridge.queueOutboundData(key, value);
    }

    addWorld(world, id) {
        if (!id) {
            id = String.random();
        }
        this.gameWorlds.set(id, world);
        world.id = id;
        this.lastCreatedWorldID = id;
    }

    createWorld(tileMapName = "lobby", id) {
        if (!id) {
            id = String.random();
        }
        this.lastCreatedWorldID = id;
        return this.gameWorlds.set(id, new GameWorld(id, 24, TileMapConfigs.getMap(tileMapName)));
    }

    putPlayerInGame(playerID, gameID) {
        const player = new Player(0,0);
        player.id = playerID;
        const world = this.gameWorlds.get(gameID);
        world.spawnPlayer(player);
    }


    importDataBridge(data) {
        this.dataBridge.receivedData = data;
    }

    exportDataBridge() {
        return this.dataBridge.outboundData;
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

        this.checkQueuedPlayers();
        for (let worldID in this.gameWorlds.object) {
            if (this.gameWorlds.has(worldID))
                this.gameWorlds.get(worldID).update(this.deltaTime, this);
        }

        if (Date.now() > 0)
            this.lastTime = Date.now();
    }
}

module.exports = WorldManager;