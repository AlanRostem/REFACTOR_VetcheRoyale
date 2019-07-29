const Affectable = require("../../Entity/Traits/Affectable.js");

// Base class of the object that performs effects on the
// Affectable entity class.
class Effect {
    constructor(affectedEntityID, duration = Infinity) {
        this._aeID = affectedEntityID;
        this._currentTime = duration;
        this._done = false;
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
        this._done = true;
    }

    get isDone() {
        return this._done;
    }

    update(entityManager, deltaTime) {
        var entity = entityManager.getEntity(this._aeID);
        this._currentTime -= deltaTime;
        if (this._currentTime > 0) {
            if (entity instanceof Affectable) {
                this.effects(entity, entityManager, deltaTime);
            }
        } else {
            this._done = true;
        }

        if (this._done) {
            if (entity instanceof Affectable) {
                this.onDone(entity, entityManager, deltaTime);
                entity.removeEffect(this.id);
            }
        }
    }
}

module.exports = Effect;