const GameWorld = require("./GameWorld.js");

class Matchmaker {
    constructor(mainSocket) {
        this._queuedPlayers = {};
        this._gameWorlds = {};
        this._lastCreatedWorldID = -1;

        this.createWorld(mainSocket);
    }

    createWorld(socket) {
        const id = String.random();
        this._lastCreatedWorldID = id;
        return this._gameWorlds[id] = new GameWorld(socket);
    }

    putPlayerInGame(playerID, gameID) {
        const client = this._queuedPlayers[playerID];
        const world = this._gameWorlds[gameID];
        world.spawnPlayer(client);
        delete this._queuedPlayers[playerID];
    }

    queuePlayer(client) {
        this._queuedPlayers[client.id] = client;
    }

    checkQueuedPlayers(webSocket, server) {
        for (let id in this._queuedPlayers) {
            // TEST: Creating a new game instantly after it exceeds the player max count
            if (!this._gameWorlds[this._lastCreatedWorldID].isFull) {
                this.putPlayerInGame(id, this._lastCreatedWorldID);
            } else {
                this.createWorld(webSocket);
            }
        }
    }

    update(webSocket, server) {
        this.checkQueuedPlayers(webSocket, server);
        for (let worldID in this._gameWorlds) {
            if (this._gameWorlds.hasOwnProperty(worldID))
                this._gameWorlds[worldID].update(server.deltaTime);
        }
    }
}

module.exports = Matchmaker;