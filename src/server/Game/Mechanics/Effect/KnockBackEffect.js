const Effect = require("./Effect.js");

class KnockBackEffect extends Effect {
    constructor(id, speedX, speedY) {
        super(id, 1);
        this._friction = 0.8;
        this._accel = 10;
        this._sx = speedX;
        this._sy = speedY;
    }

    onAppliedToEntity(entity, entityManager, deltaTime) {
        super.onAppliedToEntity(entity, entityManager, deltaTime);
        entity.vel.x = this._sx;
        entity.vel.y = this._sy;
    }

    effects(entity, entityManager, deltaTime) {
        super.effects(entity, entityManager, deltaTime);
        entity.fric.x = this._friction;
        entity.acc.x = this._accel;
    }

    onDone(entity, entityManager, deltaTime) {
        super.onDone(entity, entityManager, deltaTime);
        entity.fric.x = 0;
        entity.acc.x = entity.speed.ground;
    }
}

module.exports = KnockBackEffect;