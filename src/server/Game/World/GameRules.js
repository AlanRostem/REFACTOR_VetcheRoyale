const ObjectNotationMap = require("../../../shared/code/DataStructures/SObjectNotationMap.js");

class GameRules {
    constructor() {
        this._config = new ObjectNotationMap();
        this._config.set("lootLife", 6 * 60); // Added
        this._config.set("dropLootOnDeath", true);

        this._config.set("pvp", true); // Added

        this._config.set("maxPlayers", 24); // Added
        this._config.set("maxTeamMembers", 4);

        this._config.set("damageMultiplier", 1);
        this._config.set("superChargeTickMultiplier", 1);
        this._config.set("superChargePerKillMultiplier", 1);
        this._config.set("modCoolDownTickMultiplier", 1);
    }

    configure(object) {
        for (let key in object) {
            if (this._config.has(key)) {
                this._config.set(key, object[key]);
            }
        }
    }

    getRule(key) {
        return this._config.get(key);
    }
}

module.exports = GameRules;