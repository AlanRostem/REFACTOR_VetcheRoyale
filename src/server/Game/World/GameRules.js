const ObjectNotationMap = require("../../../shared/code/DataStructures/SObjectNotationMap.js");

class GameRules {
    constructor() {
        this.config = new ObjectNotationMap();
        this.config.set("lootLife", 6 * 60); // Added
        this.config.set("dropLootOnDeath", true); // Added
        this.config.set("infiniteAmmo", false);

        this.config.set("pvp", true); // Added

        this.config.set("maxPlayers", 24); // Added
        this.config.set("maxTeamMembers", 4); // Added

        this.config.set("damageMultiplier", 1);
        this.config.set("superChargeTickMultiplier", 1);
        this.config.set("superChargePerKillMultiplier", 1);
        this.config.set("modCoolDownTickMultiplier", 1);
    }

    configure(object) {
        for (let key in object) {
            if (this.config.has(key)) {
                this.config.set(key, object[key]);
            }
        }
    }

    getRule(key) {
        return this.config.get(key);
    }
}

module.exports = GameRules;