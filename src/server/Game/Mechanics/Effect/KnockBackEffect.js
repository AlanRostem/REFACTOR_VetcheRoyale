const Effect = require("./Effect.js");

// Performs a knock back effect on an entity. It adds friction and
// a certain velocity to the entity. 
class KnockBackEffect extends Effect {
    constructor(id, speedX, speedY, friction = 0.95, negationSpeed = 0, tolerance = 30) {
        super(id);
        this.friction = friction;
        this.accel = negationSpeed;
        this.sx = speedX;
        this.sy = speedY;
        this.tolerance = tolerance;
    }

    onAppliedToEntity(entity, entityManager, deltaTime) {
        super.onAppliedToEntity(entity, entityManager, deltaTime);
        entity.vel.x = this.sx;
        entity.vel.y = this.sy; /// (this.tolerance / 10);
        entity.setMovementState("canMove", false);
    }

    effects(entity, entityManager, deltaTime) {
        super.effects(entity, entityManager, deltaTime);
        if (this.started) {
            if (Math.abs(entity.vel.x | 0) <= this.tolerance) {
                this.complete();
            }
        }
        entity.fric.x = this.friction;
        entity.acc.x = this.accel;
        if (Math.abs(entity.vel.x | 0) !== 0) {
            this.started = true;
        }
    }

    onDone(entity, entityManager, deltaTime) {
        super.onDone(entity, entityManager, deltaTime);
        entity.fric.x = 0;
        entity.acc.x = entity.speed.ground;
        entity.setMovementState("canMove", true);
    }
}

module.exports = KnockBackEffect;