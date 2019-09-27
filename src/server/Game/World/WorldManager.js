const TileMapConfigs = require("../../../shared/code/TileBased/STileMapConfigs.js");
const ONMap = require("../../../shared/code/DataStructures/SObjectNotationMap.js");
const GameWorld = require("../../Game/World/GameWorld.js");
const HubWorld = require("../../Game/World/Matches/Hubs/HubWorld.js");
const PlayGround = require("../../Game/World/Matches/PlayGround/PlayGround.js");
const SPlayer = require("../Entity/Player/SPlayer.js");
const DataBridge = require("../../Multithreading/DataBridge.js");
const Player = require("../Entity/Player/SPlayer.js");

String.random = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

Array.prototype.remove = function () {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

class WorldManager {
    constructor() {
        this.dataBridge = new class extends DataBridge {
            onDataReceived(data) {
                // TODO: Do shit
                if (data["events"]["client"]) {
                    console.log(data["events"]["client"]);
                }
            }
        }();

        this.defineClientResponseEvents();

        this.lastCreatedWorldID = -1;
        this.deltaTime = 0;
        this.lastTime = 0;

        this.gameWorlds = new ONMap();
        this.playerList = new ONMap();

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

    getLastWorld() {
        return this.gameWorlds.get(this.lastCreatedWorldID);
    }

    createWorld(tileMapName = "lobby", id) {
        if (!id) {
            id = String.random();
        }
        this.lastCreatedWorldID = id;
        return this.gameWorlds.set(id, new GameWorld(id, 24, TileMapConfigs.getMap(tileMapName)));
    }

    putPlayerInGame(playerID, gameID) {
        const player = new Player(0, 0);
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

    defineClientResponseEvents() {
        this.dataBridge.addClientResponseListener("clientConnectCallback", data => {
            let player = new Player();
            player.id = data.id;
            this.getLastWorld().spawnPlayer(player);

            this.playerList.set(data.id, player);
            player.homeWorldID = this.getLastWorld().id;
            this.dataBridge.transferClientEvent("clientInWorld", data.id, {
                id: data.id,
                worldID: player.homeWorldID
            });
            console.log("Player", data.id, "spawned in", player.homeWorldID);
        });


        this.dataBridge.addClientResponseListener("removePlayer", data => {
            let player = this.playerList.get(data.id);
            this.gameWorlds.get(player.homeWorldID).removeEntity(player.id);
            this.playerList.remove(player.id);
            console.log("Removed player", data.id, "from", player.homeWorldID);
        });




        //console.log(this.dataBridge.events.object["clientEvent"].toString())
    }
}

module.exports = WorldManager;