import R from "../Graphics/Renderer.js";
import UIElement from "./UIElement.js";
import AssetManager from "../AssetManager/AssetManager.js"


export default class MiniMap extends UIElement {
    constructor(tileMap) {
        super("minimap", R.WIDTH - 33, 1, 1, 1);
        this.tiles = 32;
        this.p_Pos = {_x: 0, _y: 0};
        this.updateMap(tileMap);
    }

    updateMap(tileMap){
        this.map = [];
        this.tileSizeW = tileMap.w / this.tiles;
        this.tileSizeH = tileMap.h / this.tiles;

        for (var k = 0; k < this.tiles; k++) {
            this.map.push(new Array(this.tiles).fill(0))
        }

        for (var i = 0; i < tileMap.h; i++) {
            for (var j = 0; j < tileMap.w; j++) {
                if (tileMap.array[i * tileMap.w + j] !== 0)
                    this.map[i / this.tileSizeH | 0][j / this.tileSizeW | 0] += 1;
            }
        }

        AssetManager.addDownloadCallback(() => {
            this.image = this.paintImage(this.map);
        });
    }


    paintImage(map) {
        var canvas = document.createElement('canvas');
        canvas.width = this.tiles * 8;
        canvas.height = this.tiles * 8;
        var ctx = canvas.getContext('2d');

        for (var y = 0; y < this.tiles; y++) {
            for (var x = 0; x < this.tiles; x++) {
                ctx.save();
                ctx.fillStyle = "#ffffff";
                if (map[y][x] >= this.tileSizeW * this.tileSizeH / 1.07)
                    ctx.fillStyle = "#222034";
                ctx.fillRect(
                    (this.width * x) | 0,
                    (this.height * y) | 0,
                    this.width,
                    this.height
                );
                ctx.restore();
            }
        }
        return canvas;
    }


    update(client, entityList) {
        this.pos.x = R.WIDTH - 33;
        if (client.player) {
            this.p_Pos = client.player._output._pos;
        }
    }

    draw() {

        R.ctx.drawImage(this.image, this.pos.x, this.pos.y, this.tiles * 8, this.tiles * 8);
    }

}


