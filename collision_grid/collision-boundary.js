/**
 * Centralized rectangle with boundaries relative to its center.
 */
class CollisionBoundary {
    pos = createVector(0, 0);
    bounds = createVector(0, 0);

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

    draw() {
        stroke(0);
        noFill();
        rect(this.pos.x, this.pos.y,
            this.bounds.x,
            this.bounds.y,
        );
    }
}