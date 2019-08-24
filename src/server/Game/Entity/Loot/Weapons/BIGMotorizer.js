const AttackWeapon = require("./Base/AttackWeapon.js");
const Projectile = require("./AttackEntities/Projectile.js");
const AOEDamage = require("../../../Mechanics/Damage/AOEDamage.js");

class MicroMissile extends Projectile {
    constructor(ownerID, x, y, cos, sin) {
        super(ownerID, x, y, 2, 2, cos, sin, 150);
        this._trajectoryAngleX = Math.acos(cos);
        this._trajectoryAngleY = Math.asin(sin);

        this._speed = 160;
        this._theta = 0;
        this._time = 0;

        this._freq = .4;
        this._amp = .4 + .5 * Math.random();
    }

    update(entityManager, deltaTime) {
        this.harmonicMovement(deltaTime);
        super.update(entityManager, deltaTime);
    }

    calcTheta(deltaTime) {
        this._time--;
        this._theta = Math.sin(this._time * this._freq) * this._amp;
        return this._theta;
    }

    harmonicMovement(deltaTime) {
        let theta = this.calcTheta(deltaTime);
        this.vel.x = this._speed * Math.cos(this._trajectoryAngleX + theta);
        this.vel.y = this._speed * Math.sin(this._trajectoryAngleY + theta);
    }

    onTileHit(entityManager, deltaTime) {
        super.onTileHit(entityManager, deltaTime);
        this.dealDamage(entityManager);
    }

    onPlayerHit(player, entityManager) {
        super.onPlayerHit(player, entityManager);
        this.dealDamage(entityManager);

    }

    dealDamage(entityManager) {
        new AOEDamage(this._ownerID, this.center.x, this.center.y, 8, 17)
            .applyAreaOfEffect(this._ownerID, entityManager, entityManager.getEntity(this._ownerID).team.array);
    }

}

class BIGMotorizer extends AttackWeapon {
    constructor(x, y) {
        super(x, y, "B.I.G Motorizer", "rifle", 0, 10, 0, 2, 18, 0.4, 6, 0.05);
        this.configureAttackStats(1.5, 36, 1, 120);
    }

    fire(player, entityManager, deltaTime) {
        entityManager.spawnEntity(this.center.x, this.center.y,
            new MicroMissile(player.id, 0, 0,
                player.input.mouseData.cosCenter,
                player.input.mouseData.sinCenter));
    }


}

module.exports = BIGMotorizer;