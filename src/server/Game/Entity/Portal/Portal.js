const Interactable = require("../Traits/Interactable.js");
const ONMap = require("../../../../shared/code/DataStructures/SObjectNotationMap.js");
const Player = require("../Player/SPlayer.js");
const SGameEvent = require("../../World/Matches/SGameEvent.js");
// Teleports players to a given position. Can also be linked to
// another portal.
class Portal extends Interactable {
    constructor(x, y, args) {
        super(x, y, 10, 16);
        this.portalTileID = args.id;
        this.frameColor = args.frameColor;
        this.pairData = null;
        this.pair = null;

        this.addStaticSnapShotData([
            "frameColor",
        ]);

        this.addDynamicSnapShotData([
            "pairData"
        ]);
    }

    link(portal) {
        portal.pair = this;
        portal.destination = this.pos;
        this.pairData = this.getDataPack();
        this.pair = portal;
        this.pairData = portal.getDataPack();
        this.setDestination(portal.pos);
    }

    setDestination(pos) {
        this.destination = pos;
    }

    teleport(entity, game) {
        if (!this.pair) {
            return;
        }
        entity.pos.x = this.destination.x
            + this.width / 2 - entity.width / 2;
        entity.pos.y = this.destination.y
            + this.height / 2 - entity.height / 2;
    }

    onPlayerInteraction(player, entityManager) {
        super.onPlayerInteraction(player, entityManager);
        this.teleport(player, entityManager);
    }

    onEntityCollision(entity, entityManager) {
        super.onEntityCollision(entity, entityManager);
        if (this.portalTileID)
            if (entity instanceof Player)
                if (entityManager.exists(entity.id))
                    entityManager.eventManager.addPrivate(
                        entity.id, "Portal: " + this.portalTileID, "minimap", "Green", 0, {
                            pos: this.destination,
                        }
                    );
    }
}

module.exports = Portal;