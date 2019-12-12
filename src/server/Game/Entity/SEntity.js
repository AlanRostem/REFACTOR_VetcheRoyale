const Vector2D = require("../../../shared/code/Math/SVector2D");
const SnapShotGenerator = require("./Management/SnapShotGenerator.js");
const SnapShotTemplate = require("./Management/SnapShotTemplate.js");
const ProximityEntityManager = require("./Management/ProximityEntityManager.js");

// Base class of dynamic objects in the game world.
class SEntity {
    static SNAPSHOT_TEMPLATE = new SnapShotTemplate(SEntity);
    static _ = (() => {
        SEntity.SNAPSHOT_TEMPLATE.addStaticValues(
            "id",
            "width",
            "height",
        );
        SEntity.SNAPSHOT_TEMPLATE.addDynamicValues(
            "pos",
            "removed",
            "entityType",
            "entityOrder");
    })();

    static validateSnapShotDerivation() {
        if (this.SNAPSHOT_TEMPLATE.currentConstructor !== this.name) {
            let superStatic = this.SNAPSHOT_TEMPLATE.referenceTemplate;
            let superDynamic = this.SNAPSHOT_TEMPLATE.dynamicTemplate;
            this.SNAPSHOT_TEMPLATE = new SnapShotTemplate(this);
            this.SNAPSHOT_TEMPLATE.addStaticValues(...superStatic);
            this.SNAPSHOT_TEMPLATE.addDynamicValues(...superDynamic);
        }
    }

    static addStaticValues(...values) {
        this.validateSnapShotDerivation();
        this.SNAPSHOT_TEMPLATE.addStaticValues(...values);
    }

    static addDynamicValues(...values) {
        this.validateSnapShotDerivation();
        this.SNAPSHOT_TEMPLATE.addDynamicValues(...values);
    }

    constructor(x, y, width, height, id) {
        this.keys = [];
        this.pos = new Vector2D(x, y);
        this.center = new Vector2D(x + width / 2, y + height / 2);
        this.topLeft = this.pos;
        this.topRight = new Vector2D(x + width, y);
        this.bottomLeft = new Vector2D(x, y + height);
        this.bottomRight = new Vector2D(x + width, y + height);

        this.width = width;
        this.height = height;
        if (id) this.id = id;
        else this.id = String.random();
        this.removed = false;
        this.entityType = this.constructor.name;
        this.homeWorldID = -1;
        this.entityOrder = 0;
        this.snapShotGenerator = new SnapShotGenerator(this);
        this.entitiesInProximity = new ProximityEntityManager(this);
    }

    setEntityOrder(int) {
        this.entityOrder = int;
    }

    // Configure the maximum range the entity checks for other
    // entities in the world. Entities such as projectiles
    // should have the least amount of iteration depending on
    // their size in the world.
    setCollisionRange(x, y) {
        this.entitiesInProximity.collisionBoundary.w = x;
        this.entitiesInProximity.collisionBoundary.h = y;
    }

    setWorld(game) {
        this.homeWorldID = game.id;
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

    updatePoints() {
        this.center.x = this.pos.x + this.width / 2;
        this.center.y = this.pos.y + this.height / 2;

        this.topRight.x = this.pos.x + this.width;
        this.topRight.y = this.pos.y;

        this.bottomRight.x = this.pos.x + this.width;
        this.bottomRight.y = this.pos.y + this.height;

        this.bottomLeft.x = this.pos.x;
        this.bottomLeft.y = this.pos.y + this.height;
    }

    update(game, deltaTime) {
        this.updatePoints();
        this.entitiesInProximity.update(game, deltaTime);
    }

    updateDataPack(entityManager, deltaTime) {
    }

    remove() {
        this.removed = true;
        this.onRemoved();
    }

    // Getters and setters

    getDataPack() {
        return this.snapShotGenerator.export();
    }

    getInitDataPack() {
        return this.snapShotGenerator.exportInitValues();
    }

    onRemoved() {

    }
}




module.exports = SEntity;