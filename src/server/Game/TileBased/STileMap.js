var typeCheck = require("../../../shared/code/Debugging/StypeCheck.js");
var Tile = require("./Tile.js");
var JSONFile = require("../../ResourceManagement/SJSONFile.js");

// Specify global file path relative to app.js
// for the JSON tile map file
class TileMap {
    constructor(src) {
        var json = new JSONFile(__dirname + "../../../../" + src);
        this.array = json.get().layers[0].data;
        this.w = json.get().width;
        this.h = json.get().height;
        this.types = {
            PASS: 0, // TODO: Remove test values
            SOLID: 17 // TODO: Remove test values
        };
    }

    withinRange(x, y) {
        return x >= 0 && x <= this.w && y >= 0 && y <= this.h;
    }

    getID(cx, cy) {
        return this.array[cy * this.w + cx]
    }

    isSolid(id) {
        return id < this.types.SOLID && id !== 0;
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