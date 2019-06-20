import TileSheet from "../AssetManager/Classes/TileSheet.js";

export default class CTileMap {
    constructor() {
        this.array = mappu; // TODO: Remove test and improve
        this.w = 480;
        this.h = 272;
        this.dontDrawID = 0;
    }

    getID(x, y) {
        return this.array[x + this.w * y];
    }

    withinRange(x, y) {
        return x >= 0 && x <= this.w && y >= 0 && y <= this.h;
    }
}