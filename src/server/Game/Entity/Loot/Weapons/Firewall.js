const AttackWeapon = require("./Base/AttackWeapon.js");
const ModAbility = require("./Base/ModAbility.js");
const Projectile = require("./AttackEntities/Projectile.js");
const Damage = require("../../../Mechanics/Damage/Damage.js");
const Tile = require("../../../TileBased/Tile.js");
const AOEKnockBackDamage = require("../../../Mechanics/Damage/AOEKnockBackDamage.js");

// Projectile fired by the firewall
class Firepellet extends Projectile {
    constructor(ownerID, weaponID, x, y, angle, entityManager) {
        super(ownerID, x, y, 2, 1, angle);
        this.speed = 4 * 100;
        this.damage = new Damage(8, ownerID);

        this.vel.x = Math.cos(angle) * this.speed; //+ this.getOwner(entityManager).vel.x;
        this.vel.y = Math.sin(angle) * this.speed;// + this.getOwner(entityManager).vel.y;
    }

    onTileHit(entityManager, deltaTime) {
        this.remove();
    }

    onPlayerHit(player, entityManager) {
        this.damage.inflict(player, entityManager);
        this.remove();
    }
}

class Firewall extends AttackWeapon {
    constructor(x, y) {
        super(x, y, "Firewall", 0, 0, 0);
        this.superAbility.tickChargeGain = 100;

        this.spreadAngle = 20;
        this.pellets = 4;

        this.secondaryUse = false;
        this.superAbilitySnap = false;

        this.modAbility = new ModAbility(0.75, 1.5);

        this.configureAttackStats(1.25, 6, 1, 110);

        this.addDynamicSnapShotData(["secondaryUse", "superAbilitySnap"]);

        this.modAbility.onActivation = (weapon, entityManager) => {
            let player = this.getOwner(entityManager);
        };

        this.modAbility.onDeactivation = (composedWeapon, entityManager, deltaTime) => {
        };

        this.modAbility.buffs = (composedWeapon, entityManager, deltaTime) => {


        };

        this.superAbility.onActivation = (composedWeapon, entityManager, deltaTime) => {

        };

        this.superAbility.onDeactivation = (composedWeapon, entityManager, deltaTime) => {
        };
    }

    onSuperBuffs(entityManager, deltaTime) {
        super.onSuperBuffs(entityManager, deltaTime);
    }

    fire(player, entityManager, deltaTime, angle) {
        for (let i = 0; i < this.pellets; i++) {
            entityManager.spawnEntity(this.center.x, this.center.y,
                new Firepellet(player.id, this.id, 0, 0, angle + ((Math.random() * 10) / 180 * Math.PI) * ((Math.random() * 2 | 0) ? -1 : 1), entityManager));
        }
    }

    onDrop(player, entityManager, deltaTime) {
        super.onDrop(player, entityManager, deltaTime);
        this.secondaryFire = false;
    }
}


module.exports = Firewall;