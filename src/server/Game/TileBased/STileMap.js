const Tile = require("./Tile.js");
const JSONFile = require("../../ResourceManagement/SJSONFile.js");
const EntitySpawnerLocator = require("./Spawning/TileSpawnPositionList.js");
const TileCollider = require("./TileCollider.js");

// Specify global file path relative to app.js
// for the JSON tile map file
class TileMap {
    constructor(name, res) {
        this.array = res[name]["array"];
        this.w = res[name]["width"];
        this.h = res[name]["height"];
        this.tileSize = Tile.SIZE;
        this.name = name;
        this.spawner = new EntitySpawnerLocator(this);
    }

    withinRange(x, y) {
        return x >= 0 && x <= this.w && y >= 0 && y <= this.h;
    }

    getID(cx, cy) {
        return this.array[cy * this.w + cx]
    }

    get width() {
        return this.w;
    }

    get height() {
        return this.h;
    }

    set array(arr) {
        this._array = Uint8Array.from(arr);
    }

    get array() {
        return this._array;
    }
}

module.exports = TileMap;