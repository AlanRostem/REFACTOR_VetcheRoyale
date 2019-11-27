const Vector2D = require("../../../../shared/code/Math/SVector2D.js");
const Effect = require("./Effect.js");

class WormHoleEffect extends Effect {
    constructor(id, duration, pos, pullbackSpeed) {
        super(id, duration);
        this.pullbackSpeed = pullbackSpeed;
        this.pos = pos;
    }

    onAppliedToEntity(entity, entityManager, deltaTime) {
        super.onAppliedToEntity(entity, entityManager, deltaTime);
        entity.setMovementState("canMove", "false");
    }

    onDone(entity, entityManager, deltaTime) {
        super.onDone(entity, entityManager, deltaTime);
        entity.setMovementState("canMove", "true");
    }

    effects(entity, entityManager, deltaTime) {
        super.effects(entity, entityManager, deltaTime);
        let angle = Math.atan2(this.pos.y - entity.center.y, this.pos.x - entity.center.x);
        let speed = Vector2D.distance(this.pos, entity.center);
        let vx = speed * Math.cos(angle);
        let vy = speed * Math.sin(angle);
        entity.vel.x = vx;
        entity.vel.y = vy;
    }
}