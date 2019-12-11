const AttackWeapon = require("./Base/AttackWeapon.js");
const Tile = require("../../../TileBased/Tile.js");
const Damage = require("../../../Mechanics/Damage/Damage.js");
const AOEDamage = require("../../../Mechanics/Damage/AOEDamage.js");
const Projectile = require("./AttackEntities/Projectile.js");
const Vector2D = require("../../../../../shared/code/Math/SVector2D.js");
const SEntity = require("../../SEntity.js");
const Alive = require("../../Traits/Alive.js");


// Projectile fired by the SEW-9 weapon
class ElectricSphere extends Projectile {
    static _ = (() => {
        ElectricSphere.addDynamicValues("secondary")
    })();

    constructor(owner, weaponID, x, y, angle, entityManager) {
        super(owner, x, y, 3, 3, angle, 0);
        this.radius = 3;
        this.maxSpeed = 200;
        this.velVal = 5;
        this.weapon = null;
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
        if (this.weapon.modActive) this.weapon.modAbility.deActivate(null, entityManager);
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
    constructor(x, y, w, h, player) {
        super(x, y, w, h);
        this.damage = new Damage(1, player);

    }

    update(game, deltaTime) {
        super.update(game, deltaTime);
        let player = this.damage.player;
        if (player) {
            this.pos.x = player.x;
            this.pos.y = player.y;

            if (player.movementState.direction !== "right") this.pos.x -= this.width;
        }
    }

    onEntityCollision(entity, entityManager) {
        super.onEntityCollision(entity, entityManager);
        if (entity instanceof Alive) {
            if (!entity.isTeammate(this.damage.player)) {
                this.damage.inflict(entity, entityManager);
            }
        }
    }

}

class SEW_9 extends AttackWeapon {
    static _ = (() => {
        SEW_9.addDynamicValues("misPos", "secondaryFire", "superAbilitySnap", "isShooting");
    })();

    constructor(x, y) {
        super(x, y, "SEW-9", 0, 0, 0);
        this.misRef = null;
        this.misPos = null;

        this.superAbility.tickChargeGain = 100;

        this.canMove = true;
        this.primaryFire = false;
        this.secondaryFire = false;
        this.superAbilitySnap = false;

        this.isShooting = false;

        this.configureAttackStats(2.25, 5, 1, 100);

        this.modAbility.onActivation = (weapon, entityManager) => {
            if(!this.primaryFire) {
                this.currentAmmo--;
                this.isShooting = true;
                entityManager.spawnEntity(this.center.x, this.center.y,
                    this.misRef = new ElectricSphere(this.getOwner(), this.id, 0, 0,
                        0, entityManager));
                this.misRef.weapon = this;
                this.misRef.secondary = true;
                this.secondaryFire = true;
                this.getOwner().entitiesInProximity.shouldFollowEntity = false;
            }
        };

        this.modAbility.configureStats(9, 4);

        this.modAbility.onDeactivation = (composedWeapon, entityManager, deltaTime) => {

            this.secondaryFire = false;
            this.canMove = true;

            this.isShooting = false;
            if (this.getOwner())
                this.getOwner().entitiesInProximity.shouldFollowEntity = true;
            if (composedWeapon) this.misRef.detonate(entityManager);
        };

        this.modAbility.buffs = (composedWeapon, entityManager, deltaTime) => {
            this.canMove = false;
            this.isShooting = true;
            if (this.misRef) {
                this.getOwner().entitiesInProximity.follow(
                    this.misRef.x,
                    this.misRef.y
                );
            }
        };

        this.superAbility.onActivation = (composedWeapon, entityManager, deltaTime) => {
            this.superAbilitySnap = true;
            entityManager.spawnEntity(this.center.x, this.center.y,
                this.damageBox = new SuperDamage(this.x, this.y, 100, this.getOwner().height, this.getOwner())
            );
        };

        this.superAbility.onDeactivation = (composedWeapon, entityManager, deltaTime) => {
            this.superAbilitySnap = false;
            if (this.damageBox) this.damageBox.remove();
            this.damageBox = null;
        };
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

    onSuperBuffs(entityManager, deltaTime) {
        super.onSuperBuffs(entityManager, deltaTime);
    }

    fire(player, entityManager, deltaTime, angle) {
        if(!this.secondaryFire) {
            this.isShooting = true;
            this.misRef =
                entityManager.spawnEntity(this.center.x, this.center.y,
                    new ElectricSphere(player, this.id, 0, 0,
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