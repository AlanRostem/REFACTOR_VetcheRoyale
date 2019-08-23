import R from "../Graphics/Renderer.js";
import UIElement from "./UIElement.js";
import AssetManager from "../AssetManager/AssetManager.js";
import ObjectNotationMap from "../../../shared/code/DataStructures/CObjectNotationMap.js";

export default class MiniMap extends UIElement {
    constructor() {
        super("minimap", R.WIDTH - 33, 1, 1, 1);
        this.p_Pos = {_x: 0, _y: 0};
        this.images = new ObjectNotationMap();

        AssetManager.addDownloadCallback(() => {
            for (var key in Scene.tileMaps.getAllMaps()) {
                var tileMap = Scene.tileMaps.getAllMaps()[key];
                this.images.set(tileMap._name, this.paintImage(tileMap));
            }
        });
    }

    paintImage(tileMap) {
        var map = {
            array: [],
            tiles: 32,
            tileSizeW: 0,
            tileSizeH: 0
        };

        map.tileSizeW = tileMap.w / map.tiles;
        map.tileSizeH = tileMap.h / map.tiles;


        for (var k = 0; k < map.tiles; k++) {
            map.array.push(new Array(map.tiles).fill(0))
        }

        for (var i = 0; i < tileMap.h; i++) {
            for (var j = 0; j < tileMap.w; j++) {
                if (tileMap.array[i * tileMap.w + j] !== 0) {
                    try {
                        map.array[i / map.tileSizeH | 0][j / map.tileSizeW | 0] += 1;

                    } catch (e) {
                        console.log(i / map.tileSizeH | 0, j / map.tileSizeW | 0);
                    }
                }
            }
        }

        console.log(map.array);

        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        canvas.width = map.tiles * 8;
        canvas.height = map.tiles * 8;

        for (var y = 0; y < map.tiles; y++) {
            for (var x = 0; x < map.tiles; x++) {
                ctx.save();
                ctx.fillStyle = "#ffffff";
                if (map.array[y][x] >= map.tileSizeW * map.tileSizeH / 1.07)
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
        R.ctx.drawImage(this.images.get(Scene._currentMap), this.pos.x, this.pos.y, 32 * 8, 32 * 8);
    }
}


