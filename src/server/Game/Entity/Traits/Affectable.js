const Physical = require("./Physical.js");

// Entity that can receive effects.
class Affectable extends Physical {
    constructor(x, y, w, h) {
        super(x, y, w, h);
        this.effects = {};
    }

    update(entityManager, deltaTime) {
        for (var id in this.effects) {
            this.effects[id].update(entityManager, deltaTime);
        }
        super.update(entityManager, deltaTime);
    }

    applyEffect(effect, entityManager) {
        this.effects[effect.id] = effect;
        effect.onAppliedToEntity(this, entityManager)
    }

    removeEffect(id) {
        delete this.effects[id];
    }
}

module.exports = Affectable;