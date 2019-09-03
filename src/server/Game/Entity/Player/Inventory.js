// Composition class that keeps track of the
// player inventory data such as ammo and weapon.
class Inventory {
    constructor() {
        this.ammoCount = Infinity;
        this.equippedWeapon = null;
    }

    pickUp(loot) {
        loot.addToInventory(this);
    }

    get ammo() {
        return this.ammoCount
    }

    set ammo(val) {
        this.ammoCount = val;
    }

    get weapon() {
        return this.equippedWeapon;
    }

    set weapon(val) {
        if (this.equippedWeapon === null)
            this.equippedWeapon = val;
    }

    dropWeapon() {
        if (this.equippedWeapon !== null) {
            this.equippedWeapon = null;
        }
    }
}

module.exports = Inventory;