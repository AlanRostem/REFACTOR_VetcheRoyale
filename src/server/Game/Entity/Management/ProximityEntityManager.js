const EntityManager = require("./EntityManager.js");
const Rect = require("./CollisionBoundary.js");

// Composition class for entities which handles
// all entities in proximity using the global
// entity storage per game world.

class ProximityEntityManager extends EntityManager {
    static MIN_BOUNDS_X = 32;
    static MIN_BOUNDS_Y = 32;

    constructor(entity) {
        super(false);
        this.entRef = entity;
        this.container = new Set();
        this.collisionBoundary = new Rect(entity.center.x, entity.center.y,
            // TODO: Optimize the choice of values
            ProximityEntityManager.MIN_BOUNDS_X + entity.width, ProximityEntityManager.MIN_BOUNDS_Y + entity.height
        );
        this.shouldFollowEntity = true;
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

    // Binds the quad tree range bounding rect to
    // the entity's center and does interaction checks.
    update(entityManager, deltaTime) {
        if (this.shouldFollowEntity) {
            this.collisionBoundary.update(this.entRef);
        }
        entityManager.cellSpace.letEntityIterate(this.entRef, entityManager, deltaTime);
        entityManager.cellSpace.updateCellPosition(this.entRef);
    }

    proximityCellTraversal(cell, entityManager, deltaTime) {
        for (let e of cell) {
            if (e === this.entRef) continue;
            if (!this.container.has(e)) {
                if (this.collisionBoundary.containsEntity(e)) {
                    this.addEntity(e, entityManager);
                }
            } else {
                this.entRef.forEachNearbyEntity(e, entityManager, deltaTime);
                if (this.entRef.overlapEntity(e)) {
                    this.entRef.onEntityCollision(e, entityManager);
                }
                if (e.removed || !this.collisionBoundary.containsEntity(e)) {
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