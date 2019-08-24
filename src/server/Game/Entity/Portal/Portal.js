const Interactable = require("../Traits/Interactable.js");
const ONMap = require("../../../../shared/code/DataStructures/SObjectNotationMap.js");

// Teleports players to a given position. Can also be linked to
// another portal.
class Portal extends Interactable {
    constructor(x, y, destinationPos, frameColor = "blue") {
        super(x, y, 10, 16);
        this._frameColor = frameColor;
        this._destination = destinationPos;
        this._pairData = null;
        this.addStaticSnapShotData([
            "_frameColor",
        ]);
        this.addDynamicSnapShotData([
            "_pairData"
        ]);
        this._link = null;
    }

    link(portal) {
        portal.setDestination(this.center);
        this.setDestination(portal.center);
        portal._link = this;
        this._link = portal;
        this._pairData = portal.getDataPack();
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