Player = require("../Game/Entity/Player/SPlayer.js");

class Client {
    constructor(socket, clientList, entityManager) {
        // Object given by _socket.io
        this._socket = socket;

        this._socket.emit("connectClient", {id: socket.id});
        // Holds all key states of corresponding key codes
        this._keyStates = {
            32: false
        };

        this._player = new Player(0, 0, this);
        entityManager.spawnEntity(100, Math.random() * 100, this._player);

        this.defineSocketEvents(socket, clientList, entityManager);
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
        });

        this._socket.on("disconnect", data => {
            clientList.removeClient(this.id);
            entityManager.removeEntity(this.player.id);
            console.log("Disconnected [ " + this.id + " ]");
        });

        this._socket.on("keyEvent", data => {
            this._keyStates[data.keyCode] = data.keyState;
        });
    }

    update(entityManager) {
        this.emit("updateEntity", this._player.entitiesInProximity.exportDataPack());
    }
}

module.exports = Client;