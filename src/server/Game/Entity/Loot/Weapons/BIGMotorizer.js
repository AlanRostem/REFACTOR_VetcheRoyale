const AttackWeapon = require("./Base/AttackWeapon.js");
const Projectile = require("./AttackEntities/Projectile.js");
const AOEDamage = require("../../../Mechanics/Damage/AOEDamage.js");
const HitScanner = require("../../../Mechanics/Scanners/HitScanner.js");
const Effect = require("../../../Mechanics/Effect/Effect.js");
const Affectable = require("../../../Entity/Traits/Affectable.js");
const vm = require("../../../../../shared/code/Math/SCustomMath.js");

class MicroMissile extends Projectile {
    constructor(ownerID, x, y, angle, entityManager, harmonic = true, left = false) {
        super(ownerID, x, y, 2, 2, angle, 150);
        this.trajectoryAngle = angle;

        this.speed = 220;
        this.theta = 0;
        this.time = 0;

        this.freq = .1;
        this.amp = .2 + .01 * Math.random();

        this.harmonic = harmonic;
        this.facingLeft = left;
        this.exceptions = entityManager.getEntity(this.ownerID).team.players;
    }

    update(entityManager, deltaTime) {
        this.harmonicMovement(deltaTime);
        super.update(entityManager, deltaTime);
    }

    calcTheta(deltaTime) {
        this.time += this.facingLeft ? 1 : -1;
        if (Math.abs(this.time) < 10) {
            return 0;
        }
        this.theta = Math.sin(this.time * this.freq) * this.amp * vm.randMinMax(-3,3);
        return this.theta;
    }

    harmonicMovement(deltaTime) {
        let theta = 0;
        this.amp = .4 + .7 * Math.random();
        if (this.harmonic) {
            theta = this.calcTheta(deltaTime);
        }
        this.vel.x = this.speed * Math.cos(this.trajectoryAngle + theta);
        this.vel.y = this.speed * Math.sin(this.trajectoryAngle + theta);
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
        new AOEDamage(this.ownerID, this.center.x, this.center.y, 8, 17, this.exceptions)
            .applyAreaOfEffect(entityManager);
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
        this.minFireRate = 100;
        this.configureAttackStats(1.5, 36, 1, this.minFireRate);
        this.modAbility.configureStats(1, 10);
        this.upgradeStage = 0;
        this.thunderPulse = new HitScanner([]);
        this.thunderPulse.onEntityHit = (entity, game, angle) => {
            if (entity instanceof Affectable) {
                entity.applyEffect(new StunEffect(entity.id), game);
            }
        };
        this.thunderPulseRange = 12 * 8;
    }

    onModActivation(entityManager, deltaTime) {
        super.onModActivation(entityManager, deltaTime);
        let end = {};
        end.x = this.center.x + Math.cos(this.fireAngle) * this.thunderPulseRange;
        end.y = this.center.y + Math.sin(this.fireAngle) * this.thunderPulseRange;
        this.thunderPulse.scan(this.center, end, entityManager, entityManager.tileMap);
    }

    onModBuffs(entityManager, deltaTime) {
        super.onModBuffs(entityManager, deltaTime);
        if (this.upgradeStage < 2) {
            this.canFire = false;
        }
    }

    onModDeactivation(entityManager, deltaTime) {
        super.onModDeactivation(entityManager, deltaTime);
        if (this.upgradeStage < 2) {
            this.canFire = true;
        }
    }

    onSuperActivation(entityManager, deltaTime) {
        this.upgradeStage++;
        if (this.upgradeStage >= 4) {
            this.currentAmmo = this.maxAmmo;
            this.reloading = false;
            this.currentReloadTime = 0;
            this.canFire = true;
            return;
        }
        if (this.upgradeStage === 1) {
            this.firerer.maxChargeTime = 0;
            this.firerer.maxBurstCount = 0;
        }
        if (this.upgradeStage === 3) {
            this.firerer.recoil = 0;
        }
    }

    fire(player, entityManager, deltaTime, angle) {
        entityManager.spawnEntity(this.center.x, this.center.y,
            new MicroMissile(player.id, 0, 0,
                angle, entityManager, this.upgradeStage < 3,
        player.checkMovementState("direction", "left")));
    }

    activateReloadAction() {
        super.activateReloadAction();
        this.fireRate = this.minFireRate;
    }

    updateWhenEquipped(player, entityManager, deltaTime) {
        super.updateWhenEquipped(player, entityManager, deltaTime);
        if (entityManager.getEntity(this.playerID)) {
            this.fireAngle = entityManager.getEntity(this.playerID).input.mouseData.angleCenter;
        }
        if (!this.holdingDownFireButton) {
            this.fireRate = this.minFireRate;
        }
    }

    onFireButton(entityManager, deltaTime) {
        if (this.upgradeStage >= 1 && !this.reloading) {
            this.fireRate += 500 * deltaTime;
            if (this.fireRate >= 1100) {
                this.fireRate = 1100;
            }
        }
    }
}

module.exports = BIGMotorizer;