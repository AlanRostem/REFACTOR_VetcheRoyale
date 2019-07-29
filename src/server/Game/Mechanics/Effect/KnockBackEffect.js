const Effect = require("./Effect.js");

// Performs a knock back effect on an entity. It adds friction and
// a certain velocity to the entity. 
class KnockBackEffect extends Effect {
    constructor(id, speedX, speedY, friction = 0.95, negationSpeed = 0, tolerance = 30) {
        super(id);
        this._friction = friction;
        this._accel = negationSpeed;
        this._sx = speedX;
        this._sy = speedY;
        this._tolerance = tolerance;
    }

    onAppliedToEntity(entity, entityManager, deltaTime) {
        super.onAppliedToEntity(entity, entityManager, deltaTime);
        entity.vel.x = this._sx;
        entity.vel.y = this._sy /// (this._tolerance / 10);
    }

    effects(entity, entityManager, deltaTime) {
        super.effects(entity, entityManager, deltaTime);
        if (this._started) {
            if (Math.abs(entity.vel.x | 0) <= this._tolerance) {
                this.complete();
            }
        }
        entity.fric.x = this._friction;
        entity.acc.x = this._accel;
        if (Math.abs(entity.vel.x | 0) !== 0) {
            this._started = true;
        }
    }

    onDone(entity, entityManager, deltaTime) {
        super.onDone(entity, entityManager, deltaTime);
        entity.fric.x = 0;
        entity.acc.x = entity.speed.ground;
    }
}

module.exports = KnockBackEffect;