const GameWorld = require("../GameWorld.js");
const HubWorld = require("./Hubs/HubWorld.js");
const TileMapConfigs = require("../../../../shared/code/TileBased/STileMapConfigs.js");
const ONMap = require("../../../../shared/code/DataStructures/SObjectNotationMap.js");
const PlayGround = require("./PlayGround/PlayGround.js");

// Manages all the game worlds and match queueing.
// TODO: Add match queueing.
class Matchmaker {
    constructor(mainSocket) {
        this._queuedPlayers = {};
        this._gameWorlds = new ONMap();
        this._lastCreatedWorldID = -1;

        let megaMap = new GameWorld(mainSocket, "MegaMap", 24, true, TileMapConfigs.getMap("MegaMap"));
        this.addWorld(megaMap, "MegaMap");

        let lobby = new HubWorld(mainSocket, this._gameWorlds, "lobby", 64, TileMapConfigs.getMap("lobby"));
        this.addWorld(lobby, "lobby");

        let playground = new PlayGround(mainSocket, this._gameWorlds);
        this.addWorld(playground, "playground");
    }

    addWorld(world, id) {
        if (!id) {
            id = String.random();
        }
        this._gameWorlds.set(id, world);
        world._id = id;
        this._lastCreatedWorldID = id;
    }

    createWorld(socket, tileMapName = "lobby", id) {
        if (!id) {
            id = String.random();
        }
        this._lastCreatedWorldID = id;
        return this._gameWorlds.set(id, new GameWorld(socket, id, 24, TileMapConfigs.getMap(tileMapName)));
    }

    putPlayerInGame(playerID, gameID) {
        const client = this._queuedPlayers[playerID];
        const world = this._gameWorlds.get(gameID);
        world.spawnPlayer(client);
        delete this._queuedPlayers[playerID];
    }

    queuePlayer(client) {
        this._queuedPlayers[client.id] = client;
    }

    checkQueuedPlayers(webSocket, server) {
        for (let id in this._queuedPlayers) {
            // TEST: Creating a new game instantly after it exceeds the player max count
            if (!this._gameWorlds.get(this._lastCreatedWorldID).isFull) {
                this.putPlayerInGame(id, this._lastCreatedWorldID);
            } else {
                this.createWorld(webSocket);
            }
        }
    }

    update(webSocket, server) {
        this.checkQueuedPlayers(webSocket, server);
        for (let worldID in this._gameWorlds.object) {
            if (this._gameWorlds.has(worldID))
                this._gameWorlds.get(worldID).update(server.deltaTime);
        }
    }
}

module.exports = Matchmaker;