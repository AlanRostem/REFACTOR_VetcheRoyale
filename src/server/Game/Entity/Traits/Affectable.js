const Entity = require("../SEntity.js");

class Affectable extends Entity {
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

    applyEffect(effect) {
        this._effects[effect.id] = effect;
    }

    removeEffect(id) {
        delete this._effects[id];
    }
}

module.exports = Affectable;