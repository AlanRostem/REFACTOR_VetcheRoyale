const EntityManager = require("./EntityManager.js");
const Rect = require("./CollisionBoundary.js");

// Composition class for entities which handles
// all entities in proximity using the global
// entity storage per game world.

class ProximityEntityManager extends EntityManager {
    constructor(entity) {
        super(false);
        this.entRef = entity;
        this.container = new Set();
        this.collisionBoundary = new Rect(entity.center.x, entity.center.y,
            32 + entity.width, 32 + entity.height // TODO: Optimize the choice of values
            //entity.width * 3, entity.height * 3
        );
        this._shouldFollowEntity = true;
    }

    // TODO: Remove getters and setters
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
        entityManager.cellSpace.insert(this.entRef);
        entityManager.cellSpace.update(this.entRef, entityManager, deltaTime);
        if (this.entitySpeedIsTooHigh(entityManager, deltaTime)) {
            // TODO: Perform extra updates per frame if an entity goes too fast
        }
    }

    entitySpeedIsTooHigh(entityManager, deltaTime) {
        return (
            Math.abs(this.entRef.vel.x) * deltaTime > entityManager.cellSpace.cellWidth ||
            Math.abs(this.entRef.vel.y) * deltaTime > entityManager.cellSpace.cellHeight
        );
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
                if (e.toRemove || !this.collisionBoundary.containsEntity(e)) {
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