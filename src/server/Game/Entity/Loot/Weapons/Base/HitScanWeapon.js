const AttackWeapon = require("./AttackWeapon.js");
const HitScanner = require("../../../../Mechanics/Scanners/HitScanner.js");
const Vector2D = require("../../../../../../shared/code/Math/SVector2D.js");

// Weapon that fires hit-scans rather than projectiles.
class HitScanWeapon extends AttackWeapon {
    constructor(x, y, displayName, weaponClass = "pistol", maxRange = 200, hitEntities = true, hitTiles = true) {
        super(x, y, displayName, weaponClass);
        this._range = maxRange; // Max range of the scan-line
        this._scanner = new HitScanner([], hitEntities, hitTiles);
        this._scanner.onTileHit = (hitPos, entityManager) => {
            this.onTileHit(hitPos, entityManager); // Overriding
        };

        this._scanner.onEntityHit = (hitPos, entityManager, a) => {
            this.onEntityHit(hitPos, entityManager, a); // Overriding
        };

        // The end of the scan-line.
        this._endFirePos = new Vector2D(0, 0);
    }

    set entityScanEnabled(val) {
        this._scanner.entityScanEnabled = val;
    }

    set tileScanEnabled(val) {
        this._scanner.tileScanEnabled = val;
    }

    onTileHit(hitPos, entityManager) {
        // Override here
    }

    onEntityHit(entity, entityManager, angle) {
        // Override here
    }

    // Scans the map geometry and entities in proximity
    // obtained from the game world quad tree
    fire(player, entityManager, deltaTime) {
        super.fire(player, entityManager, deltaTime);
        this._endFirePos.x = this.center.x + this._range * player.input.mouseData.cosCenter;
        this._endFirePos.y = this.center.y + this._range * player.input.mouseData.sinCenter;
        this._scanner.scan(this.id, this.center, this._endFirePos, entityManager, entityManager.tileMap);
    }

    // Adds the entity scan exception array to the hit scanner.
    equip(player) {
        super.equip(player);
        this._scanner.exceptions = player.team.array;
    }
}

module.exports = HitScanWeapon;