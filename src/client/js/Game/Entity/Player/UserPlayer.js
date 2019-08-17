import RemotePlayer from "./RemotePlayer.js";
import R from "../../../Graphics/Renderer.js";
import SpriteSheet from "../../../AssetManager/Classes/Graphical/SpriteSheet.js";
import Vector2D from "../../../../../shared/code/Math/CVector2D.js";
import {vectorLinearInterpolation} from "../../../../../shared/code/Math/CCustomMath.js";


const TILE_SIZE = 8;

// The player the client controls. It contains the client prediction code.
export default class UserPlayer extends RemotePlayer {
    constructor(data) {
        super(data);
        this._serverState = data;
        this._localVel = new Vector2D(0, 0);
        this._localPos = new Vector2D(data._pos._x, data._pos._y);
        this._localSides = {
            left: false,
            right: false,
            top: false,
            bottom: false,
            reset: () => {
                this._localSides.left = this._localSides.right = this._localSides.top = this._localSides.bottom = false;
            }
        };
    }

    updateFromDataPack(dataPack, client) {
        //super.updateFromDataPack(dataPack, client);
        this._serverState = dataPack;
        this._output = dataPack;
        //this.updateRemainingServerData(client);
        this.serverReconciliation(client);
    }

    overlapTile(pos, e) {
        return pos._y + this._height > e.y
            && pos._y < (e.y + TILE_SIZE)
            && pos._x + this._width > e.x
            && pos._x < (e.x + TILE_SIZE);
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
        super.update(deltaTime, client);
        this._currentMap = currentMap;
        //console.log(Date.now() - client._latency, this._serverState.serverTimeStamp);
        /*
        let t = client._latency / 1000;
        if (Date.now() - client._latency <= this._serverState.serverTimeStamp) {
            this._output._pos =
                vectorLinearInterpolation(this._output._pos,
                    vectorLinearInterpolation(this._serverState._pos, this._localPos, 60 * t),
                    .36);
        } else {
            this._output._pos = this._localPos;
        }

         */
    }

    updateRemainingServerData(client) {
        for (let key in this._serverState) {
            if (key !== "_pos") {
                this._output[key] = this._serverState[key];
            }
        }
        this._localPos.x = this._serverState._pos._x;
        this._localPos.y = this._serverState._pos._y;
    }

    physics(deltaTime, client, currentMap) {
        this._localSides.reset();
        this._output._pos._x += this._localVel.x;
        this.reconciledCollisionCorrectionX(currentMap);
        this.reconciledCollisionCorrectionY(currentMap);
    }

    reconciledCollisionCorrectionX(currentMap) {
        let pos = this._output._pos;
        var cx = Math.floor(pos._x / TILE_SIZE);
        var cy = Math.floor(pos._y / TILE_SIZE);

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
                    if (this.overlapTile(pos, tile)) {
                        if (pos._x + this._width > tile.x
                            //&& this._oldPos._x + this._width <= tile.x
                            && this._localVel.x > 0
                        ) {
                            pos._x = tile.x - this._width;
                            this._localVel.x = 0;
                            this._localSides.right = true;
                        }
                        if (pos._x < tile.x + TILE_SIZE
                            //&& this._oldPos._x >= tile.x + TILE_SIZE
                            && this._localVel.x < 0
                        ) {
                            pos._x = tile.x + TILE_SIZE;
                            this._localVel.x = 0;
                            this._localSides.left = true;
                        }
                    }
                }
            }
        }
    }

    reconciledCollisionCorrectionY(currentMap) {
        let pos = this._output._pos;
        var cx = Math.floor(pos._x / TILE_SIZE);
        var cy = Math.floor(pos._y / TILE_SIZE);

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
                    if (this.overlapTile(pos, tile)) {
                        if (pos._y + this._height > tile.y && this._oldPos._y + this._height <= tile.y) {
                            pos._y = tile.y - this._height;
                            this._localSides.bottom = true;
                        }
                        if (pos._y < tile.y + TILE_SIZE && this._oldPos._y >= tile.y + TILE_SIZE) {
                            pos._y = tile.y + TILE_SIZE;
                            this._localSides.top = true;
                        }
                        /*
                        if (this._localVel.y > 0) {
                        }
                        if (this._localVel.y < 0) {
                        }
                         */
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
                // TODO: SCALABILITY
                this._oldPos = this._output._pos;
                this._localVel.x = 0;

                if (input.keyStates[68]) {
                    if (!this._localSides.right) {
                        this._localVel.x = 1;
                    }
                }

                if (input.keyStates[65]) {
                    if (!this._localSides.left) {
                        this._localVel.x = -1;
                    }
                }

                this.physics(input.pressTime, client, this._currentMap);


                j++;
            }
        }
    }


}