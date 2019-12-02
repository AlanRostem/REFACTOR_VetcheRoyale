const Vector2D = require("../../../../../shared/code/Math/SVector2D.js");
const AttackWeapon = require("./Base/AttackWeapon.js");
const Bouncy = require("./AttackEntities/Bouncy.js");
const Tile = require("../../../TileBased/Tile.js");
const Damage = require("../../../Mechanics/Damage/Damage.js");
const AOEWormHoleScanner = require("../../../Mechanics/Scanners/AOEWormHoleScanner.js");
const AOEKnockBackDamage = require("../../../Mechanics/Damage/AOEKnockBackDamage.js");


// Projectile fired by the KE-6H weapon
class KineticBomb extends Bouncy {
    constructor(weaponRef, owner, weaponID, x, y, angle, entityManager) {
        super(owner, x, y, 2, 2, angle, 120, 0);
        this.hits = 6;
        this.weaponID = weaponID;
        this.directHitDmg = new Damage(8, owner.id);

        let exceptions = {};
        for (let key in owner.team.players) {
            exceptions[key] = owner.team.players[key];
        }
        delete exceptions[owner.id];
        this.weapon = weaponRef;

        this.areaDmg = new AOEKnockBackDamage(owner.id, x, y, Tile.SIZE * 3, 300, 15, exceptions);
    }

    onTileHit(entityManager, deltaTime) {
        super.onTileHit(entityManager, deltaTime);
        this.hits--;
    }

    onEnemyHit(player, entityManager) {
        this.directHitDmg.inflict(player, entityManager);
        this.detonate(entityManager);
    }

    detonate(entityManager) {
        this.areaDmg.x = this.center.x;
        this.areaDmg.y = this.center.y;
        this.areaDmg.applyAreaOfEffect(entityManager);
        this.remove();
    }

    update(entityManager, deltaTime) {
        super.update(entityManager, deltaTime);

        if (this.hits <= 0) {
            this.detonate(entityManager);
        }

        if (!this.weapon) return;
        if (this.weapon.kineticImplosion) {
            this.followPoint = true;
            this.point = this.weapon.followPoint;
            this.hits = 1;
        }

        if (this.followPoint) {
            let angle = Vector2D.angle(this.center, this.point);
            let d = Vector2D.distance(this.center, this.point);
            this.vel.x = Math.cos(angle) * d * 10;
            this.vel.y = Math.sin(angle) * d * 10;
            if (Vector2D.distance(this.center, this.point) < this.point.radius) {
                this.detonate(entityManager);
            }
        }
    }
}

const RETRACTION_SCANNER = new AOEWormHoleScanner(null, Tile.SIZE * 6, null, .2, 350, null);

class KE_6H extends AttackWeapon {
    constructor(x, y) {
        super(x, y, "KE-6H", 0, 0, 0);
        this.followPoint = new Vector2D(0, 0);
        this.followPoint.radius = 2;
        this.configureAttackStats(2.5, 8, 1, 100);

        this.modAbility.configureStats(.2, 4);
        this.modAbility.onActivation = (composedWeapon, entityManager, deltaTime) => {
            composedWeapon.kineticImplosion = true;
            composedWeapon.canFire = false;
            this.followPoint.x = this.getOwner(entityManager).input.mouseData.world.x;
            this.followPoint.y = this.getOwner(entityManager).input.mouseData.world.y;
            RETRACTION_SCANNER.ownerID = this.playerID;
            RETRACTION_SCANNER.pos = this.followPoint;
            RETRACTION_SCANNER.entityExceptions = this.getOwner(entityManager).team.players;
            RETRACTION_SCANNER.areaScan(this.followPoint, entityManager);
        };

        this.modAbility.onDeactivation = (composedWeapon, entityManager, deltaTime) => {
            composedWeapon.kineticImplosion = false;
            composedWeapon.canFire = true;
        };

    }

    fire(player, entityManager, deltaTime, angle) {
        entityManager.spawnEntity(this.center.x, this.center.y,
            new KineticBomb(this, player, this.id, 0, 0,
                angle, entityManager));
    }
}


module.exports = KE_6H;