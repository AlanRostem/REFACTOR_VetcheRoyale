import SpriteSheet from "./SpriteSheet.js";
import R from "../../../Graphics/Renderer.js";
import AssetManager from "../../AssetManager.js"

export default class TileSheet extends SpriteSheet {
    constructor(src, tileSize, map) {
        super(src);
        this.tileSize = tileSize;
        AssetManager.addDownloadCallback(() => {
            this.tilesPerRow = (this.img.width / tileSize) | 0;
            this.image = this.paintImage(map);
        });
    }

    paintImage(map) {
        var canvas = document.createElement('canvas');
        canvas.width = map.w * this.tileSize;
        canvas.height = map.h * this.tileSize;
        var ctx = canvas.getContext('2d');
        for (var y = 0; y <= map.h; y++) {
            for (var x = 0; x <= map.w; x++) {
                if (map.getID(x, y) > map.dontDrawID && map.withinRange(x, y)) {
                    var tile = map.getID(x, y) - 1;
                    var tileRow = Math.floor(tile / this.tilesPerRow);
                    var tileCol = Math.floor(tile % this.tilesPerRow);
                    this.drawCropped(
                        (x * this.tileSize + R.camera.boundPos.x),
                        (y * this.tileSize + R.camera.boundPos.y),
                        this.tileSize, this.tileSize,
                        (tileCol * this.tileSize), (tileRow * this.tileSize),
                        this.tileSize, this.tileSize, ctx);
                }
            }
        }
        return canvas;
    }

    draw() {
        R.context.drawImage(this.image, R.camera.boundPos.x, R.camera.boundPos.y);
        /*
        R.context.drawImage(this.image,
            -R.camera.boundPos.x, -R.camera.boundPos.y, R.screenSize.x | 0, R.screenSize.y | 0, 0, 0, R.screenSize.x | 0, R.screenSize.y | 0);
        */
    }
}