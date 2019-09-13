import JSONFile from "../../AssetManager/Classes/Text/CJSONFile.js"
import TileSheet from "../../AssetManager/Classes/Graphical/TileSheet.js";
import AssetManager from "../../AssetManager/AssetManager.js"

/**
 * Tile map class for the client. It reads the shared .json file for the tile map
 * that the server also has access to.
 */
class CTileMap {
    constructor(jsonSrc, imgSrc, name) {
        var _this = this;
        this.name = name;
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

    /**
     * Draws the entire tile map on the canvas in the game loop.
     */
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

    isSolid(id) {
        return id < 17 && id !== 0;
    }
}

export default CTileMap;