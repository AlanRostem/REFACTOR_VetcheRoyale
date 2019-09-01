const GameWorld = require("../../GameWorld.js");
const TileMapConfigs = require("../../../../../shared/code/TileBased/STileMapConfigs.js");

module.exports = class PlayGround extends GameWorld {
    constructor(serverSocket) {
        super(serverSocket, "playground", 64, false, TileMapConfigs.getMap("lobby"));

    }
};