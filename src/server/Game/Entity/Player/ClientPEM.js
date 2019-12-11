const ProximityEntityManager = require("../Management/ProximityEntityManager.js");
const SpectatorManager = require("./SpectatorManager.js");

// Entity manager that iterates over quad-tree-queried
// entities in proximity and creates data packs sent to
// the client.
class ClientPEM extends ProximityEntityManager {
    static COLLISION_BOUNDARY_X = 640;
    static COLLISION_BOUNDARY_Y = 320;
    constructor(player) {
        super(player);
        this.dataBox = {};
        this.spectators = new SpectatorManager(player);
        this.collisionBoundary.bounds.x = ClientPEM.COLLISION_BOUNDARY_X;
        this.collisionBoundary.bounds.y = ClientPEM.COLLISION_BOUNDARY_Y;
    }

    addEntity(entity, game) {
        super.addEntity(entity);
        if (game.recentlySpawnedEntities.has(entity.id)) {
            this.entRef.emit("spawnEntity", entity.getInitDataPack());
        } else {
            this.entRef.emit("addEntity", entity.getInitDataPack());
        }

        //this.spectators.onSpawnEntity(entity);
        //console.log("Added:", "\x1b[33m" + entity.eType + "\x1b[0m", "with ID:", '\x1b[36m' + entity.id + "\x1b[0m");
    }

    removeEntity(entity) {
        super.removeEntity(entity);
        let e = this.dataBox[entity.id];
        delete this.dataBox[entity.id];

        //console.log("Removing entity:", id);

        let data = {id: entity.id, removalData: e};
        this.entRef.emit("removeEntity", data);
    }

    throwOutOfBounds(entity) {
        super.removeEntity(entity);
        delete this.dataBox[entity.id];
        this.entRef.emit("removeOutOfBoundsEntity", entity.id);
    }

    exportInitDataPack() {
        for (let entity of this.container) {
            this.dataBox[entity.id] = entity.getInitDataPack();
        }
        this.dataBox[this.entRef.id] = this.entRef.getInitDataPack();
        return this.dataBox;
    }

    proximityCellTraversal(cell, entityManager, deltaTime) {
        for (let e of cell) {
            if (e === this.entRef) continue;
            if (!this.container.has(e)) {
                if (this.collisionBoundary.containsEntity(e)) {
                    this.addEntity(e, entityManager);
                }
            } else {
                this.entRef.forEachNearbyEntity(e, entityManager, deltaTime);
                if (this.entRef.overlapEntity(e)) {
                    this.entRef.onEntityCollision(e, entityManager);
                }
                if (e.removed) {
                    continue;
                }

                if (!this.collisionBoundary.containsEntity(e)) {
                    this.throwOutOfBounds(e);
                }
            }
        }
    }

    exportDataPack() {
        this.dataBox = {};
        for (let e of this.container) {
            this.dataBox[e.id] = e.getDataPack();
            // Removes entities out of bounds. Suboptimal location to do this.
            if (e.removed) {
                this.removeEntity(e);
            }
        }
        if (Object.keys(this.entRef.getDataPack()).length) {
            this.dataBox[this.entRef.id] = this.entRef.getDataPack();
        }
        if (this.entRef.inventory.weapon)
            if (Object.keys(this.entRef.inventory.weapon.getDataPack()).length)
                this.dataBox[this.entRef.inventory.weapon.id] = this.entRef.inventory.weapon.getDataPack();

        return this.dataBox;
    }

    update(entityManager, deltaTime) {
        super.update(entityManager, deltaTime);
        this.spectators.update();
        this.entRef.setOutboundPacketData("entities", this.exportDataPack());
    }
}

module.exports = ClientPEM;