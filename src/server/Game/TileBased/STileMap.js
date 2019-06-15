var typeCheck = require("../../../shared/Debugging/StypeCheck.js");
var Tile = require("./Tile.js");

class STileMap {
    constructor(arr = new Uint8Array(), w = 480, h = 272) {
        this.array = arr;
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

module.exports = STileMap;