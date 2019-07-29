const Loot = require("../../Loot.js");

// Composition abstraction class for the weapon you can pick up.
// Handles interaction and world physics.
class WeaponItem extends Loot {
    constructor(x, y) {
        super(x, y, false);
        this._equippedToPlayer = false;
        this._playerID = null;
    }

    // Can pick up when the player does not have a weapon.
    // (!null returns true)
    canPickUp(player) {
        return !player.inventory.weapon;
    }

    update(entityManager, deltaTime) {
        if (!this._equippedToPlayer) {
            // Update the world item behaviour when not equipped to player.
            super.update(entityManager, deltaTime);
        } else {
            if (this._playerID) {
                // If the player disconnects (or is removed from game world)
                // the weapon is dropped. Otherwise we call methods for when
                // it is equipped.
                if (entityManager.getEntity(this._playerID)) {
                    this.updateWhenEquipped(entityManager.getEntity(this._playerID), entityManager, deltaTime);
                } else {
                    this.t_drop();
                }
            }
        }
    }

    // Bind weapon to the player and check if the player presses
    // the drop key.
    updateWhenEquipped(player, entityManager, deltaTime) {
        if (player.input.singleKeyPress(WeaponItem.DROP_KEY))
            this.drop(player);
        this.pos.x = player.center.x - this.width / 2;
        this.pos.y = player.center.y - this.height / 2;
    }

    equip(player) {
        this._equippedToPlayer = true;
        this._playerID = player.id;
    }

    // Drops the weapon when the player disconnects (removed from game world)
    t_drop() {
        this._equippedToPlayer = false;
        this._playerID = null;
        this.onDrop();
    }

    // Callback when dropping the weapon
    onDrop(player, entityManager, deltaTime) {

    }

    // Unbinds the weapon from the player and is thrown in
    // the mouse direction.
    drop(player, entityManager, deltaTime) {
        if (this._equippedToPlayer) {
            player.inventory.dropWeapon();
            this._equippedToPlayer = false;
            this._playerID = null;
            this.vel.x = WeaponItem.DROP_SPEED * player.input.mouseData.cosCenter;
            this.vel.y = WeaponItem.DROP_SPEED * player.input.mouseData.sinCenter;
            this.onDrop(player, entityManager, deltaTime);
        }
    }

    addToInventory(inventory) {
        inventory.weapon = this;
    }

    onPlayerInteraction(player, entityManager) {
        if (!this._equippedToPlayer && !player.inventory.weapon) {
            super.onPlayerInteraction(player, entityManager);
            this.equip(player);
        }
    }
}

WeaponItem.DROP_KEY = 71;
WeaponItem.DROP_SPEED = 200;

module.exports = WeaponItem;