const Alive = require("../Traits/Alive.js");

// Abstract class composition of miscellaneous
// server based data given to the player by
// certain events.
class GameDataLinker extends Alive {
    constructor(client, x, y, w, h, HP, regenCoolDown) {
        super(x, y, w, h, HP, regenCoolDown);
        this._gameData = {};
        this.addStaticSnapShotData([
            "_gameData"
        ]);
        this.defineSocketEvents(client);
    }

    defineSocketEvents(client) {

    }

    retrieveGameData(game) {
        this._gameData.mapName = game.tileMap.name;
    }

    update(entityManager, deltaTime) {
        this.retrieveGameData(entityManager);
        super.update(entityManager, deltaTime);
    }
}

module.exports = GameDataLinker;