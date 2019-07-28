const Vector2D = require("../../../shared/code/Math/SVector2D.js");

const TileCollider = {
    TYPE_RANGE: {
        PASS: 95, // TODO: Remove test values
        SOLID: 17, // TODO: Remove test values
        ONE_WAY: 96, // TODO: FIND CORRECT VALUE
        SLOPE_UP_LEFT: 14,
        SLOPE_UP_RIGHT: 13,
    },

    TYPE_COLLISION_CALLBACK_X: {
        SOLID: (entity, tile, deltaTime) => {
            if (entity.overlapTile(tile)) {
                if (entity.vel.x > 0) {
                    if (entity.pos.x + entity.width > tile.x) {
                        entity.onRightCollision(tile);
                        entity.side.right = true;
                    }
                }
                if (entity.vel.x < 0) {
                    if (entity.pos.x < tile.x + Tile.SIZE) {
                        entity.onLeftCollision(tile);
                        entity.side.left = true;
                    }
                }
            }
        },
        SLOPE_UP_RIGHT: (entity, tile, deltaTime) => {
            if (entity.constructor.name !== "Player") {
                return;
            }
            if (entity.overlapTile(tile)) {
                let eRightToSlopeLeftDiff = entity.pos.x + entity.width - tile.x;

                let steppingPosY = -1 * eRightToSlopeLeftDiff + tile.y + Tile.SIZE;

                if (eRightToSlopeLeftDiff > Tile.SIZE) {
                    entity.jumping = false;
                    entity.vel.y = 0;
                    entity.pos.y = tile.y - entity.height;
                    entity.side.bottom = true;
                    if (entity.vel.x < 0) {
                        entity.vel.y = 1/deltaTime; // Making it move down 1 pixel
                    }
                } else if (entity.pos.y + entity.height > steppingPosY) {
                    entity.jumping = false;
                    entity.vel.y = 0;
                    entity.pos.y = steppingPosY - entity.height;
                    entity.side.bottom = true;
                    if (entity.vel.x < 0) {
                        entity.vel.y = 1/deltaTime; // Making it move down 1 pixel
                    }
                }
            }
        },
        SLOPE_UP_LEFT: (entity, tile, deltaTime) => {
            if (entity.constructor.name !== "Player") {
                return;
            }
            if (entity.overlapTile(tile)) {
                let eLeftToSlopeRightDiff = tile.x + Tile.SIZE - entity.pos.x;

                let steppingPosY = -1 * eLeftToSlopeRightDiff + tile.y + Tile.SIZE;

                if (eLeftToSlopeRightDiff > Tile.SIZE) {
                    entity.jumping = false;
                    entity.vel.y = 0;
                    entity.pos.y = tile.y - entity.height;
                    entity.side.bottom = true;
                    if (entity.vel.x > 0) {
                        entity.vel.y = 1/deltaTime; // Making it move down 1 pixel
                    }
                } else if (entity.pos.y + entity.height > steppingPosY) {
                    entity.jumping = false;
                    entity.vel.y = 0;
                    entity.pos.y = steppingPosY - entity.height;
                    entity.side.bottom = true;
                    if (entity.vel.x > 0) {
                        entity.vel.y = 1/deltaTime; // Making it move down 1 pixel
                    }
                }
            }

        },
    },

    collideSlope(object, row, column, slope, y_offset) {
        let TILE_SIZE = Tile.SIZE;
        let origin_x = column * TILE_SIZE;
        let origin_y = row * TILE_SIZE + y_offset;
        let current_x = (slope < 0) ? object.x + object.width - origin_x : object.x - origin_x;
        let current_y = object.y + object.height - origin_y;
        let old_x = (slope < 0) ? object._old.x + object.width - origin_x : object._old.x - origin_x;
        let old_y = object._old.y + object.height - origin_y;
        let current_cross_product = current_x * slope - current_y;
        let old_cross_product     = old_x * slope - old_y;
        let top = (slope < 0) ? row * TILE_SIZE + TILE_SIZE + y_offset * slope : row * TILE_SIZE + y_offset;

        if ((current_x < 0 || current_x > TILE_SIZE)
            && (object.y + object.height > top && object._old.y + object.height <= top
            || current_cross_product < 1 && old_cross_product > -1)) {

            object.jumping = false;
            object.vel.y = 0;
            object.y = top - object.height;
        } else if (current_cross_product < 1 && old_cross_product > -1) {

            object.jumping = false;
            object.vel.y = 0;
            object.y = row * TILE_SIZE + slope * current_x + y_offset - object.height;
        }
    },

    TYPE_COLLISION_CALLBACK_Y: {
        SOLID: (entity, tile, deltaTime) => {
            if (entity.overlapTile(tile)) {
                if (entity.vel.y > 0) {
                    if (entity.pos.y + entity.height > tile.y) {
                        entity.onBottomCollision(tile);
                        entity.side.bottom = true;
                    }
                }
                if (entity.vel.y < 0) {
                    if (entity.pos.y < tile.y + Tile.SIZE) {
                        entity.onTopCollision(tile);
                        entity.side.top = true;
                    }
                }
            }
        },
        ONE_WAY: (entity, tile, deltaTime) => {
            // TODO: Find a better way to do this and let loot collide with one ways
            if (entity.constructor.name !== "Player") {
                return;
            }
            // entity.input.keyHeldDown(83)
            if (entity.overlapTile(tile)) {
                if (entity.pos.y + entity.height > tile.y && entity._old.y + entity.height <= tile.y) {
                    entity.vel.y = 0;
                    entity.jumping = false;
                    entity.pos.y = tile.y - entity.height;
                    entity.side.bottom = true;
                }
            }
        }
    },

    overlapEntityWithTile(e, t) {
        return t.y + Tile.SIZE > e.pos.y
            && t.y < (e.pos.y + e.height)
            && t.x + Tile.SIZE > e.pos.x
            && t.x < (e.pos.x + e.width);
    },

    handleCollisionX(entity, tileID, tilePos, deltaTime) {
        let type = TileCollider.findType(tileID);
        if (TileCollider.TYPE_COLLISION_CALLBACK_X.hasOwnProperty(type))
            TileCollider.TYPE_COLLISION_CALLBACK_X[type](entity, tilePos, deltaTime);
    },

    handleCollisionY(entity, tileID, tilePos, deltaTime) {
        let type = TileCollider.findType(tileID);
        if (TileCollider.TYPE_COLLISION_CALLBACK_Y.hasOwnProperty(type))
            TileCollider.TYPE_COLLISION_CALLBACK_Y[type](entity, tilePos, deltaTime);
    },

    findType(id) {
        if (TileCollider.isSlopeLeft(id)) {
            return "SLOPE_UP_LEFT"
        } else if (TileCollider.isSlopeRight(id)) {
            return "SLOPE_UP_RIGHT";
        } else if (TileCollider.isSolid(id)) {
            return "SOLID";
        } else if (TileCollider.isOneWay(id)) {
            return "ONE_WAY";
        } else {
            return "PASS";
        }
    },

    isSlopeLeft(id) {
        return TileCollider.TYPE_RANGE.SLOPE_UP_LEFT === id;
    },

    isSlopeRight(id) {
        return TileCollider.TYPE_RANGE.SLOPE_UP_RIGHT === id;
    },

    isSolid(id) {
        return id < TileCollider.TYPE_RANGE.SOLID && id !== 0;
    },

    isOneWay(id) {
        return id > TileCollider.TYPE_RANGE.PASS
            && id <= TileCollider.TYPE_RANGE.ONE_WAY
            && id !== 0;
    },
};

Object.freeze(TileCollider); // Prevents object mutation

module.exports = TileCollider;