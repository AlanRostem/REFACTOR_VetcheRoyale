import RemotePlayer from "./RemotePlayer.js";
import R from "../../../Graphics/Renderer.js";
import SpriteSheet from "../../../AssetManager/Classes/Graphical/SpriteSheet.js";
import Vector2D from "../../../../../shared/code/Math/CVector2D.js";

const TILE_SIZE = 8;

let set = 0;

// The player the client controls. It contains the client prediction code.
export default class UserPlayer extends RemotePlayer {
    constructor(data) {
        super(data);
        this._old = data._pos;
        this._serverState = data;
        this._localVel = new Vector2D(0, 0);
    }

    updateFromDataPack(dataPack, client) {
        //super.updateFromDataPack(dataPack, client);
        this._serverState = dataPack;
        this._output = dataPack;
        this.serverReconciliation(client);
        /*
        if (!set) {
            set = 1;
            this._output = dataPack;
        }
         */
    }

    overlapTile(e) {
        return this._output._pos._y + this._height > e.y
            && this._output._pos._y < (e.y + TILE_SIZE)
            && this._output._pos._x + this._width > e.x
            && this._output._pos._x < (e.x + TILE_SIZE);
    }

    t_drawGhost() {
        R.ctx.save();
        R.ctx.globalAlpha = 0.4;
        //this.animations.animate(RemotePlayer.sprite, this._serverState._teamName, 16, 16);
        SpriteSheet.beginChanges();
        if (this._serverState._movementState.direction === "left") {
            RemotePlayer.sprite.flipX();
        }
        RemotePlayer.sprite.drawAnimated(
            Math.round(this._serverState._pos._x) + R.camera.boundPos.x,
            Math.round(this._serverState._pos._y) + R.camera.boundPos.y);
        SpriteSheet.end();
        R.ctx.restore();
    }

    draw() {
        super.draw();
        this.t_drawGhost();
    }

    update(deltaTime, client, currentMap) {
        this._currentMap = currentMap;
        this._old = this._output._pos;
        super.update(deltaTime, client);
        this.physics(deltaTime, client, currentMap)
    }

    physics(deltaTime, client, currentMap) {
        //this._localVel.y += 500; // TEST GRAVITY VALUE
        /*
        this._localVel.x = 0;
        if (client.input.getKey(68)) {
            this._localVel.x = 65;
        }

        if (client.input.getKey(65)) {
            this._localVel.x = -65;
        }


        this._output._pos._x += this._localVel.x * deltaTime;
        this.reconciledCollisionCorrectionX(currentMap);
        this._output._pos._y += this._localVel.y * deltaTime;
        this.reconciledCollisionCorrectionY(currentMap);
         */
    }

    reconciledCollisionCorrectionX(currentMap) {
        var cx = Math.floor(this._output._pos._x / TILE_SIZE);
        var cy = Math.floor(this._output._pos._y / TILE_SIZE);

        var proxy = 2; // Amount of margin of tiles around entity

        var tileX = Math.floor(this._width / TILE_SIZE) + proxy;
        var tileY = Math.floor(this._height / TILE_SIZE) + proxy;

        for (var y = -proxy; y < tileY; y++) {
            for (var x = -proxy; x < tileX; x++) {
                var xx = cx + x;
                var yy = cy + y;

                let tile = {
                    x: xx * TILE_SIZE,
                    y: yy * TILE_SIZE,
                };

                let id = currentMap.getID(xx, yy);
                if (currentMap.isSolid(id)) {
                    let pos = this._output._pos;
                    let old = this._old;

                    console.log(true)
                    if (pos._x + this._width > tile.x && old._x + this._width <= tile.x) {
                        pos._x = tile.x - this._width;
                    }

                    if (pos._x < tile.x + TILE_SIZE && old._x >= tile.x + TILE_SIZE) {
                        pos._x = tile.x + TILE_SIZE;
                    }
                    if (this.overlapTile(tile)) {
                    }
                }
            }
        }
    }

    reconciledCollisionCorrectionY(currentMap) {
        var cx = Math.floor(this._output._pos._x / TILE_SIZE);
        var cy = Math.floor(this._output._pos._y / TILE_SIZE);

        var proxy = 2; // Amount of margin of tiles around entity

        var tileX = Math.floor(this._width / TILE_SIZE) + proxy;
        var tileY = Math.floor(this._height / TILE_SIZE) + proxy;

        for (var y = -proxy; y < tileY; y++) {
            for (var x = -proxy; x < tileX; x++) {
                var xx = cx + x;
                var yy = cy + y;

                let tile = {
                    x: xx * TILE_SIZE,
                    y: yy * TILE_SIZE,
                };

                let id = currentMap.getID(xx, yy);
                if (currentMap.isSolid(id)) {
                    let pos = this._output._pos;

                    let old = this._old;
                    if (pos._y + this._height > tile.y && old._y + this._height <= tile.y) {
                        pos._y = tile.y - this._height;

                    }
                    if (pos._y < tile.y + TILE_SIZE && old._y >= tile.y + TILE_SIZE) {
                        pos._y = tile.y + TILE_SIZE;
                    }
                    if (this.overlapTile(tile)) {
                    }
                }
            }
        }
    }


    serverReconciliation(client) {
        let pending = client.input.pending;
        let j = 0;
        while (j < pending.length) {
            let input = pending[j];
            if (input.sequence <= client.inboundPacket.lastProcessedInputSequence) {
                pending.splice(j, 1);
            } else {
                // TODO
                //this._localVel.x = Math.sign(input.pressTime) * 65;
                this._output._pos._x += Math.sign(input.pressTime); //* 65;
                j++;
            }
        }
    }


}