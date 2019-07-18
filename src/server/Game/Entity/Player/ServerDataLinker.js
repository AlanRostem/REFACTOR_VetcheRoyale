const Alive = require("../Traits/Alive.js");

// Abstract class composition of miscellaneous
// server based data given to the player by
// certain events.
class GameDataLinker extends Alive {
    constructor(client, x, y, w, h, HP, regenCoolDown) {
        super(x, y, w, h, HP, regenCoolDown);
        this.defineSocketEvents(client);
    }


    defineSocketEvents(client) {

    }
}

module.exports = GameDataLinker;