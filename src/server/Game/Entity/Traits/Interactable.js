const Entity = require("../SEntity.js");
const Player = require("../Player/SPlayer.js");

class Interactable extends Entity {
    constructor(x, y, w, h, interactionRange = 0) {
        super(x, y, w, h);
        this._iRange = interactionRange;
    }

    forEachNearbyEntity(entity) {
        if (entity instanceof Player) {
            
        }
    }

}