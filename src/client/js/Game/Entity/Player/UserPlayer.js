import RemotePlayer from "./RemotePlayer.js";
import R from "../../../Graphics/Renderer.js";
import SpriteSheet from "../../../AssetManager/Classes/Graphical/SpriteSheet.js";
import Vector2D from "../../../../../shared/code/Math/CVector2D.js";
import CSharedImportJS from "../../../../../shared/code/CSharedImportJS.js";
import {linearInterpolation} from "../../../../../shared/code/Math/CCustomMath.js";
import Scene from "../../Scene.js"

const TILE_SIZE = 8;
const SMOOTHING_VALUE = 22;

let TC = CSharedImportJS("shared/code/TileBased/TileCollider.js");

TC.onload = self => {
    self.createCollisionResponse("UserPlayer", "SLOPE_UP_RIGHT", "Y", (entity, tile, deltaTime) => {
        if (entity.overlapTile(tile)) {
            let eRightToSlopeLeftDiff = entity._output._pos._x + entity._width - tile.x;

            let steppingPosY = -1 * eRightToSlopeLeftDiff + tile.y + self.TILE_SIZE;

            if (eRightToSlopeLeftDiff > self.TILE_SIZE) {
                entity.jumping = false;
                entity._localVel.y = 0;
                entity._output._pos._y = tile.y - entity._height;
                entity._localSides.bottom = true;
                if (entity._output._pos._x < 0) {
                    entity._localVel._y = -entity._localVel._x;
                }
            } else if (entity._output._pos._y + entity._height > steppingPosY) {
                entity._jumping = false;
                entity._localVel._y = 0;
                entity._output._pos._y = steppingPosY - entity._height;
                entity._localSides.bottom = true;
                if (entity._localVel._x < 0) {
                    entity._localVel._y = -entity._localVel._x;
                }
            }
        }
    });
    self.createCollisionResponse("UserPlayer", "SLOPE_UP_LEFT", "Y", (entity, tile, deltaTime) => {
        if (entity.overlapTile(tile)) {
            let eLeftToSlopeRightDiff = tile.x + self.TILE_SIZE - entity._output._pos._x;

            let steppingPosY = -1 * eLeftToSlopeRightDiff + tile.y + self.TILE_SIZE;

            if (eLeftToSlopeRightDiff > self.TILE_SIZE) {
                entity._jumping = false;
                entity._localVel.y = 0;
                entity._output._pos._y = tile.y - entity._height;
                entity._localSides.bottom = true;
                if (entity._localVel.x > 0) {
                    entity._localVel.y = entity._localVel.x;
                }
            } else if (entity._output._pos._y + entity._height > steppingPosY) {
                entity._jumping = false;
                entity._localVel.y = 0;
                entity._output._pos._y = steppingPosY - entity._height;
                entity._localSides.bottom = true;
                if (entity._localVel.x > 0) {
                    entity._localVel.y = entity._localVel.x;
                }
            }
        }
    });
    self.createCollisionResponse("UserPlayer", "SOLID", "X", (entity, tile, deltaTime) => {
        let pos = entity._output._pos;
        if (entity.overlapTile(tile)) {
            if (pos._x + entity._width > tile.x
                //&& this._oldPos._x + this._width <= tile.x
                && entity._localVel.x > 0
            ) {
                pos._x = tile.x - entity._width;
                entity._localVel.x = 0;
                entity._localSides.right = true;
            }
            if (pos._x < tile.x + TILE_SIZE
                //&& this._oldPos._x >= tile.x + TILE_SIZE
                && entity._localVel.x < 0
            ) {
                pos._x = tile.x + TILE_SIZE;
                entity._localVel.x = 0;
                entity._localSides.left = true;
            }
        }
    });
    self.createCollisionResponse("UserPlayer", "SOLID", "Y", (entity, tile, deltaTime) => {
        let pos = entity._output._pos;
        if (entity.overlapTile(tile)) {
            if (entity._localVel.y > 0) {
                if (pos._y + entity._height > tile.y
                //&& this._oldPos._y + this._height <= tile.y
                ) {
                    pos._y = tile.y - entity._height;
                    entity._localVel.y = 0;
                    entity._localSides.bottom = true;
                    entity._jumping = false;
                }
            }
            if (entity._localVel.y < 0) {
                if (pos._y < tile.y + TILE_SIZE
                //&& this._oldPos._y >= tile.y + TILE_SIZE
                ) {
                    pos._y = tile.y + TILE_SIZE;
                    entity._localVel.y = 0;
                    entity._localSides.top = true;
                }
            }
        }

    });
    self.createCollisionResponse("UserPlayer", "ONE_WAY", "Y", (entity, tile, deltaTime) => {
        if (entity.overlapTile(tile)) {
            if (entity._output._pos._y + entity._height > tile.y && entity._oldPos.y + entity._height <= tile.y) {
                entity._output._pos._y = tile.y - entity._height;
                entity._localVel.y = 0;
                entity._jumping = false;
                entity._localSides.bottom = true;
            }
        }
    },)

};

// The player the client controls. It contains the client prediction code.
export default class UserPlayer extends RemotePlayer {
    constructor(data) {
        super(data);
        this._serverState = data;
        this._localVel = new Vector2D(0, 0);
        this._localPos = new Vector2D(data._pos._x, data._pos._y);
        this._localGravity = 0;
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
        this.CR_ID = "UserPlayer";
    }

    overlapTile(e) {
        let pos = this._output._pos;
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
        this._serverState = dataPack;
        if (!this._t_set) {
            this._t_set = 1;
            this._output._pos = dataPack._pos;
        }
        for (let key in dataPack) {
            if (key !== "_pos") {
                this._output[key] = dataPack[key];
            }
        }
        //this.interpolateX(Scene.deltaTime, client);
        //this.interpolateY(Scene.deltaTime, client);
        this.updateServerX(dataPack);
        this.updateServerY(dataPack);
        this.serverReconciliation(client);
    }

    updateServerX(dataPack) {
        this._output._pos._x = dataPack._pos._x;
    }

    updateServerY(dataPack) {
        this._output._pos._y = dataPack._pos._y;
    }

    interpolateX(deltaTime, client) {
        this._output._pos._x =
            linearInterpolation(this._output._pos._x,
                this._serverState._pos._x,
                SMOOTHING_VALUE * deltaTime);
    }

    interpolateY(deltaTime, client) {
        this._output._pos._y =
            linearInterpolation(this._output._pos._y,
                this._serverState._pos._y,
                SMOOTHING_VALUE * deltaTime);
    }

    update(deltaTime, client, currentMap) {
        super.update(deltaTime, client);
        this._localVel.x = 0;
        this._oldPos = this._serverState._pos;
        R.camera.update({
            _x: this._output._pos._x + this._width / 2,
            _y: this._output._pos._y + this._height / 2,
        });

        client.input.clientPrediction(client);
        this.physics(deltaTime, client, currentMap);
    }

    physics(deltaTime, client, currentMap) {
        if (!this._localSides.bottom) {
        }
        client.input.setReconciliationProcess("gravity", true);

        this._localSides.reset();
        this._localGravity = 0;
        if (!currentMap) return;

        this._output._pos._x += this._localVel.x * deltaTime;
        this.reconciledCollisionCorrectionX(currentMap);

        this._localVel.y += this._localGravity * deltaTime;
        this._output._pos._y += this._localVel.y * deltaTime;
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
                if (TC.object) {
                    TC.object.handleCollisionX(this, id, tile, Scene.deltaTime);
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
                if (TC.object) {
                    TC.object.handleCollisionY(this, id, tile, Scene.deltaTime);
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
        if (input.keyStates[68]) {
            if (!this._localSides.right && !this._serverState.side.right) {
                this._localVel.x = 60;
            }
        }

        if (input.keyStates[65]) {
            if (!this._localSides.left && !this._serverState.side.left) {
                this._localVel.x = -60;
            }
        }

        if (input.keyStates[32]) {
            if (!this._localSides.top) {
                if (!this._jumping) {
                    this._jumping = true;
                    this._localVel.y = -190;
                }
            }
        }

        if (input.processes["gravity"]) {
            this._localGravity = 500;
        }
    }
}