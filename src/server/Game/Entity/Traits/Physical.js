const Entity = require("../SEntity.js");
const Tile = require("../../TileBased/Tile.js");
const EntityCollider = require("../Management/EntityCollider.js");
const TileCollider = require("../../TileBased/STileCollider.js");
const MovementTracker = require("../Management/EntityMovementTracker.js");
//const Vector2D = require("../../../../shared/code/Math/SVector2D.js");

const SSharedImportJS = require("../../../../shared/code/SSharedImportJS.js");

const Vector2D = SSharedImportJS("src/shared/code/Math/Vector2D.js");

// Entity with tile tileCollision and movement.
class Physical extends Entity {
    constructor(x, y, w, h) {
        super(x, y, w, h);
        this._old = new Vector2D(x, y);
        this._vel = new Vector2D(0, 0);
        this._fric = new Vector2D(0, 0);
        this._acc = new Vector2D(0, 0);
        this._movementTracker = new MovementTracker();
        this._movementState = this._movementTracker.movementStates;
        this.side = {
            left: false,
            right: false,
            top: false,
            bottom: false,
            reset: () => {
                this.side.left = this.side.right = this.side.top = this.side.bottom = false;
            }
        };
        this.addStaticSnapShotData([
            "_vel",
            "_movementState",
            "side",
        ]);

        this._physicsConfig = {
            tileCollision: true, // Tile tileCollision
            gravity: true, // Gravity
            static: false, // No movement
            stop: true, // Sets speed to zero when colliding with tile
            pixelatePos: true, // Rounds position to nearest integer
        };

        this._collisionResponseID = "Physical";

    }


    get CR_ID() {
        return this._collisionResponseID;
    }

    // Sets the ID of (preferably the extended constructor name) a presumably
    // mapped ID in the TileCollider to a callback function which is the
    // tileCollision response to a specific tile.
    setCollisionResponseID(string) {
        this._collisionResponseID = string;
    }

    // Composite method for the movement tracker
    checkMovementState(movementName, stateName) {
        return this._movementTracker.checkMovementState(movementName, stateName);
    }

    // Abstract method for conditional updates to the movement states.
    updateMovementStates(game, deltaTime) {

    }

    // Composite method for the movement tracker
    addMovementListener(name, stateName, callback) {
        this._movementTracker.addMovementStateListener(name, stateName, callback);
    }

    // Composite method for the movement tracker
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
            && this.pos.y < (e.pos.y + e.height)
            && this.pos.x + this.width > e.pos.x
            && this.pos.x < (e.pos.x + e.width);
    }

    overlapTile(e) {
        return this.pos.y + this.height > e.y
            && this.pos.y < (e.y + Tile.SIZE)
            && this.pos.x + this.width > e.x
            && this.pos.x < (e.x + Tile.SIZE);
    }

    // Tile tileCollision checks and resolution for x-axis-aligned
    // bounds of the rectangle shape of the entity.
    tileCollisionX(tileMap, deltaTime) {
        var cx = Math.floor(this.pos.x / Tile.SIZE);
        var cy = Math.floor(this.pos.y / Tile.SIZE);

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

    // Tile tileCollision checks and resolution for x-axis-aligned
    // bounds of the rectangle shape of the entity.
    tileCollisionY(tileMap, deltaTime) {
        var cx = Math.floor(this.pos.x / Tile.SIZE);
        var cy = Math.floor(this.pos.y / Tile.SIZE);

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
                    TileCollider.handleCollisionY(this, tileMap.getID(xx, yy), tile, deltaTime);
                }
            }
        }
    }

    // Map a boolean value to a physics configuration string to enable
    // or disable certain physics behaviour.
    // Table of configs:
    /*
      "tileCollision":      Tile tileCollision
      "gravity":        Gravity
      "static":         No movement when increasing velocity
      "stop":           Sets speed to zero when colliding with tile
      "pixelatePos":    Rounds position to nearest integer
     */
    setPhysicsConfiguration(name, value) {
        this._physicsConfig[name] = value;
    }

    onLeftCollision(tile) {
        if (this._physicsConfig.stop) this.vel.x = 0;
        this.pos.x = tile.x + Tile.SIZE;
    }

    onRightCollision(tile) {
        if (this._physicsConfig.stop) this.vel.x = 0;
        this.pos.x = tile.x - this.width;
    }

    onTopCollision(tile) {
        if (this._physicsConfig.stop) this.vel.y = 0;
        this.pos.y = tile.y + Tile.SIZE;
    }

    onBottomCollision(tile) {
        if (this._physicsConfig.stop) this.vel.y = 0;
        this.pos.y = tile.y - this.height;
    }

    onEntityCollision(entity, entityManager) {
        EntityCollider.applyCollisionsEffects(this, entity, entityManager);
    }

    // Overridable method for collisions along the X-axis.
    // The programmatic calling position of this method is
    // in-line with the physics algorithm to prevent physics
    // bugs.
    customCollisionX(game, tileMap, deltaTime) {
        // Override Here
    }

    // Overridable method for collisions along the Y-axis.
    // The programmatic calling position of this method is
    // in-line with the physics algorithm to prevent physics
    // bugs.
    customCollisionY(game, tileMap, deltaTime) {
        // Override Here
    }

    // Handling tile tileCollision physics
    physics(entityManager, deltaTime) {
        this._old.x = this._pos.x;
        this._old.y = this._pos.y;

        if (this._physicsConfig.gravity)
            if (!this.side.bottom)
                this.accelerateY(this._acc.y, deltaTime);

        this.side.reset();

        if (!this._physicsConfig.static)
            this.moveY(this._vel.y, deltaTime); // Adding velocity to position
        if (this._physicsConfig.tileCollision)      // before colliding.
            this.tileCollisionY(entityManager.tileMap, deltaTime);
        this.customCollisionY(entityManager, entityManager.tileMap, deltaTime);

        if (!this._physicsConfig.static)
            this.moveX(this._vel.x, deltaTime); // Adding velocity to position
        if (this._physicsConfig.tileCollision)      // before colliding.
            this.tileCollisionX(entityManager.tileMap, deltaTime);
        this.customCollisionX(entityManager, entityManager.tileMap, deltaTime);

        this.updateMovementStates(entityManager, deltaTime);

        if (this._physicsConfig.pixelatePos) {
            this.pos.x = Math.round(this.pos.x);
            this.pos.y = Math.round(this.pos.y);
        }
    }

    update(game, deltaTime) {
        super.update(game, deltaTime);
        this.physics(game, deltaTime);
    }

    get x() {
        return this._pos.x;
    }

    get y() {
        return this._pos.y;
    }

    set x(x) {
        this._pos.x = x;
    }

    set y(y) {
        this._pos.y = y;
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