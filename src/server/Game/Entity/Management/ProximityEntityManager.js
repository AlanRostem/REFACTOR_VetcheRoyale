EntityManager = require("./EntityManager.js");
// Composition class for entities which handles
// all entities in proximity using the global
// quad tree.

class ProximityEntityManager extends EntityManager {
    constructor(entity) {
        super(false);
        this._entRef = entity;
        this._qtBounds = new Rect(entity.center.x, entity.center.y,
            // These rectangle bounds start from the center, so the
            // actual entity check range would be a 320*2 by 160*2
            // rectangle around the entity.
            320, 160);
    }

    addEntity(entity) {
        this._container[entity.id] = entity;
    }

    removeEntity(id) {
        delete this._container[id];
        delete this._dataBox[id];
    }

    quadTreePlacement(entityManager) {
        entityManager.quadTree.insert(this._entRef);
    }

    update(entityManager, deltaTime) {
        this._qtBounds.x = this._entRef.center.x;
        this._qtBounds.y = this._entRef.center.y;
        this.quadTreePlacement(entityManager);
        this.checkProximityEntities(entityManager);
    }

    checkProximityEntities(entityManager) {
        var entities = entityManager.quadTree.query(this._qtBounds);
        for (let e of entities) {
            if (e !== this._entRef) {
                if (!this.exists(e.id)) {
                    this.addEntity(e);
                } else {
                    this._entRef.forEachNearbyEntity(e);
                    if (this._entRef.overlapEntity(e)) {
                        this._entRef.onEntityCollision(e);
                    }
                    if (e.toRemove || !entityManager.exists(e.id) || !this._qtBounds.myContains(e)) {
                        this.removeEntity(e.id);
                    }
                }
            }
        }
    }

    // Called when player spawns in the world
    initProximityEntityData(entityManager) {
        var entities = entityManager.quadTree.query(this._qtBounds);
        for (var e of entities) {
            if (e !== this._entRef && this._qtBounds.contains(e)) {
                this.addEntity(e);
            }
        }
    }
}

module.exports = ProximityEntityManager;