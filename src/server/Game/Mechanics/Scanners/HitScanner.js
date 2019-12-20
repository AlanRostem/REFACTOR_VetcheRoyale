const Vector2D = require("../../../../shared/code/Math/SVector2D.js");
const CollisionBoundary = require("../../Entity/Management/CollisionBoundary.js");
const TileCollider = require("../../TileBased/TileCollider.js");
const SEntity = require("../../Entity/SEntity.js");

// Scan line that collides with map geometry or entities (can be set however you like).
class HitScanner {
    static ScannableEntity = SEntity;

    static setScannableEntityType(type) {
        this.ScannableEntity = type;
    }

    constructor(entityIDExclusions = {}, entityCollision = true, tileCollision = true) {
        this.shouldScanEntities = entityCollision;
        this.scanTiles = tileCollision;
        this.stopAtEntity = true;
        this.stopAtTile = true;
        this.rangeBoundary = new CollisionBoundary(0, 0, 360, 160);
        this.end = new Vector2D(0, 0);
        this.entityExceptions = entityIDExclusions;
    }

    set entityScanEnabled(val) {
        this.scanEntities = val;
    }

    set tileScanEnabled(val) {
        this.scanTiles = val;
    }

    get exceptions() {
        return this.entityExceptions;
    }

    set exceptions(val) {
        this.entityExceptions = val;
    }

    scanGeometry(a, b, entityManager, tileMap) {
        if (this.scanTiles) {

            let distX = b.x - a.x;
            let distY = b.y - a.y;

            let startX = Math.floor(a.x / tileMap.tileSize);
            let startY = Math.floor((a.y + distY) / tileMap.tileSize);

            let endX = startX + Math.floor(distX / tileMap.tileSize);
            let endY = Math.floor(a.y / tileMap.tileSize);

            let scanDoubleX = (startX - endX) === 0;
            let scanDoubleY = (startY - endY) === 0;

            if (startX > endX) {
                let temp = endX;
                endX = startX;
                startX = temp;
            }

            if (startY > endY) {
                let temp = endY;
                endY = startY;
                startY = temp;
            }

            for (let y = startY; y <= endY; y++) {
                for (let x = startX; x <= endX; x++) {
                    if (TileCollider.isSolid(tileMap.array[y * tileMap.w + x])) {
                        let ts = tileMap.tileSize, topLeft = new Vector2D(x * ts, y * ts),
                            bottomLeft = new Vector2D(x * ts, (y + 1) * ts),
                            topRight = new Vector2D((x + 1) * ts, y * ts),
                            bottomRight = new Vector2D((x + 1) * ts, (y + 1) * ts);
                        if (scanDoubleX) {
                            topLeft.x -= ts;
                            bottomLeft.x -= ts;
                            topRight.x += ts;
                            bottomRight.x += ts;
                        }
                        if (scanDoubleY) {
                            topLeft.y -= ts;
                            topRight.y -= ts;
                            bottomLeft.y += ts;
                            bottomRight.y += ts;
                        }
                        if (Vector2D.intersect(a, b, topLeft, bottomLeft)) {
                            if (this.stopAtTile) b.set(Vector2D.getIntersectedPos(a, b, topLeft, bottomLeft));
                            this.onTileHit(b, entityManager);
                        }
                        if (Vector2D.intersect(a, b, topLeft, topRight)) {
                            if (this.stopAtTile) b.set(Vector2D.getIntersectedPos(a, b, topLeft, topRight));
                            this.onTileHit(b, entityManager);
                        }
                        if (Vector2D.intersect(a, b, topRight, bottomRight)) {
                            if (this.stopAtTile) b.set(Vector2D.getIntersectedPos(a, b, topRight, bottomRight));
                            this.onTileHit(b, entityManager);
                        }
                        if (Vector2D.intersect(a, b, bottomLeft, bottomRight)) {
                            if (this.stopAtTile) b.set(Vector2D.getIntersectedPos(a, b, bottomLeft, bottomRight));
                            this.onTileHit(b, entityManager);
                        }
                    }
                }
            }
        }
    }

    scanEntities(entityManager, a, b) {
        if (this.shouldScanEntities) {
            this.rangeBoundary.pos.x = a.x + b.x / 2;
            this.rangeBoundary.pos.y = a.y + b.y / 2;
            this.rangeBoundary.bounds.x = Math.abs(b.x - a.x);
            if (this.rangeBoundary.bounds.x < 32) {
                this.rangeBoundary.bounds.x += 32;
            }
            this.rangeBoundary.bounds.y = Math.abs(b.y - a.y);
            if (this.rangeBoundary.bounds.y < 32) {
                this.rangeBoundary.bounds.y += 32;
            }
            //if (this.constructor.ScannableEntity.name === "Alive") console.log(this.rangeBoundary)
            entityManager.cellSpace.iterate(this.rangeBoundary, cell => {
                for (let e of cell) {
                    if (!(e instanceof this.constructor.ScannableEntity)) continue;
                    if (this.entityExceptions.hasOwnProperty(e.id)) continue;
                    if (Vector2D.intersect(a, b, e.topLeft, e.bottomLeft)) {
                        if (this.stopAtEntity) b.set(Vector2D.getIntersectedPos(a, b, e.topLeft, e.bottomLeft));
                        let ang = Math.atan2(a.y - b.y, a.x - b.x);
                        this.onEntityHit(e, entityManager, ang);
                    }

                    if (Vector2D.intersect(a, b, e.topLeft, e.topRight)) {
                        if (this.stopAtEntity) b.set(Vector2D.getIntersectedPos(a, b, e.topLeft, e.topRight));
                        let ang = Math.atan2(a.y - b.y, a.x - b.x);
                        this.onEntityHit(e, entityManager, ang);
                    }

                    if (Vector2D.intersect(a, b, e.topRight, e.bottomRight)) {
                        if (this.stopAtEntity) b.set(Vector2D.getIntersectedPos(a, b, e.topRight, e.bottomRight));
                        let ang = Math.atan2(a.y - b.y, a.x - b.x);
                        this.onEntityHit(e, entityManager, ang);
                    }

                    if (Vector2D.intersect(a, b, e.bottomLeft, e.bottomRight)) {
                        if (this.stopAtEntity) b.set(Vector2D.getIntersectedPos(a, b, e.bottomLeft, e.bottomRight));
                        let ang = Math.atan2(a.y - b.y, a.x - b.x);
                        this.onEntityHit(e, entityManager, ang);
                    }
                }
            });
        }
    }

    scan(originPos, endPos, entityManager, tileMap) {
        let a = originPos;
        let b = this.end;
        b.x = endPos.x;
        b.y = endPos.y;
        this.scanGeometry(a, b, entityManager, tileMap);
        this.scanEntities(entityManager, a, b);

        return this.end;
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