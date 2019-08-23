const ONMap = require("../../../../../../shared/code/DataStructures/SObjectNotationMap.js");

class Firerer {
    constructor(chargeTime = 0, burstCount = 0, burstDelay = 0) {
        this._chargeTime = chargeTime;
        this._maxChargeTime = chargeTime;

        this._maxBurstCount = burstCount;
        this._burstCount = burstCount;

        this._maxBurstDelay = burstDelay;
        this._burstDelay = burstDelay;
    }

    update(weapon, player, entityManager, deltaTime) {
        this.firingUpdate(weapon, player, entityManager, deltaTime);
    }

    doSingleFire(weapon, player, entityManager, deltaTime) {
        if (weapon._currentAmmo >= weapon._ammoPerShot) {
            weapon.fire(player, entityManager, deltaTime);
            weapon._currentAmmo -= weapon._ammoPerShot;
        } else if (player.inventory.ammo > 0) {
            weapon.activateReloadAction();
        }
    }

    firingUpdate(weapon, player, entityManager, deltaTime) {
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
            if (this._maxChargeTime > 0) { // Check if we have charge mode on
                if (this._chargeTime > 0) {
                    this._chargeTime -= deltaTime;
                } else {
                    this._chargeTime = this._maxChargeTime;
                    if (this._burstCount > 0) {
                        this._queueBurst = true;
                    } else {
                        this.doSingleFire(weapon, player, entityManager, deltaTime);
                    }
                }
            } else {
                if (weapon._currentFireTime <= 0 && !weapon._reloading) {
                    if (this._burstCount > 0) {
                        this._queueBurst = true;
                    } else {
                        this.doSingleFire(weapon, player, entityManager, deltaTime);
                    }
                    weapon._currentFireTime = (1 / deltaTime) / weapon._fireRate;
                }
            }
        } else {
            if (this._maxChargeTime > 0) {
                if (this._chargeTime < this._maxChargeTime) {
                    this._chargeTime += deltaTime / 4;
                }
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
    }

}


module.exports = Firerer;