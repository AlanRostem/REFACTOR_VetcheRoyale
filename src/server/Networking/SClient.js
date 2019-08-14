const Player = require("../Game/Entity/Player/SPlayer.js");
const Tile = require("../Game/TileBased/Tile.js");
const QuadTree = require("../Game/Entity/Management/QuadTree.js");
const InputReceiver = require("./InputReceiver.js");
const ONMap = require("../../shared/code/DataStructures/SObjectNotationMap.js");

// Object that represents a client connected to the server
class Client {
    constructor(socket, clientList) {
        this._inboundDataCallbacks = new ONMap();
        this._outboundPacket = new ONMap();

        // Object given by socket.io
        this._socket = socket;

        this._socket.emit("connectClient", {id: socket.id});

        this._inputReceiver = new InputReceiver(this);

        this._removed = false;

        this._player = new Player(0, 0, this);
        this.defineSocketEvents(socket, clientList);
    }

    addClientUpdateListener(eventName, callback) {
        this._inboundDataCallbacks.set(eventName, callback);
    }

    setOutboundPacketData(key, value) {
        this._outboundPacket.set(key, value);
    }

    get removed() {
        return this._removed;
    }

    set removed(val) {
        this._removed = val;
    }

    defineSocketEvents(socket, clientList) {
        this._socket.on("connectClientCallback", data => {
            console.log("Client [ " + data.id + " ] successfully connected!");
            this._socket.broadcast.emit("broadcast-newPlayer", {
                id: this.id,
                playerCount: clientList.length
            });
        });

        this._socket.on("disconnect", data => {
            clientList.removeClient(this.id);
            console.log("Disconnected [ " + this.id + " ]");
        });

        this._socket.on("clientPacketToServer", packet => {
            this.onClientUpdateReceived(packet)
        })
    }

    onClientUpdateReceived(packet) {
        for (let callback of this._inboundDataCallbacks.array) {
            callback(packet);
        }
    }

    update() {
        this._inputReceiver.update(this);
        this.setOutboundPacketData("entityData", this._player.entitiesInProximity.exportDataPack());
        this.setOutboundPacketData("now", Date.now());
        this.emit("serverUpdateTick", this._outboundPacket.object);
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


}

module.exports = Client;