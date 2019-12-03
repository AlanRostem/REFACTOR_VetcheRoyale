const Physical = require("../Physical.js");
//const Player = require("../Player/SPlayer.js");
const Vector2D = require("../../../../../shared/code/Math/SVector2D.js");

class CompositeInteractor {
    constructor(entity, interactionRange = 0) {
        this.iRange = interactionRange;
        this.entity = entity;
    }

    checkInteraction(player, entityManager) {
        if (this.iRange !== 0) {
            if (Vector2D.distance(player.pos, this.entity.pos) <= this.iRange) {
                this.handlePlayerInput(player, entityManager);
            }
        } else {
            if (this.entity.overlapEntity(player)) {
                this.handlePlayerInput(player, entityManager)
            }
        }
    }

    handlePlayerInput(player, entityManager) {
        if (player.input.singleKeyPress(CompositeInteractor.INTERACTION_KEY)) {
            this.entity.onPlayerInteraction(player, entityManager);
        }
    }
}

CompositeInteractor.INTERACTION_KEY = 69;

module.exports = CompositeInteractor;