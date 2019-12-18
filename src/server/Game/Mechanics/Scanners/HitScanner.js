const Vector2D = require("../../../../shared/code/Math/SVector2D.js");
const CollisionBoundary = require("../../Entity/Management/CollisionBoundary.js");
const TileCollider = require("../../TileBased/TileCollider.js");
const Tile = require("../../TileBased/Tile.js");

// Scan line that collides with map geometry or entities (can be set however you like).
class HitScanner {
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
        let x0 = Math.floor(a.x / Tile.SIZE);
        let y0 = Math.floor(a.y / Tile.SIZE);

        let x1 = Math.floor(b.x / Tile.SIZE);
        let y1 = Math.floor(b.y / Tile.SIZE);

        let dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
        let dy = Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
        let err = (dx > dy ? dx : -dy) / 2;

        while (true) {
            if (this.operateOnScan(a, b, x0, y0, tileMap)) {
                break;
            }
            if (x0 === x1 && y0 === y1) break;

            let e2 = err;
            if (e2 > -dx) {
                err -= dy;
                x0 += sx;
            }
            if (e2 < dy) {
                err += dx;
                y0 += sy;
            }
        }


    }

    operateOnScan(a, b, x0, y0, tileMap) {
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                let x1 = x0 + x;
                let y1 = y0 + y;
                if (TileCollider.isSolid(tileMap.array[y1 * tileMap.w + x1])) {
                    let ts = Tile.SIZE;
                    let topLeft = new Vector2D(x1 * ts, y1 * ts);
                    let bottomLeft = new Vector2D(x1 * ts, (y1 + 1) * ts);
                    let topRight = new Vector2D((x1 + 1) * ts, y1 * ts);
                    let bottomRight = new Vector2D((x1 + 1) * ts, (y1 + 1) * ts);

                    if (Vector2D.intersect(a, b, topLeft, bottomLeft)) {
                        if (this.stopAtTile) b.set(Vector2D.getIntersectedPos(a, b, topLeft, bottomLeft));
                        this.onTileHit(b);
                        return true;
                    }

                    if (Vector2D.intersect(a, b, topLeft, topRight)) {
                        if (this.stopAtTile) b.set(Vector2D.getIntersectedPos(a, b, topLeft, topRight));
                        this.onTileHit(b);
                        return true;
                    }

                    if (Vector2D.intersect(a, b, topRight, bottomRight)) {
                        if (this.stopAtTile) b.set(Vector2D.getIntersectedPos(a, b, topRight, bottomRight));
                        this.onTileHit(b);
                        return true;
                    }

                    if (Vector2D.intersect(a, b, bottomLeft, bottomRight)) {
                        if (this.stopAtTile) b.set(Vector2D.getIntersectedPos(a, b, bottomLeft, bottomRight));
                        this.onTileHit(b);
                        return true;
                    }
                }
            }
        }

    }

    scanEntities(entityManager, a, b) {
        if (this.shouldScanEntities) {
            entityManager.cellSpace.iterate(this.rangeBoundary, cell => {
                for (let e of cell) {
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
        this.rangeBoundary.pos.x = a.x;
        this.rangeBoundary.pos.y = a.y;

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