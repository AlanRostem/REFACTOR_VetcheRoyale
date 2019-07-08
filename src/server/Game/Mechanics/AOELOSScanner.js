const HitScanner = require("./HitScanner.js");
const VMath = require("../../../shared/code/Math/SCustomMath.js");
const Vector2D = require("../../../shared/code/Math/SVector2D.js");

// Area of effect line of sight hit scanner
class AOELOSScanner extends HitScanner {
    constructor(radius, exceptions = [], tileCollision = true) {
        super(exceptions, false, tileCollision);
        this._radius = radius;
    }

    areaScan(ownerID, originPos, entityManager) {
        this._qtRange.x = originPos.x;
        this._qtRange.y = originPos.y;
        var entities = entityManager.quadTree.query(this._qtRange);
        for (var e of entities) {
            var angle = Math.atan2(
                originPos.y - e.center.x,
                originPos.y - e.center.y);
            var rangePos = new Vector2D(
                originPos.x + this._radius * Math.cos(angle),
                originPos.y + this._radius * Math.sin(angle));
            var a = originPos;
            var b = this.scan(ownerID, originPos, rangePos, entityManager, entityManager.tileMap);
            if (this._entityExceptions.includes(e.id) || e.id === ownerID) {
                continue;
            }

            if (e.constructor.name === "Player") {
                console.log(angle * 180 / Math.PI);
            }

            if (Vector2D.intersect(a, b, e.topLeft, e.bottomLeft)) {
                this.onEntityHit(e, entityManager);
            }

            if (Vector2D.intersect(a, b, e.topLeft, e.topRight)) {
                this.onEntityHit(e, entityManager);
            }

            if (Vector2D.intersect(a, b, e.topRight, e.bottomRight)) {
                this.onEntityHit(e, entityManager);
            }

            if (Vector2D.intersect(a, b, e.bottomLeft, e.bottomRight)) {
                this.onEntityHit(e, entityManager);
            }
        }
    }
}

module.exports = AOELOSScanner;