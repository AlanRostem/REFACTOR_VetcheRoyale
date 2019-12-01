const Vector2D = require("../../../../../../shared/code/Math/SVector2D");
const Physical = require("../../../Traits/Physical.js");
const Alive = require("../../../Traits/Alive.js");
const TileCollider = require("../../../../TileBased/TileCollider.js");
const WeaponItem = require("../Base/WeaponItem.js");
const HitScanner = require("../../../../Mechanics/Scanners/HitScanner.js");
const Player = require("../../../Player/SPlayer.js");

/**
 * A moving damaging object. Entities of instance Alive are damaged in
 * different ways if the object hs collision with it
 * @see Alive
 */
class Projectile extends Physical {
    static _ = (() => {
        Projectile.addStaticValues("ownerID");
    })();

    /**
     * @param owner {Player} The entity that projectile belongs to
     * @param x {number} Position in the world
     * @param y {number} Position in the world
     * @param w {number} Collision bounds
     * @param h {number} Collision bounds
     * @param angle {number} The initial angle it was launched at. The projectile moves at this angle
     * @param {number} speed The speed constant
     * @param {number} arc Gravity constant
     * @param {boolean} shouldRemove Boolean value determining whether or not the projectile should disappear upon impact
     */
    constructor(owner, x, y, w, h, angle, speed, arc = 0, shouldRemove = true) {
        super(x, y, w, h);
        this.owner = owner;
        if (!owner.team) {
            console.log(new Error(this.constructor.name + " has an owner without a team! The owner is " + owner.id).stack)
        }
        this.ownerID = owner.id;
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

    /**
     * Callback when hitting a tile on the map
     * @param world {GameWorld} Given world the projectile was spawned in
     * @param deltaTime {number} Time in seconds between each server tick
     */
    onTileHit(world, deltaTime) {

    }

    /**
     * Callback when hitting an enemy (non-teammates)
     * @param world {GameWorld} Given world the projectile was spawned in
     * @param enemy {Alive} The entity that was hit
     */
    onEnemyHit(enemy, world) {

    }

    /**
     * Get the owner of this projectile. Returns a constant object EMPTY_PLAYER which corresponds to
     * a player object with no particular values in order to prevent errors if the owner ID was incorrect.
     * @returns {Player}
     */
    getOwner() {
        if (this.owner) {
            return this.owner;
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
            if (entity.hasTeam()) if(entity.team.hasEntity(this.ownerID)) return;
            if (this.alreadyCollided === false) {
                this.onEnemyHit(entity, entityManager);
                if (this.shouldRemove) {
                    this.remove();
                }
                this.alreadyCollided = true;
            }
        }
    }
}

TileCollider.createCollisionResponse("Projectile", "ONE_WAY", "Y");
TileCollider.createCollisionResponse("Projectile", "SLOPE_UP_LEFT", "Y");
TileCollider.createCollisionResponse("Projectile", "SLOPE_UP_RIGHT", "Y");


module.exports = Projectile;