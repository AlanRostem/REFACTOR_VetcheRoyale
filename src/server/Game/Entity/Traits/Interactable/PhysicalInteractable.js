const Physical = require("../Physical.js");
//const Player = require("../Player/SPlayer.js");
const CompositeInteractor = require("./CompositeInteractor.js");

// Entity that can be interacted with by pressing
// the designated interaction key.
class PhysicalInteractable extends Physical {
    constructor(x, y, w, h, interactionRange = 0) {
        super(x, y, w, h);
        this.interactor = new CompositeInteractor(this, interactionRange);
    }

    onPlayerInteraction(player, entityManager) {
        // Override here
    }

    forEachNearbyEntity(entity, entityManager) {
        if (entity.constructor.name === "Player") {
            this.interactor.checkInteraction(entity, entityManager);
        }
    }

}

module.exports = PhysicalInteractable;