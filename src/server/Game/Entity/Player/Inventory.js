// Composition class that keeps track of the
// player inventory data such as ammo and weapon.

const MAX_AMMO = 240;
class Inventory {
    constructor() {
        this.ammoCount = 0;
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

    update(game) {
        if (game.getGameRule("infiniteAmmo")) {
            if (this.ammo < MAX_AMMO) {
                this.ammo++;
            }
        }
    }
}

module.exports = Inventory;