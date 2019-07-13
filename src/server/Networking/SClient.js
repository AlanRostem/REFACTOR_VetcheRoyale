Player = require("../Game/Entity/Player/SPlayer.js");
Tile = require("../Game/TileBased/Tile.js");
QuadTree = require("../Game/Entity/Management/QuadTree.js");
InputReceiver = require("./InputReceiver.js");

class Client {
    constructor(socket, clientList, entityManager) {
        // Object given by socket.io
        this._socket = socket;

        this._socket.emit("connectClient", {id: socket.id});

        this._inputReceiver = new InputReceiver(this);

        this._player = new Player(0, 0, this);
        entityManager.spawnEntity(
            //0, 0,
            145 * Tile.SIZE,
            202 * Tile.SIZE,
            this._player);

        this.defineSocketEvents(socket, clientList, entityManager);
    }

    get inputReceiver() {
        return this._inputReceiver;
    }

    get player() {
        return this._player;
    }

    get id() {
        return this._socket.id;
    }

    get socket() {
        return this._socket;
    }

    getKeyState(keyCode) {
        return this._keyStates[keyCode];
    }

    emit(eventType, data) {
        this._socket.emit(eventType, data);
    }

    on(eventType, callback) {
        this._socket.on(eventType, callback);
    }

    defineSocketEvents(socket, clientList, entityManager) {
        this._socket.on("connectClientCallback", data => {
            console.log("Client [ " + data.id + " ] successfully connected!");
            this._socket.broadcast.emit("broadcast-newPlayer", {
                id: this.id,
                playerCount: clientList.length
            });
        });

        this._socket.on("disconnect", data => {
            clientList.removeClient(this.id);
            entityManager.removeEntity(this.player.id);
            console.log("Disconnected [ " + this.id + " ]");
        });

        var _this = this;
        this.on('_ping', function() {
            _this.emit('_pong');
        });
    }

    update(entityManager) {
        this.emit("updateEntity", this._player.entitiesInProximity.exportDataPack());
    }
}

module.exports = Client;