EntityManager = require("../EntityManager.js");
Vector2D = require("../../../../shared/Math/SVector2D.js");

// Composition class for the player. Manages outbound
// data for all entities within player proximity

class ProximityEntityManager extends EntityManager {
    constructor(player) {
        super();
        this._dataBox = {};
        this._playerRef = player;
    }

    spawnEntity(x, y, entity) {
        this._container[entity.id] = entity;
    }

    removeEntity(id) {
        delete this.container[id];
    }

    checkPlayerProximityEntities(entityManager) {
        for (var id in entityManager.container) {
            var entityCloseToPlayer = entityManager.container[id];
            if (this._playerRef.id !== entityCloseToPlayer.id) {
                if (!this.exists(id)) {
                    if (Vector2D.distance(this._playerRef.center, entityCloseToPlayer.center)
                        < ProximityEntityManager.clientSpawnRange) {
                        this.spawnEntity(
                            undefined,
                            undefined,
                            entityCloseToPlayer,
                        );
                        this._playerRef.client.emit("spawnEntity", entityCloseToPlayer.getDataPack());
                    }

                } else {
                    if (entityCloseToPlayer.toRemove || !entityManager.exists(id) ||
                        Vector2D.distance(this._playerRef.center, entityCloseToPlayer.center)
                        > ProximityEntityManager.clientSpawnRange) {
                        this.removeEntity(entityCloseToPlayer.id);
                        this._playerRef.client.emit("removeEntity", entityCloseToPlayer.id);
                    }
                }
            }
        }

    }

    // Called only when player spawns in the world
    getProximityEntityData(position, entityManager) {
        entityManager.forEach(entity => {
            if (entity.id !== this.id) {
                if (Vector2D.distance(position, entity.center) < ProximityEntityManager.clientSpawnRange) {
                    this.spawnEntity(entity.pos.x, entity.pos.y, entity);
                }
            }
        });
    }

    exportDataPack() {
        for (var id in this.container) {
            var entityData = this.container[id].getDataPack();
            if (this._dataBox[id]) {
                if (entityData.removed || Vector2D.distance(this._playerRef.center, this.getEntity(entityData.id).center)
                    > ProximityEntityManager.clientSpawnRange) {
                    delete this._dataBox[id];
                    continue;
                }
            }
            this._dataBox[id] = entityData;
        }
        return this._dataBox;
    }
}

ProximityEntityManager.clientSpawnRange = 48; // TODO: Create a proper value (currently for testing)

module.exports = ProximityEntityManager;