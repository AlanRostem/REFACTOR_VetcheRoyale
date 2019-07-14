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
        inventory.weapon.superCharge += this._amount;
    }

    onPlayerInteraction(player, entityManager) {
        if (player.inventory.weapon) {
            if (player.inventory.weapon.superCharge < 100 && !player.inventory.weapon.isSuperActive) {
                super.onPlayerInteraction(player, entityManager);
            }
        }
    }
}

module.exports = Charge;