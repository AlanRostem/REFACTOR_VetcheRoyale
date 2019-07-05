const Entity = require("../SEntity.js");
const Player = require("../Player/SPlayer.js");
const Vector2D = require("../../../../shared/code/Math/SVector2D.js");

class Interactable extends Entity {
    constructor(x, y, w, h, interactionRange = 0) {
        super(x, y, w, h);
        this._iRange = interactionRange;
    }

    checkInteraction(player, entityManager) {
        if (this._iRange !== 0) {
            if (Vector2D.distance(player.pos, this.pos) <= this._iRange) {
                this.handlePlayerInput(player, entityManager);
            }
        } else {
            if (this.overlapEntity(player)) {
                this.handlePlayerInput(player, entityManager)
            }
        }
    }

    handlePlayerInput(player, entityManager) {
        if (player.input.keyHeldDown(Interactable.INTERACTION_KEY)) {
            this.onPlayerInteraction(player, entityManager);
        }
    }

    onPlayerInteraction(player, entityManager) {
        // TODO: Remove Test
        console.log("Interactions with " + player.id);
    }

    forEachNearbyEntity(entity, entityManager) {
        if (entity instanceof Player) {
            this.checkInteraction(entity, entityManager);
        }
    }

}

Interactable.INTERACTION_KEY = 69;

module.exports = Interactable;