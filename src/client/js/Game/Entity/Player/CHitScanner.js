import Vector2D from "../../../../../shared/code/Math/CVector2D.js";
import CTileCollider from "./CTileCollider.js";

// Scan line that collides with map geometry or entities (can be set however you like).
class CHitScanner {
    constructor(entityCollision = true, tileCollision = true) {
        this.shouldScanEntities = entityCollision;
        this.scanTiles = tileCollision;
        this.stopAtEntity = false;
        this.stopAtTile = true;
        this.end = new Vector2D(0, 0);
    }

    set entityScanEnabled(val) {
        this.scanEntities = val;
    }

    set tileScanEnabled(val) {
        this.scanTiles = val;
    }

    scanGeometry(a, b, tileMap) {
        let x0 = Math.floor(a.x / tileMap.tileSize);
        let y0 = Math.floor(a.y / tileMap.tileSize);

        let x1 = Math.floor(b.x / tileMap.tileSize);
        let y1 = Math.floor(b.y / tileMap.tileSize);

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
                let ts = tileMap.tileSize;
                // TODO: Remove line below
                R.drawRect("White", x1 * ts, y1 * ts, ts, ts, true);
                if (CTileCollider.isSolid(tileMap.array[y1 * tileMap.w + x1])) {
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

    scanEntities(a, b) {

        let entities = Scene.entityManager.container.values();
        for (var e of entities) {
            if (Vector2D.intersect(a, b, e.topLeft, e.bottomLeft)) {
                if (this.stopAtEntity) b.set(Vector2D.getIntersectedPos(a, b, e.topLeft, e.bottomLeft));
                let ang = Math.atan2(a.y - b.y, a.x - b.x);
                this.onEntityHit(e, ang);
            }

            if (Vector2D.intersect(a, b, e.topLeft, e.topRight)) {
                if (this.stopAtEntity) b.set(Vector2D.getIntersectedPos(a, b, e.topLeft, e.topRight));
                let ang = Math.atan2(a.y - b.y, a.x - b.x);
                this.onEntityHit(e, ang);
            }

            if (Vector2D.intersect(a, b, e.topRight, e.bottomRight)) {
                if (this.stopAtEntity) b.set(Vector2D.getIntersectedPos(a, b, e.topRight, e.bottomRight));
                let ang = Math.atan2(a.y - b.y, a.x - b.x);
                this.onEntityHit(e, ang);
            }

            if (Vector2D.intersect(a, b, e.bottomLeft, e.bottomRight)) {
                if (this.stopAtEntity) b.set(Vector2D.getIntersectedPos(a, b, e.bottomLeft, e.bottomRight));
                let ang = Math.atan2(a.y - b.y, a.x - b.x);
                this.onEntityHit(e, ang);
            }

        }
    }

    scan(originPos, endPos, tileMap) {
        var a = originPos;

        var b = this.end;

        b.x = endPos.x;
        b.y = endPos.y;

        this.scanGeometry(a, b, tileMap);
        this.scanEntities(a, b);

        return this.end;
    }


    onTileHit(hitPos) {

    }

    onEntityHit(entity, angle) {

    }
}

CHitScanner.intersectsEntity = (a, b, e) => {
    return Vector2D.intersect(a, b, e.topLeft, e.bottomLeft) ||
        Vector2D.intersect(a, b, e.topLeft, e.topRight) ||
        Vector2D.intersect(a, b, e.topRight, e.bottomRight) ||
        Vector2D.intersect(a, b, e.bottomLeft, e.bottomRight);
};

export default CHitScanner;
