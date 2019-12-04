const EntityManager = require("./EntityManager.js");
const Rect = require("./QTRect.js");

// Composition class for entities which handles
// all entities in proximity using the global
// quad tree.

class ProximityEntityManager extends EntityManager {
    constructor(entity) {
        super(false);
        this.entRef = entity;
        this.container = new Set();
        this.qtBounds = new Rect(entity.center.x, entity.center.y,
            // These rectangle bounds start from the center, so the
            // actual entity check range would be a 320*2 by 160*2
            // rectangle around the entity.
            320, 160);
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
            this.qtBounds.x = x;
            this.qtBounds.y = y;
        }
    }

    addEntity(entity) {
        this.container.add(entity);
    }

    removeEntity(entity) {
        this.container.delete(entity);
    }

    quadTreePlacement(entityManager) {
        entityManager.quadTree.insert(this.entRef);
    }

    // Binds the quad tree range bounding rect to
    // the entity's center and does interaction checks.
    update(entityManager, deltaTime) {
        if (this.shouldFollowEntity) {
            this.qtBounds.x = this.entRef.center.x;
            this.qtBounds.y = this.entRef.center.y;
        }
        this.quadTreePlacement(entityManager);
        this.checkProximityEntities(entityManager, deltaTime);
    }

    // Performs interactions with entities that intersect the range
    // bounding rectangle.
    checkProximityEntities(entityManager, deltaTime) {
        let entities = entityManager.quadTree.query(this.qtBounds);
        for (let e of entities) {
            if (e !== this.entRef) {
                if (!this.container.has(e)) {
                    this.addEntity(e, entityManager);
                } else {
                    this.entRef.forEachNearbyEntity(e, entityManager, deltaTime);
                    if (this.entRef.overlapEntity(e)) {
                        this.entRef.onEntityCollision(e, entityManager);
                    }
                    if (e.toRemove || !this.qtBounds.myContains(e)) {
                        this.removeEntity(e.id);
                    }
                }
            }
            }
    }

    // Called when player spawns in the world
    initProximityEntityData(entityManager) {
        var entities = entityManager.quadTree.query(this.qtBounds);
        this.container = entities;
        /*for (let e of entities) {
            if (e !== this.entRef && this.qtBounds.contains(e)) {
                this.addEntity(e, entityManager);
            }
        }
         */
    }
}

module.exports = ProximityEntityManager;