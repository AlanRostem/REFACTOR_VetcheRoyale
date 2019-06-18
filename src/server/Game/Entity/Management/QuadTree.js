Vector2D = require("../../../../shared/Math/SVector2D");

class QuadTree {
    constructor(x, y, size, level) {
        this._level = level;
        this._entities = {};
    }
}

QuadTree.MAX_ENTITIES = 10;
QuadTree.MAX_LEVEL = 5;

module.exports = QuadTree;