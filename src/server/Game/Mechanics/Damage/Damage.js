const Alive = require("../../Entity/Traits/Alive.js");

// Composition class for objects that deal damage.
class Damage {
    constructor(value, playerID) {
        this._value = value;
        this._playerID = playerID;
    }

    inflict(entity, entityManager) {
        if (entity instanceof Alive) {
            entity.takeDamage(this._value);
            var player = entityManager.getEntity(this._playerID);
            if (player && player !== entity) {
                player.stats.grantDamage(this._value);
                if (entity.dead) {
                    player.stats.grantKill();
                    if (player.inventory.weapon) {
                        player.inventory.weapon.grantSuperCharge();
                    }
                }
            }
        }
    }
}

module.exports = Damage;