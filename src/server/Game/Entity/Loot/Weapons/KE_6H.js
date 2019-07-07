const AttackWeapon = require("./Base/AttackWeapon.js");
const Projectile = require("./Other/Projectile.js");
const Tile = require("../../../TileBased/Tile.js");
const Damage = require("../../../Mechanics/Damage/Damage.js");

class KineticBomb extends Projectile {
    constructor(ownerID, weaponID, x, y, cos, sin) {
        super(ownerID, x, y, 4, 4, cos, sin, 100, 0, false);
        this._hits = 4;
        this._weaponID = weaponID;
        this._directHitDmg = new Damage(50);
    }

    onTopCollision(tile) {
        this.side.top = true;
        this.pos.y = tile.y + Tile.SIZE;
        this.vel.y = -this.vel.y;
        this._hits--;
    }

    onBottomCollision(tile) {
        this.side.bottom = true;
        this.pos.y = tile.y - this.height;
        this.vel.y = -this.vel.y;
        this._hits--;
    }

    onLeftCollision(tile) {
        this.side.left = true;
        this.pos.x = tile.x + Tile.SIZE;
        this.vel.x = -this.vel.x;
        this._hits--;
    }

    onRightCollision(tile) {
        this.side.right = true;
        this.pos.x = tile.x - this.width;
        this.vel.x = -this.vel.x;
        this._hits--;
    }

    onPlayerHit(player, entityManager) {
        this._directHitDmg.inflict(player, entityManager);
        this.detonate(entityManager);
    }

    detonate(entityManager) {
        this.remove();
    }

    update(entityManager, deltaTime) {
        super.update(entityManager, deltaTime);
        if (this._hits === 0 ||
            entityManager.getEntity(this._weaponID).kineticDetonation) {
            this.detonate(entityManager);
        }
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