const Entity = require("../SEntity.js");
const Tile = require("../../TileBased/Tile.js");
const EntityCollider = require("../Management/EntityCollider.js");
const TileCollider = require("../../TileBased/TileCollider.js");
const MovementTracker = require("../Management/EntityMovementTracker.js");

class Physical extends Entity {
    constructor(x, y, w, h) {
        super(x, y, w, h);
        this._vel = new Vector2D(0, 0);
        this._fric = new Vector2D(0, 0);
        this._acc = new Vector2D(0, 0);
        this._movementTracker = new MovementTracker();
        this._movementState = this._movementTracker.movementStates;
        this.addStaticSnapShotData([
            "_vel",
            "_movementState",
        ]);

        this._collisionConfig = {
            collision: true, // Tile collision
            gravity: true, // Gravity
            static: false, // No movement
            stop: true // Sets speed to zero when colliding with tile
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
    }

    addMovementListener(name, stateName, callback) {
        this._movementTracker.addMovementStateListener(name, stateName, callback);
    }

    setMovementState(name, stateName, entityManager, deltaTime) {
        this._movementTracker.setMovementState(name, stateName, this, entityManager, deltaTime)
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

    overlapEntity(e) {
        return this.pos.y + this.height > e.pos.y
            &&  this.pos.y < (e.pos.y + e.height)
            && this.pos.x + this.width > e.pos.x
            &&  this.pos.x < (e.pos.x + e.width);
    }

    overlapTile(e) {
        return this.pos.y + this.height > e.y
            &&  this.pos.y < (e.y + Tile.SIZE)
            && this.pos.x + this.width > e.x
            &&  this.pos.x < (e.x + Tile.SIZE);
    }

    tileCollisionX(tileMap, deltaTime) {
        var cx =  Math.floor(this.pos.x / Tile.SIZE);
        var cy =  Math.floor(this.pos.y / Tile.SIZE);

        var proxy = 2; // Amount of margin of tiles around entity

        var tileX = Math.floor(this.width / Tile.SIZE) + proxy;
        var tileY = Math.floor(this.height / Tile.SIZE) + proxy;

        for (var y = -proxy; y < tileY; y++) {
            for (var x = -proxy; x < tileX; x++) {
                var xx = cx + x;
                var yy = cy + y;

                var tile = Tile.toPos(xx, yy);
                tile.id = tileMap.getID(xx, yy);
                if (tileMap.withinRange(xx, yy)) {
                    TileCollider.handleCollisionX(this, tileMap.getID(xx, yy), tile, deltaTime);
                }
            }
        }
    }

    tileCollisionY(tileMap, deltaTime) {
        var cx =  Math.floor(this.pos.x / Tile.SIZE);
        var cy =  Math.floor(this.pos.y / Tile.SIZE);

        var proxy = 2; // Amount of margin of tiles around entity

        var tileX = Math.floor(this.width / Tile.SIZE) + proxy;
        var tileY = Math.floor(this.height / Tile.SIZE) + proxy;

        for (var y = -proxy; y < tileY; y++) {
            for (var x = -proxy; x < tileX; x++) {
                var xx = cx + x;
                var yy = cy + y;

                var tile = Tile.toPos(xx, yy);
                tile.id = tileMap.getID(xx, yy);
                if (tileMap.withinRange(xx, yy)) {
                    /*
                    if (this.overlapTile(tile)) {
                        if (this.constructor.name === "Player") {
                            console.log(tile.id);
                        }
                    }

                     */
                    TileCollider.handleCollisionY(this, tileMap.getID(xx, yy), tile, deltaTime);
                }
            }
        }
    }

    onLeftCollision(tile) { if (this._collisionConfig.stop) this.vel.x = 0; this.pos.x = tile.x + Tile.SIZE; }
    onRightCollision(tile) { if (this._collisionConfig.stop) this.vel.x = 0; this.pos.x = tile.x - this.width; }
    onTopCollision(tile) { if (this._collisionConfig.stop) this.vel.y = 0; this.pos.y = tile.y + Tile.SIZE; }
    onBottomCollision(tile) { if (this._collisionConfig.stop) this.vel.y = 0; this.pos.y = tile.y - this.height; }

    onEntityCollision(entity, entityManager) {
        EntityCollider.applyCollisionsEffects(this, entity, entityManager);
    }

    physics(entityManager, deltaTime) {
        if (this._collisionConfig.gravity)
            if (!this.side.bottom)
                this.accelerateY(this._acc.y, deltaTime);

        this.side.reset();

        if (!this._collisionConfig.static)
            this.moveY(this._vel.y, deltaTime);
        if (this._collisionConfig.collision)
            this.tileCollisionY(entityManager.tileMap, deltaTime);

        if (!this._collisionConfig.static)
            this.moveX(this._vel.x, deltaTime);
        if (this._collisionConfig.collision)
            this.tileCollisionX(entityManager.tileMap, deltaTime);

        this.pos.x = Math.round(this.pos.x);
        this.pos.y = Math.round(this.pos.y);
    }

    update(game, deltaTime) {
        super.update(game, deltaTime);
        this.physics(game, deltaTime);
    }

    get vel() {
        return this._vel;
    }

    get acc() {
        return this._acc;
    }

    get fric() {
        return this._fric;
    }

}

module.exports = Physical;