const Affectable = require("../../Entity/Traits/Affectable.js");

// Base class of the object that performs effects on the
// Affectable entity class.
class Effect {
    constructor(affectedEntity, duration = Infinity) {
        this.ae = affectedEntity;
        this.currentTime = duration;
        this.done = false;
        this.id = Math.random();
        this.name = this.constructor.name;
    }

    onAppliedToEntity(entity, entityManager, deltaTime) {
        // Override here
    }

    onDone(entity, entityManager, deltaTime) {
        // Override here
    }

    effects(entity, entityManager, deltaTime) {
        // Override here
    }

    complete() {
        this.done = true;
    }

    get isDone() {
        return this.done;
    }

    update(entityManager, deltaTime) {
        var entity = this.ae;
        this.currentTime -= deltaTime;
        if (this.currentTime > 0) {
            if (entity instanceof Affectable) {
                this.effects(entity, entityManager, deltaTime);
            }
        } else {
            this.done = true;
        }

        if (this.done) {
            if (entity instanceof Affectable) {
                this.onDone(entity, entityManager, deltaTime);
                entity.removeEffect(this);
            }
        }
    }
}

module.exports = Effect;