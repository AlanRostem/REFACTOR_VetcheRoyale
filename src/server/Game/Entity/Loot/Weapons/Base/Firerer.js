const ONMap = require("../../../../../../shared/code/DataStructures/SObjectNotationMap.js");

function randMinMax(min, max) {
    return (Math.random() * (max - min)) + min;
}

class Firerer {
    constructor(chargeTime = 0, burstCount = 0, burstDelay = 0, spread = 0, recoil = 0, accurator = 0) {
        this.chargeTime = chargeTime;
        this.maxChargeTime = chargeTime;

        this.maxBurstCount = burstCount;
        this.burstCount = burstCount;

        this.maxBurstDelay = burstDelay;
        this.burstDelay = burstDelay;

        this.defaultSpread = spread;
        this.recoil = recoil;
        this.accurator = accurator;
        this.currentRecoil = 0;
    }

    update(weapon, player, entityManager, deltaTime) {
        this.firingUpdate(weapon, player, entityManager, deltaTime);
    }

    getRecoilAngle(weapon, player, deltaTime) {
        this.currentRecoil += this.recoil;
        return (
            player.input.mouseData.angleCenter
            + randMinMax(-this.defaultSpread / 2, this.defaultSpread / 2)
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
                if (this.maxChargeTime > 0) { // Check if we have charge mode on
                    if (this.chargeTime > 0) {
                        this.chargeTime -= deltaTime;
                    } else {
                        this.chargeTime = this.maxChargeTime;
                        if (this.maxBurstCount > 0) { // Check if we have burst mode on
                            this.queueBurst = true;
                        } else {
                            this.doSingleFire(weapon, player, entityManager, deltaTime);
                        }
                        weapon.currentFireTime = 60 / weapon.fireRate;
                    }
                } else {
                    if (weapon.currentFireTime <= 0 && !weapon.reloading) {
                        if (this.maxBurstCount > 0) {  // Check if we have burst mode on
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
                this.burstDelay = this.maxBurstDelay;
                if (this.burstCount > 0) {
                    this.burstCount--;
                    this.doSingleFire(weapon, player, entityManager, deltaTime);
                } else {
                    this.queueBurst = false;
                    this.burstCount = this.maxBurstCount;
                }
            }
        }

        if (!this.firing) {
            if (this.currentRecoil > 0) {
                this.currentRecoil -= this.accurator;
            } else {
                this.currentRecoil = 0;
            }
        }

        if (weapon.reloading) {
            this.currentRecoil = 0;
        }

        if (!player.input.mouseHeldDown(1)) {
            weapon.holdingDownFireButton = false;
            if (this.maxChargeTime > 0) {
                if (this.chargeTime < this.maxChargeTime) {
                    this.chargeTime += deltaTime / 4;
                }
            }
        }

        weapon.spreadAngle = this.currentRecoil + this.defaultSpread;
    }

    reset() {
        this.currentRecoil = 0;
        this.burstCount = 0;
        this.chargeTime = 0;
    }

}


module.exports = Firerer;