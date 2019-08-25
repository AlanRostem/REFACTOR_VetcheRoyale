const ONMap = require("../../../../../../shared/code/DataStructures/SObjectNotationMap.js");

function randMinMax(min, max) {
    return (Math.random() * (max - min)) + min;
}

class Firerer {
    constructor(chargeTime = 0, burstCount = 0, burstDelay = 0, spread = 0, recoil = 0, accurator = 0) {
        this._chargeTime = chargeTime;
        this._maxChargeTime = chargeTime;

        this._maxBurstCount = burstCount;
        this._burstCount = burstCount;

        this._maxBurstDelay = burstDelay;
        this._burstDelay = burstDelay;

        this._defaultSpread = spread;
        this._recoil = recoil;
        this._accurator = accurator;
        this._currentRecoil = 0;
    }

    update(weapon, player, entityManager, deltaTime) {
        this.firingUpdate(weapon, player, entityManager, deltaTime);
    }

    getRecoilAngle(weapon, player, deltaTime) {
        this._currentRecoil += this._recoil;
        return (
            player.input.mouseData.angleCenter
            + randMinMax(-this._defaultSpread / 2, this._defaultSpread / 2)
            + randMinMax(-this._currentRecoil / 2, this._currentRecoil / 2)
        );
    }

    doSingleFire(weapon, player, entityManager, deltaTime) {
        let angle = this.getRecoilAngle(weapon, player, deltaTime);
        if (weapon._currentAmmo >= weapon._ammoPerShot) {
            weapon.fire(player, entityManager, deltaTime, angle);
            weapon._firing = true;
            weapon._currentAmmo -= weapon._ammoPerShot;
        } else if (player.inventory.ammo > 0) {
            weapon.activateReloadAction();
        }
        return angle;
    }

    firingUpdate(weapon, player, entityManager, deltaTime) {
        weapon._firing = false;
        // Can spam the mouse but the weapon always fires at the
        // same designated rate of fire.
        if (!this._queueBurst) {
            if (weapon._currentFireTime > 0) {
                weapon._currentFireTime -= deltaTime;
            }
        }

        // Checks for mouse down and fires automatically when
        // clip size is more than zero. Otherwise it reloads.
        if (player.input.mouseHeldDown(1)) {

            weapon.onFireButton(entityManager, deltaTime);
            weapon._holdingDownFireButton = true;
            if (weapon._canFire && !this._queueBurst) {
                if (this._maxChargeTime > 0) { // Check if we have charge mode on
                    if (this._chargeTime > 0) {
                        this._chargeTime -= deltaTime;
                    } else {
                        this._chargeTime = this._maxChargeTime;
                        if (this._maxBurstCount > 0) { // Check if we have burst mode on
                            this._queueBurst = true;
                        } else {
                            this.doSingleFire(weapon, player, entityManager, deltaTime);
                        }
                        weapon._currentFireTime = 60 / weapon._fireRate;
                    }
                } else {
                    if (weapon._currentFireTime <= 0 && !weapon._reloading) {
                        if (this._maxBurstCount > 0) {  // Check if we have burst mode on
                            this._queueBurst = true;
                        } else {
                            this.doSingleFire(weapon, player, entityManager, deltaTime);
                        }
                        weapon._currentFireTime = 60 / weapon._fireRate;
                    }
                }
            } else if (weapon._currentAmmo === 0 && player.inventory.ammo > 0){
                weapon.activateReloadAction()
            }
        }



        if (this._queueBurst) {
            if (this._burstDelay > 0) {
                this._burstDelay -= deltaTime;
            } else {
                this._burstDelay = this._maxBurstDelay;
                if (this._burstCount > 0) {
                    this._burstCount--;
                    this.doSingleFire(weapon, player, entityManager, deltaTime);
                } else {
                    this._queueBurst = false;
                    this._burstCount = this._maxBurstCount;
                }
            }
        }

        if (!this._firing) {
            if (this._currentRecoil > 0) {
                this._currentRecoil -= this._accurator;
            } else {
                this._currentRecoil = 0;
            }
        }

        if (weapon._reloading) {
            this._currentRecoil = 0;
        }

        if (!player.input.mouseHeldDown(1)) {
            weapon._holdingDownFireButton = false;
            if (this._maxChargeTime > 0) {
                if (this._chargeTime < this._maxChargeTime) {
                    this._chargeTime += deltaTime / 4;
                }
            }
        }

        weapon._spreadAngle = this._currentRecoil + this._defaultSpread;
    }

}


module.exports = Firerer;