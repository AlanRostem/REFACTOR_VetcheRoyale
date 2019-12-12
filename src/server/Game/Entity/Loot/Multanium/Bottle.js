const Loot = require("../Loot.js");

/**
 * Base class for the bottle. This holds what type of bottle it is for visual purposes on the client side.
 */
class Bottle extends Loot {
    static TYPE = "none";
    static NAME = "Bottle";
    constructor(x, y) {
        super(x, y, true);
        this.snapShotGenerator.snapShot.entityType = Bottle.NAME;
        this.type = Bottle.TYPE;
    }
}

module.exports = Bottle;