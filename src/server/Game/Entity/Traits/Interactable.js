const Physical = require("../Traits/Physical.js");
//const Player = require("../Player/SPlayer.js");
const Vector2D = require("../../../../shared/code/Math/SVector2D.js");

// Entity that can be interacted with by pressing
// the designated interaction key.
class Interactable extends Physical {
    constructor(x, y, w, h, interactionRange = 0) {
        super(x, y, w, h);
        this.iRange = interactionRange;
    }

    checkInteraction(player, entityManager) {
        if (this.iRange !== 0) {
            if (Vector2D.distance(player.pos, this.pos) <= this.iRange) {
                this.handlePlayerInput(player, entityManager);
            }
        } else {
            if (this.overlapEntity(player)) {
                this.handlePlayerInput(player, entityManager)
            }
        }
    }

    handlePlayerInput(player, entityManager) {
        if (player.input.singleKeyPress(Interactable.INTERACTION_KEY)) {
            this.onPlayerInteraction(player, entityManager);
        }
    }

    onPlayerInteraction(player, entityManager) {
        // Override here
    }

    forEachNearbyEntity(entity, entityManager) {
        if (entity.constructor.name === "Player") {
            this.checkInteraction(entity, entityManager);
        }
    }

}

Interactable.INTERACTION_KEY = 69;

module.exports = Interactable;