const Portal = require("./Portal.js");

// Portal that transfers players to different hubs.
class HubPortal extends Portal {
    constructor(x, y, gameID, destinationWorld, destinationPos, frameColor) {
        super(x, y, destinationPos, frameColor);
        this._destinationWorld = destinationWorld;

    }

    teleport(entity, game) {
        var client = entity.client;
        super.teleport(client.player, game);
        this._destinationWorld.spawnPlayer(client);
        game.removePlayer(client.player.id);
        client.removed = false;
        client.player._removed = false;
        var data = client.player.getDataPack();
        entity.client.emit("gameEvent-changeWorld", data);
        // TODO: Transfer player weapon
    }
}

module.exports = HubPortal;