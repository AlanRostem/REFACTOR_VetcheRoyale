const HitScanner = require("./HitScanner.js");
const VMath = require("../../../../shared/code/Math/SCustomMath.js");
const Vector2D = require("../../../../shared/code/Math/SVector2D.js");

// Area of effect line of sight hit scanner. Checks if the entity
// is within the correct radius and casts a line toward the entity
// that collides with the map geometry. The line has to intersect
// the entity to do the events.
class AOELOSScanner extends HitScanner {
    constructor(radius, exceptions = {}, tileCollision = true) {
        super(exceptions, false, tileCollision);
        this.radius = radius;
    }

    areaScan(originPos, entityManager) {
        this.qtRange.x = originPos.x;
        this.qtRange.y = originPos.y;

        var entities = entityManager.quadTree.query(this.qtRange);
        for (var e of entities) {
            var angle = Math.atan2(
                e.center.y - originPos.y,
                e.center.x - originPos.x);
            var rangePos = new Vector2D(
                originPos.x + this.radius * Math.cos(angle),
                originPos.y + this.radius * Math.sin(angle));
            var a = originPos;
            var b = this.scan(originPos, rangePos, entityManager, entityManager.tileMap);
            if (this.entityExceptions.hasOwnProperty(e.id)) continue;
            if (Vector2D.intersect(a, b, e.topLeft, e.bottomLeft) ||
                Vector2D.intersect(a, b, e.topLeft, e.topRight) ||
                Vector2D.intersect(a, b, e.topRight, e.bottomRight) ||
                Vector2D.intersect(a, b, e.bottomLeft, e.bottomRight)) {
                var ang = Math.atan2(a.y - b.y, a.x - b.x);
                this.onEntityHit(e, entityManager, ang);
            }
        }
    }
}

module.exports = AOELOSScanner;