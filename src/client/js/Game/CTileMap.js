import TileSheet from "../AssetManager/Classes/Graphical/TileSheet.js";
import JSONFile from "../AssetManager/Classes/Text/JSONFile.js"

export default class CTileMap {
    constructor() {
        var _this = this;
        this.json = new JSONFile("tilemaps/MegaMap.json", object => {
            _this.array = object.layers[0].data;
        });
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