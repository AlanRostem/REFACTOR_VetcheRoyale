const Interactable = require("../../Traits/Interactable.js");
const LootRNG = require("../LootRNG.js");

class LootCrate extends Interactable {
    constructor(x, y, level = 1, capacity = 5, levelGuarantee = 1) {
        super(x, y, 16, 8);
        this._level = level;
        this._capacity = capacity;
        this._levelGuarantee = levelGuarantee;
        this._collisionConfig.gravity = true;
        this._collisionConfig.collision = true;
        this.acc.y = 500;
        this.addStaticSnapShotData([
            "_level"
        ]);
    }

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

    onPlayerInteraction(player, entityManager) {
        super.onPlayerInteraction(player, entityManager);
        this.spawnItems(entityManager);
        this.remove();
    }
}

LootCrate.DROP_SPEED = 200;

module.exports = LootCrate;