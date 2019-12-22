const AttackWeapon = require("./Base/AttackWeapon.js");
const ModAbility = require("./Base/ModAbility.js");
const SuperAbility = require("./Base/SuperAbility.js");
const Projectile = require("./AttackEntities/Projectile.js");
const Damage = require("../../../Mechanics/Damage/Damage.js");
const DamageOverTime = require("../../../Mechanics/Effect/DamageOverTime.js");
const HitScanner = require("../../../Mechanics/Scanners/HitScanner.js");
const Vector2D = require("../../../../../shared/code/Math/SVector2D.js");
const SEntity = require("../../SEntity.js");
const Alive = require("../../Traits/Alive.js");


// Projectile fired by the firewall
class Firepellet extends Projectile {
    static DAMAGE = 8;
    constructor(owner, weaponID, x, y, angle, entityManager) {
        super(owner, x, y, 2, 1, angle, 4 * 100);
    }

    onTileHit(entityManager, deltaTime) {
        this.remove();
    }

    onEnemyHit(player, entityManager) {
        Damage.inflict(this.getOwner(), player, entityManager, this.constructor.DAMAGE);
        this.remove();
    }
}

class BurnEffect extends DamageOverTime {}

class FireDamage extends SEntity {
    static DAMAGE_PER_TICK = 2.5;
    static DAMAGE_TICK_SPEED = .25;
    static DAMAGE_DURATION = 5;
    constructor(x, y, w, h, player) {
        super(x, y, w, h);
        this.player = player;
    }

    update(game, deltaTime) {
        super.update(game, deltaTime);
        let player = this.player;
        if (player) {
            this.pos.x = player.center.x - player.width / 2;
            this.pos.y = player.center.y - player.height / 2;
            if (player.movementState.direction !== "right")
                this.pos.x -= this.width;
        }
    }

    onEntityCollision(entity, entityManager) {
        super.onEntityCollision(entity, entityManager);
        if (entity instanceof Alive) {
            if (!entity.isTeammate(this.player)) {
                if (!entity.effectsData[BurnEffect.name]) {
                    entity.applyEffect(new BurnEffect(this.player, entity, FireDamage.DAMAGE_PER_TICK,
                        FireDamage.DAMAGE_TICK_SPEED, FireDamage.DAMAGE_DURATION));
                }
            }
        }
    }
}

class FirewallSuperAbility extends SuperAbility {

}

class FirewallModAbility extends ModAbility {
    constructor() {
        super(5, 5);
        this.scanner = new HitScanner([], false);
        this.w = 64;
    }

    onActivation(composedWeapon, entityManager, deltaTime) {
        composedWeapon.secondaryUse = true;
        entityManager.spawnEntity(composedWeapon.center.x, composedWeapon.center.y,
            composedWeapon.damageBox = new FireDamage(composedWeapon.center.x + this.w/2, composedWeapon.center.y + 16/2, this.w, 16, composedWeapon.getOwner())
        );
    }

    buffs(composedWeapon, entityManager, deltaTime) {
        this.checkPos = new Vector2D(composedWeapon.center.x + (composedWeapon.getOwner().movementState.direction === "left" ? -1 : 1) * 64, composedWeapon.center.y);
        this.scanner.scan(composedWeapon.center, this.checkPos, entityManager, entityManager.tileMap, false);
        if (Math.abs(this.scanner.end.x - composedWeapon.center.x) < 64)
            this.w = composedWeapon.damageBox.width = composedWeapon.wallWidth = Math.abs(this.scanner.end.x - composedWeapon.center.x);
        else this.w = composedWeapon.damageBox.width = composedWeapon.wallWidth = 64;
    }

    onDeactivation(composedWeapon, entityManager, deltaTime) {
        composedWeapon.secondaryUse = false;
        if (composedWeapon.damageBox) composedWeapon.damageBox.remove();
        composedWeapon.damageBox = null;
    }

}

class Firewall extends AttackWeapon {
    static _ = (() => {
        Firewall.assignWeaponClassAbilities(FirewallModAbility, FirewallSuperAbility);
        Firewall.addDynamicValues(
            "secondaryUse",
            "wallWidth");
        Firewall.overrideAttackStats(1.25, 6, 120);
    })();

    constructor(x, y) {
        super(x, y);
        this.superAbility.tickChargeGain = 100;
        this.pellets = 4;
    }

    fire(player, entityManager, deltaTime, angle) {
        for (let i = -this.pellets / 2; i < this.pellets / 2; i++) {
            entityManager.spawnEntity(this.center.x, this.center.y,
                new Firepellet(player, this.id, 0, 0, angle + (i / this.pellets * Math.PI / 12), entityManager));
        }
    }
}


module.exports = Firewall;
