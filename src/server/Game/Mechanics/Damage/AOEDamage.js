const Damage = require("./Damage.js");
const AOELOSScanner = require("../Scanners/AOELOSScanner.js");
const Vector2D = require("../../../../shared/code/Math/SVector2D.js");

// Scans the map geometry for available line of sight
// to deal damage to entities in an area.
class AOEDamage extends Damage {
    constructor(owner, x, y, radius, value, exceptions = {}) {
        super(value, owner);
        this.pos = new Vector2D(x, y);
        this.scanner = new AOELOSScanner(radius, exceptions);
        this.scanner.onEntityHit = (entity, entityManager, angle) => {
            this.inflict(entity, entityManager, {angle: angle});
        }
    }

    set x(val) {
        this.pos.x = val;
    }

    set y(val) {
        this.pos.y = val;
    }

    applyAreaOfEffect(entityManager) {
        this.scanner.areaScan(this.pos, entityManager);
    }
}

module.exports = AOEDamage;