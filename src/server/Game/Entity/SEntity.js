const Vector2D = require("../../../shared/code/Math/SVector2D");
const typeCheck = require("../../../shared/code/Debugging/StypeCheck.js");
const SnapShotGenerator = require("./Management/SnapShotGenerator.js");
const ProximityEntityManager = require("./Management/ProximityEntityManager.js");

// Base class of dynamic objects in the game world.
class SEntity {
    constructor(x, y, width, height) {
        this._pos = new Vector2D(x, y);
        this._width = width;
        this._height = height;
        this._id = String.random();
        this._removed = false;
        this._eType = this.constructor.name;
        this._color = "rgb(" + 255 * Math.random() + "," + 255 * Math.random() + "," + 255 * Math.random() + ")";
        this._homeWorldID = -1;
        this._snapShotGenerator = new SnapShotGenerator(this,
        [
            "_id",
            "_pos",
            "_width",
            "_height",
        ],
        [
            "_removed",
            "_color",
            "_eType"
        ]);

        this._entitiesInProximity = new ProximityEntityManager(this);
    }

    get gameID() {
        return this._homeWorldID;
    }

    // Configure the maximum range the entity checks for other
    // entities in the quad tree. Entities such as projectiles
    // should have the least amount of iteration depending on
    // their size in the world.
    setQuadTreeRange(x, y) {
        this._entitiesInProximity._qtBounds.w = x;
        this._entitiesInProximity._qtBounds.h = y;
    }

    setStaticSnapshotData(key, value) {
        this._snapShotGenerator.setStaticSnapshotData(key, value);
    }

    setWorld(game) {
        this._homeWorldID = game.id;
    }

    addDynamicSnapShotData(array) {
        this._snapShotGenerator.addDynamicValues(this, array);
    }

    addStaticSnapShotData(array) {
        this._snapShotGenerator.addReferenceValues(this, array);
    }

    initFromEntityManager(entityManager) {

    }


    forEachNearbyEntity(entity, entityManager) {
        // Override here
    }

    update(game, deltaTime) {
        this._entitiesInProximity.update(game, deltaTime);
    }

    updateDataPack(entityManager, deltaTime) {
        this._snapShotGenerator.update(entityManager, this, deltaTime);
    }

    remove() {
        this._removed = true;
    }

    // Getters and setters

    getDataPack() {
        return this._snapShotGenerator.export();
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
}

module.exports = SEntity;