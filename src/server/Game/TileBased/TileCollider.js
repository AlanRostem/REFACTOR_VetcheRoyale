const TileCollider = {
    TYPE_RANGE: {
        PASS: 0, // TODO: Remove test values
        SOLID: 17, // TODO: Remove test values
        ONE_WAY: 0 // TODO: FIND CORRECT VALUE
    },

    TYPE_COLLISION_CALLBACK_X: {
        SOLID: (entity, tile) => {
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
        ONE_WAY: (entity, tile) => {

        }
    },

    TYPE_COLLISION_CALLBACK_Y: {
        SOLID: (entity, tile) => {
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
        ONE_WAY: (entity, tile) => {

        }
    },

    handleCollisionX(entity, tileID, tilePos) {
        let type = TileCollider.findType(tileID);
        if (TileCollider.TYPE_COLLISION_CALLBACK_X.hasOwnProperty(type))
            TileCollider.TYPE_COLLISION_CALLBACK_X[type](entity, tilePos);
    },

    handleCollisionY(entity, tileID, tilePos) {
        let type = TileCollider.findType(tileID);
        if (TileCollider.TYPE_COLLISION_CALLBACK_Y.hasOwnProperty(type))
            TileCollider.TYPE_COLLISION_CALLBACK_Y[type](entity, tilePos);
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
        return id > TileCollider.TYPE_RANGE.SOLID
            && id < TileCollider.TYPE_RANGE.ONE_WAY
            && id !== 0;
    }
};

Object.freeze(TileCollider); // Prevents object mutation

module.exports = TileCollider;