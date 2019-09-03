const ProximityEntityManager = require("../Management/ProximityEntityManager.js");
const SpectatorManager = require("./SpectatorManager.js");

// Entity manager that iterates over quad-tree-queried
// entities in proximity and creates data packs sent to
// the client.
class ClientPEM extends ProximityEntityManager {
    constructor(player) {
        super(player);
        this._dataBox = {};
        this._spectators = new SpectatorManager(player);
    }

    addEntity(entity) {
        super.addEntity(entity);
        this._entRef.client.emit("spawnEntity", entity.getDataPack());
        this._spectators.onSpawnEntity(entity);
    }

    get spectators() {
        return this._spectators;
    }

    removeEntity(id) {
        super.removeEntity(id);
        delete this._dataBox[id];
        this._entRef.client.emit("removeEntity", id);
        this._spectators.onRemoveEntity(id);
    }

    exportDataPack() {
        for (let id in this.container) {
            this._dataBox[id] = this.container[id].getDataPack();
            let e = this._container[id];
            // Removes entities out of bounds. Suboptimal location to do this.
            if (!this._qtBounds.myContains(e) || e.toRemove) {
                this.removeEntity(id);

            }
        }
        this._dataBox[this._entRef.id] = this._entRef.getDataPack();
        return this._dataBox;
    }
}

module.exports = ClientPEM;