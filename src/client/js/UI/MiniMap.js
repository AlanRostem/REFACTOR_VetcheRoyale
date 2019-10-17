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
        this.mapSize = "small";
        this.events = [];
        AssetManager.addSpriteCreationCallback(() => {
            for (var key in Scene.tileMaps.getAllMaps()) {
                var tileMap = Scene.tileMaps.getAllMaps()[key];
                AssetManager.addPainting(this.paintImage(tileMap), tileMap.name);
            }
        });

        Scene.clientRef.inputListener.addKeyMapping(70, (keyState) => {
            if (keyState) this.mapSize = "big";
            else this.mapSize = "small";
        });

        Scene.eventManager.addEventReceiver(this.id, this, (ev) => {
            return ev.arg.hasOwnProperty('pos')
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

        for (var key in obj) {
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            canvas.width = this.tiles[key] * 8;
            canvas.height = this.tiles[key] * 8;

            obj[key].image = new Image();
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
                    if (tileMap.isSolid(tileMap.array[i * tileMap.w + j])) {
                        obj[key].mapInfo.array
                            [i / obj[key].mapInfo.tileSizeH | 0]
                            [j / obj[key].mapInfo.tileSizeW | 0] += 1;
                    }
                }
            }

            for (var y = 0; y < this.tiles[key]; y++) {
                for (var x = 0; x < this.tiles[key]; x++) {
                    let color = "#ffffff";
                    if (obj[key].mapInfo.array[y][x] >=
                        Math.floor(obj[key].mapInfo.tileSizeW) *
                        Math.floor(obj[key].mapInfo.tileSizeH))
                        color = "#222034";
                    R.drawRect(color,
                        this.width * x,
                        this.height * y,
                        this.width, this.height,
                        false, ctx)
                }
            }
            obj[key].image.src = canvas.toDataURL("image/png");
        }
        return obj;
    }


    addEvent(e) {
        this.events = e;
    }


    posOnMap(pos) {

        var x = pos.x / 8 / this.image[this.mapSize].mapInfo.tileSizeW * this.width | 0;
        var y = pos.y / 8 / this.image[this.mapSize].mapInfo.tileSizeH * this.height | 0;

        return {x: x, y: y};
    }


    update(deltaTime, client, entityList) {
        if (this.mapSize === "small")
            this.pos.set(new Vector2D(R.screenSize.x - this.tiles[this.mapSize] - 4, 4));
        else
            this.pos.set(new Vector2D((R.screenSize.x - this.tiles[this.mapSize]) / 2, (R.screenSize.y - this.tiles[this.mapSize]) / 2));


        if (this.image === undefined
            || this.image[this.mapSize].mapInfo.name !== Scene.currentMap)
            this.image = AssetManager.get(Scene.currentMap);

        if (client.player)
            this.pPos = this.posOnMap(client.player.output.pos)
    }

    draw() {
        R.ctx.drawImage(
            this.image[this.mapSize].image,
            this.pos.x | 0,
            this.pos.y | 0,
            this.tiles[this.mapSize] * 8,
            this.tiles[this.mapSize] * 8
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

        R.drawRect(
            "Red",
            this.pos.x + this.pPos.x,
            this.pos.y + this.pPos.y,
            1,
            1
        );
    }
}

export default MiniMap;


