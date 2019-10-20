const AttackWeapon = require("./Base/AttackWeapon.js");
const Projectile = require("./AttackEntities/Projectile.js");
const Damage = require("../../../Mechanics/Damage/Damage.js");

// Projectile fired by the AquaSLG
class IceBullet extends Projectile {
    constructor(ownerID, weaponID, x, y, angle) {
        super(ownerID, x, y, 2, 4, angle);
        this.speed = 10;
        this.damage = new Damage(7.5, ownerID);
    }

    onTileHit(entityManager, deltaTime) {
        this.remove();
    }

    onPlayerHit(player, entityManager) {
        this.damage.inflict(player, entityManager);
        this.remove();
    }

    update(entityManager, deltaTime) {
        super.update(entityManager, deltaTime);
        if (this.getOwner(entityManager)) {
            let atan2 = Math.atan2(this.getOwner(entityManager).input.mouseData.world.y - (this.height / 2 | 0) - this.pos.y, this.getOwner(entityManager).input.mouseData.world.x - (this.width / 2 | 0) - this.pos.x);

            this.vel.x = Math.cos(atan2) * this.speed;
            this.vel.y = Math.sin(atan2) * this.speed;
        }
    }
}

class AquaSLG extends AttackWeapon {
    constructor(x, y) {
        super(x, y, "AquaSLG", 0, 0, 0);

        this.secondaryFire = false;
        this.superAbilitySnap = false;

        this.configureAttackStats(2, 25, 1, 500);

        this.addDynamicSnapShotData(["secondaryFire", "superAbilitySnap"]);

        this.modAbility.onActivation = (weapon, entityManager) => {

        };

        this.modAbility.configureStats(0.75, 5);

        this.modAbility.onDeactivation = (composedWeapon, entityManager, deltaTime) => {

        };

        this.modAbility.buffs = (composedWeapon, entityManager, deltaTime) => {

        };

        this.superAbility.onActivation = (composedWeapon, entityManager, deltaTime) => {
            this.superAbilitySnap = true;

        };

        this.superAbility.onDeactivation = (composedWeapon, entityManager, deltaTime) => {
            this.superAbilitySnap = false;

        };
    }

    update(entityManager, deltaTime) {
        super.update(entityManager, deltaTime);
    }

    updateWhenEquipped(player, entityManager, deltaTime) {
        super.updateWhenEquipped(player, entityManager, deltaTime);
        if (entityManager.getEntity(this.playerID)) {
        }

    }

    onSuperBuffs(entityManager, deltaTime) {
        super.onSuperBuffs(entityManager, deltaTime);
    }

    fire(player, entityManager, deltaTime, angle) {
        entityManager.spawnEntity(this.center.x, this.center.y,
            new IceBullet(player.id, this.id, 0, 0, angle));
    }

    onDrop(player, entityManager, deltaTime) {
        super.onDrop(player, entityManager, deltaTime);
        this.secondaryFire = false;
    }

}


module.exports = AquaSLG;