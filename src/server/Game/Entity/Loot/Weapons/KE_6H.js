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
        this._knockBackSpeed = knockBackSpeed;
    }

    inflict(entity, entityManager, a) {
        super.inflict(entity, entityManager, a);
        if (entity instanceof Player) {
            entity.applyEffect(new KnockBackEffect(entity.id,
                -Math.cos(a) * this._knockBackSpeed,
                -Math.sin(a) * this._knockBackSpeed / 2, 0.9), entityManager);
        }
    }
}

// Projectile fired by the KE-6H weapon
class KineticBomb extends Bouncy {
    constructor(ownerID, weaponID, x, y, angle, entityManager) {
        super(ownerID, x, y, 2, 2, angle, 120, 0);
        this._hits = 4;
        this._weaponID = weaponID;
        this._directHitDmg = new Damage(30, ownerID);

        var exceptions = {};
        for (let key in entityManager.getEntity(ownerID).team.players) {
            exceptions[key] = entityManager.getEntity(ownerID).team.players[key];
        }
        delete exceptions[ownerID];

        this._areaDmg = new AOEKnockBackDamage(ownerID, x, y, Tile.SIZE * 4, 300, 15, exceptions);
    }

    onTileHit(entityManager, deltaTime) {
        super.onTileHit(entityManager, deltaTime);
        this._hits--;
    }

    onPlayerHit(player, entityManager) {
        this._directHitDmg.inflict(player, entityManager);
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
        if (!entityManager.getEntity(this._weaponID)) return;
        if (this._hits === 0 ||
            entityManager.getEntity(this._weaponID).kineticDetonation)
            this.detonate(entityManager);
    }

}

class KE_6H extends AttackWeapon {
    constructor(x, y) {
        super(x, y, "KE-6H", 0, 0, 0);
        this._detonate = false;
        this.configureAttackStats(2.5, 5, 1, 100);
        this._modAbility.onActivation = (composedWeapon, entityManager) => {
            composedWeapon.kineticDetonation = true;
        };
    }

    get kineticDetonation() {
        return this._detonate;
    }

    set kineticDetonation(val) {
        this._detonate = val;
    }

    update(entityManager, deltaTime) {
        this._detonate = false;
        super.update(entityManager, deltaTime);
    }

    fire(player, entityManager, deltaTime, angle) {
        entityManager.spawnEntity(this.center.x, this.center.y,
            new KineticBomb(player.id, this.id, 0, 0,
                angle, entityManager));
    }

}


module.exports = KE_6H;