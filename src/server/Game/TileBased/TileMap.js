var typeCheck = require("../../../shared/Debugging/StypeCheck.js");
var Tile = require("./Tile.js");

class TileMap {
    constructor(w = 240, h = 136) {
        this._array = new Uint8Array();
        this.w = w;
        this.h = h;
        this.types = {
            PASS: 0, // TODO: Remove test values
            SOLID: 17 // TODO: Remove test values
        };
    }

    withinRange(x, y) {
        return x >= 0 && x <= this.w && y >= 0 && y <= this.h;
    }

    getID(cx, cy) {
        return this._array[cy * this.w + cx]
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
        typeCheck.instance(Uint8Array, arr);
        this._array = Uint8Array.from(arr);
    }
}

module.exports = TileMap;