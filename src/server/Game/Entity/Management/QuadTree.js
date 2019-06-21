Vector2D = require("../../../../shared/Math/SVector2D.js");
typeCheck = require("../../../../shared/Debugging/StypeCheck.js");
Entity = require("../SEntity.js");
Rect = require("./QTRect.js");

class QuadTree {
    constructor(rect) {
        this._boundary = rect;
        this._entities = [];
        this._divided = false;
    }

    get width() {
        return this._w;
    }

    get height() {
        return this._h;
    }

    // Range is a bounding rectangle (QTRect)
    query(range, found = []) {

        if (!range.intersects(this._boundary)) {
            return found;
        }

        for (let e of this._entities) {
            if (range.myContains(e)) {
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
        if (!this._boundary.myContains(entity)) {
            if (this._entities.indexOf(entity) !== -1) {
                this.remove(entity);
            }
            return false;
        }

        if (this._entities.indexOf(entity) !== -1) {
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
        if (this._entities.indexOf(entity) !== -1) {
            this._entities.splice(this._entities.indexOf(entity));
            if (this._divided) {
                this.northeast.remove(entity);
                this.northwest.remove(entity);
                this.southeast.remove(entity);
                this.southwest.remove(entity);
            }
        } else {
            if (this._divided) {
                this.northeast.remove(entity);
                this.northwest.remove(entity);
                this.southeast.remove(entity);
                this.southwest.remove(entity);
            }
        }
    }

    get bounds() {
        return this._boundary;
    }

}

QuadTree.MAX_ENTITIES = 10; // TODO: Find a decent max value.
QuadTree.MAX_LEVEL = 5;
QuadTree.MAX_NODE_COUNT = 4;
QuadTree.UNBOUND = -1;


module.exports = QuadTree;