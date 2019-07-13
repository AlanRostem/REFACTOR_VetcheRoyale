const KE_6H = require("../Weapons/KE_6H.js");
const Ammo = require("../Multanium/Ammo.js");
const Charge = require("../Multanium/Charge.js");


const LootRNG = {
    _levelMap: {
        1: [],
        2: [],
        3: [],
        4: [],
    },

    setup() {
        LootRNG.setLootConstructor(3, KE_6H);
        LootRNG.setLootConstructor(3, Charge);
        LootRNG.setLootConstructor(3, Ammo);
    },

    setLootConstructor: (level, constructor) => {
        LootRNG._levelMap[level].push(constructor);
    },

    generateLootArray : (level, count) => {
        var map = LootRNG._levelMap[level];
        var array = [];
        for (var i = 0; i < count; i++) {
            var idx = (Math.random() * map.length) | 0;
            array.push(new map[idx](0, 0));
        }
        return array;
    }
};

LootRNG.setup();

module.exports = LootRNG;