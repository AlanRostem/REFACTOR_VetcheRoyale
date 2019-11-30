const AttackWeapon = require("./Base/AttackWeapon.js");
const ModAbility = require("./Base/ModAbility.js");
const Projectile = require("./AttackEntities/Projectile.js");
const Damage = require("../../../Mechanics/Damage/Damage.js");
const Tile = require("../../../TileBased/Tile.js");
const AOEKnockBackDamage = require("../../../Mechanics/Damage/AOEKnockBackDamage.js");

// Projectile fired by the AquaSLG
class IceBullet extends Projectile {
    constructor(ownerID, weaponID, x, y, angle, entityManager) {
        super(ownerID, x, y, 2, 2, angle);
        this.speed = 5  * 60; // TODO: 300
        this.damage = new Damage(10, ownerID);

        //let atan2 = Math.atan2(this.getOwner(entityManager).input.mouseData.world.y - (this.height / 2 | 0) - this.pos.y, this.getOwner(entityManager).input.mouseData.world.x - (this.width / 2 | 0) - this.pos.x);

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

class AquaSLG extends AttackWeapon {

    static _ = (() => {
        AquaSLG.addDynamicValues("secondaryUse", "superAbilitySnap");
    })();

    constructor(x, y) {
        super(x, y, "AquaSLG", 0, 0, 0);
        this.superAbility.tickChargeGain = 100;

        this.secondaryUse = false;
        this.superAbilitySnap = false;

        this.maxSpeed = 102;

        this.modAbility = new ModAbility(0.75, 1.5);

        this.configureAttackStats(2, 25, 1, 500);

        this.modAbility.onActivation = (weapon, entityManager) => {
            let player = this.getOwner(entityManager);
            //if(player.vel.y >= 0) player.vel.y = 0;
            player.vel.y = 0;
            this.secondaryUse = true;
        };

        this.modAbility.onDeactivation = (composedWeapon, entityManager, deltaTime) => {
            this.secondaryUse = false;
        };

        this.modAbility.buffs = (composedWeapon, entityManager, deltaTime) => {
            let player = this.getOwner(entityManager);
            if (player.input.heldDownMapping("modAbility")) {
                player.accelerateY(-6400, deltaTime);

                if (player.vel.y < -this.maxSpeed) player.vel.y = -this.maxSpeed;

                if (player.vel.y === 0) player.vel.y = -1;
            } else {
                var oldCharge = this.modAbility.currentDuration - 0.5;
                this.modAbility.deActivate(composedWeapon, entityManager, deltaTime);
                this.modAbility.currentCoolDown = this.modAbility.maxDuration - oldCharge;
            }

        };

        this.superAbility.onActivation = (composedWeapon, entityManager, deltaTime) => {
            this.superAbilitySnap = true;
            let exceptions = this.getOwner(entityManager).team.players;
            this.areaDmg = new AOEKnockBackDamage(this.getOwner(entityManager).id, this.x, this.y, Tile.SIZE * 8, 900, 20, exceptions);
            this.areaDmg.applyAreaOfEffect(entityManager);
        };

        this.superAbility.onDeactivation = (composedWeapon, entityManager, deltaTime) => {
            this.superAbilitySnap = false;
        };
    }

    onSuperBuffs(entityManager, deltaTime) {
        super.onSuperBuffs(entityManager, deltaTime);
    }

    fire(player, entityManager, deltaTime, angle) {
        entityManager.spawnEntity(this.center.x, this.center.y,
            new IceBullet(player.id, this.id, 0, 0, angle, entityManager));
    }

    onDrop(player, entityManager, deltaTime) {
        super.onDrop(player, entityManager, deltaTime);
        this.secondaryFire = false;
    }
}


module.exports = AquaSLG;