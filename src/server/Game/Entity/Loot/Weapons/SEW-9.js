const AttackWeapon = require("./Base/AttackWeapon.js");
const Tile = require("../../../TileBased/Tile.js");
const Damage = require("../../../Mechanics/Damage/Damage.js");
const AOEDamage = require("../../../Mechanics/Damage/AOEDamage.js");
const Projectile = require("./AttackEntities/Projectile.js");


// Projectile fired by the SEW-9 weapon
class ElectricSphere extends Projectile {
    constructor(ownerID, weaponID, x, y, angle, entityManager) {
        super(ownerID, x, y, 5, 5, angle, 120, 0);
        this.radius = 5;
        this.weaponID = weaponID;

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
        this.remove();
    }

    update(entityManager, deltaTime) {
        super.update(entityManager, deltaTime);
        this.pos.x = this.getOwner(entityManager).input.mouseData.world.x;
        this.pos.y = this.getOwner(entityManager).input.mouseData.world.y;
    }
}

class SEW_9 extends AttackWeapon {
    constructor(x, y) {
        super(x, y, "SEW-9", 0, 0, 0);
        this.misRef = null;
        this.misPos = null;

        this.secondaryFire = false;

        this.configureAttackStats(1.5, 1, 1, 100);

        this.addDynamicSnapShotData(["misPos", "secondaryFire"]);
        this.modAbility.onActivation = (weapon, entityManager) => {
            entityManager.spawnEntity(this.center.x, this.center.y,
                this.misRef = new ElectricSphere(this.getOwner(entityManager).id, this.id, 0, 0,
                    0, entityManager));
        };

        this.modAbility.configureStats(5, 4);
        this.modAbility.onDeactivation = (weapon, entityManager) => {
            if (this.misRef) {
                this.misRef.detonate(entityManager);
                this.misRef = null;
                this.secondaryFire = false;
            }
        };

        this.modAbility.buffs = (composedWeapon, entityManager, deltaTime) => {
            let player = entityManager.getEntity(this.playerID);
            if (player) {
                this.secondaryFire = player.input.mouseHeldDown(3);
            }
        };
    }

    update(entityManager, deltaTime) {
        super.update(entityManager, deltaTime);
        if (this.misRef) {
            this.misPos = this.misRef.pos;
        }
    }

    fire(player, entityManager, deltaTime, angle) {
        entityManager.spawnEntity(this.center.x, this.center.y,
            new ElectricSphere(player.id, this.id, 0, 0,
                angle, entityManager));

    }

    onDrop(player, entityManager, deltaTime) {
        super.onDrop(player, entityManager, deltaTime);
        this.secondaryFire = false;
    }

}

module.exports = SEW_9;