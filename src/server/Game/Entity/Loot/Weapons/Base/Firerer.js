const ONMap = require("../../../../../../shared/code/DataStructures/SObjectNotationMap.js");

class Firerer {
    constructor() {
        this._modes = {
            "charge": false,
            "burst": false,
        }
    }

    update(weapon, player, entityManager, deltaTime) {
        this.firingUpdate(weapon, player, entityManager, deltaTime);
    }

    firingUpdate(weapon, player, entityManager, deltaTime) {
        // Can spam the mouse but the weapon always fires at the
        // same designated rate of fire.
        if (weapon._currentFireTime > 0) {
            weapon._currentFireTime -= deltaTime;
        }



        // Checks for mouse down and fires automatically when
        // clip size is more than zero. Otherwise it reloads.
        if (player.input.mouseHeldDown(1)) {
            if (weapon._currentFireTime <= 0 && !weapon._reloading) {
                weapon._currentFireTime = (1 / deltaTime) / weapon._fireRate;

                if (this._modes["charge"]) {

                } else {
                    if (weapon._currentAmmo >= weapon._ammoPerShot) {
                        weapon.fire(player, entityManager, deltaTime);
                        weapon._currentAmmo -= weapon._ammoPerShot;
                    } else if (player.inventory.ammo > 0) {
                        weapon.activateReloadAction();
                    }
                }
            }
        }
    }

}


module.exports = Firerer;