const Vector2D = require("../../../shared/code/Math/SVector2D.js");

class HitScanner {
    constructor(entityCollision = true, tileCollision = true) {
        this._origin = new Vector2D(0, 0);
        this._end = new Vector2D(0, 0);
        this._scanEntities = entityCollision;
        this._scanTiles = tileCollision;
    }

    scan(originPos, entityManager, tileMap,) {

    }

}