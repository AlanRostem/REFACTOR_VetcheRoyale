const AttackWeapon = require("./Base/AttackWeapon.js");
const Projectile = require("./AttackEntities/Projectile.js");
const AOEDamage = require("../../../Mechanics/Damage/AOEDamage.js");

class MicroMissile extends Projectile {
    constructor(ownerID, x, y, cos, sin, harmonic = true) {
        super(ownerID, x, y, 2, 2, cos, sin, 150);
        this._trajectoryAngleX = Math.acos(cos);
        this._trajectoryAngleY = Math.asin(sin);

        this._speed = 160;
        this._theta = 0;
        this._time = 0;

        this._freq = .4;
        this._amp = .4 + .5 * Math.random();

        this._harmonic = harmonic;
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
        let theta = 0;
        if (this._harmonic) {
            theta = this.calcTheta(deltaTime);
        }
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
        super(x, y, "B.I.G Motorizer", "rifle", 0, 10, 0,
            50, //Charge gain
            18, 0.4, 6, 0.05);
        this._minFireRate = 120;
        this.configureAttackStats(1.5, 36, 1, this._minFireRate);
        this._upgradeStage = 0;
    }

    onSuperActivation(entityManager, deltaTime) {
        if (this._upgradeStage >= 4) {
            this._currentAmmo = this._maxAmmo;
            return;
        }
        this._upgradeStage++;
        if (this._upgradeStage >= 2) {
            this._firerer._maxChargeTime = 0;
            this._firerer._maxBurstCount = 0;
        }
    }

    fire(player, entityManager, deltaTime) {
        entityManager.spawnEntity(this.center.x, this.center.y,
            new MicroMissile(player.id, 0, 0,
                player.input.mouseData.cosCenter,
                player.input.mouseData.sinCenter, this._upgradeStage < 1));
    }

    activateReloadAction() {
        super.activateReloadAction();
        this._fireRate = this._minFireRate;
    }

    update(entityManager, deltaTime) {
        super.update(entityManager, deltaTime);
        if (!this._holdingDownFireButton) {
            this._fireRate = this._minFireRate;
        }
    }

    onFireButton(entityManager, deltaTime) {
        if (this._upgradeStage >= 2 && !this._reloading) {
            this._fireRate += 500 * deltaTime;
        }
    }
}

module.exports = BIGMotorizer;