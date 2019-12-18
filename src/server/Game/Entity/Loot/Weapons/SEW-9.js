const AttackWeapon = require("./Base/AttackWeapon.js");
const Tile = require("../../../TileBased/Tile.js");
const Damage = require("../../../Mechanics/Damage/Damage.js");
const AOEDamage = require("../../../Mechanics/Damage/AOEDamage.js");
const Projectile = require("./AttackEntities/Projectile.js");
const Vector2D = require("../../../../../shared/code/Math/SVector2D.js");
const SEntity = require("../../SEntity.js");
const Alive = require("../../Traits/Alive.js");
const ModAbility = require("./Base/ModAbility.js");
const SuperAbility = require("./Base/SuperAbility.js");


// Projectile fired by the SEW-9 weapon
class ElectricSphere extends Projectile {
    static _ = (() => {
        ElectricSphere.addDynamicValues("secondary")
    })();

    constructor(owner, weapon, x, y, angle, entityManager) {
        super(owner, x, y, 3, 3, angle, 0);
        this.radius = 3;
        this.maxSpeed = 200;
        this.velVal = 5;
        this.weapon = weapon;
        this.secondary = false;

        this.areaDmg = new AOEDamage(owner, x, y, Tile.SIZE * this.radius, 10,
            owner.team.players);
    }

    onTileHit(entityManager, deltaTime) {
        this.detonate(entityManager);
    }

    onEnemyHit(player, entityManager) {
        this.detonate(entityManager);
    }

    detonate(entityManager) {
        if (this.getOwner()) {
            this.getOwner().entitiesInProximity.shouldFollowEntity = true;
        }
        this.areaDmg.x = this.center.x;
        this.areaDmg.y = this.center.y;
        this.areaDmg.applyAreaOfEffect(entityManager);
        if (this.weapon.modAbility.active) this.weapon.modAbility.currentDuration = 0;
        this.remove();
    }


    update(entityManager, deltaTime) {
        super.update(entityManager, deltaTime);


        if (this.getOwner()) {
            let atan2 = Math.atan2(this.getOwner().input.mouseData.world.y - (this.height / 2 | 0) - this.pos.y, this.getOwner().input.mouseData.world.x - (this.width / 2 | 0) - this.pos.x);

            let length = Vector2D.distance(this.getOwner().input.mouseData.world, this.pos);

            this.vel.x = Math.cos(atan2) * length * this.velVal;
            this.vel.y = Math.sin(atan2) * length * this.velVal;

            if (this.vel.x > this.maxSpeed) this.vel.x = this.maxSpeed;
            if (this.vel.x < -this.maxSpeed) this.vel.x = -this.maxSpeed;
            if (this.vel.y > this.maxSpeed) this.vel.y = this.maxSpeed;
            if (this.vel.y < -this.maxSpeed) this.vel.y = -this.maxSpeed;
        }
    }
}

class SuperDamage extends SEntity {
    static DAMAGE = 1;
    constructor(x, y, w, h, player) {
        super(x, y, w, h);
        this.player = player;
    }

    update(game, deltaTime) {
        super.update(game, deltaTime);
        let player = this.player;
        if (player) {
            this.pos.x = player.center.x;
            this.pos.y = player.center.y;
            if (player.movementState.direction !== "right")
                this.pos.x -= this.width;
        }
    }

    onEntityCollision(entity, entityManager) {
        super.onEntityCollision(entity, entityManager);
        if (entity instanceof Alive) {
            if (!entity.isTeammate(this.player)) {
                Damage.inflict(this.player, entity, entityManager, this.constructor.DAMAGE);
            }
        }
    }

}


class SEW_9ModAbility extends ModAbility {
    static _ = (() => {
        SEW_9ModAbility.configureStats(9, 4);
    })();

    onActivation(weapon, entityManager, deltaTime) {
        if (!weapon.primaryFire) {
            weapon.currentAmmo--;
            weapon.isShooting = true;
            entityManager.spawnEntity(weapon.center.x, weapon.center.y,
                weapon.misRef = new ElectricSphere(weapon.getOwner(), weapon, 0, 0,
                    0, entityManager));
            weapon.misRef.weapon = weapon;
            weapon.misRef.secondary = true;
            weapon.secondaryFire = true;
            weapon.getOwner().entitiesInProximity.shouldFollowEntity = false;
        }
    }

    onDeactivation(composedWeapon, entityManager, deltaTime) {
        composedWeapon.secondaryFire = false;
        composedWeapon.canMove = true;

        composedWeapon.isShooting = false;
        if (composedWeapon.getOwner())
            composedWeapon.getOwner().entitiesInProximity.shouldFollowEntity = true;
        if (composedWeapon) composedWeapon.misRef.detonate(entityManager);
    }

    buffs(composedWeapon, entityManager, deltaTime) {
        composedWeapon.canMove = false;
        composedWeapon.isShooting = true;
        if (composedWeapon.misRef) {
            composedWeapon.getOwner().entitiesInProximity.follow(
                composedWeapon.misRef.center.x,
                composedWeapon.misRef.center.y
            );
        }
    }
}

class SEW_9SuperAbility extends SuperAbility {
    static _ = (() => {
        SEW_9SuperAbility.configureStats(5);
    })();

    onActivation(composedWeapon, entityManager, deltaTime) {
        composedWeapon.superAbilitySnap = true;
        entityManager.spawnEntity(composedWeapon.center.x, composedWeapon.center.y,
            composedWeapon.damageBox = new SuperDamage(composedWeapon.center.x, composedWeapon.center.y, 100, composedWeapon.getOwner().height, composedWeapon.getOwner())
        );
    }

    onDeactivation(composedWeapon, entityManager, deltaTime) {
        composedWeapon.superAbilitySnap = false;
        if (composedWeapon.damageBox) composedWeapon.damageBox.remove();
        composedWeapon.damageBox = null;
    }
}

class SEW_9 extends AttackWeapon {
    static _ = (() => {
        SEW_9.assignWeaponClassAbilities(SEW_9ModAbility, SEW_9SuperAbility);
        SEW_9.addDynamicValues("misPos", "secondaryFire", "superAbilitySnap", "isShooting");
        SEW_9.overrideAttackStats(2.25, 5, 100);
    })();

    constructor(x, y) {
        super(x, y);
        this.misRef = null;
        this.misPos = null;

        this.superAbility.tickChargeGain = 100;

        this.canMove = true;
        this.primaryFire = false;
        this.secondaryFire = false;
        this.superAbilitySnap = false;
        this.isShooting = false;
    }

    updateWhenEquipped(player, entityManager, deltaTime) {
        super.updateWhenEquipped(player, entityManager, deltaTime);
        this.canUseMod = this.canFire = this.currentAmmo > 0;

        this.canUseMod = this.modCoolDownData === 0 && this.currentAmmo > 0;

        if (this.misRef) {
            //  this.isShooting = true;
            this.misPos = this.misRef.pos;
            if (!this.misRef.removed) this.canFire = this.canUseMod = this.primaryFire = this.secondaryFire = false;
            else this.isShooting = false;
        }

        if (player) player.setMovementState("canMove", this.canMove);
    }

    fire(player, entityManager, deltaTime, angle) {
        if (!this.secondaryFire) {
            this.isShooting = true;
            this.misRef =
                entityManager.spawnEntity(this.center.x, this.center.y,
                    new ElectricSphere(player, this, 0, 0,
                        angle, entityManager));
            this.misRef.weapon = this;
            this.primaryFire = true;
        }
    }

    onDrop(player, entityManager, deltaTime) {
        super.onDrop(player, entityManager, deltaTime);
        if (this.misRef)
            if (!this.misRef.removed)
                this.misRef.detonate(entityManager);
        this.isShooting = false;
        this.secondaryFire = false;
        player.setMovementState("canMove", true);
    }

}

module.exports = SEW_9;
