import Vector2D from "../../../../../shared/code/Math/CVector2D.js";

// Composite object that handles tile tileCollision
// based on entity type.
const CTileCollider = {
    TYPE_RANGE: {
        PASS: 95, // TODO: Remove test values
        SOLID: 17, // TODO: Remove test values
        ONE_WAY: 96, // TODO: FIND CORRECT VALUE
        SLOPE_UP_LEFT: 14,
        SLOPE_UP_RIGHT: 13,
    },

    handleCollisionX(entity, tileID, tilePos, deltaTime) {
        let type = CTileCollider.findType(tileID);
        if (CTileCollider.ENTITY_COLLISION_RESPONSES.hasOwnProperty(type)) {
            if (CTileCollider.ENTITY_COLLISION_RESPONSES[type].hasOwnProperty(entity.CR_ID)) {
                if (CTileCollider.ENTITY_COLLISION_RESPONSES[type][entity.CR_ID].X) {
                    CTileCollider.ENTITY_COLLISION_RESPONSES[type][entity.CR_ID].X(entity, tilePos, deltaTime);
                }
            } else {
                if (CTileCollider.ENTITY_COLLISION_RESPONSES[type].hasOwnProperty("Physical")) {
                    CTileCollider.ENTITY_COLLISION_RESPONSES[type]["Physical"].X(entity, tilePos, deltaTime);
                }
            }
        }
    },

    handleCollisionY(entity, tileID, tilePos, deltaTime) {
        let type = CTileCollider.findType(tileID);
        if (CTileCollider.ENTITY_COLLISION_RESPONSES.hasOwnProperty(type)) {
            if (CTileCollider.ENTITY_COLLISION_RESPONSES[type].hasOwnProperty(entity.CR_ID)) {
                if (CTileCollider.ENTITY_COLLISION_RESPONSES[type][entity.CR_ID].Y) {
                    CTileCollider.ENTITY_COLLISION_RESPONSES[type][entity.CR_ID].Y(entity, tilePos, deltaTime);
                }
            } else {
                if (CTileCollider.ENTITY_COLLISION_RESPONSES[type].hasOwnProperty("Physical")) {
                    CTileCollider.ENTITY_COLLISION_RESPONSES[type]["Physical"].Y(entity, tilePos, deltaTime);
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
                            if (entity.pos.x + entity.width > tile.x && entity.old.x + entity.width <= tile.x) {
                                entity.onRightCollision(tile);
                                entity.side.right = true;
                            }
                        }
                        if (entity.vel.x < 0) {
                            if (entity.pos.x < tile.x + Tile.SIZE && entity.old.x >= tile.x + Tile.SIZE) {
                                entity.onLeftCollision(tile);
                                entity.side.left = true;
                            }
                        }
                    }
                },
                "Y": (entity, tile, deltaTime) => {
                    if (entity.overlapTile(tile)) {
                        if (entity.vel.y > 0) {
                            if (entity.pos.y + entity.height > tile.y && entity.old.y + entity.height <= tile.y) {
                                entity.onBottomCollision(tile);
                                entity.side.bottom = true;
                            }
                        }
                        if (entity.vel.y < 0) {
                            if (entity.pos.y < tile.y + Tile.SIZE && entity.old.y >= tile.y + Tile.SIZE) {
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
                        if (entity.pos.y + entity.height > tile.y && entity.old.y + entity.height <= tile.y) {
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
        if (CTileCollider.isSlopeLeft(id)) {
            return "SLOPE_UP_LEFT"
        } else if (CTileCollider.isSlopeRight(id)) {
            return "SLOPE_UP_RIGHT";
        } else if (CTileCollider.isSolid(id)) {
            return "SOLID";
        } else if (CTileCollider.isOneWay(id)) {
            return "ONE_WAY";
        } else {
            return "PASS";
        }
    },

    isSlopeLeft(id) {
        return CTileCollider.TYPE_RANGE.SLOPE_UP_LEFT === id;
    },

    isSlopeRight(id) {
        return CTileCollider.TYPE_RANGE.SLOPE_UP_RIGHT === id;
    },

    isSolid(id) {
        return id < CTileCollider.TYPE_RANGE.SOLID && id !== 0
            && !CTileCollider.isSlopeLeft(id) && !CTileCollider.isSlopeRight(id);
    },

    isOneWay(id) {
        return id > CTileCollider.TYPE_RANGE.PASS
            && id <= CTileCollider.TYPE_RANGE.ONE_WAY
            && id !== 0;
    },

    createCollisionResponse(entityName, tileName, axis, callback = CTileCollider.noResponse) {
        if (!CTileCollider.ENTITY_COLLISION_RESPONSES[tileName]) {
            CTileCollider.ENTITY_COLLISION_RESPONSES[tileName] = {}
        }
        if (!CTileCollider.ENTITY_COLLISION_RESPONSES[tileName][entityName]) {
            CTileCollider.ENTITY_COLLISION_RESPONSES[tileName][entityName] = {};
        }
        CTileCollider.ENTITY_COLLISION_RESPONSES[tileName][entityName][axis] = callback;
    },
    noResponse: () => {}
};

export default CTileCollider;