const Bottle = require("./Bottle.js");

/**
 * Weapon super ability charge loot object. Adds extra charge to
 * the player's weapon.
 */
class Charge extends Bottle {
    static _ = (() => {
        Charge.addStaticValues("type", "amount");
    })();

    static TYPE = "charge";

    /**
     * @param x {number} Position in the world
     * @param y {number} Position in the world
     * @param amount {number} Percentage added to the weapon
     */
    constructor(x, y, amount = 24) {
        super(x, y);
        this.amount = amount;
        this.type = Charge.TYPE;
    }

    /**
     * Can only pick up when the player has a weapon.
     * This is checked in the LOS-AOE loot scanner.
     * @param player {Player} Given player that want to pick this item up
     * @see AOELOSScanner
     */
    canPickUp(player) {
        return player.inventory.weapon;
    }

    /**
     * Add percentage to the weapon in inventory
     * @param inventory {Inventory} The inventory of the given player who picked this item up
     */
    addToInventory(inventory) {
        super.addToInventory(inventory);
        inventory.weapon.superCharge += this.amount;
    }

    /**
     * Can only pick up when the weapon has a super charge
     * below 100%;
     * @param player {Player} Given player that interacted with this item
     * @param entityManager {GameWorld} The world this item belongs to
     */
    onPlayerInteraction(player, entityManager) {
        if (player.inventory.weapon) {
            if (player.inventory.weapon.superCharge < 100 && !player.inventory.weapon.isSuperActive) {
                super.onPlayerInteraction(player, entityManager);
            }
        }
    }
}

module.exports = Charge;