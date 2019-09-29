const GameWorld = require("../../GameWorld.js");
const Tile = require("../../../TileBased/Tile.js");
const HubPortal = require("../../../Entity/Portal/HubPortal.js");
const Vector2D = require("../../../../../shared/code/Math/SVector2D.js");

class Match extends GameWorld{
    constructor(worldList, name, gameMap) {
        super(name, gameMap);
        this.setGameRules({
            "lootLife": 2,
            "pvp": true,
            "maxPlayers": 24,
            "maxTeamMembers": 6,
            "dropLootOnDeath": true,
        });
        this.spawnEntity(
            61 * Tile.SIZE,
            104 * Tile.SIZE,
            new HubPortal(0, 0, this.id, worldList.get("lobby"),
                new Vector2D(
                    150 * Tile.SIZE,
                    202 * Tile.SIZE)));
    }

    update(deltaTime, worldManager) {
        super.update(deltaTime, worldManager);
    }
}

module.exports = Match;