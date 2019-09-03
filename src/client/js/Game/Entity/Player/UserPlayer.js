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
        this.serverState = data;
        this.localVel = new Vector2D(0, 0);
        this.localPos = new Vector2D(data.pos.x, data.pos.y);
        this.localSides = {
            left: false,
            right: false,
            top: false,
            bottom: false,
            reset: () => {
                this.localSides.left = this.localSides.right = this.localSides.top = this.localSides.bottom = false;
            }
        };
    }

    updateFromDataPack(dataPack, client) {
        this.dataBuffer.t_directServerUpdate(dataPack, this);
        //super.updateFromDataPack(dataPack, client);
        //this._serverState = dataPack;
        //this._output = dataPack;
        //this.updateRemainingServerData(client);
        //this.serverReconciliation(client);
    }

    overlapTile(pos, e) {
        return pos.y + this.height > e.y
            && pos.y < (e.y + TILE_SIZE)
            && pos.x + this.width > e.x
            && pos.x < (e.x + TILE_SIZE);
    }

    t_drawGhost() {
        R.ctx.save();
        R.ctx.globalAlpha = 0.4;
        //this.animations.animate(RemotePlayer.sprite, this.serverState.teamName, 16, 16);
        SpriteSheet.beginChanges();
        if (this.serverState.movementState.direction === "left") {
            RemotePlayer.sprite.flipX();
        }
        RemotePlayer.sprite.drawAnimated(
            Math.round(this.serverState.pos.x) + R.camera.boundPos.x,
            Math.round(this.serverState.pos.y) + R.camera.boundPos.y);
        SpriteSheet.end();
        R.ctx.restore();
    }

    draw() {
        super.draw();
        if (this.weapon) {
            if (this.weapon.getRealtimeProperty("modCoolDown") > 0) {
                R.drawText(this.weapon.getRealtimeProperty("modCoolDown") | 0,
                    this.output.pos.x,
                    this.output.pos.y - 9, "White", true);
            }
        }
        //this.tdrawGhost();
    }

    update(deltaTime, client, currentMap) {
        super.update(deltaTime, client);
        this.currentMap = currentMap;
        this.weapon = Scene.entities.getEntityByID(this.output.invWeaponID);
        //console.log(Date.now() - client.latency, this.serverState.serverTimeStamp);
        /*
        let t = client.latency / 1000;
        if (Date.now() - client.latency <= this.serverState.serverTimeStamp) {
            this.output.pos =
                vectorLinearInterpolation(this.output.pos,
                    vectorLinearInterpolation(this.serverState.pos, this.localPos, 60 * t),
                    .36);
        } else {
            this.output.pos = this.localPos;
        }

         */
    }

    updateRemainingServerData(client) {
        for (let key in this.serverState) {
            if (key !== "pos") {
                this.output[key] = this.serverState[key];
            }
        }
        this.localPos.x = this.serverState.pos.x;
        this.localPos.y = this.serverState.pos.y;
    }

    physics(deltaTime, client, currentMap) {
        this.localSides.reset();
        this.output.pos.x += this.localVel.x;
        this.reconciledCollisionCorrectionX(currentMap);
        this.reconciledCollisionCorrectionY(currentMap);
    }

    reconciledCollisionCorrectionX(currentMap) {
        let pos = this.output.pos;
        var cx = Math.floor(pos.x / TILE_SIZE);
        var cy = Math.floor(pos.y / TILE_SIZE);

        var proxy = 2; // Amount of margin of tiles around entity

        var tileX = Math.floor(this.width / TILE_SIZE) + proxy;
        var tileY = Math.floor(this.height / TILE_SIZE) + proxy;

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
                        if (pos.x + this.width > tile.x
                            //&& this.oldPos.x + this.width <= tile.x
                            && this.localVel.x > 0
                        ) {
                            pos.x = tile.x - this.width;
                            this.localVel.x = 0;
                            this.localSides.right = true;
                        }
                        if (pos.x < tile.x + TILE_SIZE
                            //&& this.oldPos.x >= tile.x + TILE_SIZE
                            && this.localVel.x < 0
                        ) {
                            pos.x = tile.x + TILE_SIZE;
                            this.localVel.x = 0;
                            this.localSides.left = true;
                        }
                    }
                }
            }
        }
    }

    reconciledCollisionCorrectionY(currentMap) {
        let pos = this.output.pos;
        var cx = Math.floor(pos.x / TILE_SIZE);
        var cy = Math.floor(pos.y / TILE_SIZE);

        var proxy = 2; // Amount of margin of tiles around entity

        var tileX = Math.floor(this.width / TILE_SIZE) + proxy;
        var tileY = Math.floor(this.height / TILE_SIZE) + proxy;

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
                        if (pos.y + this.height > tile.y && this.oldPos.y + this.height <= tile.y) {
                            pos.y = tile.y - this.height;
                            this.localSides.bottom = true;
                        }
                        if (pos.y < tile.y + TILE_SIZE && this.oldPos.y >= tile.y + TILE_SIZE) {
                            pos.y = tile.y + TILE_SIZE;
                            this.localSides.top = true;
                        }
                        /*
                        if (this.localVel.y > 0) {
                        }
                        if (this.localVel.y < 0) {
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
                this.oldPos = this.output.pos;
                this.localVel.x = 0;

                if (input.keyStates[68]) {
                    if (!this.localSides.right) {
                        this.localVel.x = 1;
                    }
                }

                if (input.keyStates[65]) {
                    if (!this.localSides.left) {
                        this.localVel.x = -1;
                    }
                }

                this.physics(input.pressTime, client, this.currentMap);


                j++;
            }
        }
    }


}