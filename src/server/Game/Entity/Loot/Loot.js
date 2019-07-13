const Interactable = require("../Traits/Interactable.js");

class Loot extends Interactable {
    constructor(x, y, shouldRemove = false) {
        super(x, y, 4, 6); // All loot should be of this size
        this._shouldRemove = shouldRemove;
        this._acc.y = 500;
    }

    cast(x, y) {
        this.vel.x = x;
        this.vel.y = y;
    }

    update(entityManager, deltaTime) {
        if (this.side.bottom) {
            this.vel.x *= Loot.GROUND_FRICTION;
        }
        super.update(entityManager, deltaTime);
    }

    addToInventory(inventory) {
        // Override here
    }

    onPlayerInteraction(player, entityManager) {
        super.onPlayerInteraction(player, entityManager);
        player.inventory.pickUp(this);
        if (this._shouldRemove) this.remove();
    }
}

Loot.GROUND_FRICTION = 0.80;

module.exports = Loot;