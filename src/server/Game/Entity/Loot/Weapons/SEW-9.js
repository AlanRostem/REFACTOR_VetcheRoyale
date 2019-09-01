const AttackWeapon = require("./Base/AttackWeapon.js");
const Tile = require("../../../TileBased/Tile.js");
const Damage = require("../../../Mechanics/Damage/Damage.js");
const AOEDamage = require("../../../Mechanics/Damage/AOEDamage.js");
const Player = require("../../Player/SPlayer.js");
const Projectile = require("./AttackEntities/Projectile.js");


// Projectile fired by the SEW-9 weapon
class ElectricSphere extends Projectile {
    constructor(ownerID, weaponID, x, y, angle, entityManager) {
        super(ownerID, x, y, 5, 5, angle, 120, 0);
        this._radius = 5;
        this._weaponID = weaponID;

        this._areaDmg = new AOEDamage(ownerID, x, y, Tile.SIZE * this._radius, 10,
            entityManager.getEntity(ownerID).team.players);
    }

    onTileHit(entityManager, deltaTime) {
        this.detonate(entityManager);
    }

    onPlayerHit(player, entityManager) {
        this.detonate(entityManager);
    }

    detonate(entityManager) {
        this._areaDmg.x = this.center.x;
        this._areaDmg.y = this.center.y;
        this._areaDmg.applyAreaOfEffect(entityManager);
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
        this._misRef = null;
        this._misPos = null;
        this.addDynamicSnapShotData(["_misPos"]);
        this.configureAttackStats(1.5, 1, 1, 100);
        this._modAbility.onActivation = (weapon, entityManager) => {
            entityManager.spawnEntity(this.center.x, this.center.y,
                this._misRef = new ElectricSphere(this.getOwner(entityManager).id, this.id, 0, 0,
                    0, entityManager));
        };
        this._modAbility.configureStats(5, 4);
        this._modAbility.onDeactivation = (weapon, entityManager) => {
            if (this._misRef) {
                this._misRef.detonate(entityManager);
                this._misRef = null;
            }
        }
    }

    update(entityManager, deltaTime) {
        super.update(entityManager, deltaTime);
        if (this._misRef) {
            this._misPos = this._misRef.pos;
        }
    }

    fire(player, entityManager, deltaTime, angle) {
        entityManager.spawnEntity(this.center.x, this.center.y,
            new ElectricSphere(player.id, this.id, 0, 0,
                angle, entityManager));

    }

}

module.exports = SEW_9;