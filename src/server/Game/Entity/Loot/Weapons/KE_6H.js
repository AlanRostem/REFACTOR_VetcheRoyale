const Vector2D = require("../../../../../shared/code/Math/SVector2D.js");
const AttackWeapon = require("./Base/AttackWeapon.js");
const Bouncy = require("./AttackEntities/Bouncy.js");
const Tile = require("../../../TileBased/Tile.js");
const Damage = require("../../../Mechanics/Damage/Damage.js");
const AOEWormHoleScanner = require("../../../Mechanics/Scanners/AOEWormHoleScanner.js");
const AOEKnockBackDamage = require("../../../Mechanics/Damage/AOEKnockBackDamage.js");
const ModAbility = require("./Base/ModAbility.js");
const SuperAbility = require("./Base/SuperAbility.js");

// Projectile fired by the KE-6H weapon
class KineticBomb extends Bouncy {
    constructor(weaponRef, owner, weaponID, x, y, angle, entityManager) {
        super(owner, x, y, 2, 2, angle, 120, 0);
        this.hits = 6;
        this.weaponID = weaponID;
        this.directHitDmg = new Damage(8, owner);

        let exceptions = {};
        for (let key in owner.team.players) {
            exceptions[key] = owner.team.players[key];
        }
        delete exceptions[owner.id];
        this.weapon = weaponRef;

        this.areaDmg = new AOEKnockBackDamage(owner, x, y, Tile.SIZE * 3, 300, 15, exceptions);
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

class KE_6HModAbility extends ModAbility {
    static _ = (() => {
        KE_6HModAbility.configureStats(.2, 4);
    })();

    onActivation(composedWeapon, entityManager, deltaTime) {
        composedWeapon.kineticImplosion = true;
        composedWeapon.canFire = false;
        composedWeapon.followPoint.x = composedWeapon.getOwner().input.mouseData.world.x;
        composedWeapon.followPoint.y = composedWeapon.getOwner().input.mouseData.world.y;
        RETRACTION_SCANNER.ownerID = composedWeapon.playerID;
        RETRACTION_SCANNER.pos = composedWeapon.followPoint;
        RETRACTION_SCANNER.entityExceptions = composedWeapon.getOwner().team.players;
        RETRACTION_SCANNER.areaScan(composedWeapon.followPoint, entityManager);
    }

    onDeactivation(composedWeapon, entityManager, deltaTime) {
        composedWeapon.kineticImplosion = false;
        composedWeapon.canFire = true;
    }
}

class KE_6HSuperAbility extends SuperAbility {

}

class KE_6H extends AttackWeapon {
    static _ = (() => {
        KE_6H.assignWeaponClassAbilities(KE_6HModAbility, KE_6HSuperAbility);
        KE_6H.overrideAttackStats(2.5, 8, 100);
    })();

    constructor(x, y) {
        super(x, y, 0, 0, 0);
        this.followPoint = new Vector2D(0, 0);
        this.followPoint.radius = 2;
    }

    fire(player, entityManager, deltaTime, angle) {
        entityManager.spawnEntity(this.center.x, this.center.y,
            new KineticBomb(this, player, this.id, 0, 0,
                angle, entityManager));
    }
}

module.exports = KE_6H;