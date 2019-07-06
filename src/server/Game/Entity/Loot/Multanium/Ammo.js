const Bottle = require("./Bottle.js");

class Ammo extends Bottle {
    constructor(x, y, count = 24 /* cus dome 24 xD*/) {
        super(x, y);
        this._count = count;
    }

    addToInventory(inventory) {
        inventory.ammo += this._count;
    }
}

module.exports = Ammo;