const ONMap = require("../../../../shared/code/DataStructures/SObjectNotationMap.js");

class SpectatorManager {
    constructor(player) {
        this._players = new ONMap();
    }

    addSpectator(client) {
        this._players.set(client.id, client);
    }

    onSpawnEntity(entity) {
        for (let spectator of this._players.array) {
            spectator.emit("spawnEntity", entity.getDataPack());
        }
    }

    onRemoveEntity(id) {
        for (let spectator of this._players.array) {
            spectator.emit("removeEntity", id);
        }
    }
}

module.exports = SpectatorManager;