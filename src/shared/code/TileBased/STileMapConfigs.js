const JSONFile = require("../../../server/ResourceManagement/SJSONFile.js");
const TileMap = require("../../../server/Game/TileBased/STileMap.js");

// Stores all configurations of tile maps.
// Each configuration holds the 8-bit uint
// array and the width and height.

const TileMapConfigs = {
    _maps: {},
    createFromJSON(name, src) {
        this._maps[name] = new TileMap(name, src);
    },
    setup() {
        this.createFromJSON("lobby", "src/shared/res/tilemaps/lobby.json");
        this.createFromJSON("MegaMap", "src/shared/res/tilemaps/MegaMap.json");
    },
    getMap(name) {
        return this._maps[name];
    }
};

TileMapConfigs.setup();

module.exports = TileMapConfigs;