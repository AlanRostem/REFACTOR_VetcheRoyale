const Alive = require("../../Entity/Traits/Alive.js");

// Composition class for objects that deal damage.
class Damage {
    constructor(value, playerID) {
        this.value = value;
        this.playerID = playerID;
    }

    onInflict(entity, game, args) {

    }

    inflict(entity, entityManager, args = {}) {
        if (entity instanceof Alive) {
            if (entityManager.getGameRule("pvp")) {
                if (!entity.dead) {
                    entity.takeDamage(this.value);
                    this.onInflict(entity, entityManager, args);
                } else {
                    return;
                }
            }
            let player = entityManager.getEntity(this.playerID);
            if (entity.constructor.name === "Player") {
                if (player.isTeammate(entity)) {
                    return;
                }
            }
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