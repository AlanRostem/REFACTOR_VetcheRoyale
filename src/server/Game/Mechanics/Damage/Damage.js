const Alive = require("../../Entity/Traits/Alive.js");

class Damage {
    constructor(value) {
        this._value = value;
    }

    inflict(entity, entityManager) {
        if (entity instanceof Alive) {
            entity.takeDamage(this._value);
            console.log("Inflicted", this._value, "damage on entity with", entity.HP, "HP");
        }
    }
}

module.exports = Damage;