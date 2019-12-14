const AttackWeapon = require("./Base/AttackWeapon.js");
const Projectile = require("./AttackEntities/Projectile.js");
const AOEDamage = require("../../../Mechanics/Damage/AOEDamage.js");
const HitScanner = require("../../../Mechanics/Scanners/HitScanner.js");
const Effect = require("../../../Mechanics/Effect/Effect.js");
const Affectable = require("../../../Entity/Traits/Affectable.js");
const vm = require("../../../../../shared/code/Math/SCustomMath.js");

class MicroMissile extends Projectile {
    constructor(owner, x, y, angle, entityManager, harmonic = true, left = false) {
        super(owner, x, y, 2, 2, angle, 150);
        this.trajectoryAngle = angle;

        this.speed = 220;
        this.theta = 0;
        this.time = 0;

        this.freq = .1;
        this.amp = .2 + .01 * Math.random();

        this.harmonic = harmonic;
        this.facingLeft = left;
        this.exceptions = owner.team.players;
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
        this.amp =  vm.randMinMax(-1, 1);
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

    onEnemyHit(player, entityManager) {
        super.onEnemyHit(player, entityManager);
        this.dealDamage(entityManager);

    }

    dealDamage(entityManager) {
        new AOEDamage(this.getOwner(), this.center.x, this.center.y, 8, 17, this.exceptions)
            .applyAreaOfEffect(entityManager);
    }

}

class StunEffect extends Effect {
    constructor(ae) {
        super(ae, 3);
    }

    effects(entity, entityManager, deltaTime) {
        super.effects(entity, entityManager, deltaTime);
        entity.vel.x *= 0.5;
        entity.vel.y *= 0.5;
    }
}

class BIGMotorizer extends AttackWeapon {
    static _ = (() => {
        BIGMotorizer.overrideAttackStats(1.5, 36, 100, 1,
            5 * Math.PI / 180,
            Math.PI / 180,
            0.07 * Math.PI / 180, 0, 6, 0.05)
    })();

    constructor(x, y) {
        super(x, y);
    }

    fire(player, entityManager, deltaTime, angle) {
        entityManager.spawnEntity(this.center.x, this.center.y,
            new MicroMissile(player, 0, 0,
                angle, entityManager, true,
        player.checkMovementState("direction", "left")));
    }
}

module.exports = BIGMotorizer;