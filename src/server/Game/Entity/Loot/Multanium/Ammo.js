const Bottle = require("./Bottle.js");

class Ammo extends Bottle {
    constructor(x, y, count = 24 /* cus dome 24 xD*/) {
        super(x, y);
        this.count = count;
        this.type = "ammo";
        this.addStaticSnapShotData([
            "type",
            "count"
        ]);
    }

    // Add ammo count to player inventory
    addToInventory(inventory) {
        inventory.ammo += this.count;
    }
}

module.exports = Ammo;