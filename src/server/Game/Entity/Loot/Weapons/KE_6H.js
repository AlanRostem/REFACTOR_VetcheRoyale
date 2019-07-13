const AttackWeapon = require("./Base/AttackWeapon.js");
const Projectile = require("./Other/Projectile.js");
const Tile = require("../../../TileBased/Tile.js");
const Damage = require("../../../Mechanics/Damage/Damage.js");
const AOEDamage = require("../../../Mechanics/Damage/AOEDamage.js");
const KnockBackEffect = require("../../../Mechanics/Effect/KnockBackEffect.js");
const Player = require("../../Player/SPlayer.js");

class AOEKnockBackDamage extends AOEDamage {
    constructor(x, y, radius, knockBackSpeed, value) {
        super(x, y, radius, value);
        this._knockBackSpeed = knockBackSpeed;
    }

    inflict(entity, entityManager, a) {
        super.inflict(entity, entityManager, a);
        if (entity instanceof Player) {
            entity.applyEffect(new KnockBackEffect(entity.id,
                -Math.cos(a) * this._knockBackSpeed,
                -Math.sin(a) * this._knockBackSpeed), entityManager);
        }
    }
}

class KineticBomb extends Projectile {
    constructor(ownerID, weaponID, x, y, cos, sin) {
        super(ownerID, x, y, 4, 4, cos, sin, 120, 0, false);
        this._hits = 4;
        this._weaponID = weaponID;
        this._directHitDmg = new Damage(30);
        this._areaDmg = new AOEKnockBackDamage(x, y, Tile.SIZE * 4, 600, 15);
        this.vx = 0;
        this.vy = 0;
    }

    onTopCollision(tile) {
        this.side.top = true;
        this.pos.y = tile.y + Tile.SIZE;
        this.vy = -this.vel.y;
        this._hits--;
    }

    onBottomCollision(tile) {
        this.side.bottom = true;
        this.pos.y = tile.y - this.height;
        this.vy = -this.vel.y;
        this._hits--;
    }

    onLeftCollision(tile) {
        this.side.left = true;
        this.pos.x = tile.x + Tile.SIZE;
        this.vx = -this.vel.x;
        this._hits--;
    }

    onRightCollision(tile) {
        this.side.right = true;
        this.pos.x = tile.x - this.width;
        this.vx = -this.vel.x;
        this._hits--;
    }

    onPlayerHit(player, entityManager) {
        this._directHitDmg.inflict(player, entityManager);
        this.detonate(entityManager);
    }

    detonate(entityManager) {
        this._areaDmg.x = this.center.x;
        this._areaDmg.y = this.center.y;
        this._areaDmg.applyAreaOfEffect(this.id, entityManager);
        this.remove();
    }

    update(entityManager, deltaTime) {
        super.update(entityManager, deltaTime);
        if (this.side.left || this.side.right)
            this.vel.x = this.vx;

        if (this.side.bottom || this.side.top)
            this.vel.y = this.vy;

        if (this._hits === 0 ||
            entityManager.getEntity(this._weaponID).kineticDetonation)
            this.detonate(entityManager);
    }

}

class KE_6H extends AttackWeapon {
    constructor(x, y) {
        super(x, y);
        this._detonate = false;
        this.configureAttackStats(2.5, 5, 1, 100);
        this._modAbility._maxCoolDown = 0;
        this._modAbility._maxDuration = 0;
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

    fire(player, entityManager, deltaTime) {
        entityManager.spawnEntity(this.center.x, this.center.y,
            new KineticBomb(player.id, this.id, 0, 0,
                player.input.mouseData.cosCenter,
                player.input.mouseData.sinCenter));
    }

}


module.exports = KE_6H;