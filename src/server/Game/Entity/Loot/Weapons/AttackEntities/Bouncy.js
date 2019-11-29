const Projectile = require("./Projectile.js");
// A bouncy projectile. Requires to be manually removed in overridden class.
class Bouncy extends Projectile {
    constructor(ownerID, x, y, w, h, angle, speed, arc, bounceFactor = 1) {
        super(ownerID, x, y, w, h, angle, speed, arc, false);
        this.vy = 0;
        this.vx = 0;
        this.bounceFactor = bounceFactor;
        this.setPhysicsConfiguration("stop", false);
    }

    onTopCollision(tile) {
        super.onTopCollision(tile);
        this.side.top = true;
        this.vy = -this.vel.y * this.bounceFactor;
    }

    onBottomCollision(tile) {
        super.onBottomCollision(tile);
        this.side.bottom = true;
        this.vy = -this.vel.y * this.bounceFactor;
    }

    onLeftCollision(tile) {
        super.onLeftCollision(tile);
        this.side.left = true;
        this.vx = -this.vel.x * this.bounceFactor;
    }

    onRightCollision(tile) {
        super.onRightCollision(tile);
        this.side.right = true;
        this.vx = -this.vel.x * this.bounceFactor;
    }

    update(entityManager, deltaTime) {
        super.update(entityManager, deltaTime);
        if (this.side.left || this.side.right) {
            this.vel.x = this.vx;
        }

        if (this.side.bottom || this.side.top) {
            this.vel.y = this.vy;
        }
    }

    onTileHit(entityManager, deltaTime) {
        super.onTileHit(entityManager, deltaTime);
    }


}

module.exports = Bouncy;