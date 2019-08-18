import RemotePlayer from "./RemotePlayer.js";
import R from "../../../Graphics/Renderer.js";
import SpriteSheet from "../../../AssetManager/Classes/Graphical/SpriteSheet.js";
import Vector2D from "../../../../../shared/code/Math/CVector2D.js";
import CSharedImportJS from "../../../../../shared/code/CSharedImportJS.js";
import {linearInterpolation} from "../../../../../shared/code/Math/CCustomMath.js";

const TILE_SIZE = 8;
const SMOOTHING_VALUE = 22;

let TC = CSharedImportJS("shared/code/TileBased/TileCollider.js");
window.TC = TC;

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
        this._t_set = 0;
        this._dataBuffer._size = 2;
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

    updateFromDataPack(dataPack, client) {

        //super.updateFromDataPack(dataPack, client);
        this._dataBuffer.onServerUpdateReceived(dataPack, this, client);
        if (!this._t_set) {
            this._t_set = 1;
            this._output._pos = dataPack._pos;
        }
        for (let key in dataPack) {
            if (key !== "_pos") {
                this._output[key] = dataPack[key];
            }
        }
        this._output._pos._x = dataPack._pos._x;
        this._serverState = dataPack;
        this.serverReconciliation(client);
    }

    interpolateY(deltaTime, client) {
        let currentTime = Date.now() - client._latency;
        let target = null;
        let previous = null;
        for (let i = 0; i < this.length - 1; i++) {
            let point = this._dataBuffer.get(i);
            let next = this._dataBuffer.get(i + 1);
            if (currentTime > point.timeStamp && currentTime < next.timeStamp) {
                target = next;
                previous = point;
                break;
            }
        }

        if (!target) {
            target = previous = this._dataBuffer.get(0);
        }

        if (target && previous) {
            let targetTime = target.serverTimeStamp;
            var difference = targetTime - currentTime;
            var maxDiff = (target.serverTimeStamp - previous.serverTimeStamp).fixed(3);
            var timePoint = (difference / maxDiff).fixed(3);

            if (isNaN(timePoint) || Math.abs(timePoint) === Infinity) {
                timePoint = 0;
            }

            this._output._pos._y =
                linearInterpolation(this._output._pos._y,
                    linearInterpolation(previous._pos._y, target._pos._y, timePoint),
                    SMOOTHING_VALUE * deltaTime);
        }
    }

    update(deltaTime, client, currentMap) {
        super.update(deltaTime, client);
        this._currentMap = currentMap;
        this._oldPos = this._serverState._pos;
        this.interpolateY(deltaTime, client);
        this.reconciledCollisionCorrectionY(currentMap);
        R.camera.update({
            _x: this._output._pos._x + this._width / 2,
            _y: this._output._pos._y + this._height / 2,
        });
    }

    physics(deltaTime, client, currentMap) {
        this._localSides.reset();
        if (!currentMap) return;
        this._output._pos._x += this._localVel.x;
        this.reconciledCollisionCorrectionX(currentMap);
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
                        if (pos._y + this._height > tile.y
                            && this._oldPos._y + this._height <= tile.y
                        ) {
                            pos._y = tile.y - this._height;
                            this._localVel.y = 0;
                            this._localSides.bottom = true;
                        }
                        if (pos._y < tile.y + TILE_SIZE
                            && this._oldPos._y >= tile.y + TILE_SIZE
                        ) {
                            pos._y = tile.y + TILE_SIZE;
                            this._localVel.y = 0;
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
                this.processReconciledInput(client, input);

                j++;
            }
        }
    }

    processReconciledInput(client, input) {
        this._localVel.x = 0;


        if (input.keyStates[68]) {
            if (!this._localSides.right) {
                this._localVel.x = 60 * input.pressTime;
            }
        }

        if (input.keyStates[65]) {
            if (!this._localSides.left) {
                this._localVel.x = 60 * input.pressTime;
            }
        }

        this.physics(input.pressTime, client, this._currentMap);
    }


}