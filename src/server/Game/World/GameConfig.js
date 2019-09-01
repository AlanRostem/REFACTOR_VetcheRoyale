const ObjectNotationMap = require("../../../shared/code/DataStructures/SObjectNotationMap.js");

class GameConfig {
    constructor() {
        this._config = new ObjectNotationMap();
        this._config.set("lootLife", 6 * 60);
        this._config.set("pvp", true);
        this._config.set("maxPlayers", 24);
        this._config.set("maxTeamMembers", 4);
    }

    configure(object) {
        for (let key in object) {
            if (this._config.has(key)) {
                this._config.set(key, object[key]);
            }
        }
    }

    getConfig(key) {
        return this._config.get(key);
    }
}

module.exports = GameConfig;