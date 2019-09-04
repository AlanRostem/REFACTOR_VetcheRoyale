const Vector2D = require("../../../../shared/code/Math/SVector2D.js");
const typeCheck = require("../../../../shared/code/Debugging/StypeCheck.js");
const Rect = require("./QTRect.js");

// Data structure that reduces the amount of iterations
// an entity has to perform in order to check for interactions
// such as tileCollision.
class QuadTree {
    constructor(rect) {
        this.boundary = rect;
        this.entities = [];
        this.divided = false;
    }

    get width() {
        return this.w;
    }

    get height() {
        return this.h;
    }

    // Range is a bounding rectangle (QTRect)
    query(range, found = []) {

        if (!range.intersects(this.boundary)) {
            return found;
        }

        for (let e of this.entities) {
            if (range.myContains(e)) {
                found.push(e);
            }
        }
        if (this.divided) {
            this.northwest.query(range, found);
            this.northeast.query(range, found);
            this.southwest.query(range, found);
            this.southeast.query(range, found);
        }

        return found;
    }

    // Creates more quad trees divided into smaller
    // pieces within the current quad tree.
    subdivide() {
        let x = this.boundary.x;
        let y = this.boundary.y;
        let w = this.boundary.w / 2;
        let h = this.boundary.h / 2;

        let ne = new Rect(x + w, y - h, w, h);
        this.northeast = new QuadTree(ne);
        let nw = new Rect(x - w, y - h, w, h);
        this.northwest = new QuadTree(nw);
        let se = new Rect(x + w, y + h, w, h);
        this.southeast = new QuadTree(se);
        let sw = new Rect(x - w, y + h, w, h);
        this.southwest = new QuadTree(sw);

        this.divided = true;
    }

    // TODO: Maybe store the ID in the QuadTree instead.
    // Places a reference to an entity in the container.
    // We subdivides if we reach the max count.
    insert(entity) {
        if (!this.boundary.myContains(entity)) {
            if (this.entities.indexOf(entity) !== -1) {
                this.remove(entity);
            }
            return false;
        }

        if (this.entities.indexOf(entity) !== -1) {
            return false;
        }

        if (this.entities.length < QuadTree.MAX_ENTITIES) {
            this.entities.push(entity);
            return true;
        } else {
            if (!this.divided) {
                this.subdivide();
            }

            if (this.northeast.insert(entity)) {
                return true;
            }

            if (this.northwest.insert(entity)) {
                return true;
            }

            if (this.southeast.insert(entity)) {
                return true;
            }

            if (this.southwest.insert(entity)) {
                return true;
            }

        }
    }

    // Recursively removes an entity from the quad tree and
    // its subdivisions.
    remove(entity) {
        if (this.entities.indexOf(entity) !== -1) {
            this.entities.splice(this.entities.indexOf(entity));
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

                if (this.northeast.length === 0 && this.southwest.length === 0
                    && this.southeast.length === 0 && this.northwest.length === 0) {
                    this.clear();
                }
            }
        }
    }

    clear() {
        delete this.northeast;
        delete this.northwest;
        delete this.southwest;
        delete this.southeast;
        this.divided = false;
    }

    get length() {
        return this.entities.length;
    }

    get bounds() {
        return this.boundary;
    }

}

QuadTree.MAX_ENTITIES = 10; // TODO: Find a decent max value.
QuadTree.MAX_LEVEL = 5;
QuadTree.MAX_NODE_COUNT = 4;
QuadTree.UNBOUND = -1;


module.exports = QuadTree;