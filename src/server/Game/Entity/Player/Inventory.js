class Inventory {
    constructor() {
        this._ammoCount = 24;
        this._equippedWeapon = null;
    }

    pickUp(loot) {
        loot.addToInventory(this);
        console.log(this); // TODO: Remove test
    }

    get ammo() {
        return this._ammoCount
    }

    set ammo(val) {
        this._ammoCount = val;
    }

    get weapon() {
        return this._equippedWeapon;
    }
}

module.exports = Inventory;