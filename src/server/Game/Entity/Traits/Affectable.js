const Physical = require("./Physical.js");

// Entity that can receive effects.
class Affectable extends Physical {
    static _ = (() => {
        Affectable.addDynamicValues("effectsData")
    })();

    constructor(x, y, w, h, id) {
        super(x, y, w, h, id);
        this.effects = {};
        this.effectsData = {};
    }

    updateEffects(entityManager, deltaTime) {
        for (var id in this.effects) {
            this.effects[id].update(entityManager, deltaTime);
        }
    }

    update(entityManager, deltaTime) {
        this.updateEffects(entityManager, deltaTime);
        super.update(entityManager, deltaTime);
    }

    applyEffect(effect, entityManager) {
        this.effects[effect.id] = effect;
        if (!this.effectsData[effect.name]) {
            this.effectsData[effect.name] = 0;
        }
        this.effectsData[effect.name]++;
        effect.onAppliedToEntity(this, entityManager);
    }

    removeEffect(effect) {
        this.effectsData[effect.name]--;
        if (this.effectsData[effect.name] === 0) {
            delete this.effectsData[effect.name];
        }
        delete this.effects[effect.id];
    }
}

module.exports = Affectable;