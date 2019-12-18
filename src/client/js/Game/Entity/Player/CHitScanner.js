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
        var distX = b.x - a.x;
        var distY = b.y - a.y;

        var startX = Math.round(a.x / tileMap.tileSize);
        var startY = Math.round((a.y + distY) / tileMap.tileSize);

        var endX = startX + Math.round(distX / tileMap.tileSize);
        var endY = Math.round(a.y / tileMap.tileSize);

        if (startX - endX === 0) {
            startX--;
        }

        if (startY - endY === 0) {
            startY--;
        }

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

        for (var y = startY; y <= endY; y++) {
            for (var x = startX; x <= endX; x++) {
                if (CTileCollider.isSolid(tileMap.array[y * tileMap.w + x])) {
                    let ts = tileMap.tileSize;
                    let topLeft = new Vector2D(x * ts, y * ts);
                    let bottomLeft = new Vector2D(x * ts, (y + 1) * ts);
                    let topRight = new Vector2D((x + 1) * ts, y * ts);
                    let bottomRight = new Vector2D((x + 1) * ts, (y + 1) * ts);

                    if (Vector2D.intersect(a, b, topLeft, bottomLeft)) {
                        if (this.stopAtTile) b.set(Vector2D.getIntersectedPos(a, b, topLeft, bottomLeft));
                        this.onTileHit(b);
                    }

                    if (Vector2D.intersect(a, b, topLeft, topRight)) {
                        if (this.stopAtTile) b.set(Vector2D.getIntersectedPos(a, b, topLeft, topRight));
                        this.onTileHit(b);
                    }

                    if (Vector2D.intersect(a, b, topRight, bottomRight)) {
                        if (this.stopAtTile) b.set(Vector2D.getIntersectedPos(a, b, topRight, bottomRight));
                        this.onTileHit(b);
                    }

                    if (Vector2D.intersect(a, b, bottomLeft, bottomRight)) {
                        if (this.stopAtTile) b.set(Vector2D.getIntersectedPos(a, b, bottomLeft, bottomRight));
                        this.onTileHit(b);
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
