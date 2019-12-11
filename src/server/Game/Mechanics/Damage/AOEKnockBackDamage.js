const AOEDamage = require("./AOEDamage.js");
const KnockBackEffect = require("../Effect/KnockBackEffect.js");

// Applies a knock back effect to players hit by the
// area of effect damage.
class AOEKnockBackDamage extends AOEDamage {
    constructor(owner, x, y, radius, knockBackSpeed, value, exceptions) {
        super(owner, x, y, radius, value, exceptions);
        this.knockBackSpeed = knockBackSpeed;
    }

    onInflict(entity, entityManager, a) {
        entity.applyEffect(new KnockBackEffect(entity,
            -Math.cos(a.angle) * this.knockBackSpeed,
            -Math.sin(a.angle) * this.knockBackSpeed / 2, 0.9), entityManager);
    }
}

module.exports = AOEKnockBackDamage;