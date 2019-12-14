const AttackWeapon = require("./Base/AttackWeapon.js");
const ModAbility = require("./Base/ModAbility.js");
const SuperAbility = require("./Base/SuperAbility.js");
const Projectile = require("./AttackEntities/Projectile.js");
const Damage = require("../../../Mechanics/Damage/Damage.js");
const Tile = require("../../../TileBased/Tile.js");
const AOEKnockBackDamage = require("../../../Mechanics/Damage/AOEKnockBackDamage.js");

// Projectile fired by the AquaSLG
class IceBullet extends Projectile {
    constructor(owner, x, y, angle) {
        super(owner, x, y, 2, 2, angle, 300);
        this.damage = new Damage(10, owner);

        //let atan2 = Math.atan2(this.getOwner(entityManager).input.mouseData.world.y - (this.height / 2 | 0) - this.pos.y, this.getOwner(entityManager).input.mouseData.world.x - (this.width / 2 | 0) - this.pos.x);

        this.vel.x = Math.cos(angle) * this.speed; //+ this.getOwner(entityManager).vel.x;
        this.vel.y = Math.sin(angle) * this.speed;// + this.getOwner(entityManager).vel.y;
    }

    onTileHit(entityManager, deltaTime) {
        this.remove();
    }

    onEnemyHit(player, entityManager) {
        this.damage.inflict(player, entityManager);
        this.remove();
    }
}

class AquaSLGModAbility extends ModAbility {
    static _ = (() => {
        AquaSLGModAbility.configureStats(0.75, 1.5);
    })();

    onActivation(weapon, entityManager) {
        let player = weapon.getOwner();
        //if(player.vel.y >= 0) player.vel.y = 0;
        player.vel.y = 0;
        weapon.secondaryUse = true;
    };

    onDeactivation(weapon, entityManager, deltaTime) {
        weapon.secondaryUse = false;
    };

    buffs(weapon, entityManager, deltaTime) {
        let player = weapon.getOwner();
        if (player.input.heldDownMapping("modAbility")) {
            player.vel.y = -100;

            if (player.vel.y < -this.maxSpeed) player.vel.y = -weapon.maxSpeed;

            if (player.vel.y === 0) player.vel.y = -1;
        } else {
            let oldCharge = this.currentDuration - 0.5;
            this.deActivate(weapon, entityManager, deltaTime);
            this.currentCoolDown = this.maxDuration - oldCharge;
        }

    };
}

class AquaSLGSuperAbility extends SuperAbility {
    static _ = (() => {
        AquaSLGSuperAbility.configureStats(0.1);
    })();

    onActivation(weapon, entityManager, deltaTime) {
        weapon.superAbilitySnap = true;
        let exceptions = weapon.getOwner().team.players;
        weapon.areaDmg = new AOEKnockBackDamage(weapon.getOwner(), weapon.center.x, weapon.center.y, Tile.SIZE * 8, 900, 20, exceptions);
        weapon.areaDmg.applyAreaOfEffect(entityManager);
    };

    onDeactivation(weapon, entityManager, deltaTime) {
        weapon.superAbilitySnap = false;
    };
}

class AquaSLG extends AttackWeapon {
    static _ = (() => {
        AquaSLG.assignWeaponClassAbilities(AquaSLGModAbility, AquaSLGSuperAbility);
        AquaSLG.addDynamicValues("secondaryUse", "superAbilitySnap");
        AquaSLG.overrideAttackStats(2.25, 25, 500);
    })();

    constructor(x, y) {
        super(x, y);
        this.superAbility.tickChargeGain = 100;
        this.secondaryUse = false;
        this.superAbilitySnap = false;
        this.maxSpeed = 102;
    }

    fire(player, entityManager, deltaTime, angle) {
        entityManager.spawnEntity(this.center.x, this.center.y,
            new IceBullet(player, 0, 0, angle));
    }

    onDrop(player, entityManager, deltaTime) {
        super.onDrop(player, entityManager, deltaTime);
        this.secondaryFire = false;
    }
}


module.exports = AquaSLG;