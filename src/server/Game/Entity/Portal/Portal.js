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
            "pairData"
        ]);

        this.maxTeleportCooldown = 1; // Seconds
        this.recentlyTeleportedPlayers = new ONMap();
    }

    link(portal) {
        // Myself
        this.pair = portal;
        this.pairData = portal.getDataPack();
        this.snapShotGenerator.snapShot.init.pairData = this.pairData;
        this.destination = portal.pos;

        // The pair
        portal.pair = this;
        this.pair.pairData = this.getDataPack();
        this.pair.snapShotGenerator.snapShot.init.pairData = this.pair.pairData;
        portal.destination = this.pos;
    }

    setDestination(pos) {
        this.destination = pos;
    }

    // Decrement the cool down
    update(game, deltaTime) {


        super.update(game, deltaTime);
        for (let id in this.recentlyTeleportedPlayers.object) {
            this.recentlyTeleportedPlayers.set(id, this.recentlyTeleportedPlayers.get(id) - deltaTime);
            if (this.recentlyTeleportedPlayers.get(id) <= 0) {
                this.recentlyTeleportedPlayers.remove(id);
            }
        }

    }

    teleport(entity, game) {
        if (!this.pair) {
            return;
        }

        if (!this.recentlyTeleportedPlayers.has(entity.id)) {
            this.recentlyTeleportedPlayers.set(entity.id, this.maxTeleportCooldown);
            this.pair.recentlyTeleportedPlayers.set(entity.id, this.maxTeleportCooldown);
        } else {
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
        super.onEntityCollision(entity, entityManager);/*
        if (this.portalTileID)
            if (entity instanceof Player)
                if (entityManager.exists(entity.id)){ //TODO::Portalene med id 99 sender 2 events. 2 Collision?
                    entityManager.eventManager.addPrivate(
                        entity.id, "Portal: " + this.portalTileID, "minimap", "Green", 0, {
                            pos: this.destination,
                            string: "Noe",
                        }, true
                    );
                }*/
    }
}

module.exports = Portal;