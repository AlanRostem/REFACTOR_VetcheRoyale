const AOELOSScanner = require("./AOELOSScanner.js");
const Affectable = require("../../Entity/Traits/Affectable.js");
const WormHoleEffect = require("../Effect/WormHoleEffect.js");

class AOEWormHoleScanner extends AOELOSScanner {
    constructor(ownerID, radius, pos, duration, speed, exceptions) {
        super(radius, exceptions, true);
        this.pos = pos;
        this.ownerID = ownerID;
        this.duration = duration;
        this.speed = speed
    }

    onEntityHit(entity, entityManager, angle) {
        super.onEntityHit(entity, entityManager, angle);
        if (entity instanceof Affectable) {
            entity.applyEffect(new WormHoleEffect(this.ownerID, this.radius, this.duration, this.pos, this.speed))
        }
    }
}

module.exports = AOEWormHoleScanner;