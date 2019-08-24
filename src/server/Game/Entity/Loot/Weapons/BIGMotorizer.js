const AttackWeapon = require("./Base/AttackWeapon.js");
const Projectile = require("./AttackEntities/Projectile.js");

class MicroMissile extends Projectile {
    constructor(ownerID, x, y, cos, sin) {
        super(ownerID, x, y, 2, 2, cos, sin, 150);
        this._trajectoryAngleX = Math.acos(cos);
        this._trajectoryAngleY = Math.asin(sin);

        this._speed = 160;
        this._theta = 0;
        this._sign = 1;
    }

    update(entityManager, deltaTime) {
        this.harmonicMovement(deltaTime);
        super.update(entityManager, deltaTime);
    }

    calcTheta(deltaTime) {
        let maxAngleAbs = Math.PI / 8 + Math.PI / 4 * Math.random();
        let incr = Math.PI / 15;
        this._theta += this._sign * incr;
        if (this._theta < -maxAngleAbs) {
            this._sign = 1;
        } else if (this._theta > maxAngleAbs) {
            this._sign = -1;
        }
        return this._theta;
    }

    harmonicMovement(deltaTime) {
        let theta = this.calcTheta(deltaTime);
        this.vel.x = this._speed * Math.cos(this._trajectoryAngleX + theta);
        this.vel.y = this._speed * Math.sin(this._trajectoryAngleY + theta);
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