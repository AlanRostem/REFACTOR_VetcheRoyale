const Physical = require("../../../Traits/Physical.js");
const Player = require("../../../Player/SPlayer.js");
const Damage = require("../../../../Mechanics/Damage/Damage.js");
const TileCollider = require("../../../../TileBased/TileCollider.js");

// Moving damaging object.
class Projectile extends Physical {
    constructor(ownerID, x, y, w, h, angle, speed, arc = 0, shouldRemove = true) {
        super(x, y, w, h);
        this._ownerID = ownerID;
        this._shouldRemove = shouldRemove;
        this.vel.x = Math.cos(angle) * speed;
        this.vel.y = Math.sin(angle)* speed;
        this._hitTile = false;
        this.setPhysicsConfiguration("gravity", false);
        this.setPhysicsConfiguration("pixelatePos", false);
        this.setCollisionResponseID("Projectile");
        this.setQuadTreeRange(w * 2, h * 2);
        if (arc) {
            this.acc.y = arc; // Gravity for the projectile
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

    // Callback when hitting a tile
    onTileHit(entityManager, deltaTime) {

    }

    // Callback when hitting a player (non-teammates)
    onPlayerHit(player, entityManager) {

    }

    getOwner(entityManager) {
        return entityManager.getEntity(this._ownerID);
    }

    update(entityManager, deltaTime) {
        super.update(entityManager, deltaTime);
        if (this._hitTile) {
            this.onTileHit(entityManager, deltaTime);
            this._hitTile = false;
        }
    }

    // Checks if the projectile belongs to the player
    // who fired it.
    onEntityCollision(entity, entityManager) {
        super.onEntityCollision(entity, entityManager);
        if (entity instanceof Player) {
            if (!entity.team.hasEntity(this._ownerID)) {
                this.onPlayerHit(entity, entityManager);
                if (this._shouldRemove) {
                    this.remove();
                }
            }
        }
    }

}

TileCollider.createCollisionResponse("Projectile", "ONE_WAY", "Y");
TileCollider.createCollisionResponse("Projectile", "SLOPE_UP_LEFT", "Y");
TileCollider.createCollisionResponse("Projectile", "SLOPE_UP_RIGHT", "Y");


module.exports = Projectile;