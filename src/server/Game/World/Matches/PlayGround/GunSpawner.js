const Entity = require("../../../Entity/SEntity.js");
const TileCollider = require("../../../TileBased/TileCollider.js");

const START_TILE = 14 * 8; // 14 rows times 8 cols on tile-sheet

module.exports = class GunSpawner extends Entity {
    constructor(x, y, gunSpawnID) {
        super(x, y, TileCollider.TILE_SIZE, TileCollider.TILE_SIZE);

    }
};

GunSpawner.START_TILE = START_TILE;