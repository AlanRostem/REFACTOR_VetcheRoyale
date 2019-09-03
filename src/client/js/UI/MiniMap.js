import R from "../Graphics/Renderer.js";
import UIElement from "./UIElement.js";
import AssetManager from "../AssetManager/AssetManager.js";
import CClient from "../Networking/Client/CClient.js";


export default class MiniMap extends UIElement {
    constructor() {
        super("minimap", R.WIDTH - 36, 4, 1, 1);
        this.pPos = {x: 0, y: 0};
        this.tiles = 32;
        this.events = [];
        AssetManager.addDownloadCallback(() => {
            for (var key in Scene.tileMaps.getAllMaps()) {
                var tileMap = Scene.tileMaps.getAllMaps()[key];
                AssetManager.addPainting(this.paintImage(tileMap), tileMap.name);
            }
        });
    }


    paintImage(tileMap) {
        var map = {
            name: tileMap.name,
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

        var x = pos.x / 8 / this.image.mapInfo.tileSizeW | 0;
        var y = pos.y / 8 / this.image.mapInfo.tileSizeH | 0;

        return {x: x, y: y};
    }


    update(deltaTime, client, entityList) {
        this.pos.x = R.WIDTH - 36;

        if (this.image === undefined || this.image.mapInfo.name !== Scene.currentMap)
            this.image = AssetManager.get(Scene.currentMap);

        if (client.player)
            this.pPos = this.posOnMap(client.player.output.pos);

    }

    draw() {
        R.ctx.drawImage(
            this.image.canvas,
            this.pos.x,
            this.pos.y,
            this.tiles * 8,
            this.tiles * 8
        );

        R.drawRect(
            "Red",
            this.pos.x + this.pPos.x,
            this.pos.y + this.pPos.y,
            1,
            1
        );

        for (var e of this.events) {
            R.drawRect(
                e.color,
                this.pos.x + e.x | 0,
                this.pos.y + e.y | 0,
                1,
                1
            );
        }
    }
}


