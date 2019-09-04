const Alive = require("../../Entity/Traits/Alive.js");

// Composition class for objects that deal damage.
class Damage {
    constructor(value, playerID) {
        this.value = value;
        this.playerID = playerID;
    }

    inflict(entity, entityManager) {
        if (entity instanceof Alive) {
            if (entityManager.getGameRule("pvp")) {
                if (!entity.dead) {
                    entity.takeDamage(this.value);
                } else {
                    return;
                }
            }
            var player = entityManager.getEntity(this.playerID);
            if (player && player !== entity) {
                player.stats.grantDamage(this.value);
                if (entity.dead) {
                    player.stats.grantKill();
                    entity.dieBy(player);
                    if (player.inventory.weapon) {
                        player.inventory.weapon.grantSuperCharge();
                    }
                }
            }
        }
    }
}

module.exports = Damage;