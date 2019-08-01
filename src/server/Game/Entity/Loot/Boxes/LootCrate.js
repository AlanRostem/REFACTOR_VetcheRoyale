const Interactable = require("../../Traits/Interactable.js");
const LootRNG = require("../LootRNG.js");

class LootCrate extends Interactable {
    constructor(x, y, level = 1, capacity = 5, levelGuarantee = 1) {
        super(x, y, 16, 8);
        this._level = level;
        this._capacity = capacity;
        this._levelGuarantee = levelGuarantee;
        this._physicsConfig.gravity = false;
        this._physicsConfig.tileCollision = false;
        this.acc.y = 500;
        this.addStaticSnapShotData([
            "_level"
        ]);
    }

    // Asks the LootRNG object for an array of references to randomly
    // generate loot. Then, it spawns them in a game world with speeds
    // respective to their array placement order to shoot out in all
    // of those directions.
    spawnItems(entityManager) {
        var items = LootRNG.generateLootArray(this._level, this._capacity, this._levelGuarantee);
        var startAngle = 0;
        var count = 0;
        for (var loot of items) {
            entityManager.spawnEntity(
                this.center.x - loot.width / 2,
                this.pos.y - loot.height,
                loot);
            startAngle += count * (Math.PI / items.length);
            loot.cast(
                LootCrate.DROP_SPEED * -Math.cos(startAngle),
                LootCrate.DROP_SPEED * -Math.sin(startAngle));
            count++;
        }
    }

    // Press key to spawn the items and delete the loot crate.
    onPlayerInteraction(player, entityManager) {
        super.onPlayerInteraction(player, entityManager);
        this.spawnItems(entityManager);
        this.remove();
    }
}

LootCrate.DROP_SPEED = 200;

module.exports = LootCrate;