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
                let line = {
                    a: {
                        x: tile.x,
                        y: tile.y + Tile.SIZE,
                    },
                    b: {
                        x: tile.x + Tile.SIZE,
                        y: tile.y,
                    }
                };
                if (Vector2D.intersect(entity.bottomLeft, entity.bottomRight, line.a, line.b) ||
                    Vector2D.intersect(entity.topRight, entity.bottomRight, line.a, line.b)) {
                    let pos = Vector2D.getIntersectedPos(entity.bottomLeft, entity.bottomRight, line.a, line.b);
                    entity.side.bottom = true;
                    entity.pos.x = pos.x - entity.width + entity.vel.x * deltaTime;
                    entity.pos.y = pos.y - entity.height - entity.vel.x * deltaTime;
                    entity.vel.y = 0;
                }

            }
        },
        SLOPE_UP_LEFT: (entity, tile, deltaTime) => {
            if (entity.constructor.name !== "Player") {
                return;
            }
            if (entity.overlapTile(tile)) {
                let line = {
                    a: {
                        x: tile.x,
                        y: tile.y,
                    },
                    b: {
                        x: tile.x + Tile.SIZE,
                        y: tile.y + Tile.SIZE,
                    }
                };

                if (entity.slopeCollided) {
                    if (entity.vel.x > 0) {
                        entity.vel.y = entity.vel.x;
                        if (!entity.jumping) {
                            entity.setMovementState("slope", "run");
                        }
                    }
                }
                if (Vector2D.intersect(entity.bottomRight, entity.bottomLeft, line.a, line.b)
                    || Vector2D.intersect(entity.topLeft, entity.bottomLeft, line.a, line.b)
                ) {
                    let pos = Vector2D.getIntersectedPos(entity.bottomLeft, entity.bottomRight, line.a, line.b);
                    entity.side.bottom = true;
                    entity.pos.x = pos.x + entity.vel.x * deltaTime;
                    entity.pos.y = pos.y - entity.height + entity.vel.x * deltaTime;
                    entity.vel.y = 0;
                    entity.slopeCollided = true;
                }
            } else {
                entity.slopeCollided = false;
            }

        },
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
            if (entity.constructor.name !== "Player") {
                return;
            }
            var bottomLine = {
                pos: {x: entity.pos.x, y: entity.pos.y + entity.height + entity.vel.y * deltaTime},
                width: entity.width,
                height: 1
            };

            if (TileCollider.overlapEntityWithTile(bottomLine, tile)) {
                if (entity.pos.y + entity.height <= tile.y || entity.side.bottom) {
                    entity.onBottomCollision(tile);
                    entity.side.bottom = true;
                    entity.onPlatform = true;
                }
            } else {
                entity.onPlatform = false;
            }

            if (entity.onPlatform) {
                if (TileCollider.overlapEntityWithTile(entity, tile)) {
                    if (entity.pos.y + entity.height > tile.y) {
                        entity.onBottomCollision(tile);
                        entity.side.bottom = true;
                    }
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
    }
};

Object.freeze(TileCollider); // Prevents object mutation

module.exports = TileCollider;