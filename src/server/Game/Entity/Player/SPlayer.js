Entity = require("../SEntity.js");
ProximityEntityManager = require("./ProximityEntityManager.js");
Vector2D = require("../../../../shared/Math/SVector2D.js");

class Player extends Entity {
    constructor(x, y, client) {
        super(x, y, 8, 12);
        this._id = client.id;
        this._clientRef = client;
        this._entitiesInProximity = new ProximityEntityManager();
    }

    initFromEntityManager(entityManager) {
        super.initFromEntityManager(entityManager);
        this._entitiesInProximity.getProximityEntityData(this.center, entityManager);
        this._clientRef.emit("initEntity", this._entitiesInProximity.exportDataPack())
    }

    get entitiesInProximity() {
        return this._entitiesInProximity;
    }

    proximityForLoop(entity) {
        if (!this.entitiesInProximity.exists(entity.id)) {
        }
    }

    update(entityManager) {
        this.entitiesInProximity.forEach(this.proximityForLoop);
    }

}

// Static variables:

Player.clientSpawnProximity = 320; // TODO: Fix this test value

module.exports = Player;