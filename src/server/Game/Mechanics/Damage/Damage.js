class Damage {
    constructor(value) {
        this._value = value;
    }

    inflict(entity, entityManager) {
        console.log("Inflicted", this._value, "damage on entity", entity.id);
    }
}

module.exports = Damage;