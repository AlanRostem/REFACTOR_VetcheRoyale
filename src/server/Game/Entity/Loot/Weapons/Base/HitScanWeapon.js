const AttackWeapon = require("./AttackWeapon.js");
const HitScanner = require("../../../../Mechanics/Scanners/HitScanner.js");
const Vector2D = require("../../../../../../shared/code/Math/SVector2D.js");

class HitScanWeapon extends AttackWeapon {
    constructor(x, y, maxRange = 200, hitEntities = true, hitTiles = true) {
        super(x, y);
        this._range = maxRange;
        this._scanner = new HitScanner([], hitEntities, hitTiles);
        this._scanner.onTileHit = (hitPos, entityManager) => {
            this.onTileHit(hitPos, entityManager);
        };

        this._scanner.onEntityHit = (hitPos, entityManager, a) => {
            this.onEntityHit(hitPos, entityManager, a);
        };

        this._endFirePos = new Vector2D(0, 0);
    }

    set entityScanEnabled(val) {
        this._scanner.entityScanEnabled = val;
    }

    set tileScanEnabled(val) {
        this._scanner.tileScanEnabled = val;
    }

    onTileHit(hitPos, entityManager) {

    }

    onEntityHit(entity, entityManager, angle) {

    }

    fire(player, entityManager, deltaTime) {
        super.fire(player, entityManager, deltaTime);
        this._endFirePos.x = this.center.x + this._range * player.input.mouseData.cosCenter;
        this._endFirePos.y = this.center.y + this._range * player.input.mouseData.sinCenter;
        this._scanner.scan(this.id, this.center, this._endFirePos, entityManager, entityManager.tileMap);
    }

    equip(player) {
        super.equip(player);
        this._scanner.exceptions = player.team.array;
    }
}

module.exports = HitScanWeapon;