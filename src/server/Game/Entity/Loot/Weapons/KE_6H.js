const Vector2D = require("../../../../../shared/code/Math/SVector2D.js");

const AttackWeapon = require("./Base/AttackWeapon.js");
const Bouncy = require("./AttackEntities/Bouncy.js");
const Tile = require("../../../TileBased/Tile.js");
const Damage = require("../../../Mechanics/Damage/Damage.js");
const AOEDamage = require("../../../Mechanics/Damage/AOEDamage.js");
const KnockBackEffect = require("../../../Mechanics/Effect/KnockBackEffect.js");
const Player = require("../../Player/SPlayer.js");

// Applies a knock back effect to players hit by the
// area of effect damage.
class AOEKnockBackDamage extends AOEDamage {
    constructor(ownerID, x, y, radius, knockBackSpeed, value, exceptions) {
        super(ownerID, x, y, radius, value, exceptions);
        this.knockBackSpeed = knockBackSpeed;
    }

    inflict(entity, entityManager, a) {
        super.inflict(entity, entityManager, a);
        if (entity instanceof Player) {
            entity.applyEffect(new KnockBackEffect(entity.id,
                -Math.cos(a) * this.knockBackSpeed,
                -Math.sin(a) * this.knockBackSpeed / 2, 0.9), entityManager);
        }
    }
}

// Projectile fired by the KE-6H weapon
class KineticBomb extends Bouncy {
    constructor(weaponRef, ownerID, weaponID, x, y, angle, entityManager) {
        super(ownerID, x, y, 2, 2, angle, 120, 0);
        this.hits = 6;
        this.weaponID = weaponID;
        this.directHitDmg = new Damage(30, ownerID);

        var exceptions = {};
        for (let key in entityManager.getEntity(ownerID).team.players) {
            exceptions[key] = entityManager.getEntity(ownerID).team.players[key];
        }
        delete exceptions[ownerID];
        this.weapon = weaponRef;

        this.areaDmg = new AOEKnockBackDamage(ownerID, x, y, Tile.SIZE * 4, 300, 15, exceptions);
    }

    onTileHit(entityManager, deltaTime) {
        super.onTileHit(entityManager, deltaTime);
        this.hits--;
    }

    onPlayerHit(player, entityManager) {
        this.directHitDmg.inflict(player, entityManager);
        this.detonate(entityManager);
    }

    detonate(entityManager) {
        this.areaDmg.x = this.center.x;
        this.areaDmg.y = this.center.y;
        this.areaDmg.applyAreaOfEffect(entityManager);
        this.remove();
    }

    update(entityManager, deltaTime) {
        super.update(entityManager, deltaTime);

        if (this.hits <= 0) {
            this.detonate(entityManager);
        }

        if (!entityManager.getEntity(this.weaponID)) return;
        if (entityManager.getEntity(this.weaponID).kineticImplosion) {
            this.followPoint = true;
            this.point = entityManager.getEntity(this.weaponID).followPoint;
            this.hits = 1;
        }

        if (this.followPoint) {
            let angle = Vector2D.angle(this.center, this.point);
            let d = Vector2D.distance(this.center, this.point);
            this.vel.x = Math.cos(angle) * d * 10;
            this.vel.y = Math.sin(angle) * d * 10;
            if (Vector2D.distance(this.center, this.point) < this.point.radius) {
                this.detonate(entityManager);
                this.weapon.roamingBombs--;
            }
        }


    }

}

class KE_6H extends AttackWeapon {
    constructor(x, y) {
        super(x, y, "KE-6H", 0, 0, 0);
        this.followPoint = new Vector2D(0, 0);
        this.followPoint.radius = 2;
        this.roamingBombs = 0;
        this.configureAttackStats(2.5, 8, 1, 100);
        this.modAbility.configureStats(2, 4);
        this.modAbility.onActivation = (composedWeapon, entityManager) => {
            composedWeapon.kineticImplosion = true;
            composedWeapon.canFire = false;
            this.followPoint.x = this.getOwner(entityManager).input.mouseData.world.x;
            this.followPoint.y = this.getOwner(entityManager).input.mouseData.world.y;

        };
        this.modAbility.onDeactivation = (composedWeapon, entityManager) => {
            composedWeapon.kineticImplosion = false;
            composedWeapon.canFire = true;
        };
        this.modAbility.buffs = (weapon, game, deltaTime) => {
            if (weapon.roamingBombs <= 0) {
                weapon.modAbility.deActivate(weapon, game, deltaTime);
            }
        }
    }

    update(entityManager, deltaTime) {
        this.detonate = false;
        this.canUseMod = this.currentAmmo < this.maxAmmo;
        super.update(entityManager, deltaTime);
    }

    updateWhenEquipped(player, entityManager, deltaTime) {
        super.updateWhenEquipped(player, entityManager, deltaTime);
    }

    fire(player, entityManager, deltaTime, angle) {
        entityManager.spawnEntity(this.center.x, this.center.y,
            new KineticBomb(this, player.id, this.id, 0, 0,
                angle, entityManager));
        this.roamingBombs++;
    }

}


module.exports = KE_6H;