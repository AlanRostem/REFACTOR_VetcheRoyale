import RemotePlayer from "./RemotePlayer.js";
import R from "../../../Graphics/Renderer.js";

const TILE_SIZE = 8;

// The player the client controls. It contains the client prediction code.
export default class UserPlayer extends RemotePlayer {
    constructor(data) {
        super(data);
        this._old = data._pos;
    }

    updateFromDataPack(dataPack, client) {
        //super.updateFromDataPack(dataPack, client);
        this._output = dataPack;
        this.serverReconciliation(client);
    }

    update(deltaTime, client, currentMap) {
        this._currentMap = currentMap;
        this._old = this._output._pos;
        super.update(deltaTime, client);
    }

    overlapTile(e) {
        return this._output._pos._y + this._height > e.y
            && this._output._pos._y < (e.y + TILE_SIZE)
            && this._output._pos._x + this._width > e.x
            && this._output._pos._x < (e.x + TILE_SIZE);
    }

    draw() {
        super.draw();
    }

    reconciledCollisionCorrection(currentMap) {
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
                    if (this.overlapTile(tile)) {
                        //R.drawRect("blue", tile.x, tile.y, 8, 8, true);
                        let pos = this._output._pos;
                        let old = this._old;

                        if (pos._x + this._width > tile.x && old._x + this._width <= tile.x) {
                            pos._x = tile.x - this._width;
                        }

                        if (pos._x < tile.x + TILE_SIZE && old._x >= tile.x + TILE_SIZE) {
                            pos._x = tile.x + TILE_SIZE;
                        }
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
                if (!this._output.side.right && !this._output.side.left) {
                    this._output._pos._x += Math.sign(input.pressTime);
                }
                j++;
            }
        }
    }


}