const GameWorld = require("../../GameWorld.js");
const Tile = require("../../../TileBased/Tile.js");
const HubPortal = require("../../../Entity/Portal/HubPortal.js");
const Vector2D = require("../../../../../shared/code/Math/SVector2D.js");
const EventManager = require("./SEventManager.js");

class Match extends GameWorld{
    constructor(socket, worldList, name, maxPlayers, gameMap) {
        super(socket, name, maxPlayers, false, gameMap);
        this.eventManager = new EventManager();
        this.spawnEntity(
            61 * Tile.SIZE,
            104 * Tile.SIZE,
            new HubPortal(0, 0, this.id, worldList.get("lobby"),
                new Vector2D(
                    150 * Tile.SIZE,
                    202 * Tile.SIZE)));
    }

    update(deltaTime) {
        super.update(deltaTime);
        this.eventManager.update(this, deltaTime);
    }
}

module.exports = Match;