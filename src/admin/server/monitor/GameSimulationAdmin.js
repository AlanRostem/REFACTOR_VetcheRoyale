const DataSelector = require("./DataSelector.js");
const ONMap = require("../../../shared/code/DataStructures/SObjectNotationMap.js");

const PROP_TYPE_HOLDER = new class extends ONMap {
    constructor() {
        super();
        this.empty = [];
    }

    get(key) {
        if (!this.has(key)) {
            return this.empty;
        }
        return super.get(key);
    }
}();

PROP_TYPE_HOLDER.set("World", ["id", "mapName", "players", "entityCount"]);
PROP_TYPE_HOLDER.set("Entity", ["id", "pos", "vel"]);
PROP_TYPE_HOLDER.set("Player", ["id", "pos", "vel", "HP"]);

class GameSimulationAdmin {
    constructor(id, gameWorlds) {
        this.id = id;
        this.dataSelector = new DataSelector(gameWorlds, ...PROP_TYPE_HOLDER.get("World"))
    }

    update(worldManager) {
        this.dataSelector.update();
        worldManager.dataBridge.transferClientEvent("adminUpdate", this.id, {
            id: this.id,
            object: this.dataSelector.export()
        });
    }

    selectProp(prop, type) {
        switch (type) {
            case "SELECT_NEW":
                this.dataSelector.selectObjectAndDisplayProps(prop, PROP_TYPE_HOLDER.get(type));
                break;
            case "GO_BACK":
                this.dataSelector.reverseSelection();
                break;
        }
    }
}

module.exports = GameSimulationAdmin;