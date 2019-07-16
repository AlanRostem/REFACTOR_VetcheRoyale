import TileSheet from "../AssetManager/Classes/Graphical/TileSheet.js";
import JSONFile from "../AssetManager/Classes/Text/CJSONFile.js"

export default class CTileMap {
    constructor() {
        var _this = this;
        this.json = new JSONFile("tilemaps/lobby.json", object => {
            _this.array = object.layers[0].data;
            _this.w = object.width;
            _this.h = object.height;
        });
        this.dontDrawID = 0;
    }

    getID(x, y) {
        return this.array[x + this.w * y];
    }

    withinRange(x, y) {
        return x >= 0 && x <= this.w && y >= 0 && y <= this.h;
    }
}