const AttackWeapon = require("./Base/AttackWeapon.js");
const Projectile = require("./AttackEntities/Projectile.js");
const Bouncy = require("./AttackEntities/Bouncy.js");
const Damage = require("../../../Mechanics/Damage/Damage.js");
const Player = require("../../../Entity/Player/SPlayer.js");
const ModAbility = require("./Base/ModAbility.js");
const SuperAbility = require("./Base/SuperAbility.js");

class ATBullet extends Projectile {
    static DAMAGE = 20;

    constructor(owner, wID, x, y, speed, arc, angle) {
        super(owner, x, y, 2, 2, angle, speed, arc, false);
        this.seek = false;
        this.lifeTime = 10;
        this.wID = wID;
        this.findPlayers = false;
        this.weapon = null;
        this.stuck = false;
    }

    update(entityManager, deltaTime) {
        super.update(entityManager, deltaTime);
        if (this.stuck) {
            this.vel.x = (this.stuck.center.x - this.center.x) / deltaTime;
            this.vel.y = (this.stuck.center.y - this.center.y) / deltaTime;
            if (this.stuck.removed || this.stuck.dead) {
                this.remove();
            }
        }
        if (this.seek) {
            this.lifeTime -= deltaTime;
            if (this.lifeTime <= 0) {
                this.remove();
            }
            let owner = this.getOwner();
            if (owner) {
                if (owner.inventory.weapon) {
                    if (owner.inventory.weapon.id === this.wID) {
                        this.findPlayers = true;
                        this.weapon = owner.inventory.weapon;
                    }
                }
            } else {
                this.findPlayers = false;
            }
        }
    }

    forEachNearbyEntity(entity, entityManager, deltaTime) {
        super.forEachNearbyEntity(entity, entityManager, deltaTime);
        if (this.weapon) {
            if (entity instanceof Player) {
                if (entity.id !== this.weapon.playerID && !this.getOwner().isTeammate(entity)) {
                    this.weapon.found[entity.id] = entity.center;
                }
            }
        }
    }

    onEnemyHit(entity, entityManager) {
        if (!this.seek) {
            Damage.inflict(this.getOwner(), entity, entityManager, this.constructor.DAMAGE);
        }
        this.stuck = entity;
        this.startSeek();
    }

    onTileHit(entityManager, deltaTime) {
        super.onTileHit(entityManager, deltaTime);
        this.startSeek();
        this.acc.y = 0;
    }

    startSeek() {
        this.vel.x = this.vel.y = 0;
        this.seek = true;
    }
}

SEEKER_SMOKE_FRICTION = 1.7;

class SeekerSmoke extends Bouncy {
    static _ = (() => {
        SeekerSmoke.addStaticValues("smokeBounds");
        SeekerSmoke.addDynamicValues(
            "findPlayers",
            "taps"
        );
    })();

    static LIFE_DURATION = 10;

    constructor(owner, weapon, x, y, angle) {
        super(owner, x, y, 4, 6, angle, 185, 200, 0.5);
        this.findPlayers = false;
        this.weapon = weapon;
        this.life = this.constructor.LIFE_DURATION;
        this.taps = true;
        this.minSpeed = 10;
        this.smokeBounds = {
            x: 100,
            y: 60,
        };
        this.entityOrder = 2;
    }

    update(entityManager, deltaTime) {
        if (this.taps === true) this.taps = false;

        if (this.side.bottom) {
            this.fric.x = SEEKER_SMOKE_FRICTION;
        }

        if (this.side.top || this.side.bottom || this.side.left || this.side.right) {
            if (!this.findPlayers) this.taps = true;
        }

        if (this.findPlayers) {
            this.life -= deltaTime;
            if (this.life <= 0) {
                this.remove();
            }
        }

        if (Math.abs(this.vel.x | 0) <= this.minSpeed && Math.abs(this.vel.y | 0) <= this.minSpeed && this.side.bottom) {
            this.findPlayers = true;
            this.vel.x = 0;
        }

        if (!this.findPlayers && this.getOwner().input.singleKeyPress(81)) {
            this.findPlayers = true;
            this.vel.x = this.vel.y = this.acc.y = 0;
        }

        super.update(entityManager, deltaTime);
    }
}

const SCOPED_SPEED = 520;
const NORMAL_SPEED = 350;
const ARC = 60;

class CKER90ModAbility extends ModAbility {
    static _ = (() => {
        CKER90ModAbility.configureStats(1, 1, false, 0, true);
    })();


    buffs(composedWeapon, entityManager, deltaTime) {
        let player = composedWeapon.getOwner();
        if (player) {
            composedWeapon.dataIsScoping = player.input.heldDownMapping("modAbility");
        }

        composedWeapon.firerer.maxFireRate = composedWeapon.dataIsScoping ?
            composedWeapon.constructor.SCOPED_FIRE_RATE : composedWeapon.constructor.UNSCOPED_FIRE_RATE
    }

    onDeactivation(composedWeapon, entityManager, deltaTime) {
        composedWeapon.dataIsScoping = false;
    }

}

class CKER90SuperAbility extends SuperAbility {
    static _ = (() => {
        CKER90SuperAbility.configureStats(SeekerSmoke.LIFE_DURATION);
    })();

    constructor() {
        super();
        this.smokeBomb = null;
    }

    onActivation(composedWeapon, entityManager, deltaTime) {
        let player = composedWeapon.getOwner();
        let angle = 0;
        if (player) {
            angle = player.input.mouseData.angleCenter;
        }
        this.smokeBomb = entityManager.spawnEntity(
            composedWeapon.pos.x,
            composedWeapon.pos.y,
            new SeekerSmoke(
                composedWeapon.getOwner(),
                composedWeapon,
                0, 0,
                angle
            ));
    }

    buffs(composedWeapon, entityManager, deltaTime) {
        super.buffs(composedWeapon, entityManager, deltaTime);
        if (this.smokeBomb) {
            if (!this.smokeBomb.findPlayers) {
                this.currentDuration = SeekerSmoke.LIFE_DURATION;
            }
        }
    }

    onDeactivation(composedWeapon, entityManager, deltaTime) {
        super.onDeactivation(composedWeapon, entityManager, deltaTime);
        this.smokeBomb = null;
    }

}

class CKER90 extends AttackWeapon {
    static SCOPED_FIRE_RATE = 60;
    static UNSCOPED_FIRE_RATE = 1.5 * 60;
    static _ = (() => {
        CKER90.assignWeaponClassAbilities(CKER90ModAbility, CKER90SuperAbility);
        CKER90.addDynamicValues(
            "dataIsScoping",
            "found");
        CKER90.overrideAttackStats(2, 10, CKER90.UNSCOPED_FIRE_RATE);
    })();

    constructor(x, y) {
        super(x, y);
        this.dataIsScoping = false;
        this.found = {};
        this.entityType = "AttackWeapon";
    }

    update(entityManager, deltaTime) {
        this.found = {};
        super.update(entityManager, deltaTime);
    }

    fire(player, entityManager, deltaTime, angle) {
        entityManager.spawnEntity(this.pos.x, this.pos.y,
            new ATBullet(player, this.id, this.pos.x, this.pos.y,
                this.dataIsScoping ? SCOPED_SPEED : NORMAL_SPEED,
                this.dataIsScoping ? 0 : ARC,
                angle));
    }

    onDrop(player, entityManager, deltaTime) {
        super.onDrop(player, entityManager, deltaTime);
        this.dataIsScoping = false;
    }
}


/*
C-KER .90_reload_start,512,512,480,28
C-KER .90_reload_end,512,540,480,28
*/
module.exports = CKER90;
