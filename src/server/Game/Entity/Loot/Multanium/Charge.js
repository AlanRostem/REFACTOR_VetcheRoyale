const Bottle = require("./Bottle.js");

class Charge extends Bottle {
    constructor(x, y, amount = 24) {
        super(x, y);
        this.amount = amount;
        this.type = "charge";
        this.addStaticSnapShotData([
            "type",
            "amount"
        ]);
    }

    // Can only pick up when the player has a weapon.
    // This is checked in the LOS-AOE loot scanner.
    canPickUp(player) {
        return player.inventory.weapon;
    }

    // Add percentage to the weapon in inventory
    addToInventory(inventory) {
        super.addToInventory(inventory);
        inventory.weapon.superCharge += this.amount;
    }

    // Can only pick up when the weapon has a super charge
    // below 100%;
    onPlayerInteraction(player, entityManager) {
        if (player.inventory.weapon) {
            if (player.inventory.weapon.superCharge < 100 && !player.inventory.weapon.isSuperActive) {
                super.onPlayerInteraction(player, entityManager);
            }
        }
    }
}

module.exports = Charge;