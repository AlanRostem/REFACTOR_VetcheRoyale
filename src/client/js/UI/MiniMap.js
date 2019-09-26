import R from "../Graphics/Renderer.js";
import UIElement from "./UIElement.js";
import AssetManager from "../AssetManager/AssetManager.js";
import Scene from "../Game/Scene.js";
import Vector2D from "../../../shared/code/Math/CVector2D.js";

/**
 *
 */
class MiniMap extends UIElement {
    constructor() {
        super("minimap", R.WIDTH - 36, 4, 1, 1);
        this.pPos = {x: 0, y: 0};
        this.tiles = {small: 32, big: 120};
        this.currentTiles = "small";
        this.events = [];
        AssetManager.addDownloadCallback(() => {
            for (var key in Scene.tileMaps.getAllMaps()) {
                var tileMap = Scene.tileMaps.getAllMaps()[key];
                AssetManager.addPainting(this.paintImage(tileMap), tileMap.name);
            }
        });
    }

    /**
     *
     * @param tileMap {tileMap}
     * @returns {{mapInfo: {tileSizeH: number, tileSizeW: number, array: Array, name: *}, canvas: HTMLCanvasElement}}
     */
    paintImage(tileMap) {

        var obj = {
            small: {},
            big: {}
        };

        for (var key in obj){
            obj[key].canvas = document.createElement('canvas');
            var ctx = obj[key].canvas.getContext('2d');

            obj[key].canvas.width = this.tiles[key] * 8;
            obj[key].canvas.height = this.tiles[key] * 8;

            obj[key].mapInfo = {
                name: tileMap.name,
                array: [],
                tileSizeW: (tileMap.w / this.tiles[key]),
                tileSizeH: (tileMap.h / this.tiles[key])
            };

            for (var k = 0; k < this.tiles[key]; k++) {
                obj[key].mapInfo.array.push(new Array(this.tiles[key]).fill(0))
            }

            for (var i = 0; i < tileMap.h; i++) {
                for (var j = 0; j < tileMap.w; j++) {
                    if (tileMap.array[i * tileMap.w + j] !== 0) {
                        obj[key].mapInfo.array
                            [i / obj[key].mapInfo.tileSizeH | 0]
                            [j / obj[key].mapInfo.tileSizeW | 0] += 1;
                    }
                }
            }

            for (var y = 0; y < this.tiles[key]; y++) {
                for (var x = 0; x < this.tiles[key]; x++) {
                    ctx.save();
                    ctx.fillStyle = "#ffffff";
                    if (obj[key].mapInfo.array[y][x] >=
                        Math.floor(obj[key].mapInfo.tileSizeW) *
                        Math.floor(obj[key].mapInfo.tileSizeH))
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
        }

        return obj;
    }


    addEvent(e){
        this.events = e;
    }


    posOnMap(pos) {

        var x = pos.x / 8 / this.image[this.currentTiles].mapInfo.tileSizeW * this.width  | 0;
        var y = pos.y / 8 / this.image[this.currentTiles].mapInfo.tileSizeH * this.height | 0;

        return {x: x, y: y};
    }


    update(deltaTime, client, entityList) {
        this.pos.set(new Vector2D(R.WIDTH - this.tiles[this.currentTiles] - 4, 4));

        if(client.input.getReconKey(69))
        {
            this.currentTiles = "big";
            this.pos.set(new Vector2D((R.WIDTH - this.tiles[this.currentTiles])/2, (R.HEIGHT - this.tiles[this.currentTiles])/2));
        }
        else {
            this.pos.set(new Vector2D(R.WIDTH - this.tiles[this.currentTiles] - 4, 4));
            this.currentTiles = "small";
        }

        if (this.image === undefined || this.image[this.currentTiles].mapInfo.name !== Scene.currentMap)
            this.image = AssetManager.get(Scene.currentMap);


        if (client.player)
            this.pPos = this.posOnMap(client.player.output.pos);
    }

    draw() {
        R.ctx.drawImage(
            this.image[this.currentTiles].canvas,
            this.pos.x,
            this.pos.y,
            this.tiles[this.currentTiles]* 8,
            this.tiles[this.currentTiles]* 8
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
                this.pos.x + this.posOnMap(e.arg.pos).x | 0,
                this.pos.y + this.posOnMap(e.arg.pos).y | 0,
                1,
                1
            );
        }
    }
}

export default MiniMap;


