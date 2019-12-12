const Loot = require("../../Loot.js");
const Player = require("../../../Player/SPlayer.js");

// Composition abstraction class for the weapon you can pick up.
// Handles interaction and world physics.
class WeaponItem extends Loot {
    static _ = (() => {
        WeaponItem.addDynamicValues(
            "equippedToPlayer",
            "playerID",
            "dropped",
        );
        WeaponItem.addStaticValues(
            "displayName",
            "weaponClass"
        );
    })();

    constructor(x, y, displayName, weaponClass = "pistol") {
        super(x, y, false);
        this.equippedToPlayer = false;
        this.playerID = null;
        this.player = null;
        this.displayName = displayName;
        this.weaponClass = weaponClass;
        this.dropped = false;

        // All possible weapon classes:
        // pistol, rifle
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

                if (!this.player.toRemove) {
                    this.updateWhenEquipped(this.player, entityManager, deltaTime);
                } else {
                    if (entityManager.getGameRule("dropLootOnDeath")) {
                        this.dropOnPlayerRemoval(entityManager, deltaTime);
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
        this.old.x = this.pos.x;
        this.old.y = this.pos.y;
        this.resetLifeTime(entityManager);
        if (player.input.singleKeyPress(WeaponItem.DROP_KEY))
            this.drop(player, entityManager);
        this.pos.x = player.center.x - this.width / 2;
        this.pos.y = player.center.y - this.height / 2;
        this.entitiesInProximity.update(entityManager, deltaTime);
    }

    equip(player) {
        this.equippedToPlayer = true;
        this.playerID = player.id;
        this.player = player;
        player.setMovementState("weapon", this.weaponClass);
    }

    getOwner() {
        if (this.player) {
            return this.player;
        }
        console.log(new Error("Player was undefined in getOwner called at " + this.constructor.name + " because id was " + this.playerID).stack);
        return WeaponItem.EMPTY_PLAYER;
    }

    hasOwner() {
        return !!this.player;
    }

    // Drops the weapon when the player disconnects (removed from game world)
    dropOnPlayerRemoval(entityManager, deltaTime) {
        this.onDrop(this.getOwner(entityManager), entityManager, deltaTime);
        this.equippedToPlayer = false;
        this.playerID = null;
        this.player = null;
        console.log(true)
    }

    // Callback when dropping the weapon
    onDrop(player, entityManager, deltaTime) {

    }

    // Unbinds the weapon from the player and is thrown in
    // the mouse direction.
    drop(player, entityManager, deltaTime) {
        if (this.equippedToPlayer) {
            player.inventory.dropWeapon();
            player.invWeaponID = null;
            player.setMovementState("weapon", "none");
            this.equippedToPlayer = false;
            this.playerID = null;
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
WeaponItem.DROP_SPEED = 120;
WeaponItem.EMPTY_PLAYER = new Player(-1);

module.exports = WeaponItem;
