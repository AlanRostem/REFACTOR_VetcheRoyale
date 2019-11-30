const Vector2D = require("../../../../../../shared/code/Math/SVector2D");
const Physical = require("../../../Traits/Physical.js");
const Alive = require("../../../Traits/Alive.js");
const TileCollider = require("../../../../TileBased/TileCollider.js");
const WeaponItem = require("../Base/WeaponItem.js");
const HitScanner = require("../../../../Mechanics/Scanners/HitScanner.js");

// Moving damaging object.
class Projectile extends Physical {
    static _ = (() => {
        Projectile.addStaticValues("ownerID");
    })();

    constructor(ownerID, x, y, w, h, angle, speed, arc = 0, shouldRemove = true) {
        super(x, y, w, h);
        this.ownerID = ownerID;
        this.shouldRemove = shouldRemove;
        this.speed = speed;
        this.angle = angle;
        this.vel.x = Math.cos(angle) * speed;
        this.vel.y = Math.sin(angle) * speed;
        this.hitTile = false;
        this.alreadyCollided = false;

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
        if (this.shouldRemove) this.remove();
        this.hitTile = true;
    }

    onBottomCollision(tile) {
        super.onBottomCollision(tile);
        if (this.shouldRemove) this.remove();
        this.hitTile = true;
    }

    onRightCollision(tile) {
        super.onRightCollision(tile);
        if (this.shouldRemove) this.remove();
        this.hitTile = true;
    }

    onTopCollision(tile) {
        super.onTopCollision(tile);
        if (this.shouldRemove) this.remove();
        this.hitTile = true;
    }

    // Callback when hitting a tile
    onTileHit(entityManager, deltaTime) {

    }

    // Callback when hitting a player (non-teammates)
    onPlayerHit(player, entityManager) {

    }

    getOwner(entityManager) {
        if (entityManager.getEntity(this.ownerID)) {
            return entityManager.getEntity(this.ownerID);
        }
        console.log(new Error("Player was undefined in getOwner called at " + this.constructor.name + "because id was " + this.ownerID).stack);
        return WeaponItem.EMPTY_PLAYER;
    }

    update(entityManager, deltaTime) {
        let d = Vector2D.abs(this.vel) * deltaTime * 2;
        if (d > 0) {
            this.setQuadTreeRange(d, d);
        }
        super.update(entityManager, deltaTime);
        if (this.hitTile) {
            this.onTileHit(entityManager, deltaTime);
            this.hitTile = false;
        }
    }

    forEachNearbyEntity(entity, entityManager, deltaTime) {
        if (entity instanceof Alive) {
            if (HitScanner.intersectsEntity({
                x: this.center.x - this.vel.x * deltaTime,
                y: this.center.y - this.vel.y * deltaTime,
            }, this.center, entity)) {
                this.onEntityCollision(entity, entityManager);
            }

        }
    }

    // Checks if the projectile belongs to the player
    // who fired it.
    onEntityCollision(entity, entityManager) {
        super.onEntityCollision(entity, entityManager);
        if (entity instanceof Alive) {
            if (!entity.team) return; // TODO: FIX HACK
            if (!entity.team.hasEntity(this.ownerID)) {
                if (this.alreadyCollided === false) { // TODO: Find out why this if doesn't work having it on top of: if (entity instanceof Alive) {
                    this.onPlayerHit(entity, entityManager);
                    if (this.shouldRemove) {
                        this.remove();
                    }
                    this.alreadyCollided = true;
                }
            }
        }
    }
}

TileCollider.createCollisionResponse("Projectile", "ONE_WAY", "Y");
TileCollider.createCollisionResponse("Projectile", "SLOPE_UP_LEFT", "Y");
TileCollider.createCollisionResponse("Projectile", "SLOPE_UP_RIGHT", "Y");


module.exports = Projectile;