const Interactable = require("../Traits/Interactable.js");
const ONMap = require("../../../../shared/code/DataStructures/SObjectNotationMap.js");

class Portal extends Interactable {
    constructor(x, y, destinationPos, frameColor = "blue") {
        super(x, y, 10, 16);
        this._frameColor = frameColor;
        this._destination = destinationPos;
        this.addStaticSnapShotData([
            "_frameColor",
        ]);
        this._link = null;
    }

    link(portal) {
        portal.setDestination(this.center);
        this.setDestination(portal.center);
        portal._link = this;
        this._link = portal;
    }

    setDestination(pos) {
        this._destination = pos;
    }

    teleport(entity, game) {
        entity.pos.x = this._destination.x - entity.width / 2;
        entity.pos.y = this._destination.y - entity.height / 2;
    }

    onPlayerInteraction(player, entityManager) {
        super.onPlayerInteraction(player, entityManager);
        this.teleport(player, entityManager);
    }
}

module.exports = Portal;