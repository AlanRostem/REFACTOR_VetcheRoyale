const AttackWeapon = require("./AttackWeapon.js");
const HitScanner = require("../../../../Mechanics/Scanners/HitScanner.js");
const Vector2D = require("../../../../../../shared/code/Math/SVector2D.js");
const Alive = require("../../../Traits/Alive.js");

let EMPTY = {};

class FiringScanner extends HitScanner {
    static _ = (() => {
        FiringScanner.setScannableEntityType(Alive);
    })();

    constructor(weapon) {
        super(EMPTY, true, true);
        this.weapon = weapon;
    }

    onTileHit(hitPos, entityManager) {
        super.onTileHit(hitPos, entityManager);
        this.weapon.onTileHit(hitPos, entityManager);
    }

    onEntityHit(entity, entityManager, angle) {
        super.onEntityHit(entity, entityManager, angle);
        this.weapon.onEntityHit(entity, entityManager, angle);
    }
}
// Weapon that fires hit-scans rather than projectiles.
class HitScanWeapon extends AttackWeapon {
    static MAX_RANGE = 64;

    static setMaxRange(range) {
        this.MAX_RANGE = range;
    }

    constructor(x, y) {
        super(x, y);
        this.scanner = new FiringScanner(this);
        this.scanHitPos = null;
        // The end of the scan-line.
        this.endFirePos = new Vector2D(0, 0);
    }

    set entityScanEnabled(val) {
        this.scanner.entityScanEnabled = val;
    }

    set tileScanEnabled(val) {
        this.scanner.tileScanEnabled = val;
    }

    onTileHit(hitPos, entityManager) {
        // Override here
    }

    onEntityHit(entity, entityManager, angle) {
        // Override here
    }

    // Scans the map geometry and entities in proximity
    // obtained from the game world.
    fire(player, entityManager, deltaTime, angle) {
        this.endFirePos.x = this.center.x + this.constructor.MAX_RANGE * Math.cos(angle);
        this.endFirePos.y = this.center.y + this.constructor.MAX_RANGE * Math.sin(angle);
        this.scanHitPos = this.scanner.scan(this.center, this.endFirePos, entityManager, entityManager.tileMap);
    }

    // Adds the entity scan exception array to the hit scanner.
    equip(player) {
        super.equip(player);
        this.scanner.exceptions = player.team.players;
    }
}

module.exports = HitScanWeapon;