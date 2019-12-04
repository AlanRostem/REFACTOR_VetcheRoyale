const Vector2D = require("../../../../shared/code/Math/SVector2D.js");
const typeCheck = require("../../../../shared/code/Debugging/StypeCheck.js");
const Rect = require("./QTRect.js");

// Data structure that reduces the amount of iterations
// an entity has to perform in order to check for interactions
// such as tileCollision.
class QuadTreeMap {
    constructor(rect) {
        this.boundary = rect;
        this.entities = new Set(); // TODO: Allocate for maximum size
        //this.entities.length = QuadTreeMap.MAX_ENTITIES;
        this.divided = false;
    }

    get width() {
        return this.w;
    }

    get height() {
        return this.h;
    }

    // Range is a bounding rectangle (QTRect)
    query(range, found = new Set()) {

        if (!range.intersects(this.boundary)) {
            return found;
        }

        for (let e of this.entities) { // TODO: Optimize
            if (range.myContains(e) && !found.has(e)) {
                found.add(e);
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
        this.northeast = new QuadTreeMap(ne);
        let nw = new Rect(x - w, y - h, w, h);
        this.northwest = new QuadTreeMap(nw);
        let se = new Rect(x + w, y + h, w, h);
        this.southeast = new QuadTreeMap(se);
        let sw = new Rect(x - w, y + h, w, h);
        this.southwest = new QuadTreeMap(sw);

        this.divided = true;
    }

    // Places a reference to an entity in the container.
    // We subdivide if we reach the max count.
    insert(entity) {
        if (!this.boundary.myContains(entity)) {
            if (this.entities.has(entity)) {
                this.remove(entity);
            }
            return false;
        }

        if (this.entities.has(entity)) {
            return false;
        }

        if (this.entities.size < QuadTreeMap.MAX_ENTITIES) {
            this.entities.add(entity);
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
        if (entity === undefined || entity === null) {
            return console.log(new Error("Entity removal at QuadTreeMap failed. Given value was " + entity));
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

                if (this.northeast.length === 0 && this.southwest.length === 0
                    && this.southeast.length === 0 && this.northwest.length === 0) {
                    this.clear();
                }
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
        return this.entities.size;
    }

    get bounds() {
        return this.boundary;
    }

}

QuadTreeMap.MAX_ENTITIES = 10;
QuadTreeMap.MAX_LEVEL = 5;
QuadTreeMap.MAX_NODE_COUNT = 4;
QuadTreeMap.UNBOUND = -1;


module.exports = QuadTreeMap;