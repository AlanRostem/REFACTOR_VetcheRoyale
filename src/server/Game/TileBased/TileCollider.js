const Vector2D = require("../../../shared/code/Math/SVector2D.js");

const TileCollider = {
    TYPE_RANGE: {
        PASS: 95, // TODO: Remove test values
        SOLID: 17, // TODO: Remove test values
        ONE_WAY: 96, // TODO: FIND CORRECT VALUE
        SLOPE_UP_LEFT: 14,
        SLOPE_UP_RIGHT: 13,
    },

    handleCollisionX(entity, tileID, tilePos, deltaTime) {
        let type = entity.CR_ID + "-" + TileCollider.findType(tileID);
        if (TileCollider.ENTITY_COLLISION_RESPONSES_X.hasOwnProperty(type))
            TileCollider.ENTITY_COLLISION_RESPONSES_X[type](entity, tilePos, deltaTime);
    },

    handleCollisionY(entity, tileID, tilePos, deltaTime) {
        let type = entity.CR_ID + "-" + TileCollider.findType(tileID);
        if (TileCollider.ENTITY_COLLISION_RESPONSES_Y.hasOwnProperty(type))
            TileCollider.ENTITY_COLLISION_RESPONSES_Y[type](entity, tilePos, deltaTime);
    },


    ENTITY_COLLISION_RESPONSES_X: {
        "Physical-SOLID": (entity, tile, deltaTime) => {
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
        }
    },

    ENTITY_COLLISION_RESPONSES_Y: {
        "Physical-SOLID": (entity, tile, deltaTime) => {
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
        "Physical-ONE_WAY": (entity, tile, deltaTime) => {
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
        },
        "Physical-SLOPE_UP_RIGHT": (entity, tile, deltaTime) => {
            if (entity.constructor.name !== "Player") {
                //   return;
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
                        entity.vel.y = -entity.vel.x; // Making it move down 1 pixel
                    }
                } else if (entity.pos.y + entity.height > steppingPosY) {
                    entity.jumping = false;
                    entity.vel.y = 0;
                    entity.pos.y = steppingPosY - entity.height;
                    entity.side.bottom = true;
                    if (entity.vel.x < 0) {
                        entity.vel.y = -entity.vel.x; // Making it move down 1 pixel
                    }
                }
            }
        },
        "Physical-SLOPE_UP_LEFT": (entity, tile, deltaTime) => {
            if (entity.constructor.name !== "Player") {
                // return;
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
                        entity.vel.y = entity.vel.x; // Making it move down 1 pixel
                    }
                } else if (entity.pos.y + entity.height > steppingPosY) {
                    entity.jumping = false;
                    entity.vel.y = 0;
                    entity.pos.y = steppingPosY - entity.height;
                    entity.side.bottom = true;
                    if (entity.vel.x > 0) {
                        entity.vel.y = entity.vel.x; // Making it move down 1 pixel
                    }
                }
            }

        },
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