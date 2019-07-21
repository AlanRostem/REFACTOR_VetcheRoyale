const KE_6H = require("./Weapons/KE_6H.js");
const Ammo = require("./Multanium/Ammo.js");
const Charge = require("./Multanium/Charge.js");

const LootRNG = {
    _levelMap: {
        1: [],
        2: [],
        3: [],
        4: [],
    },

    setup() {
        LootRNG.setLootConstructor(3, KE_6H);
        LootRNG.setLootConstructor(2, Charge);
        LootRNG.setLootConstructor(1, Ammo);
    },

    setLootConstructor(level, constructor) {
        if (!LootRNG._levelMap[level].includes(constructor)) {
            LootRNG._levelMap[level].push(constructor);
        }
    },

    // Returns an array of loot entities. Set what level
    // you want and the amount. It randomly generates
    // loot from the level you specified and below that.
    // You can also set how many items of that specific
    // you want guaranteed to spawn.
    generateLootArray(level, count, guaranteeCount = 1) {
        var guaranteeLevel = LootRNG._levelMap[level];
        var countUsage = count;
        var array = [];

        for (var i = 0; i < guaranteeCount; i++) {
            countUsage--;
            var idx = (Math.random() * guaranteeLevel.length) | 0;
            array.push(new guaranteeLevel[idx](0, 0));
        }

        for (var j = 0; j < countUsage; j++) {
            var lvl = ((Math.random() * level) | 0) + 1;
            var belowLevel = LootRNG._levelMap[lvl];
            idx = (Math.random() * belowLevel.length) | 0;
            array.push(new belowLevel[idx](0, 0));
        }
        return array;
    }
};

LootRNG.setup();

module.exports = LootRNG;