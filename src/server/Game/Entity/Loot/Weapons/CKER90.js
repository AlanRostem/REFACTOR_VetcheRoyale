const AttackWeapon = require("./Base/AttackWeapon.js");
const Projectile = require("./AttackEntities/Projectile.js");
const Bouncy = require("./AttackEntities/Bouncy.js");
const Damage = require("../../../Mechanics/Damage/Damage.js");
const Player = require("../../../Entity/Player/SPlayer.js");
const ModAbility = require("./Base/ModAbility.js");
const SuperAbility = require("./Base/SuperAbility.js");

class ATBullet extends Projectile {
    constructor(oID, wID, x, y, speed, arc, angle) {
        super(oID, x, y, 2, 2, angle, speed, arc, false);
        this.damage = new Damage(50, oID);
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
            this.pos.x = this.stuck.center.x;
            this.pos.y = this.stuck.center.y;
        }
        if (this.seek) {
            this.lifeTime -= deltaTime;
            if (this.lifeTime <= 0) {
                this.remove();
            }
            let owner = this.getOwner(entityManager);
            if (owner) {
                if (owner.inventory.weapon) {
                    if (owner.inventory.weapon.id === this.wID) {
                        if (owner.inventory.weapon.dataIsScoping) {
                            this.findPlayers = true;
                            this.weapon = owner.inventory.weapon;
                            this.setQuadTreeRange(5 * 8, 5 * 8);
                        } else {
                            this.findPlayers = false;
                        }
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
            if (entity.constructor.name === "Player") {
                if (entity.id !== this.weapon.playerID && !this.getOwner(entityManager).isTeammate(entity)) {
                    this.weapon.found[entity.id] = entity.center;
                }
            }
        }
    }

    onPlayerHit(entity, entityManager) {
        if (!this.seek) {
            this.damage.inflict(entity, entityManager);
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
    constructor(ownerID, weapon, x, y, angle) {
        super(ownerID, x, y, 4, 6, angle, 185, 200, 0.5);
        this.findPlayers = false;
        this.weapon = weapon;
        this.life = 10;
        this.taps = true;
        this.minSpeed = 10;
        this.smokeBounds = {
            x: 100,
            y: 60,
        };
        this.setQuadTreeRange(this.smokeBounds.x, this.smokeBounds.y);
        this.entityOrder = 2;
        this.addStaticSnapShotData([
            "smokeBounds",
        ]);

        this.addDynamicSnapShotData([
            "findPlayers",
            "taps"
        ]);
    }

    update(entityManager, deltaTime) {
        if(this.taps === true) this.taps = false;

        if (this.side.bottom) {
            this.fric.x = SEEKER_SMOKE_FRICTION;
        }

        if(this.side.top || this.side.bottom || this.side.left || this.side.right) {
            if(!this.findPlayers) this.taps = true;
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
        super.update(entityManager, deltaTime);
    }

}

const SCOPED_SPEED = 5  * 60; //480;
const NORMAL_SPEED = 350;
const ARC = 60;

class CKER90 extends AttackWeapon {
    constructor(x, y) {
        super(x, y, "C-KER .90", "rifle");
        this.dataIsScoping = false;
        this.configureAttackStats(2,
            10,
            1,
            60);
        this.modAbility = new class extends ModAbility {
            buffs(composedWeapon, entityManager, deltaTime) {
                let player = entityManager.getEntity(composedWeapon.playerID);
                if (player) {
                    composedWeapon.dataIsScoping = player.input.heldDownMapping("modAbility");
                }
            }

            onDeactivation(composedWeapon, entityManager, deltaTime) {
                composedWeapon.dataIsScoping = false;
            }
        }(5, 5, true);

        let _this = this;
        this.superAbility = new class extends SuperAbility {
            onActivation(composedWeapon, entityManager, deltaTime) {
                let player = _this.getOwner(entityManager);
                let angle = 0;
                if (player) {
                    angle = player.input.mouseData.angleCenter;
                }
                entityManager.spawnEntity(
                    composedWeapon.pos.x,
                    composedWeapon.pos.y,
                    new SeekerSmoke(
                        composedWeapon.playerID,
                        composedWeapon,
                        0, 0,
                        angle
                    ));
            }
        }(0, 100, 100);

        this.found = {};
        this.addDynamicSnapShotData([
            "dataIsScoping",
            "found"
        ]);
        this.entityType = "AttackWeapon";
    }

    update(entityManager, deltaTime) {
        this.found = {};
        super.update(entityManager, deltaTime);
    }

    fire(player, entityManager, deltaTime, angle) {
        entityManager.spawnEntity(this.pos.x, this.pos.y,
            new ATBullet(this.playerID, this.id, this.pos.x, this.pos.y,
                this.dataIsScoping ? SCOPED_SPEED : NORMAL_SPEED,
                this.dataIsScoping ? 0 : ARC,
                angle));
    }

    onDrop(player, entityManager, deltaTime) {
        super.onDrop(player, entityManager, deltaTime);
        this.dataIsScoping = false;
    }
}

module.exports = CKER90;