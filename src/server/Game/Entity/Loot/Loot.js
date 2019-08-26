const Interactable = require("../Traits/Interactable.js");
const Tile = require("../../TileBased/Tile.js");

class Loot extends Interactable {
    constructor(x, y, shouldRemove = false) {
        super(x, y, 4, 6); // All loot hit boxes should be of this size
        this._shouldRemove = shouldRemove;
        this._acc.y = 500;
        this.setQuadTreeRange(Loot.PICK_UP_RANGE, Loot.PICK_UP_RANGE);
    }

    // Return true based on some data of the player
    // or self when you want the item to be picked up.
    canPickUp(player) {
        return true; // Override
    }

    // Throw the item in some direction.
    cast(x, y) {
        this.vel.x = x;
        this.vel.y = y;
    }

    // Ground physics.
    update(entityManager, deltaTime) {
        if (!this.side.bottom) {
            this.vel.x *= Loot.AIR_FRICTION;
        }
        super.update(entityManager, deltaTime);
    }

    // Specify what should change about the player inventory
    // when picking the item up.
    addToInventory(inventory) {
        // Override here
    }

    onPlayerInteraction(player, entityManager) {
        super.onPlayerInteraction(player, entityManager);
        player.inventory.pickUp(this);
        if (this._shouldRemove) this.remove();
    }
}

Loot.AIR_FRICTION = 0.9;
Loot.PICK_UP_RANGE = Tile.SIZE * 6;

module.exports = Loot;