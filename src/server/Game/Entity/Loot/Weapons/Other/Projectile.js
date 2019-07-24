const Physical = require("../../../Traits/Physical.js");
const Player = require("../../../Player/SPlayer.js");
const Damage = require("../../../../Mechanics/Damage/Damage.js");

class Projectile extends Physical {
    constructor(ownerID, x, y, w, h, cos, sin, speed, arc = 0, shouldRemove = true) {
        super(x, y, w, h);
        this._ownerID = ownerID;
        this._shouldRemove = shouldRemove;
        this.vel.x = cos * speed;
        this.vel.y = sin * speed;
        this._hitTile = false;
        this.setPhysicsConfiguration("gravity", false);
        this.setPhysicsConfiguration("pixelatePos", false);
        if (arc) {
            this.acc.y = arc;
            this.setPhysicsConfiguration("gravity", true);
        }
    }

    onLeftCollision(tile) {
        super.onLeftCollision(tile);
        if (this._shouldRemove) this.remove();
        this._hitTile = true;
    }

    onBottomCollision(tile) {
        super.onBottomCollision(tile);
        if (this._shouldRemove) this.remove();
        this._hitTile = true;
    }

    onRightCollision(tile) {
        super.onRightCollision(tile);
        if (this._shouldRemove) this.remove();
        this._hitTile = true;
    }

    onTopCollision(tile) {
        super.onTopCollision(tile);
        if (this._shouldRemove) this.remove();
        this._hitTile = true;
    }

    onTileHit(entityManager, deltaTime) {

    }

    onPlayerHit(player, entityManager) {

    }

    update(entityManager, deltaTime) {
        super.update(entityManager, deltaTime);
        if (this._hitTile) {
            this.onTileHit(entityManager, deltaTime);
        }
    }

    onEntityCollision(entity, entityManager) {
        super.onEntityCollision(entity, entityManager);
        if (entity instanceof Player) {
            if (!entity.team.array.includes(this._ownerID)) {
                this.onPlayerHit(entity, entityManager);
                if (this._shouldRemove) {
                    this.remove();
                }
            }
        }
    }

}

module.exports = Projectile;