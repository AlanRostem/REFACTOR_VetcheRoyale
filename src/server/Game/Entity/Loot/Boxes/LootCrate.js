const StaticInteractable = require("../../Traits/Interactable/StaticInteractable.js");
const LootRNG = require("../LootRNG.js");

/**
 * Loot crate entity spawned in the game world. Different values for what
 * loot is spawned can be configured. The loot spawned is based on the level
 * of the loot itself.
 * @see LootRNG
 * @see Loot
 */
class LootCrate extends StaticInteractable {
    static _ = (() => {
        LootCrate.addStaticValues("level");
    })();

    static DROP_SPEED = 80;

    /**
     * Constructor method
     * @param x {number} Position in the world
     * @param y {number} Position in thw world
     * @param args {object} Arguments with the level of the items likely to spawn when opening the crate
     * @param capacity {number} Maximum amount of items spawned
     * @param levelGuarantee {number} The minimum item level that is always spawned
     */
    constructor(x, y, args, capacity = 5) {
        super(x, y, 16, 8);
        this.level = args.level;
        this.capacity = capacity;
        this.levelGuarantee = this.level - 1;
    }

    /**
     * Asks the LootRNG object for an array of references to randomly
     * generate loot. Then, it spawns them in a game world with speeds
     * respective to their array placement order to shoot out in all
     * of those directions.
     * @param world {GameWorld} The world the given loot crate was spawned in
     */
    spawnItems(world) {
        let items = LootRNG.generateLootArray(this.level, this.capacity, this.levelGuarantee);
        let startAngle = 0;
        let count = 0;
        for (let loot of items) {
            world.spawnEntity(
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

    /**
     * Overridden from Interactable class.
     * Press key to spawn the items and delete the loot crate.
     * @see Interactable
     * @param player {Player} The player that interacted with the given loot crate
     * @param world {GameWorld} The world the given loot crate was spawned in
     */
    onPlayerInteraction(player, world) {
        super.onPlayerInteraction(player, world);
        this.spawnItems(world);
        this.remove();
    }
}

module.exports = LootCrate;