const Bottle = require("./Bottle.js");

class Charge extends Bottle {
    constructor(x, y, amount = 24) {
        super(x, y);
        this._amount = amount;
        this._type = "charge";
        this.addStaticSnapShotData([
            "_type",
            "_amount"
        ]);
    }

    addToInventory(inventory) {
        super.addToInventory(inventory);
        // TODO: Remove test:
        console.log("Charged up weapon " + inventory.weapon.constructor.name + " with " + inventory.weapon.superCharge + "% to",
            (inventory.weapon.superCharge += this._amount) + "%");
    }

    onPlayerInteraction(player, entityManager) {
        if (player.inventory.weapon) {
            if (player.inventory.weapon.superCharge < 100) {
                super.onPlayerInteraction(player, entityManager);
            }
        }
    }
}

module.exports = Charge;