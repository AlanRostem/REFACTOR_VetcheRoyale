const Loot = require("../Loot.js");

/**
 * Base class for the bottle. This holds what type of bottle it is for visual purposes on the client side.
 */
class Bottle extends Loot {
    constructor(x, y) {
        super(x, y, true);
        this.snapShotGenerator.snapShot.entityType = "Bottle";
        this.type = "none";
    }
}

module.exports = Bottle;