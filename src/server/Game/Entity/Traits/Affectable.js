const Physical = require("./Physical.js");

// Entity that can receive effects.
class Affectable extends Physical {
    constructor(x, y, w, h) {
        super(x, y, w, h);
        this._effects = {};
    }

    update(entityManager, deltaTime) {
        for (var id in this._effects) {
            this._effects[id].update(entityManager, deltaTime);
        }
        super.update(entityManager, deltaTime);
    }

    applyEffect(effect, entityManager) {
        this._effects[effect.id] = effect;
        effect.onAppliedToEntity(this, entityManager)
    }

    removeEffect(id) {
        delete this._effects[id];
    }
}

module.exports = Affectable;