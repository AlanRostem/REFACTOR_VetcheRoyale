EntityManager = require("../Management/EntityManager.js");
Vector2D = require("../../../../shared/Math/SVector2D.js");

// Composition class for the player. Manages outbound
// data for all entities within player proximity

class ProximityEntityManager extends EntityManager {
    constructor(player) {
        super(false);
        this._dataBox = {};
        this._playerRef = player;
    }

    addEntity(entity) {
        this._container[entity.id] = entity;
    }

    removeEntity(id) {
        delete this._container[id];
        delete this._dataBox[id];
    }

    /*checkPlayerProximityEntities(entityManager) {
        for (var id in entityManager.container) {
            var entityCloseToPlayer = entityManager.container[id];
            if (this._playerRef.id !== entityCloseToPlayer.id) {
                if (!this.exists(id)) {
                    if (Vector2D.distance(this._playerRef.center, entityCloseToPlayer.center)
                        < ProximityEntityManager.CLIENT_SPAWN_RANGE) {
                        this.addEntity(
                            entityCloseToPlayer,
                        );
                        this._playerRef.client.emit("spawnEntity", entityCloseToPlayer.getDataPack());
                    }

                } else {
                    if (entityCloseToPlayer.toRemove || !entityManager.exists(id) ||
                        Vector2D.distance(this._playerRef.center, entityCloseToPlayer.center)
                        > ProximityEntityManager.CLIENT_SPAWN_RANGE) {
                        this.removeEntity(entityCloseToPlayer.id);
                        this._playerRef.client.emit("removeEntity", entityCloseToPlayer.id);
                    }
                }
            }
        }
    }*/

    checkPlayerProximityEntities(entityManager) {
        var entities = entityManager.quadTree.query(this._playerRef._qtBounds);
        for (var e of entities) {
            if (e !== this._playerRef) {
                if (!this.exists(e.id)) {
                    this.addEntity(e);
                } else {
                    if (e.toRemove || !entityManager.exists(e.id) || !this._playerRef._qtBounds.contains(e)) {
                        this.removeEntity(e.id);
                    }
                }
            }
        }

        console.log(Object.keys(this._container).length);
    }

    // Called only when player spawns in the world
    getProximityEntityData(position, entityManager) {
        var entities = entityManager.quadTree.query(this._playerRef._qtBounds);
        for (var e of entities) {
            if (e !== this._playerRef) {
                this.addEntity(e);
            }
        }
    }

    exportDataPack() {
        for (let id in this.container) {
            this._dataBox[id] = this.container[id].getDataPack();
        }
        this._dataBox[this._playerRef.id] = this._playerRef.getDataPack();
        return this._dataBox;
    }
}

ProximityEntityManager.CLIENT_SPAWN_RANGE = 120; // TODO: Create a proper value (currently for testing)

module.exports = ProximityEntityManager;