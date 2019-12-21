const Effect = require("./Effect.js");
const Damage = require("../Damage/Damage.js");

class DamageOverTime extends Effect {
    constructor(owner, affected, damagePerTick, tickSpeed, duration = 5) {
        super(affected, duration);
        this.damagePerTick = damagePerTick;
        this.tickSpeed = 0;
        this.maxTickSpeed = tickSpeed;
        this.owner = owner;
    }

    effects(entity, entityManager, deltaTime) {
        super.effects(entity, entityManager, deltaTime);
        if (this.tickSpeed <= 0) {
            Damage.inflict(this.owner, entity, entityManager, this.damagePerTick);
            this.tickSpeed = this.maxTickSpeed;
        }
        this.tickSpeed -= deltaTime;
    }
}

module.exports = DamageOverTime;