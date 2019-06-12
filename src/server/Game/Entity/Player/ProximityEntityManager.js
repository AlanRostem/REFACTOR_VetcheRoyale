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

    addEntity(entity) {
        this._container[entity.id] = entity;
    }

    removeEntity(id) {
        delete this._container[id];
        delete this._dataBox[id];
    }

    checkPlayerProximityEntities(entityManager) {
        for (var id in entityManager.container) {
            var entityCloseToPlayer = entityManager.container[id];
            if (this._playerRef.id !== entityCloseToPlayer.id) {
                if (!this.exists(id)) {
                    if (Vector2D.distance(this._playerRef.center, entityCloseToPlayer.center)
                        < ProximityEntityManager.clientSpawnRange) {
                        this.addEntity(
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
                    this.addEntity(entity);
                }
            }
        });
    }

    exportDataPack() {
        for (let id in this.container) {
            this._dataBox[id] =  this.container[id].getDataPack();
        }
        return this._dataBox;
    }
}

ProximityEntityManager.clientSpawnRange = 48; // TODO: Create a proper value (currently for testing)

module.exports = ProximityEntityManager;