Entity = require("../SEntity.js");
IPlayer = require("./IPlayer.js");
ProximityEntityManager = require("./ProximityEntityManager.js");
Vector2D = require("../../../../shared/Math/SVector2D.js");

class Player extends IPlayer {
    constructor(x, y, client) {
        super(x, y, 6, 12);
        this._id = client.id;
        this._t_entityProximity = ProximityEntityManager.CLIENT_SPAWN_RANGE;

        this._snapShotGenerator._snapShot._id = this._id;
        this._snapShotGenerator.addReferenceValues(this, [
            "_t_entityProximity"
        ]);

        this._clientRef = client;
        this._entitiesInProximity = new ProximityEntityManager(this);
        this._jumping = false;

        this._speed = {
            ground: 65,
            jump: -180,
        };

        this._gravity = 500;

        this.acc.y = this._gravity;
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
        if (!this.side.bottom) {
            this._jumping = true;
        }

        if (this.keys[32]) {
            if (!this._jumping) {
                this.vel.y = this._speed.jump;
                this._jumping = true;
            }
        }

        this.vel.x = 0;

        if (this.keys[68]) {
            this.vel.x = this._speed.ground;
        }

        if (this.keys[65]) {
            this.vel.x = -this._speed.ground;
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