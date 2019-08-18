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

// Composite object that handles tile tileCollision
// based on entity type.
// TODO: Create the entity type mapping functionality
const TileCollider = {
    TYPE_RANGE: {
        PASS: 95, // TODO: Remove test values
        SOLID: 17, // TODO: Remove test values
        ONE_WAY: 96, // TODO: FIND CORRECT VALUE
        SLOPE_UP_LEFT: 14,
        SLOPE_UP_RIGHT: 13,
    },

    handleCollisionX(entity, tileID, tilePos, deltaTime) {
        let type = TileCollider.findType(tileID);
        if (TileCollider.ENTITY_COLLISION_RESPONSES.hasOwnProperty(type)) {
            if (TileCollider.ENTITY_COLLISION_RESPONSES[type].hasOwnProperty(entity.CR_ID)) {
                if (TileCollider.ENTITY_COLLISION_RESPONSES[type][entity.CR_ID].X) {
                    TileCollider.ENTITY_COLLISION_RESPONSES[type][entity.CR_ID].X(entity, tilePos, deltaTime);
                }
            } else {
                if (TileCollider.ENTITY_COLLISION_RESPONSES[type].hasOwnProperty("Physical")) {
                    TileCollider.ENTITY_COLLISION_RESPONSES[type]["Physical"].X(entity, tilePos, deltaTime);
                }
            }
        }
    },

    handleCollisionY(entity, tileID, tilePos, deltaTime) {
        let type = TileCollider.findType(tileID);
        if (TileCollider.ENTITY_COLLISION_RESPONSES.hasOwnProperty(type)) {
            if (TileCollider.ENTITY_COLLISION_RESPONSES[type].hasOwnProperty(entity.CR_ID)) {
                if (TileCollider.ENTITY_COLLISION_RESPONSES[type][entity.CR_ID].Y) {
                    TileCollider.ENTITY_COLLISION_RESPONSES[type][entity.CR_ID].Y(entity, tilePos, deltaTime);
                }
            } else {
                if (TileCollider.ENTITY_COLLISION_RESPONSES[type].hasOwnProperty("Physical")) {
                    TileCollider.ENTITY_COLLISION_RESPONSES[type]["Physical"].Y(entity, tilePos, deltaTime);
                }
            }
        }
    },

    ENTITY_COLLISION_RESPONSES: {
        "SOLID": {
            "Physical": {
                "X": (entity, tile, deltaTime) => {
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
                "Y": (entity, tile, deltaTime) => {
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
            },
        },
        "ONE_WAY": {
            "Physical": {
                "Y": (entity, tile, deltaTime) => {
                    if (entity.overlapTile(tile)) {
                        if (entity.pos.y + entity.height > tile.y && entity._old.y + entity.height <= tile.y) {
                            entity.onBottomCollision(tile);
                            entity.side.bottom = true;
                        }
                    }
                },
                "X": () => {
                }
            }
        },
        "SLOPE_UP_LEFT": {
            "Physical": {
                "Y": (entity, tile, deltaTime) => {
                    if (entity.overlapTile(tile)) {
                        let eLeftToSlopeRightDiff = tile.x + Tile.SIZE - entity.pos.x;

                        let steppingPosY = -1 * eLeftToSlopeRightDiff + tile.y + Tile.SIZE;

                        if (eLeftToSlopeRightDiff > Tile.SIZE) {
                            entity.vel.y = 0;
                            entity.vel.x = 0;
                            entity.pos.y = tile.y - entity.height;
                            entity.side.bottom = true;
                        } else if (entity.pos.y + entity.height > steppingPosY) {
                            entity.vel.y = 0;
                            entity.vel.x = 0;
                            entity.pos.y = steppingPosY - entity.height;
                            entity.side.bottom = true;
                        }
                    }
                },
                "X": () => {}
            }
        },

        "SLOPE_UP_RIGHT": {
            "Physical": {
                "Y": (entity, tile, deltaTime) => {
                    if (entity.overlapTile(tile)) {
                        let eRightToSlopeLeftDiff = entity.pos.x + entity.width - tile.x;

                        let steppingPosY = -1 * eRightToSlopeLeftDiff + tile.y + Tile.SIZE;

                        if (eRightToSlopeLeftDiff > Tile.SIZE) {
                            entity.vel.y = 0;
                            entity.vel.x = 0;
                            entity.pos.y = tile.y - entity.height;
                            entity.side.bottom = true;
                        } else if (entity.pos.y + entity.height > steppingPosY) {
                            entity.vel.y = 0;
                            entity.vel.x = 0;
                            entity.pos.y = steppingPosY - entity.height;
                            entity.side.bottom = true;
                        }
                    }

                },
                "X": () => {
                }
            }
        }

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
        return id < TileCollider.TYPE_RANGE.SOLID && id !== 0
            && !TileCollider.isSlopeLeft(id) && !TileCollider.isSlopeRight(id);
    },

    isOneWay(id) {
        return id > TileCollider.TYPE_RANGE.PASS
            && id <= TileCollider.TYPE_RANGE.ONE_WAY
            && id !== 0;
    },

    createCollisionResponse(entityName, tileName, axis, callback = TileCollider.noResponse) {
        if (!TileCollider.ENTITY_COLLISION_RESPONSES[tileName]) {
            TileCollider.ENTITY_COLLISION_RESPONSES[tileName] = {}
        }
        if (!TileCollider.ENTITY_COLLISION_RESPONSES[tileName][entityName]) {
            TileCollider.ENTITY_COLLISION_RESPONSES[tileName][entityName] = {};
        }
        TileCollider.ENTITY_COLLISION_RESPONSES[tileName][entityName][axis] = callback;
    },
    noResponse: () => {}
};

//Object.freeze(TileCollider); // Prevents object mutation

subject = TileCollider;