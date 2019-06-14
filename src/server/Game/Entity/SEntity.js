Vector2D = require("../../../shared/Math/SVector2D");
typeCheck = require("../../../shared/Debugging/StypeCheck.js");
Tile = require("../TileBased/Tile.js");

class SEntity {
    constructor(x, y, width, height) {
        this._pos = new Vector2D(x, y);
        this._vel = new Vector2D(0, 0);
        this._fric = new Vector2D(0, 0);
        this._acc = new Vector2D(0, 0);
        this._width = width;
        this._height = height;
        this._id = Math.random();
        this._removed = false;
        this._color = "rgb(" + 255 * Math.random() + "," + 255 * Math.random() + "," + 255 * Math.random() + ")";

        this._config = {
            collision: true,
            gravity: true,
            static: false
        };

        this.side = {
            left: false,
            right: false,
            top: false,
            bottom: false,
            reset : () => {
                this.side.left = this.side.right = this.side.top = this.side.bottom = false;
            }
        };

        // TODO: Add scalable function/class to create data packs
        // TODO: with constants and variable data in the constructor.
        this._dataPack = {
            id: this._id,
            pos: this.pos, // Storing the reference is a good idea since
            vel: this.vel, // we don't have to waste performance with assignment
            width: this._width,
            height: this._height,
            color: this._color,
            serverTickDeltaTime: 0
        }
    }

    initFromEntityManager(entityManager) {

    }

    moveX(pixelsPerSecond, deltaTime) {
        this._pos._x += (pixelsPerSecond * deltaTime);
    }

    moveY(pixelsPerSecond, deltaTime) {
        this._pos._y += (pixelsPerSecond * deltaTime);
    }

    accelerateX(x, deltaTime) {
        this.vel.x += x * deltaTime;
    }

    accelerateY(y, deltaTime) {
        this.vel.y += y * deltaTime;
    }

    overlap(e) {
        return this.pos.y + this.height > e.pos.y
            &&  this.pos.y < (e.pos.y + e.height)
            && this.pos.x + this.width > e.pos.x
            &&  this.pos.x < (e.pos.x + e.width);
    }

    overlapTile(cx, cy) {
        return this.pos.y + this.height > cy * Tile.SIZE
            &&  this.pos.y < (cy * Tile.SIZE + Tile.SIZE)
            && this.pos.x + this.width > cx * Tile.SIZE
            &&  this.pos.x < (cx * Tile.SIZE + Tile.SIZE);
    }

    tileCollisionX(tileMap, deltaTime) {
        var cx =  Math.floor(this.pos.x / Tile.SIZE);
        var cy =  Math.floor(this.pos.y / Tile.SIZE);

        var tileX = Math.floor(this.width / Tile.SIZE) + 1;
        var tileY = Math.floor(this.height / Tile.SIZE) + 1;

        for (var y = -1; y < tileY; y++) {
            for (var x = -1; x < tileX; x++) {
                var xx = cx + x;
                var yy = cy + y;

                var tile = Tile.toPos(xx, yy);

                if (tileMap.isSolid(tileMap.getID(xx, yy))) {

                    if (this.overlapTile(xx, yy)) {
                        if (this.vel.x > 0) {
                            if (this.pos.x + this.width > tile.x) {
                                this.onRightCollision(tile);
                                this.side.right = true;
                            }
                        }
                        if (this.vel.x < 0) {
                            if (this.pos.x < tile.x + Tile.SIZE) {
                                this.onLeftCollision(tile);
                                this.side.left = true;
                            }
                        }
                    }
                }
            }
        }
    }

    tileCollisionY(tileMap, deltaTime) {
        var cx =  Math.floor(this.pos.x / Tile.SIZE);
        var cy =  Math.floor(this.pos.y / Tile.SIZE);

        var tileX = Math.floor(this.width / Tile.SIZE) + 1;
        var tileY = Math.floor(this.height / Tile.SIZE) + 1;

        for (var y = -1; y < tileY; y++) {
            for (var x = -1; x < tileX; x++) {
                var xx = cx + x;
                var yy = cy + y;

                var tile = Tile.toPos(xx, yy);

                if (tileMap.isSolid(tileMap.getID(xx, yy))) {

                    if (this.overlapTile(xx, yy)) {
                        if (this.vel.y > 0) {
                            if (this.pos.y + this.width > tile.y) {
                                this.onBottomCollision(tile);
                                this.side.bottom = true;
                            }
                        }
                        if (this.vel.y < 0) {
                            if (this.pos.y < tile.y + Tile.SIZE) {
                                this.onTopCollision(tile);
                                this.side.top = true;
                            }
                        }
                    }
                }
            }
        }
    }

    onLeftCollision(tile) { this.pos.x = tile.x + Tile.SIZE; }
    onRightCollision(tile) { this.pos.x = tile.x - this.width; }
    onTopCollision(tile) { this.pos.y = tile.y + Tile.SIZE; }
    onBottomCollision(tile) { this.pos.y = tile.y - this.height; }

    physics(entityManager, deltaTime) {
        if (!this._config.static)
            this.moveX(this.pos.x, deltaTime);
        if (this._config.collision)
            this.tileCollisionX(entityManager.tileMap, deltaTime);

        if (this._config.gravity)
            this.accelerateY(this._acc.y, deltaTime);
        if (!this._config.static)
            this.moveY(this.pos.y, deltaTime);
        if (this._config.collision)
            this.tileCollisionY(entityManager.tileMap, deltaTime);

    }

    update(entityManager, deltaTime) {
        this.physics(entityManager, deltaTime);
    }

    updateDataPack(deltaTime) {
        this._dataPack.serverTickDeltaTime = deltaTime;
    }

    remove() {
        this._removed = true;
    }

    // Getters and setters

    getDataPack() {
        this._dataPack.removed = this._removed;
        return this._dataPack;
    }

    get toRemove() {
        return this._removed;
    }

    get id() {
        return this._id;
    }

    get width() {
        return this._width;
    }

    get height() {
        return this._height;
    }

    get topLeft() {
        return this._pos
    }

    get topRight() {
        return {
            x: this._pos.x + this._width,
            y: this._pos.y
        };
    }

    get bottomLeft() {
        return {
            x: this._pos.x,
            y: this._pos.y + this._height
        };
    }

    get bottomRight() {
        return {
            x: this._pos.x + this._width,
            y: this._pos.y + this._height
        };
    }

    get center() {
        return {
            x: this.pos.x + this.width / 2,
            y: this.pos.y + this.height / 2
        }
    }

    get pos() {
        return this._pos;
    }
    set pos(val) {

    }

    get vel() {
        return this._vel;
    }
    set vel(val) {

    }

    get acc() {
        return this._acc;
    }
    set acc(val) {

    }

    get fric() {
        return this._fric;
    }
    set fric(val) {

    }
}

module.exports = SEntity;