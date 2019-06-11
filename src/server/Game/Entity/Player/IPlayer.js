Entity = require("../SEntity.js");

// Using this instance class to identify
// if an entity extends the player class
// in the entity manager. The problem
// was that Player included EntityManager
// while EntityManager included Player, so
// the result was this class.
class IPlayer extends Entity {
    constructor(x, y, w, h) {
        super(x, y, w, h);
    }
}

IPlayer.clientSpawnProximity = 320;

module.exports = IPlayer;