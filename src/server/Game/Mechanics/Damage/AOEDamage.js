const Damage = require("./Damage.js");
const AOELOSScanner = require("../Scanners/AOELOSScanner.js");
const Vector2D = require("../../../../shared/code/Math/SVector2D.js");

class AOEDamage extends Damage {
    constructor(x, y, radius, value) {
        super(value);
        this._pos = new Vector2D(x, y);
        this._scanner = new AOELOSScanner(radius);
        this._scanner.onEntityHit = (entity, entityManager) => {
            this.inflict(entity, entityManager);
        }
    }

    set x(val) {
        this._pos.x = val;
    }

    set y(val) {
        this._pos.y = val;
    }

    applyAreaOfEffect(ownerID, entityManager) {
        this._scanner.areaScan(ownerID, this._pos, entityManager);
    }
}

module.exports = AOEDamage;