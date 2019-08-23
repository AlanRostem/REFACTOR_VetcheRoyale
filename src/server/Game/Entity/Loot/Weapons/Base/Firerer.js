const ONMap = require("../../../../../../shared/code/DataStructures/SObjectNotationMap.js");

class Firerer {
    constructor() {

    }

    update(weapon, player, entityManager, deltaTime) {
        this.autoFireMode(weapon, player, entityManager, deltaTime);
    }

    autoFireMode(weapon, player, entityManager, deltaTime) {
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
                if (weapon._currentAmmo >= weapon._ammoPerShot) {
                    weapon.fire(player, entityManager, deltaTime);
                    weapon._currentAmmo -= weapon._ammoPerShot;
                } else if (player.inventory.ammo > 0) {
                    weapon.activateReloadAction();
                }
            }
        }
    }

    chargeFireMode(weapon, player, entityManager, deltaTime) {
        if (player.input.mouseHeldDown(1)) {

        }
    }
}


module.exports = Firerer;