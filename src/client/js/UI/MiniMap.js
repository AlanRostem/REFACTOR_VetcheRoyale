import R from "../Graphics/Renderer.js";
import UIElement from "./UIElement.js";
import AssetManager from "../AssetManager/AssetManager.js";
import ObjectNotationMap from "../../../shared/code/DataStructures/CObjectNotationMap.js";

export default class MiniMap extends UIElement {
    constructor() {
        super("minimap", R.WIDTH - 33, 1, 1, 1);
        this.p_Pos = {_x: 0, _y: 0};
        this.tiles = 32;

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
            tileSizeW: (tileMap.w / this.tiles),
            tileSizeH: (tileMap.h / this.tiles)
        };

        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        canvas.width = this.tiles * 8;
        canvas.height = this.tiles * 8;

        for (var k = 0; k < this.tiles; k++) {
            map.array.push(new Array(this.tiles).fill(0))
        }
        console.log(map);

        for (var i = 0; i < tileMap.h; i++) {
            for (var j = 0; j < tileMap.w; j++) {
                if (tileMap.array[i * tileMap.w + j] !== 0) {
                    map.array[i / map.tileSizeH | 0][j / map.tileSizeW | 0] += 1;
                }
            }
        }

        for (var y = 0; y < this.tiles; y++) {
            for (var x = 0; x < this.tiles; x++) {
                ctx.save();
                ctx.fillStyle = "#ffffff";
                if (map.array[y][x] >= Math.floor(map.tileSizeW) * Math.floor(map.tileSizeH))
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

        return {canvas: canvas, mapInfo: map};
    }


    posOnMap(pos) {
        return {
            _x: pos._x / this.images.get(Scene._currentMap).mapInfo.tileSizeW / 8 | 0,
            _y: pos._y / this.images.get(Scene._currentMap).mapInfo.tileSizeH / 8 | 0
        }
    }


    update(client, entityList) {
        this.pos.x = R.WIDTH - 33;
        if (client.player)
            this.p_Pos = this.posOnMap(client.player._output._pos);
    }

    draw() {
        R.ctx.drawImage(
            this.images.get(Scene._currentMap).canvas,
            this.pos.x,
            this.pos.y,
            this.tiles * 8,
            this.tiles * 8
        );

        R.drawRect(
            "Red",
            this.pos.x + this.p_Pos._x,
            this.pos.y + this.p_Pos._y,
            1,
            1
        )
    }
}


