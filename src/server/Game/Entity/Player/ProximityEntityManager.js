EntityManager = require("../EntityManager.js");
Vector2D = require("../../../../shared/Math/SVector2D.js");

// Composition class for the player. Manages outbound
// data for all entities within player proximity

class ProximityEntityManager extends EntityManager {
    constructor() {
        super();
        this._dataBox = {};
    }

    spawnEntity(x, y, entity) {
        this._container[entity.id] = entity;
    }

    // Called only when player spawns in the world
    getProximityEntityData(position, entityManager) {
        entityManager.forEach(entity => {
            if (entity.id !== this.id) {
                if (Vector2D.distance(position, entity.center) < ProximityEntityManager.clientSpawnProximity) {
                    this.spawnEntity(entity.pos.x, entity.pos.y, entity);
                }
            }
        });
    }

    exportDataPack() {
        for (var id in this.container) {
            var entityData = this.container[id].getDataPack();
            this._dataBox[id] = entityData;
        }
        return this._dataBox;
    }
}

ProximityEntityManager.clientSpawnProximity = 320; // TODO: Create a proper value (currently for testing)

module.exports = ProximityEntityManager;