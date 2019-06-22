import R from "../Graphics/Renderer.js";
import UIElement from "./UIElement.js";

export default class MiniMap extends UIElement {
    constructor(tileMap) {
        super("minimap", R.WIDTH - 33, 1, 1, 1);
        this.color = "Blue";
        this.tiles = 32;
        this.tileSize = tileMap.tileSize;
        this.tileSizeW = tileMap.w / this.tiles;
        this.tileSizeH = tileMap.h / this.tiles;
        this.toggle = true;
        this.p_Pos = {_x: 0, _y:0};

        this.events = {};

        this.map = [];
        for (var k = 0; k < this.tiles; k++) {
            this.map.push(new Array(32).fill(0))
        }

        for (var i = 0; i < tileMap.h; i++) {
            for (var j = 0; j < tileMap.w; j++) {
                if (tileMap.array[i * tileMap.w + j] !== 0)
                    this.map[i / this.tileSizeH | 0][j / this.tileSizeW | 0] += 1;
            }
        }
    }

    update(client) {
        this.pos.x = R.WIDTH - 33;
        if (client.player) {
            this.p_Pos = client.player._output._pos;
        }
        // TODO: Add toggle
        this.updateEvent();
    }

    draw() {

        var px = this.p_Pos._x / (this.tileSizeW * this.tileSize) | 0;
        var py = this.p_Pos._y / (this.tileSizeH * this.tileSize) | 0;

        for (var i = 0; i < this.tiles; i++)
            for (var j = 0; j < this.tiles; j++) {
                if (this.toggle === true) {
                    if (this.map[i][j] >= this.tileSizeW * this.tileSizeH / 1.07) {
                        R.ctx.save();
                        R.ctx.fillStyle = this.color;
                        R.ctx.fillRect(
                            (this.pos.x + this.width * j) | 0,
                            (this.pos.y + this.height * i) | 0,
                            this.width,
                            this.height
                        );
                        R.ctx.restore();
                    }

                    if (px === j && py === i) {
                        R.ctx.save();
                        R.ctx.fillStyle = "Green";
                        R.ctx.fillRect(
                            (this.pos.x + this.width * j) | 0,
                            (this.pos.y + this.height * i) | 0,
                            this.width,
                            this.height
                        );
                        R.ctx.restore();
                    }
                }
            }
        this.drawEvent();
    }

    static event = class {
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