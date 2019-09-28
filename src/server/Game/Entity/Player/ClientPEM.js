const ProximityEntityManager = require("../Management/ProximityEntityManager.js");
const SpectatorManager = require("./SpectatorManager.js");

// Entity manager that iterates over quad-tree-queried
// entities in proximity and creates data packs sent to
// the client.
class ClientPEM extends ProximityEntityManager {
    constructor(player) {
        super(player);
        this.dataBox = {};
        this.spectators = new SpectatorManager(player);
    }

    addEntity(entity) {
        super.addEntity(entity);
        this.entRef.emit("spawnEntity", entity.getDataPack());
        this.spectators.onSpawnEntity(entity);
    }

    removeEntity(id) {
        super.removeEntity(id);
        delete this.dataBox[id];

        //console.log("Removing entity:", id, Object.keys(this.container));

        this.entRef.emit("removeEntity", id);
        this.spectators.onRemoveEntity(id);
    }

    throwOutOfBounds(id) {
        super.removeEntity(id);
        delete this.dataBox[id];
        this.entRef.emit("removeOutOfBoundsEntity", id);
        this.spectators.onRemoveOutOfBoundsEntity(id);
    }

    exportDataPack() {
        for (let id in this.container) {
            this.dataBox[id] = this.container[id].getDataPack();
            let e = this.container[id];
            // Removes entities out of bounds. Suboptimal location to do this.
            if (e.toRemove) {
                this.removeEntity(id);
            }

            if (!this.qtBounds.myContains(e)) {
                this.throwOutOfBounds(e.id);
            }
        }
        this.dataBox[this.entRef.id] = this.entRef.getDataPack();
        return this.dataBox;
    }

    update(entityManager, deltaTime) {
        super.update(entityManager, deltaTime);
        this.spectators.update();
        this.entRef.setOutboundPacketData("entities", this.exportDataPack());
    }
}

module.exports = ClientPEM;