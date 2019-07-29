import JSONFile from "../../AssetManager/Classes/Text/CJSONFile.js"
import TileSheet from "../../AssetManager/Classes/Graphical/TileSheet.js";
import AssetManager from "../../AssetManager/AssetManager.js"

// Tile map class for the client.
export default class CTileMap {
    constructor(jsonSrc, imgSrc) {
        var _this = this;
        this.json = new JSONFile(jsonSrc, object => {
            _this.array = object.layers[0].data;
            _this.w = object.width;
            _this.h = object.height;
            _this.tileSheet = new TileSheet(imgSrc, 8, _this);
        });
        AssetManager.addDownloadCallback(() => {
        });
        this.dontDrawID = 0;
    }

    draw() {
        if (this.tileSheet) {
            this.tileSheet.draw();
        }
    }

    getID(x, y) {
        return this.array[x + this.w * y];
    }

    withinRange(x, y) {
        return x >= 0 && x <= this.w && y >= 0 && y <= this.h;
    }
}