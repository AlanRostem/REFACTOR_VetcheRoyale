const JSONFile = require("../../../server/ResourceManagement/SJSONFile.js");
const TileMap = require("../../../server/Game/TileBased/STileMap.js");

// Stores all configurations of tile maps.
// Each configuration holds the 8-bit uint
// array and the width and height.

const TileMapConfigs = {
    _maps: {},
    _jsonRes: {},
    createFromJSON(name) {
        this._maps[name] = new TileMap(name, this._jsonRes);

    },
    setup() {
        this._jsonRes = new JSONFile("src/shared/res/all_tilemaps.json").get();
        this.createFromJSON("lobby");
        this.createFromJSON("MegaMap");
        this.createFromJSON("battleground");
    },
    getMap(name) {
        return this._maps[name];
    }
};

TileMapConfigs.setup();

module.exports = TileMapConfigs;