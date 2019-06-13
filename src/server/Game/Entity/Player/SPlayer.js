Entity = require("../SEntity.js");
IPlayer = require("./IPlayer.js");
ProximityEntityManager = require("./ProximityEntityManager.js");
Vector2D = require("../../../../shared/Math/SVector2D.js");

class Player extends IPlayer {
    constructor(x, y, client) {
        super(x, y, 8, 12);
        this._id = client.id;
        this._dataPack.id = this._id;
        this._dataPack.t_entityProximity = ProximityEntityManager.CLIENT_SPAWN_RANGE;
        this._clientRef = client;
        this._entitiesInProximity = new ProximityEntityManager(this);
    }

    initFromEntityManager(entityManager) {
        super.initFromEntityManager(entityManager);
        this._entitiesInProximity.getProximityEntityData(this.center, entityManager);
        this._clientRef.emit("initEntity", this._entitiesInProximity.exportDataPack())
    }

    get entitiesInProximity() {
        return this._entitiesInProximity;
    }

    get client() {
        return this._clientRef;
    }

    get keys() {
        return this._clientRef._keyStates;
    }

    update(entityManager, deltaTime) {
        this.entitiesInProximity.checkPlayerProximityEntities(entityManager);

        var s = 240;

        if (this.keys[32]) {
            this.moveY(-s, deltaTime);
        }

        if (this.keys[83]) {
            this.moveY(s, deltaTime);
        }
        if (this.keys[68]) {
            this.moveX(s, deltaTime);
        }

        if (this.keys[65]) {
            this.moveX(-s, deltaTime);
        }

    }

}

// Static variables:

Player.clientSpawnProximity = ProximityEntityManager.CLIENT_SPAWN_RANGE; // TODO: Fix this test value

module.exports = Player;