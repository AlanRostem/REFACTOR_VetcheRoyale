const ONMap = require("../../../../../../shared/code/DataStructures/SObjectNotationMap.js");

function randMinMax(min, max) {
    return (Math.random() * (max - min)) + min;
}

class FiringMechanism {
    constructor(gun) {
        let stats = gun.constructor.AttackStats;
        this.maxFireRate = stats.FIRE_RATE_RPM;
        this.currentRecoil = 0;
        this.holdingDownFireButton = false;
    }

    update(weapon, player, entityManager, deltaTime) {
        this.firingUpdate(weapon, player, entityManager, deltaTime);
    }

    increaseRecoilAndGet(weapon, player, deltaTime) {
        this.currentRecoil += weapon.constructor.AttackStats.RECOIL;
        return (
            player.input.mouseData.angleCenter
            + randMinMax(-weapon.constructor.AttackStats.SPREAD / 2, weapon.constructor.AttackStats.SPREAD / 2)
            + randMinMax(-this.currentRecoil / 2, this.currentRecoil / 2)
        );
    }

    doSingleFire(weapon, player, entityManager, deltaTime) {
        let angle = this.increaseRecoilAndGet(weapon, player, deltaTime);
        if (weapon.currentAmmo >= weapon.constructor.AttackStats.AMMO_USE_PER_SHOT) {
            weapon.fire(player, entityManager, deltaTime, angle);
            weapon.firing = true;
            weapon.currentAmmo -= weapon.constructor.AttackStats.AMMO_USE_PER_SHOT;
            weapon.currentFireTime = 60 / this.maxFireRate;
        } else if (player.inventory.ammo > 0 && !weapon.reloading) {
            weapon.activateReloadAction();
        }
        return angle;
    }

    // Extendable
    firingUpdate(weapon, player, entityManager, deltaTime) {
        weapon.firing = false;
        // Can spam the mouse but the weapon always fires at the
        // same designated rate of fire.
        if (weapon.currentFireTime > 0) {
            weapon.currentFireTime -= deltaTime;
        }

        // Checks for mouse down and fires automatically when
        // clip size is more than zero. Otherwise it reloads.
        if (player.input.mouseHeldDown(1)) {

            weapon.onFireButton(entityManager, deltaTime);
            weapon.holdingDownFireButton = true;
            this.holdingDownFireButton = true;
            if (weapon.canFire && weapon.currentFireTime <= 0) {
                this.onCanFire(weapon, player, entityManager, deltaTime);
            }
        } else  {
            this.holdingDownFireButton = false;
        }

        if (weapon.currentAmmo === 0 && player.inventory.ammo > 0 && !weapon.reloading) {
            weapon.activateReloadAction()
        }

        if (!weapon.firing) {
            if (this.currentRecoil > 0) {
                this.currentRecoil -= weapon.constructor.AttackStats.BLOOM_REGULATOR;
            } else {
                this.currentRecoil = 0;
            }
        }

        if (weapon.reloading) {
            this.currentRecoil = 0;
        }

        weapon.spreadAngle = this.currentRecoil + weapon.constructor.AttackStats.SPREAD;
    }

    reset() {
        this.currentRecoil = 0;
    }

    // Overridable
    onCanFire(weapon, player, entityManager, deltaTime) {

    }
}


module.exports = FiringMechanism;