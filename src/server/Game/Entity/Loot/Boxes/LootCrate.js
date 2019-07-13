const Interactable = require("../../Traits/Interactable.js");
const LootRNG = require("./LootRNG.js");

class LootCrate extends Interactable {
    constructor(x, y, level = 1, capacity = 5) {
        super(x, y, 16, 16);
        this._level = level;
        this._capacity = capacity;
        this.addStaticSnapShotData([
            "_level"
        ]);
    }

    spawnItems(entityManager) {
        var items = LootRNG.generateLootArray(this._level, this._capacity);
        for (var loot of items) {
            entityManager.spawnEntity(
                this.center.x - loot.width / 2,
                this.center.y - loot.height / 2,
                loot);
            var angle = Math.random() * Math.PI;
            loot.cast(
                LootCrate.DROP_SPEED * Math.cos(angle),
                LootCrate.DROP_SPEED * Math.sin(angle));
        }
    }

    onPlayerInteraction(player, entityManager) {
        super.onPlayerInteraction(player, entityManager);
        this.spawnItems(entityManager);
        this.remove();
    }
}

LootCrate.DROP_SPEED = 100;

module.exports = LootCrate;