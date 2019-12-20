const HitScanWeapon = require("./Base/HitScanWeapon.js");
const FiringMechanism = require("./Base/FiringMechanism.js");
const SuperAbility = require("./Base/SuperAbility.js");
const Projectile = require("./AttackEntities/Projectile.js");
const Damage = require("../../../Mechanics/Damage/Damage.js");
const HitScanner = require("../../../Mechanics/Scanners/HitScanner.js");
const Vector2D = require("../../../../../shared/code/Math/SVector2D.js");
const SEntity = require("../../SEntity.js");
const Alive = require("../../Traits/Alive.js");

class FMPartialChargeShot extends FiringMechanism {
    constructor(gun) {
        super(gun);
        this.chargePercent = 0;
        this.chargePercentGainPerTick = 10;
        this.currentTick = 0;
        this.maxTickTime = 0.2;
        this.canShoot = false;
    }

    firingUpdate(weapon, player, entityManager, deltaTime) {
        super.firingUpdate(weapon, player, entityManager, deltaTime);
        if (weapon.currentFireTime <= 0 && weapon.canFire) {
            if (this.holdingDownFireButton) {
                if (!this.canShoot) {
                    this.chargePercent += this.chargePercentGainPerTick;
                }
                this.canShoot = true;
                if (this.chargePercent < 100) {
                    if (this.currentTick >= this.maxTickTime) {
                        this.currentTick = 0;
                        this.chargePercent += this.chargePercentGainPerTick;
                    }
                } else {
                    this.chargePercent = 100;
                    this.currentTick = 0;
                }
                this.currentTick += deltaTime;
            } else {
                if (this.canShoot) {
                    this.canShoot = false;
                    this.doSingleFire(weapon, player, entityManager, deltaTime);
                    this.currentTick = 0;
                }
                this.chargePercent = 0;
            }
        }
    }
}

class HadronRailGun extends HitScanWeapon {
    static MAX_DAMAGE = 95;
    static _ = (() => {
        HadronRailGun.setMaxRange(640);
        HadronRailGun.addDynamicValues("scanHitPos", "chargePercent");
        HadronRailGun.assignWeaponClassAbilities(HadronRailGun.ModAbilityClass, HadronRailGun.SuperAbilityClass, FMPartialChargeShot);
        HadronRailGun.overrideAttackStats(2.2, 7, 60, 1, 0,0,
            0, 1);
    })();

    constructor(x, y) {
        super(x, y);
        this.chargePercent = 0;
    }

    updateWhenEquipped(player, entityManager, deltaTime) {
        super.updateWhenEquipped(player, entityManager, deltaTime);
        this.chargePercent = this.firerer.chargePercent;
    }

    onEntityHit(entity, entityManager, angle) {
        Damage.inflict(this.getOwner(), entity, entityManager, this.firerer.chargePercent / 100 * HadronRailGun.MAX_DAMAGE | 0);
    }
}

module.exports = HadronRailGun;