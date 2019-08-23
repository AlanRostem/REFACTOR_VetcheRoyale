// Composition class that keeps track of the
// player inventory data such as ammo and weapon.
class Inventory {
    constructor() {
        this._ammoCount = Infinity;
        this._equippedWeapon = null;
    }

    pickUp(loot) {
        loot.addToInventory(this);
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

    set weapon(val) {
        if (this._equippedWeapon === null)
            this._equippedWeapon = val;
    }

    dropWeapon() {
        if (this._equippedWeapon !== null) {
            this._equippedWeapon = null;
        }
    }
}

module.exports = Inventory;