const HitScanWeapon = require("./Base/HitScanWeapon.js");
const FiringMechanism = require("./Base/FiringMechanism.js");
const SuperAbility = require("./Base/SuperAbility.js");
const Projectile = require("./AttackEntities/Projectile.js");
const Entity = require("../../SEntity.js");
const Damage = require("../../../Mechanics/Damage/Damage.js");
const HitScanner = require("../../../Mechanics/Scanners/HitScanner.js");
const Vector2D = require("../../../../../shared/code/Math/SVector2D.js");
const Alive = require("../../Traits/Alive.js");

class FMPartialChargeShot extends FiringMechanism {
    constructor(gun) {
        super(gun);
        this.chargePercent = 0;
        this.chargePercentGainPerTick = 10;
        this.currentTick = 0;
        this.maxTickTime = 0.15;
        this.canShoot = false;
    }

    firingUpdate(weapon, player, entityManager, deltaTime) {
        super.firingUpdate(weapon, player, entityManager, deltaTime);
        if (weapon.currentFireTime <= 0 && weapon.canFire) {
            if (this.holdingDownFireButton) {
                if (!this.canShoot) {
                    this.chargePercent += this.chargePercentGainPerTick;
                }
                this.canShoot = true;
                if (this.chargePercent < 100) {
                    if (this.currentTick >= this.maxTickTime) {
                        this.currentTick = 0;
                        this.chargePercent += this.chargePercentGainPerTick;
                    }
                } else {
                    this.chargePercent = 100;
                    this.currentTick = 0;
                }
                this.currentTick += deltaTime;
            } else {
                if (this.canShoot) {
                    this.canShoot = false;
                    this.doSingleFire(weapon, player, entityManager, deltaTime);
                    this.currentTick = 0;
                }
                this.chargePercent = 0;
            }
        }
    }
}

const ONE = 1;

class HadronParticleLine extends Entity {
    static _ = (() => {
        HadronParticleLine.addDynamicValues("p0", "p1");
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
        this.life = Infinity; HadronParticleLine.MAX_LIFE;
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
        this.boxX = this.entitiesInProximity.collisionBoundary.bounds.x;
        this.boxY = this.entitiesInProximity.collisionBoundary.bounds.y;
        this.doDMG = false;
        if (this.currentTime <= 0) {
            this.currentTime = HadronParticleLine.DMG_TICK_TIME;
            this.doDMG = true;
        }
        this.currentTime -= deltaTime;

        if (this.life <= 0) this.remove();
        this.life -= deltaTime;
    }
}

class HadronRailGun extends HitScanWeapon {
    static MAX_DAMAGE = 65;
    static _ = (() => {
        HadronRailGun.setMaxRange(640);
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
        if (this.firerer.chargePercent === 100) {
            let line = new HadronParticleLine(this.center, this.scanner.end, this.getOwner());
            entityManager.spawnEntity(line.pos.x, line.pos.y, line);
        }
    }

    updateWhenEquipped(player, entityManager, deltaTime) {
        super.updateWhenEquipped(player, entityManager, deltaTime);
        this.chargePercent = this.firerer.chargePercent;
    }

    onEntityHit(entity, entityManager, angle) {
        Damage.inflict(this.getOwner(), entity, entityManager, this.firerer.chargePercent / 100 * HadronRailGun.MAX_DAMAGE | 0);
    }
}

module.exports = HadronRailGun;