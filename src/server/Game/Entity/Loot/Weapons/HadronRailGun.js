const HitScanWeapon = require("./Base/HitScanWeapon.js");
const FiringMechanism = require("./Base/FiringMechanism.js");
const ModAbility = require("./Base/ModAbility.js");
const SuperAbility = require("./Base/SuperAbility.js");
const Projectile = require("./AttackEntities/Projectile.js");
const Entity = require("../../SEntity.js");
const Damage = require("../../../Mechanics/Damage/Damage.js");
const HitScanner = require("../../../Mechanics/Scanners/HitScanner.js");
const Vector2D = require("../../../../../shared/code/Math/SVector2D.js");
const Alive = require("../../Traits/Alive.js");

const ZERO = 0;
const HUNDRED = 100;
class FMPartialChargeShot extends FiringMechanism {
    static MAX_TICK_TIME = 0.1;
    static CHARGE_GAIN_TICK = 10;
    constructor(gun) {
        super(gun);
        this.chargePercent = ZERO;
        this.chargePercentGainPerTick = FMPartialChargeShot.CHARGE_GAIN_TICK;
        this.currentTick = ZERO;
        this.maxTickTime = FMPartialChargeShot.MAX_TICK_TIME;
        this.canShoot = false;
    }

    reset() {
        super.reset();
        this.chargePercent = ZERO;
        this.currentTick = ZERO;
        this.canShoot = false;
        this.holdingDownFireButton = false;
    }

    firingUpdate(weapon, player, entityManager, deltaTime) {
        super.firingUpdate(weapon, player, entityManager, deltaTime);
        if (weapon.currentFireTime <= ZERO && weapon.canFire) {
            if (this.holdingDownFireButton) {
                if (!this.canShoot) {
                    this.chargePercent += this.chargePercentGainPerTick;
                }
                this.canShoot = true;
                if (this.chargePercent < HUNDRED) {
                    if (this.currentTick >= this.maxTickTime) {
                        this.currentTick = ZERO;
                        this.chargePercent += this.chargePercentGainPerTick;
                    }
                } else {
                    this.chargePercent = HUNDRED;
                    this.currentTick = ZERO;
                }
                this.currentTick += deltaTime;
                weapon.canReload = false;
            } else {
                if (this.canShoot) {
                    this.canShoot = false;
                    this.doSingleFire(weapon, player, entityManager, deltaTime);
                    this.currentTick = ZERO;
                }
                weapon.canReload = true;
                this.chargePercent = ZERO;
            }
        }
    }
}


const ONE = 1;
class HadronParticleLine extends Entity {
    static _ = (() => {
        HadronParticleLine.addStaticValues("p0", "p1");
    })();
    static DMG_PER_TICK = 2;
    static DMG_TICK_TIME = 0.2;
    static MAX_LIFE = 3;

    constructor(p0, p1, owner) {
        super(0, 0, 0, 0);
        this.p0 = new Vector2D(p0.x, p0.y);
        this.p1 = new Vector2D(p1.x, p1.y);
        let w = (p1.x - p0.x);
        let h = (p1.y - p0.y);
        this.pos.x = p0.x + w / 2;
        this.pos.y = p0.y + h / 2;
        this.owner = owner;
        this.setCollisionRange(Math.abs(w), Math.abs(h));
        this.currentTime = 0;
        this.doDMG = false;
        this.life = HadronParticleLine.MAX_LIFE;
        this.entitiesOnLine = {};
    }

    forEachNearbyEntity(entity, entityManager) {
        super.forEachNearbyEntity(entity, entityManager);
        if (entity instanceof Alive) {
            if (!entity.isTeammate(this.owner)) {
                if (HitScanner.intersectsEntity(this.p0, this.p1, entity)) {
                    if (!this.entitiesOnLine.hasOwnProperty(entity.id)) {
                        this.entitiesOnLine[entity.id] = ONE;
                        Damage.inflict(this.owner, entity, entityManager, HadronParticleLine.DMG_PER_TICK);
                    }
                    if (this.doDMG) {
                        if (!entity.isTeammate(this.owner)) {
                            Damage.inflict(this.owner, entity, entityManager, HadronParticleLine.DMG_PER_TICK);
                        }
                    }
                } else {
                    if (this.entitiesOnLine.hasOwnProperty(entity.id)) {
                        delete this.entitiesOnLine[entity.id];
                    }
                }
            }
        }
    }

    update(game, deltaTime) {
        super.update(game, deltaTime);
        this.doDMG = false;
        if (this.currentTime <= ZERO) {
            this.currentTime = HadronParticleLine.DMG_TICK_TIME;
            this.doDMG = true;
        }
        this.currentTime -= deltaTime;

        if (this.life <= ZERO) this.remove();
        this.life -= deltaTime;
    }
}

class HadronRailGun extends HitScanWeapon {
    static MAX_DAMAGE = 65;
    static _ = (() => {
        HadronRailGun.setMaxRange(480);
        HadronRailGun.addDynamicValues("scanHitPos", "chargePercent");
        HadronRailGun.assignWeaponClassAbilities(HadronRailGun.ModAbilityClass, HadronRailGun.SuperAbilityClass, FMPartialChargeShot);
        HadronRailGun.overrideAttackStats(2.2, 7, 120, 1, 0, 0,
            0, 1);
    })();

    constructor(x, y) {
        super(x, y);
        this.chargePercent = 0;
    }

    fire(player, entityManager, deltaTime, angle) {
        super.fire(player, entityManager, deltaTime, angle);
        if (this.firerer.chargePercent === HUNDRED) {
            let line = new HadronParticleLine(this.center, this.scanner.end, this.getOwner());
            entityManager.spawnEntity(line.pos.x, line.pos.y, line);
        }
    }

    updateWhenEquipped(player, entityManager, deltaTime) {
        super.updateWhenEquipped(player, entityManager, deltaTime);
        this.chargePercent = this.firerer.chargePercent;
    }

    onEntityHit(entity, entityManager, angle) {
        Damage.inflict(this.getOwner(), entity, entityManager, this.firerer.chargePercent / HUNDRED * HadronRailGun.MAX_DAMAGE | ZERO);
    }
}

module.exports = HadronRailGun;