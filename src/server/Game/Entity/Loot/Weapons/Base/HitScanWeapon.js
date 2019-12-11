const AttackWeapon = require("./AttackWeapon.js");
const HitScanner = require("../../../../Mechanics/Scanners/HitScanner.js");
const Vector2D = require("../../../../../../shared/code/Math/SVector2D.js");

// Weapon that fires hit-scans rather than projectiles.
class HitScanWeapon extends AttackWeapon {
    constructor(x, y, displayName, weaponClass = "pistol", maxRange = 200, hitEntities = true, hitTiles = true) {
        super(x, y, displayName, weaponClass);
        this.range = maxRange; // Max range of the scan-line
        this.scanner = new HitScanner({}, hitEntities, hitTiles);
        this.scanner.onTileHit = (hitPos, entityManager) => {
            this.onTileHit(hitPos, entityManager); // Overriding
        };

        this.scanner.onEntityHit = (hitPos, entityManager, a) => {
            this.onEntityHit(hitPos, entityManager, a); // Overriding
        };

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
        super.fire(player, entityManager, deltaTime, angle);
        this.endFirePos.x = this.center.x + this.range * Math.cos(angle);
        this.endFirePos.y = this.center.y + this.range * Math.sin(angle);
        this.scanner.scan(this.center, this.endFirePos, entityManager, entityManager.tileMap);
    }

    // Adds the entity scan exception array to the hit scanner.
    equip(player) {
        super.equip(player);
        this.scanner.exceptions = player.team.array;
    }
}

module.exports = HitScanWeapon;