Entity = require("../SEntity.js");
EntityManager = require("../EntityManager.js");
Vector2D = require("../../../../shared/Math/SVector2D.js");

class Player extends Entity {
    constructor(x, y, client) {
        super(x, y, 8, 12);
        this._id = client.id;
        this._clientRef = client;
        this._entitiesInProximity = new EntityManager();
    }

    initFromEntityManager(entityManager) {
        super.initFromEntityManager(entityManager);
        this.getProximityEntityData(entityManager);
    }

    get entitiesInProximity() {
        return this._entitiesInProximity.container;
    }

    // Called only when player spawns in the world
    getProximityEntityData(entityManager) {
        entityManager.forEach(entity => {
            if (entity.id !== this.id) {
                if (Vector2D.distance(this.center, entity.center) < Player.clientSpawnProximity) {
                    this._entitiesInProximity.spawnEntity(entity);
                }
            }
        });
    }
}

// Static variables:

Player.clientSpawnProximity = 320; // TODO: Fix this test value

module.exports = Player;