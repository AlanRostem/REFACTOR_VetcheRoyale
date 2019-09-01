const ONMap = require("../../../../shared/code/DataStructures/SObjectNotationMap.js");
const SJSONFile = require("../../../ResourceManagement/SJSONFile.js");

const LootCrate = require("../../Entity/Loot/Boxes/LootCrate.js");
const Portal = require("../../Entity/Portal/Portal.js");
const GunSpawner = require("../../World/Matches/PlayGround/GunSpawner.js");

// Object stored in tile map objects that keeps track of
// positions to spawn certain types of entities.
// The objects are created based on a tile ID.

// This is so we eliminate the extreme amount of iterations through
// the tile map when creating new worlds and instead iterate through
// all the stored positions. The extreme iteration is only performed
// once when the server actually starts.
class SpawnLocation {
    constructor(x, y, name, entityClass, args) {
        this.x = x;
        this.y = y;
        this._entityClass = entityClass;
        this._name = name;
        this._args = args;
    }

    get name() {
        return this._name;
    }

    // Spawns entity at the given location.
    spawnHere(entityManager) {
        entityManager.spawnEntity(this.x, this.y, new this._entityClass(this.x, this.y, this._args));
    }
}

// Retrieve it by Tile ID,
SpawnLocation.ENTITY_SPAWN_IDS = new ONMap();

// Object that maps the tile ID to a spawn location constructor
// callback with the respective entity type. 
SpawnLocation.MappingStructure = class SLMappingStructure {
    constructor(name, classType, isOnlyPositionalData = false, args) {
        this.name = name;
        this.replicate = !isOnlyPositionalData;
        this.callback = (x, y) => new SpawnLocation(x, y, name, classType, args);
    }
};

SpawnLocation.setSpawnerByID = (id, name, classType, isOnlyPositionalData = false, args) => {
    SpawnLocation.ENTITY_SPAWN_IDS.set(id, new SpawnLocation.MappingStructure(name, classType, isOnlyPositionalData, args))
};

SpawnLocation.getSpawnerByID = (id) => {
    return SpawnLocation.ENTITY_SPAWN_IDS.get(id);
};

SpawnLocation.createSpawner = (tileID, x, y) => {
    return SpawnLocation.ENTITY_SPAWN_IDS.get(tileID).callback(x, y);
};

SpawnLocation.parseSpawnConfig = (filePath) => {
    let json = new SJSONFile(filePath);
    let content = json.get();
    for (let tileID in content) {
        let config = content[tileID];
        SpawnLocation.setSpawnerByID(tileID, config.name, eval(config.classType),
            config.isPositionalData, config.parameters);
    }
};

SpawnLocation.parseSpawnConfig("src/shared/res/spawn.json");

module.exports = SpawnLocation;