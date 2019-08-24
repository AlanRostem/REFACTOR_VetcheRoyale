const AttackWeapon = require("./Base/AttackWeapon.js");
const Projectile = require("./AttackEntities/Projectile.js");

class MicroMissile extends Projectile {
    constructor(ownerID, x, y, cos, sin) {
        super(ownerID, x, y, 2, 2, cos, sin, 120);
    }
}

class BIGMotorizer extends  AttackWeapon {
    constructor(x, y) {
        super(x, y, "B.I.G Motorizer", "rifle", 0, 10, 0, 2, 18, 0.4, 6, 0.05);
        this.configureAttackStats(1.5, 36, 1, 320);
    }

    fire(player, entityManager, deltaTime) {
        entityManager.spawnEntity(this.center.x, this.center.y,
            new MicroMissile(player.id, 0, 0,
                player.input.mouseData.cosCenter,
                player.input.mouseData.sinCenter));
    }
}

module.exports = BIGMotorizer;