const Interactable = require("../Traits/Interactable.js");
const ONMap = require("../../../../shared/code/DataStructures/SObjectNotationMap.js");

// Teleports players to a given position. Can also be linked to
// another portal.
class Portal extends Interactable {
    constructor(x, y, args) {
        super(x, y, 10, 16);


        this.portalTileID = args.id;
        this._frameColor = args.frameColor;
        this._pairData = null;
        this._link = null;

        this.addStaticSnapShotData([
            "_frameColor",
        ]);

        this.addDynamicSnapShotData([
            "_pairData"
        ]);
    }

    link(portal) {
        portal._link = this;
        portal._destination = this.pos;
        this._pairData = this.getDataPack();
        this._link = portal;
        this._pairData = portal.getDataPack();
        this.setDestination(portal.pos);
    }

    setDestination(pos) {
        this._destination = pos;
    }

    teleport(entity, game) {
        if (!this._link) {
            return;
        }
        entity.pos.x = this._destination.x - entity.width / 2;
        entity.pos.y = this._destination.y - entity.height / 2;
    }

    onPlayerInteraction(player, entityManager) {
        super.onPlayerInteraction(player, entityManager);
        this.teleport(player, entityManager);
    }
}

module.exports = Portal;