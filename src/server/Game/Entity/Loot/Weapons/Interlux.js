const AttackWeapon = require("./Base/AttackWeapon.js");
const HitScanner = require("../../../Mechanics/Scanners/HitScanner.js");
const Vector2D = require("../../../../../shared/code/Math/SVector2D.js");


class Interlux extends AttackWeapon {
    constructor(x, y) {
        super(x, y, "Interlux", 0, 0, 0);

        this.scanRange = 64;
        this.scanner = new HitScanner({}, false, true);

        this.lines = [];

        this.aimAngle = 0;

        this.shootPos = new Vector2D(0, 0);

        this.secondaryFire = false;
        this.superAbilitySnap = false;

        this.configureAttackStats(1.5, 40, 1, 500);

        this.addDynamicSnapShotData(["secondaryFire", "superAbilitySnap", "lines"]);

        this.modAbility.onActivation = (weapon, entityManager) => {

        };

        this.modAbility.configureStats(3, 15);

        this.modAbility.onDeactivation = (composedWeapon, entityManager, deltaTime) => {

        };

        this.modAbility.buffs = (composedWeapon, entityManager, deltaTime) => {

        };

        this.superAbility.onActivation = (composedWeapon, entityManager, deltaTime) => {
            this.superAbilitySnap = true;

        };

        this.superAbility.onDeactivation = (composedWeapon, entityManager, deltaTime) => {
            this.superAbilitySnap = false;

        };
    }

    update(entityManager, deltaTime) {
        super.update(entityManager, deltaTime);
        this.lines = [];
    }

    updateWhenEquipped(player, entityManager, deltaTime) {
        super.updateWhenEquipped(player, entityManager, deltaTime);
        if (entityManager.getEntity(this.playerID)) {
            this.aimAngle = this.getOwner(entityManager).input.mouseData.angleCenter;
        }

    }

    onSuperBuffs(entityManager, deltaTime) {
        super.onSuperBuffs(entityManager, deltaTime);
    }

    fire(player, entityManager, deltaTime, angle) {
        // this.scan(this.pos, this.shootPos, this.scanRange, entityManager);
        this.shootPos.x = player.center.x + (this.width / 2 | 0) + Math.cos(this.aimAngle) * this.scanRange;
        this.shootPos.y = player.center.y - (this.height / 2 | 0) + Math.sin(this.aimAngle) * this.scanRange;

        let newPoint = this.scanner.scan(player.center, this.shootPos, entityManager, entityManager.tileMap);

        let length = Vector2D.distance(player.center, newPoint);

        this.lines.push(player.center);
        this.lines.push(newPoint);

     //   if (length < this.scanRange) this.scan(newPoint, this.scanRange - length, entityManager);

    }

    scan(oldPos, range, entityManager) {

        let newPos = new Vector2D(0, 0);

        //console.log(range);

        newPos.x = oldPos.x + Math.cos(Math.PI / 2) * range;
        newPos.y = oldPos.y + Math.sin(Math.PI / 3) * range;

        let newPoint = this.scanner.scan(oldPos, newPos, entityManager, entityManager.tileMap);

        let length = Vector2D.distance(oldPos, newPoint);

        this.lines.push(oldPos);
        this.lines.push(newPoint);

        if (length < range) this.scan(newPoint, range - length, entityManager);

    }

    onDrop(player, entityManager, deltaTime) {
        super.onDrop(player, entityManager, deltaTime);
        this.secondaryFire = false;
    }

}


module.exports = Interlux;