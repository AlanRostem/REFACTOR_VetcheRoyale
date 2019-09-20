const ONMap = require("../../../../shared/code/DataStructures/SObjectNotationMap.js");

class SpectatorManager {
    constructor(player) {
        this.players = new ONMap();
        this.subject = player;
    }

    addSpectator(client) {
        this.players.set(client.id, client);
    }

    onSpawnEntity(entity) {
        for (let spectator of this.players.array) {
            spectator.emit("spawnEntity", entity.getDataPack());
        }
    }

    onRemoveEntity(id) {
        for (let spectator of this.players.array) {
            spectator.emit("removeEntity", id);
        }
    }

    onRemoveOutOfBoundsEntity(id) {
        for (let spectator of this.players.array) {
            spectator.emit("removeOutOfBoundsEntity", id);
        }
    }

    update() {
        for (let spectator of this.players.array) {
            spectator.setOutboundPacketData("spectatorSubject", this.subject.getDataPack());
        }
    }
}

module.exports = SpectatorManager;