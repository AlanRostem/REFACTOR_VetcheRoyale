import TileSheet from "../AssetManager/Classes/TileSheet.js";

export default class CTileMap {
    constructor() {
        this.t_array = mappu;
        this.w = 480;
        this.h = 272;
        this.dontDrawID = 0;
    }

    getID(x, y) {
        return this.t_array[x + this.w * y];
    }

    withinRange(x, y) {
        return x >= 0 && x <= this.w && y >= 0 && y <= this.h;
    }
}