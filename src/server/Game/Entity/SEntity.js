const Vector2D = require("../../../shared/code/Math/SVector2D");
const typeCheck = require("../../../shared/code/Debugging/StypeCheck.js");
const SnapShotGenerator = require("./Management/SnapShotGenerator.js");
const ProximityEntityManager = require("./Management/ProximityEntityManager.js");

// Base class of dynamic objects in the game world.
class SEntity {
    constructor(x, y, width, height, id) {
        this.pos = new Vector2D(x, y);
        this.width = width;
        this.height = height;
        if (id) this.id = id;
        else this.id = String.random();
        this.removed = false;
        this.entityType = this.constructor.name;
        this.color = "rgb(" + 255 * Math.random() + "," + 255 * Math.random() + "," + 255 * Math.random() + ")";
        this.homeWorldID = -1;
        this.entityOrder = 0;
        this.snapShotGenerator = new SnapShotGenerator(this,
        [
            "id",
            "width",
            "height",
        ],
        [
            "pos",
            "removed",
            "color",
            "entityType",
            "entityOrder"
        ]);

        this.entitiesInProximity = new ProximityEntityManager(this);
    }

    get gameID() {
        return this.homeWorldID;
    }

    setEntityOrder(int) {
        this.entityOrder = int;
    }

    // Configure the maximum range the entity checks for other
    // entities in the quad tree. Entities such as projectiles
    // should have the least amount of iteration depending on
    // their size in the world.
    setQuadTreeRange(x, y) {
        this.entitiesInProximity.qtBounds.w = x;
        this.entitiesInProximity.qtBounds.h = y;
    }

    setStaticSnapshotData(key, value) {
        this.snapShotGenerator.setStaticSnapshotData(key, value);
    }

    setWorld(game) {
        this.homeWorldID = game.id;
    }

    addDynamicSnapShotData(array) {
        this.snapShotGenerator.addDynamicValues(this, array);
    }

    addStaticSnapShotData(array) {
        this.snapShotGenerator.addStaticValues(this, array);
    }

    initFromEntityManager(entityManager) {

    }

    forEachNearbyEntity(entity, entityManager) {
        // Override here
    }

    overlapEntity(e) {
        return this.pos.y + this.height > e.pos.y
            && this.pos.y < (e.pos.y + e.height)
            && this.pos.x + this.width > e.pos.x
            && this.pos.x < (e.pos.x + e.width);
    }

    onEntityCollision(entity, entityManager) {

    }

    update(game, deltaTime) {
        this.entitiesInProximity.update(game, deltaTime);
    }

    updateDataPack(entityManager, deltaTime) {
        this.snapShotGenerator.update(entityManager, this, deltaTime);

    }

    remove() {
        this.removed = true;
    }

    // Getters and setters

    getDataPack() {
        return this.snapShotGenerator.export();
    }

    getInitDataPack(){
        return this.snapShotGenerator.exportInitValues();
    }

    get toRemove() {
        return this.removed;
    }

    get topLeft() {
        return this.pos
    }

    get topRight() {
        return {
            x: this.pos.x + this.width,
            y: this.pos.y
        };
    }

    get bottomLeft() {
        return {
            x: this.pos.x,
            y: this.pos.y + this.height
        };
    }

    get bottomRight() {
        return {
            x: this.pos.x + this.width,
            y: this.pos.y + this.height
        };
    }

    get center() {
        return {
            x: this.pos.x + this.width / 2,
            y: this.pos.y + this.height / 2
        }
    }
}




module.exports = SEntity;