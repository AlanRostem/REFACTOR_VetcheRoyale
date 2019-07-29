const Loot = require("../Loot.js");

// Base class for the bottle. Holds the type
// mapped to its color on the sprite sheet.
class Bottle extends Loot {
    constructor(x, y) {
        super(x, y, true);
    }
}

module.exports = Bottle;