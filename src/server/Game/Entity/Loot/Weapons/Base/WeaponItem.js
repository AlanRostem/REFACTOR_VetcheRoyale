const Loot = require("../../Loot.js");

// Composition abstraction class for the weapon you can pick up
class WeaponItem extends Loot {
    constructor(x, y) {
        super(x, y, false);
        this._equippedToPlayer = false;
        this._playerID = null;
    }

    update(entityManager, deltaTime) {
        if (!this._equippedToPlayer) {
            super.update(entityManager, deltaTime);
        } else {
            if (this._playerID) {
                if (entityManager.getEntity(this._playerID)) {
                    this.updateWhenEquipped(entityManager.getEntity(this._playerID), entityManager, deltaTime);
                } else {
                    this.t_drop();
                }
            }
        }
    }

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

    // Drops the weapon when the player disconnects
    t_drop() {
        this._equippedToPlayer = false;
        this._playerID = null;
        this.onDrop();
    }

    onDrop(player, entityManager, deltaTime) {

    }

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
WeaponItem.DROP_SPEED = 150;

module.exports = WeaponItem;