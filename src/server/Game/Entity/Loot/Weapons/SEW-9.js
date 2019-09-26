const AttackWeapon = require("./Base/AttackWeapon.js");
const Tile = require("../../../TileBased/Tile.js");
const Damage = require("../../../Mechanics/Damage/Damage.js");
const AOEDamage = require("../../../Mechanics/Damage/AOEDamage.js");
const Projectile = require("./AttackEntities/Projectile.js");
const Vector2D = require("../../../../../shared/code/Math/SVector2D.js");


// Projectile fired by the SEW-9 weapon
class ElectricSphere extends Projectile {
    constructor(ownerID, weaponID, x, y, angle, entityManager) {
        super(ownerID, x, y, 5, 5, angle, 0);
        this.radius = 5;
        this.weapon = null;

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
        if (this.weapon.modActive) this.weapon.modAbility.deActivate(false, entityManager);
        this.remove();
    }

    update(entityManager, deltaTime) {
        super.update(entityManager, deltaTime);

        let atan2 = Math.atan2(this.getOwner(entityManager).input.mouseData.world.y - this.pos.y, this.getOwner(entityManager).input.mouseData.world.x - this.pos.x);

        let length = Vector2D.distance(this.getOwner(entityManager).input.mouseData.world, this.pos);
        //TODO: Alan's camera does not update with the mouse position, only relative to the player movement

        this.vel.x = Math.cos(atan2) * length * 5;
        this.vel.y = Math.sin(atan2) * length * 5;

    }
}

class SEW_9 extends AttackWeapon {
    constructor(x, y) {
        super(x, y, "SEW-9", 0, 0, 0);
        this.misRef = null;
        this.misPos = null;

        this.superAbility.tickChargeGain = 100;

        this.canMove = true;
        this.secondaryFire = false;
        this.superAbilitySnap = false;

        this.configureAttackStats(1.5, 5, 1, 100);

        this.addDynamicSnapShotData(["misPos", "secondaryFire", "superAbilitySnap"]);

        this.modAbility.onActivation = (weapon, entityManager) => {
            this.currentAmmo--;
            entityManager.spawnEntity(this.center.x, this.center.y,
                this.misRef = new ElectricSphere(this.getOwner(entityManager).id, this.id, 0, 0,
                    0, entityManager));
            this.misRef.weapon = this;
            this.secondaryFire = true;
        };

        this.modAbility.configureStats(10, 4);

        this.modAbility.onDeactivation = (composedWeapon, entityManager, deltaTime) => {
            if (composedWeapon !== false) this.misRef.detonate(entityManager);

            this.secondaryFire = false;
            this.canMove = true;
        };

        this.modAbility.buffs = (composedWeapon, entityManager, deltaTime) => {
            this.canMove = false;
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

        this.canUseMod = this.canFire = this.currentAmmo > 0;

        if (this.misRef) {
            this.misPos = this.misRef.pos;
            if (!this.misRef.removed) this.canFire = this.canUseMod = false;
        }

        let player = entityManager.getEntity(this.playerID);
        if (player) player.setMovementState("canMove", this.canMove);

    }

    onSuperBuffs(entityManager, deltaTime) {
        super.onSuperBuffs(entityManager, deltaTime);
    }

    fire(player, entityManager, deltaTime, angle) {
        this.misRef =
            entityManager.spawnEntity(this.center.x, this.center.y,
                new ElectricSphere(player.id, this.id, 0, 0,
                    angle, entityManager));
        this.misRef.weapon = this;
    }

    onDrop(player, entityManager, deltaTime) {
        super.onDrop(player, entityManager, deltaTime);
        if (this.misRef)
            if (!this.misRef.removed)
                this.misRef.detonate(entityManager);

        this.secondaryFire = false;
        player.setMovementState("canMove", true);
    }

}

module.exports = SEW_9;