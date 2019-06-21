Entity = require("../SEntity.js");
IPlayer = require("./IPlayer.js");
ClientPEM = require("./ClientPEM.js");
Vector2D = require("../../../../shared/Math/SVector2D.js");
Rect = require("../Management/QTRect.js");

class Player extends IPlayer {
    constructor(x, y, client) {
        super(x, y, 6, 12);
        this._id = client.id;

        this._snapShotGenerator._snapShot._id = this._id;


        this._clientRef = client;
        this._entitiesInProximity = new ClientPEM(this);
        this._jumping = false;

        // TODO: Remove this test after being done with quad trees
        //this._collisionConfig.static = true;
        //this._collisionConfig.collision = false;
        //this._collisionConfig.gravity = false;

        this._speed = {
            ground: 65,
            jump: -190,
        };

        if (!this._collisionConfig.collision) {
            this._speed.ground = 600;
        }


        this._gravity = 500;

        this.acc.y = this._gravity;
    }

    initFromEntityManager(entityManager) {
        super.initFromEntityManager(entityManager);
        this._entitiesInProximity.initProximityEntityData(entityManager);
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

    onEntityCollision(e) {

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


        if (!this._collisionConfig.collision) {
            this.vel.y = 0;

            if (this.keys[87]) {
                this.vel.y = -this._speed.ground;
            }

            if (this.keys[83]) {
                this.vel.y = this._speed.ground;
            }
        }

        super.update(entityManager, deltaTime);
        this.entitiesInProximity.update(entityManager, deltaTime);

        if (this.side.bottom) {
            this._jumping = false;
        }
    }
}

module.exports = Player;