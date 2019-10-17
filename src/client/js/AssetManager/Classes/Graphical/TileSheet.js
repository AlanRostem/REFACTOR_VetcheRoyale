import SpriteSheet from "./SpriteSheet.js";
import R from "../../../Graphics/Renderer.js";
import AssetManager from "../../AssetManager.js"

/**
 * Takes a tile map and tile sheet then draws the entire tile map.
 * @memberOf ClientSide

 */
class TileSheet extends SpriteSheet {
    /**
     * @param src {string} - Tile sheet image source from AssetManager
     * @param tileSize {number} - Tile size
     * @param map {CTileMap} - Tile map object
     * @see AssetManager
     * @see CTileMap
     */
    constructor(src, tileSize, map) {
        super(src);
        this.tileSize = tileSize;
        this.name = map.name;
        AssetManager.addSpriteCreationCallback(() => {
            this.tilesPerRow = (this.img.width / tileSize) | 0;
            this.paintImage(map);
        });
    }

    /**
     * Generate a new image out of the tile map array using the tile set image
     * @param map {CTileMap} - Tile map object
     * @returns {HTMLCanvasElement}
     */
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
                        (tileCol * this.tileSize), (tileRow * this.tileSize),
                        this.tileSize, this.tileSize,
                        x * this.tileSize,
                        y * this.tileSize,
                        this.tileSize, this.tileSize,
                        ctx);
                }
            }
        }

        this.image = canvas;
        AssetManager.setMapImage(this.name, canvas);
    }

    /**
     * Draw the image to the main canvas
     */
    draw() {
        if (this.image)
            R.context.drawImage(this.image, R.camera.displayPos.x, R.camera.displayPos.y);
    }
}

export default TileSheet;