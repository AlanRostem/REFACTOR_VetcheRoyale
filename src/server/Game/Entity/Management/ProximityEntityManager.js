const EntityManager = require("./EntityManager.js");
const Rect = require("./QTRect.js");

// Composition class for entities which handles
// all entities in proximity using the global
// quad tree.

class ProximityEntityManager extends EntityManager {
    constructor(entity) {
        super(false);
        this.entRef = entity;
        this.qtBounds = new Rect(entity.center.x, entity.center.y,
            // These rectangle bounds start from the center, so the
            // actual entity check range would be a 320*2 by 160*2
            // rectangle around the entity.
            320, 160);
    }

    addEntity(entity) {
        this.container[entity.id] = entity;
    }

    removeEntity(id) {
        delete this.container[id];
    }

    quadTreePlacement(entityManager) {
        entityManager.quadTree.insert(this.entRef);
    }

    // Binds the quad tree range bounding rect to
    // the entity's center and does interaction checks.
    update(entityManager, deltaTime) {
        this.qtBounds.x = this.entRef.center.x;
        this.qtBounds.y = this.entRef.center.y;
        this.quadTreePlacement(entityManager);
        this.checkProximityEntities(entityManager);
    }

    // Performs interactions with entities that intersect the range
    // bounding rectangle.
    checkProximityEntities(entityManager) {

        var entities = entityManager.quadTree.query(this.qtBounds);
        for (let e of entities) {
            if (e !== this.entRef) {
                if (!this.exists(e.id)) {
                    this.addEntity(e);
                } else {
                    this.entRef.forEachNearbyEntity(e, entityManager);
                    if (this.entRef.overlapEntity(e)) {
                        this.entRef.onEntityCollision(e, entityManager);
                    }
                    if (e.toRemove || !entityManager.exists(e.id) || !this.qtBounds.myContains(e)) {
                        this.removeEntity(e.id);
                    }
                }
            }
        }
    }

    // Called when player spawns in the world
    initProximityEntityData(entityManager) {
        var entities = entityManager.quadTree.query(this.qtBounds);
        for (var e of entities) {
            if (e !== this.entRef && this.qtBounds.contains(e)) {
                this.addEntity(e);
            }
        }
    }
}

module.exports = ProximityEntityManager;