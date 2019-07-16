const GameWorld = require("./GameWorld.js");

class Matchmaker {
    constructor(mainSocket) {
        this._queuedPlayers = {};
        this._gameWorlds = {};
        this._lastCreatedWorldID = -1;

        this.createWorld(mainSocket);
    }

    createWorld(socket) {
        var id = String.random();
        this._lastCreatedWorldID = id;
        return this._gameWorlds[id] = new GameWorld(socket);
    }

    putPlayerInGame(playerID, gameID) {
        var client = this._queuedPlayers[playerID];
        var world = this._gameWorlds[gameID];
        world.spawnPlayer(client);
        delete this._queuedPlayers[playerID];
    }

    queuePlayer(client) {
        this._queuedPlayers[client.id] = client;
    }

    checkQueuedPlayers(webSocket, server) {
        for (var id in this._queuedPlayers) {
            // TEST:
            if (!this._gameWorlds[this._lastCreatedWorldID].isFull) {
                this.putPlayerInGame(id, this._lastCreatedWorldID);
            }
        }
    }

    update(webSocket, server) {
        this.checkQueuedPlayers(webSocket, server);
        for (var worldID in this._gameWorlds) {
            this._gameWorlds[worldID].update(server.deltaTime);
        }
    }
}

module.exports = Matchmaker;