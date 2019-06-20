Vector2D = require("../../../../shared/Math/SVector2D.js");
typeCheck = require("../../../../shared/Debugging/StypeCheck.js");
Entity = require("../SEntity.js");
Rect = require("./QTRect.js");

class QuadTree {
    constructor(rect) {
        this._boundary = rect;
        this._entities = [];
        this._divided = false;
        QuadTree.rects.push(this._boundary);
    }

    get width() {
        return this._w;
    }

    get height() {
        return this._h;
    }

    // Range is a bounding rectangle (SRect)
    query(range, found) {
        if (!found) {
            found = [];
        }

        if (!range.intersects(this._boundary)) {
            return found;
        }

        for (let e of this._entities) {
            if (range.contains(e)) {
                found.push(e);
            }
        }
        if (this._divided) {
            this.northwest.query(range, found);
            this.northeast.query(range, found);
            this.southwest.query(range, found);
            this.southeast.query(range, found);
        }

        return found;
    }

    subdivide() {
        let x = this._boundary.x;
        let y = this._boundary.y;
        let w = this._boundary.w / 2;
        let h = this._boundary.h / 2;

        let ne = new Rect(x + w, y - h, w, h);
        this.northeast = new QuadTree(ne);
        let nw = new Rect(x - w, y - h, w, h);
        this.northwest = new QuadTree(nw);
        let se = new Rect(x + w, y + h, w, h);
        this.southeast = new QuadTree(se);
        let sw = new Rect(x - w, y + h, w, h);
        this.southwest = new QuadTree(sw);

        this._divided = true;
    }

    // TODO: Maybe store the ID in the QuadTree instead.
    // Places a reference to an entity in the container
    // Subdivides if we reach the max count
    insert(entity) {
        if (!this._boundary.contains(entity)) {
            return false;
        }

        if (this._entities.length < QuadTree.MAX_ENTITIES) {
            typeCheck.instance(Entity, entity);
            this._entities.push(entity);
            return true;
        } else {
            if (!this._divided) {
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

    remove(entity) {
        delete this._entities[entity.id];
    }

    get bounds() {
        return this._boundary;
    }

}

QuadTree.MAX_ENTITIES = 1; // TODO: Set it back to 10 (or 4). This is a test value for now.
QuadTree.MAX_LEVEL = 5;
QuadTree.MAX_NODE_COUNT = 4;
QuadTree.UNBOUND = -1;

QuadTree.rects = [];

module.exports = QuadTree;