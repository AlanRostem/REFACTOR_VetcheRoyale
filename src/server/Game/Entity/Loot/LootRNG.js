const KE_6H = require("./Weapons/KE_6H.js");
const SEW_9 = require("./Weapons/SEW-9.js");
const Interlux = require("./Weapons/Interlux.js");
const HadronRailGun = require("./Weapons/HadronRailGun.js");
const AquaSLG = require("./Weapons/AquaSLG.js");
const Firewall = require("./Weapons/Firewall.js");
const Ammo = require("./Multanium/Ammo.js");
const Charge = require("./Multanium/Charge.js");

// Object that generates loot based on the "level" of
// of the designated item. This file should require all
// files of classes that extends Loot (besides composition bases)
const LootRNG = {
    levelMap: {
        1: [],
        2: [],
        3: [],
        4: [],
    },

    // Initialize
    setup() {
        LootRNG.setLootConstructor(3, KE_6H);
        LootRNG.setLootConstructor(3, SEW_9);
        LootRNG.setLootConstructor(4, Interlux);
        LootRNG.setLootConstructor(4, HadronRailGun);
        LootRNG.setLootConstructor(2, AquaSLG);
        LootRNG.setLootConstructor(1, Firewall);
        LootRNG.setLootConstructor(2, Charge);
        LootRNG.setLootConstructor(1, Ammo);
    },

    // Pass in a level int and the constructor of the loot entity
    setLootConstructor(level, constructor) {
        if (!LootRNG.levelMap[level].includes(constructor)) {
            LootRNG.levelMap[level].push(constructor);
        }
    },

    // Returns an array of loot entities. Set what level
    // you want and the amount. It randomly generates
    // loot from the level you specified and below that.
    // You can also set how many items of that specific
    // you want guaranteed to spawn.
    generateLootArray(level, count, guaranteeCount = 1) {
        var guaranteeLevel = LootRNG.levelMap[level];
        var countUsage = count;
        var array = [];
        debugger;
        for (var i = 0; i < guaranteeCount; i++) {
            countUsage--;
            var idx = (Math.random() * guaranteeLevel.length) | 0;
            array.push(new guaranteeLevel[idx](0, 0));
        }

        for (var j = 0; j < countUsage; j++) {
            var lvl = ((Math.random() * level) | 0) + 1;
            var belowLevel = LootRNG.levelMap[lvl];
            idx = (Math.random() * belowLevel.length) | 0;
            array.push(new belowLevel[idx](0, 0));
        }
        return array;
    }
};

LootRNG.setup();

module.exports = LootRNG;