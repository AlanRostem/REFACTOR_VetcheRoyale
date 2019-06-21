EntityManager = require("./EntityManager.js");
Vector2D = require("../../../../shared/Math/SVector2D.js");

// Composition class for the player. Manages outbound
// data for all entities within player proximity

class ProximityEntityManager extends EntityManager {
    constructor(entity) {
        super(false);
        this._dataBox = {};
        this._entRef = entity;
        this._qtBounds = new Rect(entity.center.x, entity.center.y, 320, 160);
    }

    addEntity(entity) {
        this._container[entity.id] = entity;
        this._entRef.client.emit("spawnEntity", entity.getDataPack());
    }

    removeEntity(id) {
        delete this._container[id];
        delete this._dataBox[id];
        this._entRef.client.emit("removeEntity", id);
    }

    /*checkPlayerProximityEntities(entityManager) {
        for (var id in entityManager.container) {
            var entityCloseToPlayer = entityManager.container[id];
            if (this._entRef.id !== entityCloseToPlayer.id) {
                if (!this.exists(id)) {
                    if (Vector2D.distance(this._entRef.center, entityCloseToPlayer.center)
                        < ProximityEntityManager.CLIENT_SPAWN_RANGE) {
                        this.addEntity(
                            entityCloseToPlayer,
                        );
                        this._entRef.client.emit("spawnEntity", entityCloseToPlayer.getDataPack());
                    }

                } else {
                    if (entityCloseToPlayer.toRemove || !entityManager.exists(id) ||
                        Vector2D.distance(this._entRef.center, entityCloseToPlayer.center)
                        > ProximityEntityManager.CLIENT_SPAWN_RANGE) {
                        this.removeEntity(entityCloseToPlayer.id);
                        this._entRef.client.emit("removeEntity", entityCloseToPlayer.id);
                    }
                }
            }
        }
    }*/

    quadTreePlacement(entityManager) {
        entityManager.quadTree.insert(this._entRef);
    }

    update(entityManager, deltaTime) {
        this._qtBounds.x = this._entRef.center.x;
        this._qtBounds.y = this._entRef.center.y;
        this.quadTreePlacement(entityManager);
        this.checkPlayerProximityEntities(entityManager);
    }

    checkPlayerProximityEntities(entityManager) {
        var entities = entityManager.quadTree.query(this._qtBounds);
        for (let e of entities) {
            if (e !== this._entRef) {
                if (!this.exists(e.id)) {
                    this.addEntity(e);
                } else {
                    if (this._entRef.overlapEntity(e)) {
                        this._entRef.onEntityCollision(e);
                    }
                    if (e.toRemove || !entityManager.exists(e.id) || !this._qtBounds.myContains(e)) {
                        this.removeEntity(e.id);
                    }
                }
            }
        }
    }

    // Called when player spawns in the world
    initProximityEntityData(entityManager) {
        var entities = entityManager.quadTree.query(this._qtBounds);
        for (var e of entities) {
            if (e !== this._entRef && this._qtBounds.contains(e)) {
                this.addEntity(e);
            }
        }
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

ProximityEntityManager.CLIENT_SPAWN_RANGE = 120; // TODO: Create a proper value (currently for testing)

module.exports = ProximityEntityManager;