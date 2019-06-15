Entity = require("../SEntity.js");
IPlayer = require("./IPlayer.js");
ProximityEntityManager = require("./ProximityEntityManager.js");
Vector2D = require("../../../../shared/Math/SVector2D.js");

class Player extends IPlayer {
    constructor(x, y, client) {
        super(x, y, 8, 16);
        this._id = client.id;
        this._dataPack.id = this._id;
        this._dataPack.t_entityProximity = ProximityEntityManager.CLIENT_SPAWN_RANGE;
        this._clientRef = client;
        this._entitiesInProximity = new ProximityEntityManager(this);
        this._jumping = false;

        this.acc.y = 320;
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
        var s = 120;

        if (!this.side.bottom) {
            this._jumping = true;
        }

        if (this.keys[32]) {
            if (!this._jumping) {
                this.vel.y = -s * 1.3;
                this._jumping = true;
            }
        }

        this.vel.x = 0;

        if (this.keys[68]) {
            this.vel.x = s;
        }

        if (this.keys[65]) {
            this.vel.x = -s;
        }

        super.update(entityManager, deltaTime);
        this.entitiesInProximity.checkPlayerProximityEntities(entityManager);

        if (this.side.bottom) {
            this._jumping = false;
        }
    }
}

// Static variables:

Player.clientSpawnProximity = ProximityEntityManager.CLIENT_SPAWN_RANGE; // TODO: Fix this test value

module.exports = Player;