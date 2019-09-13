const AttackWeapon = require("./Base/AttackWeapon.js");
const Projectile = require("./AttackEntities/Projectile.js");
const Damage = require("../../../Mechanics/Damage/Damage.js");

class ATBullet extends Projectile {
    constructor(oID, x, y, angle) {
        super(oID, x, y, 2, 2, angle, 400, 400);
        this.damage = new Damage(50, oID);
    }

    onEntityCollision(entity, entityManager) {
        this.damage.inflict(entity, entityManager);
        return super.onEntityCollision(entity, entityManager);
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

        this.addDynamicSnapShotData([
            "dataIsScoping"
        ]);
    }

    fire(player, entityManager, deltaTime, angle) {
        entityManager.spawnEntity(this.pos.x, this.pos.y,
            new ATBullet(this.playerID, this.pos.x, this.pos.y, angle));
    }

    onDrop(player, entityManager, deltaTime) {
        super.onDrop(player, entityManager, deltaTime);
        this.dataIsScoping = false;
    }
}

module.exports = CKER90;