const AttackWeapon = require("./Base/AttackWeapon.js");
const Projectile = require("./AttackEntities/Projectile.js");
const AOEDamage = require("../../../Mechanics/Damage/AOEDamage.js");
const HitScanner = require("../../../Mechanics/Scanners/HitScanner.js");
const Effect = require("../../../Mechanics/Effect/Effect.js");
const Affectable = require("../../../Entity/Traits/Affectable.js");

class MicroMissile extends Projectile {
    constructor(ownerID, x, y, angle, entityManager, harmonic = true, left = false) {
        super(ownerID, x, y, 2, 2, angle, 150);
        this._trajectoryAngle = angle;

        this._speed = 160;
        this._theta = 0;
        this._time = 0;

        this._freq = .4;
        this._amp = .4 + .5 * Math.random();

        this._harmonic = harmonic;
        this._facingLeft = left;
        this.exceptions = entityManager.getEntity(this._ownerID).team.array
    }

    update(entityManager, deltaTime) {
        this.harmonicMovement(deltaTime);
        super.update(entityManager, deltaTime);
    }

    calcTheta(deltaTime) {
        this._time += this._facingLeft ? 1 : -1;
        this._theta = Math.sin(this._time * this._freq) * this._amp;
        return this._theta;
    }

    harmonicMovement(deltaTime) {
        let theta = 0;
        this._amp = .4 + .7 * Math.random();
        if (this._harmonic) {
            theta = this.calcTheta(deltaTime);
        }
        this.vel.x = this._speed * Math.cos(this._trajectoryAngle + theta);
        this.vel.y = this._speed * Math.sin(this._trajectoryAngle + theta);
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
            .applyAreaOfEffect(this._ownerID, entityManager, this.exceptions);
    }

}

class StunEffect extends Effect {
    constructor(id) {
        super(id, 1);
    }

    effects(entity, entityManager, deltaTime) {
        super.effects(entity, entityManager, deltaTime);
        entity.vel.x *= 0.5;
        entity.vel.y *= 0.5;
    }
}

class BIGMotorizer extends AttackWeapon {
    constructor(x, y) {
        super(x, y, "B.I.G Motorizer", "rifle", 0, 10, 0, 50, 15,
            5 * Math.PI / 180,
            Math.PI / 180,
            0.07 * Math.PI / 180,
            0.5, 6, 0.05);
        this._minFireRate = 100;
        this.configureAttackStats(1.5, 36, 1, this._minFireRate);
        this._modAbility.configureStats(1, 10);
        this._upgradeStage = 0;
        this._thunderPulse = new HitScanner([]);
        this._thunderPulse.onEntityHit = (entity, game, angle) => {
            if (entity instanceof Affectable) {
                entity.applyEffect(new StunEffect(entity.id), game);
            }
        };
        this._thunderPulseRange = 12 * 8;
    }

    onModActivation(entityManager, deltaTime) {
        super.onModActivation(entityManager, deltaTime);
        let end = {};
        end.x = this.center.x + Math.cos(this._fireAngle) * this._thunderPulseRange;
        end.y = this.center.y + Math.sin(this._fireAngle) * this._thunderPulseRange;
        this._thunderPulse.scan(this._playerID, this.center, end, entityManager, entityManager.tileMap);
    }

    onModBuffs(entityManager, deltaTime) {
        super.onModBuffs(entityManager, deltaTime);
        if (this._upgradeStage < 2) {
            this._canFire = false;
        }
    }

    onModDeactivation(entityManager, deltaTime) {
        super.onModDeactivation(entityManager, deltaTime);
        if (this._upgradeStage < 2) {
            this._canFire = true;
        }
    }

    onSuperActivation(entityManager, deltaTime) {
        this._upgradeStage++;
        if (this._upgradeStage >= 4) {
            this._currentAmmo = this._maxAmmo;
            this._reloading = false;
            this._currentReloadTime = 0;
            return;
        }
        if (this._upgradeStage === 1) {
            this._firerer._maxChargeTime = 0;
            this._firerer._maxBurstCount = 0;
        }
        if (this._upgradeStage === 3) {
            this._firerer._recoil = 0;
        }
    }

    fire(player, entityManager, deltaTime, angle) {
        entityManager.spawnEntity(this.center.x, this.center.y,
            new MicroMissile(player.id, 0, 0,
                angle, entityManager, this._upgradeStage < 3,
        player.checkMovementState("direction", "left")));
    }

    activateReloadAction() {
        super.activateReloadAction();
        this._fireRate = this._minFireRate;
    }

    updateWhenEquipped(player, entityManager, deltaTime) {
        super.updateWhenEquipped(player, entityManager, deltaTime);
        if (entityManager.getEntity(this._playerID)) {
            this._fireAngle = entityManager.getEntity(this._playerID).input.mouseData.angleCenter;
        }
        if (!this._holdingDownFireButton) {
            this._fireRate = this._minFireRate;
        }
    }

    onFireButton(entityManager, deltaTime) {
        if (this._upgradeStage >= 1 && !this._reloading) {
            this._fireRate += 500 * deltaTime;
        }
    }
}

module.exports = BIGMotorizer;