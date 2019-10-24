const AttackWeapon = require("./Base/AttackWeapon.js");
const Tile = require("../../../TileBased/Tile.js");
const Damage = require("../../../Mechanics/Damage/Damage.js");
const AOEDamage = require("../../../Mechanics/Damage/AOEDamage.js");
const Projectile = require("./AttackEntities/Projectile.js");
const Vector2D = require("../../../../../shared/code/Math/SVector2D.js");
const SEntity = require("../../SEntity.js");
const Player = require("../../Player/SPlayer.js");


// Projectile fired by the SEW-9 weapon
class ElectricSphere extends Projectile {
    constructor(ownerID, weaponID, x, y, angle, entityManager) {
        super(ownerID, x, y, 3, 3, angle, 0);
        this.radius = 3;
        this.maxSpeed = 200;
        this.velVal = 5;
        this.weapon = null;
        this.secondary = false;
        this.addDynamicSnapShotData(["secondary"]);

        this.areaDmg = new AOEDamage(ownerID, x, y, Tile.SIZE * this.radius, 10,
            entityManager.getEntity(ownerID).team.players);
    }

    onTileHit(entityManager, deltaTime) {
        this.detonate(entityManager);
    }

    onPlayerHit(player, entityManager) {
        this.detonate(entityManager);
    }

    detonate(entityManager) {
        this.areaDmg.x = this.center.x;
        this.areaDmg.y = this.center.y;
        this.areaDmg.applyAreaOfEffect(entityManager);
        if (this.weapon.modActive) this.weapon.modAbility.deActivate(null, entityManager);
        this.remove();
    }

    update(entityManager, deltaTime) {
        super.update(entityManager, deltaTime);


        if (this.getOwner(entityManager)) {
            let atan2 = Math.atan2(this.getOwner(entityManager).input.mouseData.world.y - (this.height / 2 | 0) - this.pos.y, this.getOwner(entityManager).input.mouseData.world.x - (this.width / 2 | 0) - this.pos.x);

            let length = Vector2D.distance(this.getOwner(entityManager).input.mouseData.world, this.pos);

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
    constructor(x, y, w, h, playerID) {
        super(x, y, w, h);
        this.damage = new Damage(1, playerID);

    }

    update(game, deltaTime) {
        super.update(game, deltaTime);
        let player = game.getEntity(this.damage.playerID);
        if (player) {
            this.pos.x = player.x;
            this.pos.y = player.y;

            if (player.movementState.direction !== "right") this.pos.x -= this.width;
        }
    }

    onEntityCollision(entity, entityManager) {
        super.onEntityCollision(entity, entityManager);
        if (entity instanceof Player) {
            if (!entity.isTeammate(entityManager.getEntity(this.damage.playerID))) {
                this.damage.inflict(entity, entityManager);
            }
        }
    }

}

class SEW_9 extends AttackWeapon {
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

        this.configureAttackStats(1.5, 5, 1, 100);

        this.addDynamicSnapShotData(["misPos", "secondaryFire", "superAbilitySnap", "isShooting"]);

        this.modAbility.onActivation = (weapon, entityManager) => {
            if(!this.primaryFire) {
                this.currentAmmo--;
                this.isShooting = true;
                entityManager.spawnEntity(this.center.x, this.center.y,
                    this.misRef = new ElectricSphere(this.getOwner(entityManager).id, this.id, 0, 0,
                        0, entityManager));
                this.misRef.weapon = this;
                this.misRef.secondary = true;
                this.secondaryFire = true;
                this.getOwner(entityManager).entitiesInProximity.shouldFollowEntity = false;
            }
        };

        this.modAbility.configureStats(9, 4);

        this.modAbility.onDeactivation = (composedWeapon, entityManager, deltaTime) => {

            this.secondaryFire = false;
            this.canMove = true;

            this.isShooting = false;
            if (this.getOwner(entityManager))
                this.getOwner(entityManager).entitiesInProximity.shouldFollowEntity = true;
            if (composedWeapon) this.misRef.detonate(entityManager);
        };

        this.modAbility.buffs = (composedWeapon, entityManager, deltaTime) => {
            this.canMove = false;
            this.isShooting = true;
            if (this.misRef) {
                this.getOwner(entityManager).entitiesInProximity.follow(
                    this.misRef.x,
                    this.misRef.y
                );
            }
        };

        this.superAbility.onActivation = (composedWeapon, entityManager, deltaTime) => {
            this.superAbilitySnap = true;
            entityManager.spawnEntity(this.center.x, this.center.y,
                this.damageBox = new SuperDamage(this.x, this.y, 100, entityManager.getEntity(this.playerID).height, this.playerID)
            );
        };

        this.superAbility.onDeactivation = (composedWeapon, entityManager, deltaTime) => {
            this.superAbilitySnap = false;
            if (this.damageBox) this.damageBox.remove();
            this.damageBox = null;
        };
    }

    update(entityManager, deltaTime) {
        super.update(entityManager, deltaTime);

        this.canUseMod = this.canFire = this.currentAmmo > 0;

        this.canUseMod = this.modCoolDownData === 0 && this.currentAmmo > 0;

        if (this.misRef) {
            //  this.isShooting = true;
            this.misPos = this.misRef.pos;
            if (!this.misRef.removed) this.canFire = this.canUseMod = this.primaryFire = this.secondaryFire = false;
            else this.isShooting = false;
        }

        let player = entityManager.getEntity(this.playerID);
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
                    new ElectricSphere(player.id, this.id, 0, 0,
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