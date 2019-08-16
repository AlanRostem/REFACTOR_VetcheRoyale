import RemotePlayer from "./RemotePlayer.js";
import R from "../../../Graphics/Renderer.js";
import SpriteSheet from "../../../AssetManager/Classes/Graphical/SpriteSheet.js";
import Vector2D from "../../../../../shared/code/Math/CVector2D.js";

const TILE_SIZE = 8;

// The player the client controls. It contains the client prediction code.
export default class UserPlayer extends RemotePlayer {
    constructor(data) {
        super(data);

        this._serverState = data;
        this._localVel = new Vector2D(0, 0);
        this._localPos = new Vector2D(data._pos._x, data._pos._y);
        this._pendingKeys = {};
    }

    updateFromDataPack(dataPack, client) {
        //super.updateFromDataPack(dataPack, client);
        this._serverState = dataPack;
        this.serverReconciliation(client);
    }

    overlapTile(e) {
        return this._localPos.y + this._height > e.y
            && this._localPos.y < (e.y + TILE_SIZE)
            && this._localPos.x + this._width > e.x
            && this._localPos.x < (e.x + TILE_SIZE);
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
        this.updateRemainingServerData(deltaTime, client);
        //this.physics(deltaTime, client, currentMap);
        this._output._pos = this._localPos;
    }

    updateRemainingServerData(deltaTime, client) {
        for (let key in this._serverState) {
            if (key !== "_pos") {
                this._output[key] = this._serverState[key];
            }
        }
        this._localPos.x = this._serverState._pos._x;
        this._localPos.y = this._serverState._pos._y;
    }

    physics(deltaTime, client, currentMap) {
        this._localVel.y += 500 * deltaTime; // TEST GRAVITY VALUE

        this._localVel.x = 0;
        if (this.getPendingKey(68)) {
            this._localVel.x = 65;
        }

        if (this.getPendingKey(65)) {
            this._localVel.x = -65;
        }

        if (this.getPendingKey(32)) {
            if (!this._jumping) {
                this._jumping = true;
                this._localVel.y = -190;
            }
        }

        this._localPos.x += this._localVel.x * deltaTime;
        this.reconciledCollisionCorrectionX(currentMap);
        this._localPos.y += this._localVel.y * deltaTime;
        this.reconciledCollisionCorrectionY(currentMap);

        if (this._localVel.y !== 0) {
            this._jumping = true;
        }

    }

    reconciledCollisionCorrectionX(currentMap) {
        var cx = Math.floor(this._localPos.x / TILE_SIZE);
        var cy = Math.floor(this._localPos.y / TILE_SIZE);

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
                    let pos = this._localPos;
                    if (this.overlapTile(tile)) {
                        if (this._localVel.x > 0) {
                            if (pos._x + this._width > tile.x) {
                                pos._x = tile.x - this._width;
                            }
                        }

                        if (this._localVel.x < 0) {
                            if (pos._x < tile.x + TILE_SIZE) {
                                pos._x = tile.x + TILE_SIZE;
                            }
                        }
                    }
                }
            }
        }
    }

    reconciledCollisionCorrectionY(currentMap) {
        var cx = Math.floor(this._localPos.x / TILE_SIZE);
        var cy = Math.floor(this._localPos.y / TILE_SIZE);

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
                    let pos = this._localPos;
                    if (this.overlapTile(tile)) {
                        if (this._localVel.y > 0) {
                            if (pos._y + this._height > tile.y) {
                                pos._y = tile.y - this._height;
                                this._localVel.y = 0;
                                this._jumping = false;
                            }
                        }
                        if (this._localVel.y < 0) {
                            if (pos._y < tile.y + TILE_SIZE) {
                                pos._y = tile.y + TILE_SIZE;
                                this._localVel.y = 0;
                            }
                        }
                    }
                }
            }
        }
    }

    getPendingKey(keyCode) {
        return this._pendingKeys[keyCode];
    }

    serverReconciliation(client) {
        let pending = client.input.pending;
        let j = 0;
        while (j < pending.length) {
            let input = pending[j];
            if (input.sequence <= client.inboundPacket.lastProcessedInputSequence) {
                pending.splice(j, 1);
            } else {
                this._pendingKeys = input.keyStates;
                this._output._pos._x += Math.sign(input.pressTime);
                j++;
            }
        }
    }


}