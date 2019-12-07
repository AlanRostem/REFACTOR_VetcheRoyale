const EntityManager = require("./EntityManager.js");
const Rect = require("./CollisionBoundary.js");

// Composition class for entities which handles
// all entities in proximity using the global
// quad tree.

class ProximityEntityManager extends EntityManager {
    constructor(entity) {
        super(false);
        this.entRef = entity;
        this.container = new Set();
        this.collisionBoundary = new Rect(entity.center.x, entity.center.y,
            // These rectangle bounds start from the center, so the
            // actual entity check range would be a 320*2 by 160*2
            // rectangle around the entity.
            640, 320);
        this._shouldFollowEntity = true;
    }

    get shouldFollowEntity() {
        return this._shouldFollowEntity;
    }

    set shouldFollowEntity(val) {
        this._shouldFollowEntity = val;
    }

    toggleFollowEntity() {
        this.shouldFollowEntity = !this.shouldFollowEntity;
    }

    follow(x, y) {
        if (!this.shouldFollowEntity) {
            this.collisionBoundary.pos.x = x - this.collisionBoundary.bounds.x / 2;
            this.collisionBoundary.pos.y = y - this.collisionBoundary.bounds.y / 2;
        }
    }

    addEntity(entity) {
        this.container.add(entity);
    }

    removeEntity(entity) {
        this.container.delete(entity);
    }

    cellSpacePlacement(entityManager, deltaTime) {
        entityManager.cellSpace.update(this.entRef, entityManager, deltaTime);
    }

    // Binds the quad tree range bounding rect to
    // the entity's center and does interaction checks.
    update(entityManager, deltaTime) {
        if (this.shouldFollowEntity) {
            this.collisionBoundary.update(this.entRef);
        }
        this.cellSpacePlacement(entityManager, deltaTime);
        this.checkProximityEntities(entityManager, deltaTime);
    }

    // Performs interactions with entities that intersect the range
    // bounding rectangle.
    checkProximityEntities(entityManager, deltaTime) {
        entityManager.cellSpace.update(this.entRef, entityManager, deltaTime);
    }

    proximityCellTraversal(cell, entityManager, deltaTime) {
        for (let e of cell) {
            if (!this.container.has(e)) {
                if (this.collisionBoundary.containsEntity(e))
                    this.addEntity(e, entityManager);
            } else {
                this.entRef.forEachNearbyEntity(e, entityManager, deltaTime);
                if (this.entRef.overlapEntity(e)) {
                    this.entRef.onEntityCollision(e, entityManager);
                }
                if (e.toRemove || !this.collisionBoundary.containsEntity(e)) { // TODO: Remove entity when it is out of bounds
                    this.removeEntity(e);
                }
            }
        }
    }

    // Called when player spawns in the world
    initProximityEntityData(entityManager) {
        entityManager.cellSpace.iterate(this.collisionBoundary, cell => {
            for (let e of cell)
                if (e !== this.entRef) {
                    this.container.add(e);
                }
        });
    }
}

module.exports = ProximityEntityManager;