Entity = require("../SEntity.js");
IPlayer = require("./IPlayer.js");
ProximityEntityManager = require("./ProximityEntityManager.js");
Vector2D = require("../../../../shared/Math/SVector2D.js");

class Player extends IPlayer {
    constructor(x, y, client) {
        super(x, y, 8, 12);
        this._id = client.id;
        this._dataPack.id = this._id;
        this._dataPack.t_entityProximity = ProximityEntityManager.clientSpawnRange;
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

    update(entityManager) {
        this.entitiesInProximity.checkPlayerProximityEntities(entityManager);

        var keys = this._clientRef._keyStates;
        if (keys[32]) {
            this.pos.y--;
        }

        if (keys[83]) {
            this.pos.y++;
        }
        if (keys[68]) {
            this.pos.x++;
        }

        if (keys[65]) {
            this.pos.x--;
        }

    }

}

// Static variables:

Player.clientSpawnProximity = ProximityEntityManager.clientSpawnRange; // TODO: Fix this test value

module.exports = Player;