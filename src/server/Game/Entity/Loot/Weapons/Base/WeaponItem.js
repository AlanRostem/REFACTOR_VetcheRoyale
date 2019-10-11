const Loot = require("../../Loot.js");

// Composition abstraction class for the weapon you can pick up.
// Handles interaction and world physics.
class WeaponItem extends Loot {
    constructor(x, y, displayName, weaponClass = "pistol") {
        super(x, y, false);
        this.equippedToPlayer = false;
        this.playerID = null;
        this.displayName = displayName;
        this.weaponClass = weaponClass;
        this.dropped = false;

        // All possible weapon classes:
        // pistol, rifle

        this.addStaticSnapShotData([
            "displayName",
            "weaponClass",
        ]);

        this.addDynamicSnapShotData([
            "equippedToPlayer",
            "playerID",
            "dropped",
        ]);
    }

    // Can pick up when the player does not have a weapon.
    // (!null returns true)
    canPickUp(player) {
        return !player.inventory.weapon;
    }

    update(entityManager, deltaTime) {
        if (!this.equippedToPlayer) {
            // Update the world item behaviour when not equipped to player.
            super.update(entityManager, deltaTime);
            this.dropped = false;
        } else {
            if (this.playerID) {
                // If the player disconnects (or is removed from game world)
                // the weapon is dropped. Otherwise we call methods for when
                // it is equipped.
                if (entityManager.getEntity(this.playerID)) {
                    this.updateWhenEquipped(entityManager.getEntity(this.playerID), entityManager, deltaTime);
                } else {
                    if (entityManager.getGameRule("dropLootOnDeath")) {
                        this.dropOnPlayerRemoval();
                    } else {
                        this.remove();
                    }
                }
            }
        }
    }

    // Bind weapon to the player and check if the player presses
    // the drop key.
    updateWhenEquipped(player, entityManager, deltaTime) {
        this.resetLifeTime(entityManager);
        if (player.input.singleKeyPress(WeaponItem.DROP_KEY))
            this.drop(player, entityManager);
        this.pos.x = player.center.x - this.width / 2;
        this.pos.y = player.center.y - this.height / 2;
    }

    equip(player) {
        this.equippedToPlayer = true;
        this.playerID = player.id;
        player.setMovementState("weapon", this.weaponClass);
    }

    // Drops the weapon when the player disconnects (removed from game world)
    dropOnPlayerRemoval() {
        this.equippedToPlayer = false;
        this.playerID = null;
        this.onDrop();
    }

    // Callback when dropping the weapon
    onDrop(player, entityManager, deltaTime) {

    }

    // Unbinds the weapon from the player and is thrown in
    // the mouse direction.
    drop(player, entityManager, deltaTime) {
        if (this.equippedToPlayer) {
            player.inventory.dropWeapon();
            player.setMovementState("weapon", "none");
            this.equippedToPlayer = false;
            this.playerID = null;
            this.vel.x = WeaponItem.DROP_SPEED * player.input.mouseData.cosCenter;
            this.vel.y = WeaponItem.DROP_SPEED * player.input.mouseData.sinCenter;
            this.onDrop(player, entityManager, deltaTime);
            this.dropped = true;
        }
    }

    addToInventory(inventory) {
        inventory.weapon = this;
    }

    onPlayerInteraction(player, entityManager) {
        if (!this.equippedToPlayer && !player.inventory.weapon) {
            super.onPlayerInteraction(player, entityManager);
            this.equip(player);
        }
    }
}

WeaponItem.DROP_KEY = 71;
WeaponItem.DROP_SPEED = 200;

module.exports = WeaponItem;