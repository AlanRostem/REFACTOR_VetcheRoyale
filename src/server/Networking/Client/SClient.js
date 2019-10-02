const InputReceiver = require("./InputReceiver.js");
const ONMap = require("../../../shared/code/DataStructures/SObjectNotationMap.js");
const PacketValidator = require("./PacketValidator.js");

// Object that represents a client connected to the server
class Client {
    constructor(socket, clientList, server) {
        this.inboundDataCallbacks = new ONMap();
        this.outboundPacket = new ONMap();

        // Object given by socket.io
        this.socket = socket;

        this.socket.emit("connectClient", {id: socket.id, tickRate: server.tickRate});

        this.inputReceiver = new InputReceiver(this);

        this.removed = false;
        this.disconnected = false;

        this.playerObjData = {};

        // Used to store packets over time and check their frequency
        this.frequencyBuffer = [];
        this.defineSocketEvents(socket, clientList, server);
    }

    addClientUpdateListener(eventName, callback) {
        this.inboundDataCallbacks.set(eventName, callback);
    }

    setOutboundPacketData(key, value) {
        this.outboundPacket.set(key, value);
    }

    disconnect(message) {
        this.disconnected = true;
        this.removed = true;
        this.emit("manualDisconnect", message);
        this.socket.disconnect();
    }

    isDisconnected() {
        return this.disconnected;
    }

    defineSocketEvents(socket, clientList, server) {
        this.socket.on("connectClientCallback", data => {
            if (PacketValidator.validatePacket(this, data)) {
                console.log("Client [ " + data.id + " ] successfully connected!");
                this.socket.broadcast.emit("broadcast-newPlayer", {
                    id: this.id,
                    playerCount: clientList.length
                });
                server.dataBridge.transferClientEvent("clientConnectCallback", this.id, {
                    id: this.id,
                });
            }
        });

        this.socket.on("disconnect", data => {
            clientList.removeClient(this.id);
            console.log("Disconnected [ " + this.id + " ]");
            server.dataBridge.transferClientEvent("removePlayer", this.id, {
                id: this.id,
            });
        });

        this.socket.on("clientPacketToServer", packet => {
            if (PacketValidator.validatePacket(this, packet)) {
                this.onClientUpdateReceived(packet);
            }
        })
    }

    onClientUpdateReceived(packet) {
        if (PacketValidator.validatePacket(this, packet)) {
            for (let callback of this.inboundDataCallbacks.array) {
                callback(packet);
            }
        }
    }

    networkedUpdate(data, server) {
        this.inputReceiver.update(this, server);
        this.playerObjData = data;
        this.setOutboundPacketData("entityData", this.playerObjData.entities);
        this.setOutboundPacketData("gameData", this.playerObjData.gameData);

        this.setOutboundPacketData("now", Date.now());
        this.updateDataCycle();
    }

    updateDataCycle() {
        this.emit("serverUpdateTick", this.outboundPacket.object);
        this.outboundPacket.clear(); // Clear the packet to prevent sending duplicate data
    }

    get id() {
        return this.socket.id;
    }

    emit(eventType, data) {
        this.socket.emit(eventType, data);
    }

    on(eventType, callback) {
        this.socket.on(eventType, callback);
    }


}

module.exports = Client;