const Projectile = require("./Projectile.js");
const TileCollider = require("../../../../TileBased/TileCollider.js");
const Tile = require("../../../../TileBased/Tile.js");
// A bouncy projectile. Requires to be manually removed in overridden class.
class Bouncy extends Projectile {
    constructor(ownerID, x, y, w, h, cos, sin, speed, arc) {
        super(ownerID, x, y, w, h, cos, sin, speed, arc, false);
        this.vy = 0;
        this.vx = 0;
        this.setPhysicsConfiguration("stop", false);
        this.setCollisionResponseID("Bouncy");
    }

    onTopCollision(tile) {
        super.onTopCollision(tile);
        this.side.top = true;
        this.vy = -this.vel.y;
    }

    onBottomCollision(tile) {
        super.onBottomCollision(tile);
        this.side.bottom = true;
        this.vy = -this.vel.y;
    }

    onLeftCollision(tile) {
        super.onLeftCollision(tile);
        this.side.left = true;
        this.vx = -this.vel.x;
    }

    onRightCollision(tile) {
        super.onRightCollision(tile);
        this.side.right = true;
        this.vx = -this.vel.x;
    }

    update(entityManager, deltaTime) {
        super.update(entityManager, deltaTime);
        if (this.side.left || this.side.right)
            this.vel.x = this.vx;

        if (this.side.bottom || this.side.top)
            this.vel.y = this.vy;
    }
}


module.exports = Bouncy;