/**
 * Centralized rectangle with boundaries relative to its center.
 */
class CollisionBoundary {
    pos = {};
    bounds = {};

    constructor(x, y, w, h) {
        this.pos.x = x;
        this.pos.y = y;
        this.bounds.x = w;
        this.bounds.y = h;
    }

    update(entity) {
        this.pos.x = entity.pos.x - this.bounds.x / 2 + entity.width / 2;
        this.pos.y = entity.pos.y - this.bounds.y / 2 + entity.height / 2;
    }

    containsEntity(e) {
        return this.pos.y + this.bounds.y > e.pos.y
            && this.pos.y < (e.pos.y + e.height)
            && this.pos.x + this.bounds.x > e.pos.x
            && this.pos.x < (e.pos.x + e.width);
    }
}

module.exports = CollisionBoundary;