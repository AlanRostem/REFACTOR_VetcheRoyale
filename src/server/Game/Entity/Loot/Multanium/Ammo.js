const Bottle = require("./Bottle.js");

/**
 * Ammunition loot object. Adds ammo to the player's inventory when picked up.
 */
class Ammo extends Bottle {
    static _ = (() => {
        Ammo.addStaticValues(
            "type",
            "count");
    })();

    static TYPE = "ammo";

    constructor(x, y, count = 24 /* cus dome 24 xD*/) {
        super(x, y);
        this.count = count;
        this.type = Ammo.TYPE;
    }

    /*
     * Add ammo count to player inventory.
     * @param inventory {Inventory} The given player inventory
     */
    addToInventory(inventory) {
        inventory.ammo += this.count;
    }
}

module.exports = Ammo;