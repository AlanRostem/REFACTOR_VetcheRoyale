const Vector2D = require("../../../../shared/code/Math/SVector2D.js");
const typeCheck = require("../../../../shared/code/Debugging/StypeCheck.js");
const CentralRect = require("./CentralRect.js");

// Data structure that reduces the amount of iterations
// an entity has to perform in order to check for interactions
// such as tileCollision.
class QuadTree {

    static MAX_ENTITIES = 10;
    static MAX_DEPTH = 8;

    northwest = null;
    northeast = null;
    southwest = null;
    southeast = null;

    constructor(bounds, level = 0) {
        this.boundary = bounds;
        this.entities = new Set();
        this.divided = false;
        this.level = level;
    }

    subdivide() {
        let x = this.boundary.x;
        let y = this.boundary.y;
        let w = this.boundary.w / 2;
        let h = this.boundary.h / 2;

        let ne = new CentralRect(x + w, y - h, w, h);
        this.northeast = new QuadTree(ne, this.level + 1);
        let nw = new CentralRect(x - w, y - h, w, h);
        this.northwest = new QuadTree(nw, this.level + 1);
        let se = new CentralRect(x + w, y + h, w, h);
        this.southeast = new QuadTree(se, this.level + 1);
        let sw = new CentralRect(x - w, y + h, w, h);
        this.southwest = new QuadTree(sw, this.level + 1);

        this.divided = true;
    }

    traverse(entity, entityManager, deltaTime) {
        if (entity.entitiesInProximity.qtBounds.intersects(this.boundary)) {
            for (let e of this.entities) {
                if (e !== entity) {
                    if (entity.entitiesInProximity.qtBounds.containsAABB(e)) {
                        entity.entitiesInProximity.proximityEntityTraversal(e, entityManager, deltaTime);
                    }
                }
            }
            if (this.divided) {
                this.northwest.traverse(entity, entityManager, deltaTime);
                this.northeast.traverse(entity, entityManager, deltaTime);
                this.southwest.traverse(entity, entityManager, deltaTime);
                this.southeast.traverse(entity, entityManager, deltaTime);
            }
        }
    }

    update(entity) {
        if (!this.boundary.containsAABB(entity)) {
            this.remove(entity);
            return false;
        }

        if (this.entities.has(entity)) {
            return false;
        }

        if (this.entities.size < QuadTree.MAX_ENTITIES) {
            this.entities.add(entity);
            return true;
        } else if (this.level < QuadTree.MAX_DEPTH) {
            if (!this.divided) {
                this.subdivide();
            }

            if (this.northeast.update(entity) || this.northwest.update(entity)
                || this.southeast.update(entity) || this.southwest.update(entity)) {
                return true;
            }
        }
    }

    remove(entity) {
        if (entity === undefined || entity === null) {
            return console.log(new Error("Entity removal at QuadTree failed. Given value was " + entity));
        }
        if (this.entities.has(entity)) {
            this.entities.delete(entity);
            if (this.divided) {
                this.northeast.remove(entity);
                this.northwest.remove(entity);
                this.southeast.remove(entity);
                this.southwest.remove(entity);
            }
        } else {
            if (this.divided) {
                this.northeast.remove(entity);
                this.northwest.remove(entity);
                this.southeast.remove(entity);
                this.southwest.remove(entity);

                if (this.length === 0) {
                    this.clear();
                }
            }
        }
    }

    // Range is a bounding rectangle (QTRect)
    forBoundary(range, method) {
        if (range.intersects(this.boundary)) {
            for (let e of this.entities) {
                if (range.containsAABB(e)) {
                    method(e);
                }
            }
            if (this.divided) {
                this.northwest.forBoundary(range, method);
                this.northeast.forBoundary(range, method);
                this.southwest.forBoundary(range, method);
                this.southeast.forBoundary(range, method);
            }
        }
    }

    clear() {
        this.northeast = null;
        this.northwest = null;
        this.southwest = null;
        this.southeast = null;
        this.divided = false;
    }

    get length() {
        if (!this.divided) {
            return this.entities.size;
        }
        return this.entities.size +
            this.northeast.length +
            this.northwest.length +
            this.southwest.length +
            this.southeast.length;
    }

}

module.exports = QuadTree;