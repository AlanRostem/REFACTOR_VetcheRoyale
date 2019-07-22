const Interactable = require("../Traits/Interactable.js");
class Portal extends Interactable {
    constructor(x, y, destinationPos, frameColor = "blue") {
        super(x, y, 10, 16);
        this._frameColor = frameColor;
        this._destination = destinationPos;
        this.addStaticSnapShotData([
            "_frameColor",
        ]);
    }

    link(portal) {
        portal.setDestination(this.center);
        this.setDestination(portal.center);
    }

    setDestination(pos) {
        this._destination = pos;
    }

    teleport(player, game) {
        player.pos.x = this._destination.x - player.width / 2;
        player.pos.y = this._destination.y - player.height / 2;
    }

    onPlayerInteraction(player, entityManager) {
        super.onPlayerInteraction(player, entityManager);
        this.teleport(player, entityManager);
    }
}

module.exports = Portal;