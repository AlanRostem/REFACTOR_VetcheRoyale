const Vector2D = require("../../../../../../shared/code/Math/SVector2D");
const Physical = require("../../../Traits/Physical.js");
const Player = require("../../../Player/SPlayer.js");
const Alive = require("../../../Traits/Alive.js");
const Damage = require("../../../../Mechanics/Damage/Damage.js");
const TileCollider = require("../../../../TileBased/TileCollider.js");
const Tile = require("../../../../TileBased/Tile.js");
const WeaponItem = require("../Base/WeaponItem.js");

// Moving damaging object.
class Projectile extends Physical {
    constructor(ownerID, x, y, w, h, angle, speed, arc = 0, shouldRemove = true) {
        super(x, y, w, h);
        this.ownerID = ownerID;
        this.shouldRemove = shouldRemove;
        this.speed = speed;
        this.angle = angle;
        this.vel.x = Math.cos(angle) * speed;
        this.vel.y = Math.sin(angle) * speed;
        this.hitTile = false;
        this._alreadyCollided = false;

        this.addStaticSnapShotData(["ownerID"]);

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

    set alreadyCollided(v) {
        this._alreadyCollided = v;
    }

    get alreadyCollided() {
        return this._alreadyCollided;
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
            let e = entity;
            let a = {
                x: this.center.x - this.vel.x * deltaTime,
                y: this.center.y - this.vel.y * deltaTime,
            };
            let b = this.center;

            if (Vector2D.intersect(a, b, e.topLeft, e.bottomLeft)) {
                this.onEntityCollision(e, entityManager);
                return;
            }

            if (Vector2D.intersect(a, b, e.topLeft, e.topRight)) {
                this.onEntityCollision(e, entityManager);
                return;
            }

            if (Vector2D.intersect(a, b, e.topRight, e.bottomRight)) {
                this.onEntityCollision(e, entityManager);
                return;
            }

            if (Vector2D.intersect(a, b, e.bottomLeft, e.bottomRight)) {
                this.onEntityCollision(e, entityManager);
                return;
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