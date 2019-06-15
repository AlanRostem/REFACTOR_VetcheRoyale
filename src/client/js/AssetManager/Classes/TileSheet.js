import SpriteSheet from "./SpriteSheet.js";
import R from "../../Graphics/Renderer.js";

export default class TileSheet extends SpriteSheet {
    constructor(src, tileSize) {
        super(src);
        this.tileSize = tileSize;
        this.tilesPerRow = this.img.width / tileSize | 0;
    }

    test_draw() {
        var tile = 6;
        var tileRow = Math.floor(tile / this.tilesPerRow);
        var tileCol = Math.floor(tile % this.tilesPerRow);

        var x = 3;
        var y = 3;

        tileCol--;

        this.drawCropped(
            3, //(x * this.tileSize + R.camera.x),
            3, //(y * this.tileSize + R.camera.y),
            this.tileSize, this.tileSize,
            (tileCol * this.tileSize), (tileRow * this.tileSize),
            this.tileSize, this.tileSize);
    }

    draw(map) {
        var width = Math.floor(R.screenSize.x / this.tileSize);
        var height = Math.floor(R.screenSize.y / this.tileSize);

        var startX = Math.floor((-R.camera.boundPos.x + R.camera.offset.x) / this.tileSize - width / 2) - 1;
        var startY = Math.floor((-R.camera.boundPos.y + R.camera.offset.y) / this.tileSize - height / 2) - 1;

        var endX = startX + width + 2;
        var endY = startY + height + 2;

        //R.drawRect("yellow", startX * this.tileSize, startY * this.tileSize, this.tileSize, this.tileSize);
        //R.drawRect("yellow", endX * this.tileSize, endY  * this.tileSize, this.tileSize, this.tileSize);

        for (var y = startY; y <= endY; y++) {
            for (var x = startX; x <= endX; x++) {
                try {
                    if (map[y * map.w + x] > map.dontDrawID) {
                        var tile = map[y * map.w + x];
                        var tileRow = Math.floor(tile / this.tilesPerRow);
                        var tileCol = Math.floor(tile % this.tilesPerRow);
                        tileCol--;
                        this.drawCropped(
                            (x * this.tileSize + R.camera.boundPos.x),
                            (y * this.tileSize + R.camera.boundPos.y),
                            this.tileSize, this.tileSize,
                            (tileCol * this.tileSize), (tileRow * this.tileSize),
                            this.tileSize, this.tileSize);
                    }
                } catch(e) {}
            }
        }
    }
}