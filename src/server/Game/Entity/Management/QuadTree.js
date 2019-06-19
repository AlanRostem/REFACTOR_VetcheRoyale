Vector2D = require("../../../../shared/Math/SVector2D.js");
typeCheck = require("../../../../shared/Debugging/StypeCheck.js");
Entity = require("../SEntity.js");

class QuadTree {
    constructor(cx, cy, w, h, level) {
        this._level = level; //
        this._entities = {}; // Entity container with ID-mapping
        this._length = 0; // Amount of entities inserted in the container
        this._pos = new Vector2D(cx * w, cy * h); // Cell positions to coordinates
        this._w = w;
        this._h = h;
        this._cell = {x: cx, y: cy};
        this._nodes = []; // Holds subdivisions
        this._divided = false;
        QuadTree.rects.push({
            x: this.pos.x,
            y: this.pos.y,
            w: this._w,
            h: this._h,
        });
    }

    get width() {
        return this._w;
    }

    get height() {
        return this._h;
    }

    withinBoundary(e) {
        return this.pos.y + this.height > e.pos.y
            &&  this.pos.y < (e.pos.y + e.height)
            && this.pos.x + this.width > e.pos.x
            &&  this.pos.x < (e.pos.x + e.width);
    }

    // Range is a bounding rectangle (SRect)
    query(range) {
        let found = [];
        if (!this.withinBoundary(range)) {
            return found; //Empty array
        } else {
            for (var id of this._entities) {
                var entity = this._entities[id];
                if (range.overlapEntity(entity)) {
                    found.push(entity);
                }
            }

            if (this._divided) {
                for (var qt of this._nodes) {
                    found.concat(qt.query(range))
                }
            }
            return found;
        }
    }

    subdivide() {
        var subWidth = this._w / 2;
        var subHeight = this._h / 2;

        this._nodes[0] = new QuadTree(this._cell.x, this._cell.y, subWidth, subHeight, this._level + 1);
        this._nodes[1] = new QuadTree(this._cell.x + 1, this._cell.y, subWidth, subHeight, this._level + 1);
        this._nodes[2] = new QuadTree(this._cell.x, this._cell.y + 1, subWidth, subHeight, this._level + 1);
        this._nodes[3] = new QuadTree(this._cell.x + 1, this._cell.y + 1, subWidth, subHeight, this._level + 1);

        this._divided = true;

        this._nodes.forEach(node => {
            console.log('\x1b[36m%s\x1b[0m', 'SUBDIVISION SUCCESS', node.pos);
        });
    }

    // TODO: Maybe store the ID in the QuadTree instead.
    // Places a reference to an entity in the container
    // Subdivides if we reach the max count
    insert(entity) {
        // We don't want to insert an entity that isn't
        // in the boundaries.
        if (!this.withinBoundary(entity)) {
            console.log('\x1b[36m%s\x1b[0m', 'OUT OF BOUNDS:', entity._id);
            return false;
        }

        if (this._length < QuadTree.MAX_ENTITIES) {
            this._length++;
            typeCheck.instance(Entity, entity);
            this._entities[entity.id] = entity;
            return true;
        } else {
            if (!this._divided) {
                this.subdivide();
            }
            for (var node of this._nodes) {
                // Preventing duplicate insertion
                if (node.insert(entity)) {
                    return true;
                }
            }
        }

        console.log('\x1b[36m%s\x1b[0m', 'COUNT:', this._length);
    }

    remove(entity) {
        delete this._entities[entity.id];
    }

    get pos() {
        return this._pos;
    }

    get bounds() {
        return {
            x: this._w,
            y: this._h,
        };
    }

}

QuadTree.MAX_ENTITIES = 1; // TODO: Set it back to 10. This is a test value for now.
QuadTree.MAX_LEVEL = 5;
QuadTree.MAX_NODE_COUNT = 4;
QuadTree.UNBOUND = -1;

QuadTree.rects = [];

module.exports = QuadTree;