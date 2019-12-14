const ONMap = require("../../../../../../shared/code/DataStructures/SObjectNotationMap.js");

function randMinMax(min, max) {
    return (Math.random() * (max - min)) + min;
}

class Firerer {
    constructor(gun) {
        let stats = gun.constructor.AttackStats;
        this.chargeTime = stats.CHARGE_TIME;

        this.burstCount = stats.BURST_COUNT;

        this.burstDelay = stats.BURST_DELAY;

        this.currentRecoil = 0;
    }

    update(weapon, player, entityManager, deltaTime) {
        this.firingUpdate(weapon, player, entityManager, deltaTime);
    }

    getRecoilAngle(weapon, player, deltaTime) {
        this.currentRecoil += weapon.constructor.AttackStats.RECOIL;
        return (
            player.input.mouseData.angleCenter
            + randMinMax(-weapon.constructor.AttackStats.SPREAD / 2, weapon.constructor.AttackStats.SPREAD / 2)
            + randMinMax(-this.currentRecoil / 2, this.currentRecoil / 2)
        );
    }

    doSingleFire(weapon, player, entityManager, deltaTime) {
        let angle = this.getRecoilAngle(weapon, player, deltaTime);
        if (weapon.currentAmmo >= weapon.ammoPerShot) {
            weapon.fire(player, entityManager, deltaTime, angle);
            weapon.firing = true;
            weapon.currentAmmo -= weapon.ammoPerShot;
        } else if (player.inventory.ammo > 0 && !weapon.reloading) {
            weapon.activateReloadAction();
        }
        return angle;
    }

    firingUpdate(weapon, player, entityManager, deltaTime) {
        weapon.firing = false;
        // Can spam the mouse but the weapon always fires at the
        // same designated rate of fire.
        if (!this.queueBurst) {
            if (weapon.currentFireTime > 0) {
                weapon.currentFireTime -= deltaTime;
            }
        }

        // Checks for mouse down and fires automatically when
        // clip size is more than zero. Otherwise it reloads.
        if (player.input.mouseHeldDown(1)) {

            weapon.onFireButton(entityManager, deltaTime);
            weapon.holdingDownFireButton = true;
            if (weapon.canFire && !this.queueBurst) {
                if (weapon.constructor.AttackStats.CHARGE_TIME > 0) { // Check if we have charge mode on
                    if (this.chargeTime > 0) {
                        this.chargeTime -= deltaTime;
                    } else {
                        this.chargeTime = weapon.constructor.AttackStats.CHARGE_TIME;
                        if (weapon.constructor.AttackStats.BURST_COUNT > 0) { // Check if we have burst mode on
                            this.queueBurst = true;
                        } else {
                            this.doSingleFire(weapon, player, entityManager, deltaTime);
                        }
                        weapon.currentFireTime = 60 / weapon.fireRate;
                    }
                } else {
                    if (weapon.currentFireTime <= 0 && !weapon.reloading) {
                        if (weapon.constructor.AttackStats.BURST_COUNT > 0) {  // Check if we have burst mode on
                            this.queueBurst = true;
                        } else {
                            this.doSingleFire(weapon, player, entityManager, deltaTime);
                        }
                        weapon.currentFireTime = 60 / weapon.fireRate;
                    }
                }
            } else if (weapon.currentAmmo === 0 && player.inventory.ammo > 0 && !weapon.reloading){
                weapon.activateReloadAction()
            }
        }



        if (this.queueBurst) {
            if (this.burstDelay > 0) {
                this.burstDelay -= deltaTime;
            } else {
                this.burstDelay = weapon.constructor.AttackStats.BURST_DELAY;
                if (this.burstCount > 0) {
                    this.burstCount--;
                    this.doSingleFire(weapon, player, entityManager, deltaTime);
                } else {
                    this.queueBurst = false;
                    this.burstCount = weapon.constructor.AttackStats.BURST_COUNT;
                }
            }
        }

        if (!this.firing) {
            if (this.currentRecoil > 0) {
                this.currentRecoil -= weapon.constructor.AttackStats.BLOOM_REGULATOR;
            } else {
                this.currentRecoil = 0;
            }
        }

        if (weapon.reloading) {
            this.currentRecoil = 0;
        }

        if (!player.input.mouseHeldDown(1)) {
            weapon.holdingDownFireButton = false;
            if (weapon.constructor.AttackStats.CHARGE_TIME > 0) {
                if (this.chargeTime < weapon.constructor.AttackStats.CHARGE_TIME) {
                    this.chargeTime += deltaTime / 4;
                }
            }
        }

        weapon.spreadAngle = this.currentRecoil + weapon.constructor.AttackStats.SPREAD;
    }

    reset() {
        this.currentRecoil = 0;
        this.burstCount = 0;
        this.chargeTime = 0;
    }

}


module.exports = Firerer;