const Vector2D = require("../../../../shared/code/Math/SVector2D.js");
const Effect = require("./Effect.js");

class WormHoleEffect extends Effect {
    constructor(id, length, duration, pos, pullbackSpeed) {
        super(id, duration);
        this.pullbackSpeed = pullbackSpeed;
        this.pos = pos;
        this.length = length;
    }

    onAppliedToEntity(entity, entityManager, deltaTime) {
        super.onAppliedToEntity(entity, entityManager, deltaTime);
        entity.setMovementState("canMove", false);
        //console.log("Applied to:", entity.id) // TODO: rm
    }

    onDone(entity, entityManager, deltaTime) {
        super.onDone(entity, entityManager, deltaTime);
        entity.setMovementState("canMove", true);
    }

    effects(entity, entityManager, deltaTime) {
        super.effects(entity, entityManager, deltaTime);
        let angle = Vector2D.angle(entity.center, this.pos);
        let speed = (Vector2D.distance(this.pos, entity.center) / this.length) * this.pullbackSpeed;
        let vx = speed * Math.cos(angle);
        let vy = speed * Math.sin(angle);
        entity.vel.x = vx;
        entity.vel.y = vy;
    }
}

module.exports = WormHoleEffect;