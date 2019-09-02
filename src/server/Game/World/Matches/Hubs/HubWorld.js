const GameWorld = require("../../GameWorld.js");
const HubPortal = require("../../../Entity/Portal/HubPortal.js");
const Tile = require("../../../TileBased/Tile.js");
const Vector2D = require("../../../../../shared/code/Math/SVector2D.js");

/// Base class of a hub.
class HubWorld extends GameWorld {
    constructor(socket, worldList, name, gameMap) {
        super(socket, name, gameMap);
        this.spawnEntity(
            61 * Tile.SIZE,
            104 * Tile.SIZE,
            new HubPortal(0, 0, this.id, worldList.get("MegaMap"),
                new Vector2D(
                    150 * Tile.SIZE,
                    202 * Tile.SIZE)));
    }
}

module.exports = HubWorld;