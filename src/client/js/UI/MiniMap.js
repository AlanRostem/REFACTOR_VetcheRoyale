import R from "../Graphics/Renderer.js";
import UIElement from "./UIElement.js";
import AssetManager from "../AssetManager/AssetManager.js"


export default class MiniMap extends UIElement {
    constructor(tileMap) {
        super("minimap", R.WIDTH - 33, 1, 1, 1);
        this.tiles = 32;
        this.tileSizeW = tileMap.w / this.tiles;
        this.tileSizeH = tileMap.h / this.tiles;
        this.toggle = true;
        this.p_Pos = {_x: 0, _y: 0};

        this.events = {};

        this.map = [];

        this.updateMap(tileMap);
    }


    updateMap(tileMap){
        this.map = [];
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
            this.image = this.paintImage();
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
                if (this.map[y][x] >= this.tileSizeW * this.tileSizeH / 1.07)
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
        // TODO: Add toggle
        this.updateEvent();
    }

    draw() {

        var px = (this.p_Pos._x / 32) / this.tileSizeW | 0;
        var py = (this.p_Pos._y / 32) / this.tileSizeH | 0;


        R.ctx.drawImage(this.image, this.pos.x, this.pos.y, this.tiles * 8, this.tiles * 8);

        R.ctx.save();
        R.ctx.fillStyle = "red";
        R.ctx.fillRect(
            (this.pos.x + px) | 0,
            (this.pos.y + py) | 0,
            1,
            1
        );
        R.ctx.restore();


        this.drawEvent();
    }


    addEvent(name, evt, time, color) {

        var x = evt.x / (this.tileSizeW * Game.tileMap.tileSize) | 0;
        var y = evt.y / (this.tileSizeH * Game.tileMap.tileSize) | 0;

        if (this.events[name] === undefined) {
            this.events[name] = new Minimap.event(name, x, y, time, color);
        }
    }

    updateEvent() {
        for (var key in this.events) {
            var e;
            if ((e = this.events[key]) !== undefined) {
                e.update();
                if (e.time < 0) delete this.events[key];
            }
        }
    }

    drawEvent() {
        for (var key in this.events) {
            var ev = this.events[key];
            R.ctx.save();
            R.ctx.fillStyle = ev.color;
            R.ctx.fillRect(
                (this.pos.x + this.width * ev.pos.x) | 0,
                (this.pos.y + this.height * ev.pos.y) | 0,
                this.width,
                this.height
            );
            R.ctx.restore();
        }
    }
}

MiniMap.event = class {
    constructor(nvn, x, y, t, c) {
        this.name = nvn;
        this.pos = new Vector2D(x, y);
        this.color = c;
        this.time = t;
    }

    update() {
        this.time -= Game.deltaTime / 1000;
    }
};


