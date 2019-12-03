const PhysicalInteractable = require("../Traits/Interactable/PhysicalInteractable.js");
const Tile = require("../../TileBased/Tile.js");

class Loot extends PhysicalInteractable {
    constructor(x, y, shouldRemove = false, lifeTime = 6 * 60) {
        super(x, y, 4, 6); // All loot hit boxes should be of this size
        this.shouldRemove = shouldRemove;
        this.lifeTime = lifeTime;
        this.maxLifeTime = lifeTime;
        this.acc.y = 500;
        this.fric.x = Loot.AIR_FRICTION;
        this.setQuadTreeRange(Loot.PICK_UP_RANGE, Loot.PICK_UP_RANGE);
    }

    // Return true based on some data of the player
    // or self when you want the item to be picked up.
    canPickUp(player) {
        return true; // Override
    }

    setMaxLifeTime(x) {
        this.maxLifeTime = x;
    }

    resetLifeTime(game) {
        this.lifeTime = game.getGameRule("lootLife");
    }

    // Throw the item in some direction.
    cast(x, y) {
        this.vel.x = x;
        this.vel.y = y;
    }

    // Ground physics.
    update(entityManager, deltaTime) {
        this.lifeTime -= deltaTime;
        if (this.lifeTime <= 0) {
            this.remove();
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
        if (this.shouldRemove) this.remove();
    }
}

Loot.AIR_FRICTION = 3;
Loot.PICK_UP_RANGE = Tile.SIZE * 2;

module.exports = Loot;