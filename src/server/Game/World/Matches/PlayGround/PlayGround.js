const GameWorld = require("../../GameWorld.js");
const TileMapConfigs = require("../../../../../shared/code/TileBased/STileMapConfigs.js");

const HubPortal = require("../../../Entity/Portal/HubPortal.js");
const Tile = require("../../../TileBased/Tile.js");
const Vector2D = require("../../../../../shared/code/Math/SVector2D.js");


module.exports = class PlayGround extends GameWorld {
    constructor(serverSocket, worldList) {
        super(serverSocket, "playground", 64, false, TileMapConfigs.getMap("lobby"));
        this.configure({
           "lootLife": 6,
            "pvp": false
        });
        this.spawnEntity(
            61 * Tile.SIZE,
            104 * Tile.SIZE,
            new HubPortal(0, 0, this.id, worldList.get("MegaMap"),
                new Vector2D(
                    150 * Tile.SIZE,
                    202 * Tile.SIZE)));
    }
};