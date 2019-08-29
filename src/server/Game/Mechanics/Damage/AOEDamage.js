const Damage = require("./Damage.js");
const AOELOSScanner = require("../Scanners/AOELOSScanner.js");
const Vector2D = require("../../../../shared/code/Math/SVector2D.js");

// Scans the map geometry for available line of sight
// to deal damage to entities in an area.
class AOEDamage extends Damage {
    constructor(ownerID, x, y, radius, value, exceptions = {}) {
        super(value, ownerID);
        this._pos = new Vector2D(x, y);
        this._scanner = new AOELOSScanner(radius, exceptions);
        this._scanner.onEntityHit = (entity, entityManager, angle) => {
            this.inflict(entity, entityManager, angle);
        }
    }

    set x(val) {
        this._pos.x = val;
    }

    set y(val) {
        this._pos.y = val;
    }

    applyAreaOfEffect(entityManager) {
        this._scanner.areaScan(this._pos, entityManager);
    }
}

module.exports = AOEDamage;