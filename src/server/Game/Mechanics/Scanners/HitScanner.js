const Vector2D = require("../../../../shared/code/Math/SVector2D.js");
const QTRect = require("../../Entity/Management/QTRect.js");
const TileCollider = require("../../TileBased/STileCollider.js");

// Scan line that collides with map geometry or entities (can be set however you like).
class HitScanner {
    constructor(exceptions = [], entityCollision = true, tileCollision = true) {
        this._scanEntities = entityCollision;
        this._scanTiles = tileCollision;
        this._stopAtEntity = true;
        this._stopAtTile = true;
        this._qtRange = new QTRect(0, 0, 360, 160);
        this._end = new Vector2D(0, 0);
        this._entityExceptions = exceptions;
    }

    set entityScanEnabled(val) {
        this._scanEntities = val;
    }

    set tileScanEnabled(val) {
        this._scanTiles = val;
    }

    get stopAtTile() {
        return this._stopAtTile;
    }

    set stopAtTile(val) {
        this._stopAtTile = val;
    }

    get stopAtEntity() {
        return this._stopAtEntity;
    }

    set stopAtEntity(val) {
        this._stopAtEntity = val;
    }

    get exceptions() {
        return this._entityExceptions;
    }

    set exceptions(val) {
        this._entityExceptions = val;
    }

    scan(ownerID, originPos, endPos, entityManager, tileMap) {
        var a = originPos;
        this._qtRange.x = a.x;
        this._qtRange.y = a.y;

        var b = this._end;
        b.x = endPos.x;
        b.y = endPos.y;

        var width = Math.floor(this._qtRange.w * 2 / tileMap.tileSize);
        var height = Math.floor(this._qtRange.h * 2 / tileMap.tileSize);

        var startX = Math.floor(a.x / tileMap.tileSize - width / 2);
        var startY = Math.floor(a.y / tileMap.tileSize - height / 2);

        var endX = startX + width + 1;
        var endY = startY + height + 1;

        if (this._scanTiles) {
            for (var y = startY; y <= endY; y++) {
                for (var x = startX; x <= endX; x++) {
                    if (TileCollider.isSolid(tileMap.array[y * tileMap.w + x])) {
                        var ts = tileMap.tileSize;
                        let topLeft = new Vector2D(x * ts, y * ts);
                        let bottomLeft = new Vector2D(x * ts, (y + 1) * ts);
                        let topRight = new Vector2D((x + 1) * ts, y * ts);
                        let bottomRight = new Vector2D((x + 1) * ts, (y + 1) * ts);

                        if (Vector2D.intersect(a, b, topLeft, bottomLeft)) {
                            if (this._stopAtTile) b.set(Vector2D.getIntersectedPos(a, b, topLeft, bottomLeft));
                            this.onTileHit(b, entityManager);
                        }

                        if (Vector2D.intersect(a, b, topLeft, topRight)) {
                            if (this._stopAtTile) b.set(Vector2D.getIntersectedPos(a, b, topLeft, topRight));
                            this.onTileHit(b, entityManager);
                        }

                        if (Vector2D.intersect(a, b, topRight, bottomRight)) {
                            if (this._stopAtTile) b.set(Vector2D.getIntersectedPos(a, b, topRight, bottomRight));
                            this.onTileHit(b, entityManager);
                        }

                        if (Vector2D.intersect(a, b, bottomLeft, bottomRight)) {
                            if (this._stopAtTile) b.set(Vector2D.getIntersectedPos(a, b, bottomLeft, bottomRight));
                            this.onTileHit(b, entityManager);
                        }
                    }
                }
            }
        }

        if (this._scanEntities) {
            var entities = entityManager.quadTree.query(this._qtRange);
            for (var e of entities) {
                if (this._entityExceptions.includes(e.id) || e.id === ownerID) {
                    continue;
                }

                if (Vector2D.intersect(a, b, e.topLeft, e.bottomLeft)) {
                    if (this._stopAtEntity) b.set(Vector2D.getIntersectedPos(a, b, e.topLeft, e.bottomLeft));
                    let ang = Math.atan2(a.y - b.y, a.x - b.x);
                    this.onEntityHit(e, entityManager, ang);
                }

                if (Vector2D.intersect(a, b, e.topLeft, e.topRight)) {
                    if (this._stopAtEntity) b.set(Vector2D.getIntersectedPos(a, b, e.topLeft, e.topRight));
                    let ang = Math.atan2(a.y - b.y, a.x - b.x);
                    this.onEntityHit(e, entityManager, ang);
                }

                if (Vector2D.intersect(a, b, e.topRight, e.bottomRight)) {
                    if (this._stopAtEntity) b.set(Vector2D.getIntersectedPos(a, b, e.topRight, e.bottomRight));
                    let ang = Math.atan2(a.y - b.y, a.x - b.x);
                    this.onEntityHit(e, entityManager, ang);
                }

                if (Vector2D.intersect(a, b, e.bottomLeft, e.bottomRight)) {
                    if (this._stopAtEntity) b.set(Vector2D.getIntersectedPos(a, b, e.bottomLeft, e.bottomRight));
                    let ang = Math.atan2(a.y - b.y, a.x - b.x);
                    this.onEntityHit(e, entityManager, ang);
                }
            }
        }
        return this._end;
    }

    onTileHit(hitPos, entityManager) {

    }

    onEntityHit(entity, entityManager, angle) {

    }
}

HitScanner.intersectsEntity = (a, b, e) => {
    return Vector2D.intersect(a, b, e.topLeft, e.bottomLeft) ||
        Vector2D.intersect(a, b, e.topLeft, e.topRight) ||
        Vector2D.intersect(a, b, e.topRight, e.bottomRight) ||
        Vector2D.intersect(a, b, e.bottomLeft, e.bottomRight);
};

module.exports = HitScanner;