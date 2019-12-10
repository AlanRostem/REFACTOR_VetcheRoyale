let r = 0;

/**
 * The actor class representation. Its body is represented as an AABB for simplicity's sake.
 */
class Actor {
    pos = createVector(0, 0);
    vel = createVector(random(-r, r), random(-r, r));
    width = 0;
    height = 0;
    color = 0;
    collisionBoundary = null;

    constructor(x, y, w, h, clr = color(Math.random() * 255, Math.random() * 255, Math.random() * 255)) {
        this.pos.x = x;
        this.pos.y = y;
        this.width = w;
        this.height = h;
        this.color = clr;
        this.entitiesInProximity = {};
        this.entitiesInProximity.collisionBoundary = new CollisionBoundary(x, y, w * 3, h * 3)
    }

    move(x, y) {
        this.pos.x = x;
        this.pos.y = y;
    }

    update(collisionGrid) {
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
        this.entitiesInProximity.collisionBoundary.update(this);
        if (this.pos.x < 0) {
            this.pos.x = 0;
            this.vel.x *= -1;
        }

        if (this.pos.x + this.width > width) {
            this.pos.x = width - this.width;
            this.vel.x *= -1;
        }

        if (this.pos.y < 0) {
            this.pos.y = 0;
            this.vel.y *= -1;
        }

        if (this.pos.y + this.height > height) {
            this.pos.y = height - this.height;
            this.vel.y *= -1;
        }

        collisionGrid.insert(this);
        collisionGrid.update(this, this.forEachEntity.bind(this));
    }

    forEachEntity(cell, grid) {
        //noStroke();
        //fill(0, 180, 0)
        //rect(cell.cx * grid.cellWidth, cell.cy * grid.cellHeight, grid.cellWidth, grid.cellHeight);
        for (let e of cell) {
            if (e === this) {
                continue;
            }
            if (this.overlap(e) && this.doIt) {
                grid.remove(e);
                e.removed = true;
                stroke(color(255, 0, 0));
                strokeWeight(1);
                noFill();
                rect(e.pos.x - 2, e.pos.y - 2, e.width + 4, e.height + 4);
            }
        }
    }

    overlap(e) {
        return this.pos.y + this.height > e.pos.y
            && this.pos.y < (e.pos.y + e.height)
            && this.pos.x + this.width > e.pos.x
            && this.pos.x < (e.pos.x + e.width);
    }

    draw() {
        noStroke();
        fill(this.color);
        rect(this.pos.x, this.pos.y, this.width, this.height);
        noFill();
        //this.collisionBoundary.draw();
    }
}