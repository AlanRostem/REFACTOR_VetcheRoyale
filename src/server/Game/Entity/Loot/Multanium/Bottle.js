const Loot = require("../Loot.js");

class Bottle extends Loot {
    constructor(x, y) {
        super(x, y, true);
    }
}

module.exports = Bottle;