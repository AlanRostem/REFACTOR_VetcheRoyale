const AttackWeapon = require("./Base/AttackWeapon.js");
const ModAbility = require("./Base/ModAbility.js");
const SuperAbility = require("./Base/SuperAbility.js");
const Projectile = require("./AttackEntities/Projectile.js");
const Damage = require("../../../Mechanics/Damage/Damage.js");

// Projectile fired by the firewall
class Firepellet extends Projectile {
    constructor(owner, weaponID, x, y, angle, entityManager) {
        super(owner, x, y, 2, 1, angle, 4 * 100);
        this.damage = new Damage(8, owner);
    }

    onTileHit(entityManager, deltaTime) {
        this.remove();
    }

    onEnemyHit(player, entityManager) {
        this.damage.inflict(player, entityManager);
        this.remove();
    }
}

class FirewallModAbility extends ModAbility {

}

class FirewallSuperAbility extends SuperAbility {

}

class Firewall extends AttackWeapon {
    static _ = (() => {
        Firewall.assignWeaponClassAbilities(FirewallModAbility, FirewallSuperAbility);
        Firewall.overrideAttackStats(1.25, 6, 120);
    })();

    constructor(x, y) {
        super(x, y, 0, 0, 0);
        this.superAbility.tickChargeGain = 100;
        this.pellets = 4;
    }

    fire(player, entityManager, deltaTime, angle) {
        for (let i = -this.pellets / 2; i < this.pellets / 2; i++) {
            entityManager.spawnEntity(this.center.x, this.center.y,
                new Firepellet(player, this.id, 0, 0, angle + (i / this.pellets * Math.PI / 12), entityManager));
        }
    }
}


module.exports = Firewall;