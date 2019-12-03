const TileMapConfigs = require("../../../shared/code/TileBased/STileMapConfigs.js");
const ONMap = require("../../../shared/code/DataStructures/SObjectNotationMap.js");
const GameWorld = require("../../Game/World/GameWorld.js");
const HubWorld = require("../../Game/World/Matches/Hubs/HubWorld.js");
const PlayGround = require("../../Game/World/Matches/PlayGround/PlayGround.js");
const Match = require("../../Game/World/Matches/Match/Match.js");
const SPlayer = require("../Entity/Player/SPlayer.js");
const DataBridge = require("../../Multithreading/DataBridge.js");
const Player = require("../Entity/Player/SPlayer.js");
const GameSimulationAdmin = require("../../../admin/server/monitor/GameSimulationAdmin.js");

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
    constructor(parentPort) {
        this.dataBridge = new DataBridge(parentPort);

        this.defineClientResponseEvents();
        this.defineAdminResponseEvents();

        this.lastCreatedWorldID = -1;
        this.deltaTime = 0;
        this.lastTime = 0;

        this.gameWorlds = new ONMap();
        this.playerList = new ONMap();
        this.adminList = new ONMap();

        // TODO: FIX THIS HACK



        let playground = new PlayGround(this.gameWorlds);
        this.addWorld(playground, "playground");

        let battleground = new Match(this.gameWorlds, "battleground", TileMapConfigs.getMap("battleground"));
        battleground.setGameRules({
           "infiniteAmmo": true,
            "maxTeamMembers": 1
        });
        this.addWorld(battleground, "battleground");


        let match = new Match(this.gameWorlds, "match", TileMapConfigs.getMap("MegaMap"));
        this.addWorld(match, "match");
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

    addWorld(world, id = String.random()) {
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
        const player = new Player(0, 0, this);
        player.id = playerID;
        const world = this.gameWorlds.get(gameID);
        world.spawnPlayer(player);
    }

    addAdministrator(adminID) {
        const admin = new GameSimulationAdmin(adminID, this.gameWorlds.object);
        this.adminList.set(adminID, admin);
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

        for (let admin of this.adminList.array) {
            admin.update(this);
        }

        this.checkQueuedPlayers();
        for (let worldID in this.gameWorlds.object) {
            if (this.gameWorlds.has(worldID)) {
            }
            this.gameWorlds.get(worldID).update(this.deltaTime, this);
        }

        if (Date.now() > 0)
            this.lastTime = Date.now();
    }

    defineClientResponseEvents() {

        this.dataBridge.addClientResponseListener("clientConnectCallback", data => {
            let player = new Player(data.id, this);
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
            if (!player) {
                return;
            }
            this.gameWorlds.get(player.homeWorldID).removePlayer(player.id);
            this.playerList.remove(player.id);
            console.log("Removed player", data.id, "from", player.homeWorldID);
        });

        this.dataBridge.addClientResponseListener("listenToInput", (data) => {
            if (this.playerList.has(data.id)) {
                this.playerList.get(data.id)
                    .receiveInputData(data.data);
            }
        });
    }

    defineAdminResponseEvents() {
        this.dataBridge.addClientResponseListener("connectAdmin", data => {
            this.addAdministrator(data.id);
        });

        this.dataBridge.addClientResponseListener("removeAdmin", data => {
            this.adminList.remove(data.id);
        });

        this.dataBridge.addClientResponseListener("adminDataSelection", data => {

        });

        this.dataBridge.addClientResponseListener("adminToServer", data => {
            this.adminList.get(data.id).selectProp(data.data.content.prop, data.data.content.type, data.data.messageType);
        })
    }
}

module.exports = WorldManager;
