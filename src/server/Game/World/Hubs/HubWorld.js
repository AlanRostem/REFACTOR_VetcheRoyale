const GameWorld = require("../GameWorld.js");
const HubPortal = require("../../Entity/Portal/HubPortal.js");
const Vector2D = require("../../../../shared/code/Math/SVector2D.js");
const TileCollider = require("../../TileBased/STileCollider.js");


/// Base class of a hub.
class HubWorld extends GameWorld {
    constructor(socket, worldList, name, maxPlayers, gameMap) {
        super(socket, name, maxPlayers, gameMap);
        this.spawnEntity(
            61 * TileCollider.TILE_SIZE,
            104 * TileCollider.TILE_SIZE,
            new HubPortal(0, 0, this.id, worldList.get("MegaMap"),
                new Vector2D(
                    150 * TileCollider.TILE_SIZE,
                    202 * TileCollider.TILE_SIZE)));
    }
}

module.exports = HubWorld;