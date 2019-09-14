const AttackWeapon = require("./Base/AttackWeapon.js");
const Projectile = require("./AttackEntities/Projectile.js");
const Damage = require("../../../Mechanics/Damage/Damage.js");
const Player = require("../../../Entity/Player/SPlayer.js");

class ATBullet extends Projectile {
    constructor(oID, wID, x, y, angle) {
        super(oID, x, y, 2, 2, angle, 400, 400, false);
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
                            this.setQuadTreeRange(160, 160);
                        }
                    }
                }
            } else {
                this.findPlayers = false;
            }
        }
    }

    forEachNearbyEntity(entity, entityManager) {
        super.forEachNearbyEntity(entity, entityManager);
        if (this.findPlayers) {
            if (entity instanceof Player) {
                this.weapon.found[entity.id] = entity.center;
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

class CKER90 extends AttackWeapon {
    constructor(x, y) {
        super(x, y, "C-KER .90", "rifle");
        this.dataIsScoping = false;
        this.configureAttackStats(2, 10, 1, 60);

        this.modAbility.buffs = (composedWeapon, entityManager, deltaTime) => {
            let player = entityManager.getEntity(this.playerID);
            if (player) {
                this.dataIsScoping = player.input.mouseHeldDown(3);
            }
        };

        this.modAbility.onDeactivation = (composedWeapon, entityManager, deltaTime) => {
            this.dataIsScoping = false;
        };

        this.found = {};
        this.addDynamicSnapShotData([
            "dataIsScoping",
            "found"
        ]);
        this.eType = "AttackWeapon";
    }

    updateWhenEquipped(player, entityManager, deltaTime) {
        super.updateWhenEquipped(player, entityManager, deltaTime);
        //this.found = {};
    }

    fire(player, entityManager, deltaTime, angle) {
        entityManager.spawnEntity(this.pos.x, this.pos.y,
            new ATBullet(this.playerID, this.id, this.pos.x, this.pos.y, angle));
    }

    onDrop(player, entityManager, deltaTime) {
        super.onDrop(player, entityManager, deltaTime);
        this.dataIsScoping = false;
    }
}

module.exports = CKER90;