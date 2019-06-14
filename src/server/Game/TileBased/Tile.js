const Tile = {};

Tile.toCell = (x, y) => {
    return {
        x: x / Tile.SIZE | 0,
        y: y / Tile.SIZE | 0,
    };
};

Tile.toPos = (cx, cy) => {
    return {
        x: cx * Tile.SIZE,
        y: cy * Tile.SIZE,
    };
};

Tile.SIZE = 8;

module.exports = Tile;