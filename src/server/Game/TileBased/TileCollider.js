const TileCollider = {
    TYPE_RANGE: {
        PASS: 95, // TODO: Remove test values
        SOLID: 17, // TODO: Remove test values
        ONE_WAY: 96 // TODO: FIND CORRECT VALUE
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
        ONE_WAY: (entity, tile, deltaTime) => {

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
                        entity.side.top= true;
                    }
                }
            }
        },
        ONE_WAY: (entity, tile, deltaTime) => {
            var bottomLine = {
                pos: {x: entity.pos.x, y: entity.pos.y + entity.height + entity.vel.y * deltaTime},
                width: entity.width,
                height: 1
            };

            if (TileCollider.overlapEntityWithTile(bottomLine, tile)) {
                if (entity.pos.y + entity.height < tile.y || entity.side.bottom) {
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
            &&  t.y < (e.pos.y + e.height)
            && t.x + Tile.SIZE > e.pos.x
            &&  t.x < (e.pos.x + e.width);
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
        if (TileCollider.isSolid(id)) {
            return "SOLID";
        } else if (TileCollider.isOneWay(id)) {
            return "ONE_WAY";
        } else {
            return "PASS";
        }
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