ProximityEntityManager = require("../Management/ProximityEntityManager.js");

class ClientPEM extends ProximityEntityManager {
    constructor(player) {
        super(player);
        this._dataBox = {};
    }

    addEntity(entity) {
        super.addEntity(entity);
        this._entRef.client.emit("spawnEntity", entity.getDataPack());
    }

    removeEntity(id) {
        super.removeEntity(id);
        delete this._dataBox[id];
        this._entRef.client.emit("removeEntity", id);
    }

    exportDataPack() {
        for (let id in this.container) {
            this._dataBox[id] = this.container[id].getDataPack();
            let e = this._container[id];
            // Removes entities out of bounds. Suboptimal location to do this.
            if (!this._qtBounds.myContains(e)) {
                this.removeEntity(id);

            }
        }
        this._dataBox[this._entRef.id] = this._entRef.getDataPack();
        return this._dataBox;
    }
}

module.exports = ClientPEM;