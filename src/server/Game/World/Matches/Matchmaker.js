const GameWorld = require("../GameWorld.js");
const HubWorld = require("./Hubs/HubWorld.js");
const TileMapConfigs = require("../../../../shared/code/TileBased/STileMapConfigs.js");
const ONMap = require("../../../../shared/code/DataStructures/SObjectNotationMap.js");
const PlayGround = require("./PlayGround/PlayGround.js");
const Match = require("./Match/Match.js");

// Manages all the game worlds and match queueing.
// TODO: Add match queueing.
class Matchmaker {
    constructor(mainSocket) {
        this.queuedPlayers = {};
        this.gameWorlds = new ONMap();
        this.lastCreatedWorldID = -1;

        // TODO: FIX THIS HACK

        let megaMap = new GameWorld(mainSocket, "MegaMap", TileMapConfigs.getMap("MegaMap"));
        this.addWorld(megaMap, "MegaMap");

        let lobby = new HubWorld(mainSocket, this.gameWorlds, "lobby", TileMapConfigs.getMap("lobby"));
        this.addWorld(lobby, "lobby");

        let hub = new HubWorld(mainSocket, this.gameWorlds, "hub", TileMapConfigs.getMap("hub"));
        this.addWorld(hub, "hub");

        let playground = new PlayGround(mainSocket, this.gameWorlds);
        this.addWorld(playground, "playground");

        let MatchWorld = new Match(mainSocket, this._gameWorlds, "MatchWorld", 64, TileMapConfigs.getMap("MegaMap"));
        this.addWorld(MatchWorld, "match");
    }

    addWorld(world, id) {
        if (!id) {
            id = String.random();
        }
        this.gameWorlds.set(id, world);
        world.id = id;
        this.lastCreatedWorldID = id;
    }

    createWorld(socket, tileMapName = "lobby", id) {
        if (!id) {
            id = String.random();
        }
        this.lastCreatedWorldID = id;
        return this.gameWorlds.set(id, new GameWorld(socket, id, 24, TileMapConfigs.getMap(tileMapName)));
    }

    putPlayerInGame(playerID, gameID) {
        const client = this.queuedPlayers[playerID];
        const world = this.gameWorlds.get(gameID);
        world.spawnPlayer(client);
        delete this.queuedPlayers[playerID];
    }

    queuePlayer(client) {
        this.queuedPlayers[client.id] = client;
    }

    checkQueuedPlayers(webSocket, server) {
        for (let id in this.queuedPlayers) {
            // TEST: Creating a new game instantly after it exceeds the player max count
            if (!this.gameWorlds.get(this.lastCreatedWorldID).isFull) {
                this.putPlayerInGame(id, this.lastCreatedWorldID);
            } else {
                this.createWorld(webSocket);
            }
        }
    }

    update(webSocket, server) {
        this.checkQueuedPlayers(webSocket, server);
        for (let worldID in this.gameWorlds.object) {
            if (this.gameWorlds.has(worldID))
                this.gameWorlds.get(worldID).update(server.deltaTime);
        }
    }
}

module.exports = Matchmaker;
