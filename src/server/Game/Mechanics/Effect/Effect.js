const Affectable = require("../../Entity/Traits/Affectable.js");

// Base class of the object that performs effects on the
// Affectable entity class.
class Effect {
    constructor(affectedEntityID, duration = Infinity) {
        this.aeID = affectedEntityID;
        this.currentTime = duration;
        this.done = false;
        this.id = Math.random();
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
        var entity = entityManager.getEntity(this.aeID);
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
                entity.removeEffect(this.id);
            }
        }
    }
}

module.exports = Effect;