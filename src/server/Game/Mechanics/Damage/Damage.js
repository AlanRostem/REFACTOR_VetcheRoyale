const Alive = require("../../Entity/Traits/Alive.js");

// Composition class for objects that deal damage.
class Damage {
    static EMPTY_ARGS = {};

    constructor(value, player) {
        this.value = value;
        this.player = player;
    }

    onInflict(entity, game, args) {

    }

    inflict(entity, entityManager, args) {
        //console.log(entity.constructor.name);
        if (entity instanceof Alive) {
            if (entityManager.getGameRule("pvp")) {
                if (!entity.dead) {
                    entity.takeDamage(this.value);
                    this.onInflict(entity, entityManager, args);
                } else {
                    return;
                }
            }
            let player = this.player;
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

    static inflict(owner, entity, entityManager, value, callback, args = Damage.EMPTY_ARGS) {
        //console.log(entity.constructor.name);
        if (entity instanceof Alive) {
            if (entityManager.getGameRule("pvp")) {
                if (!entity.dead) {
                    entity.takeDamage(value);
                    if (callback)
                        callback(entity, entityManager, args);
                } else {
                    return;
                }
            }
            let player = owner;
            if (entity.constructor.name === "Player") {
                if (player.isTeammate(entity)) {
                    return;
                }
            }
            if (player && player !== entity) {
                player.stats.grantDamage(value);
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