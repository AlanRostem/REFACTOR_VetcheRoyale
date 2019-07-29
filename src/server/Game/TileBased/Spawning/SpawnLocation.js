const ONMap = require("../../../../shared/code/DataStructures/SObjectNotationMap.js");

// Object stored in tile map objects that keeps track of
// positions to spawn certain types of entities.
// The objects are created based on a tile ID.

// This is so we eliminate the extreme amount of iterations through
// the tile map when creating new worlds and instead iterate through
// all the stored positions. The extreme iteration is only performed
// once when the server actually starts.
class SpawnLocation {
    constructor(x, y, name, entityClass) {
        this.x = x;
        this.y = y;
        this._entityClass = entityClass;
        this._name = name;
    }

    get name() {
        return this._name;
    }

    // Spawns entity at the given location.
    spawnHere(entityManager) {
        entityManager.spawnEntity(this.x, this.y, new this._entityClass());
    }
}

// Retrieve it by Tile ID,
SpawnLocation.ENTITY_SPAWN_IDS = new ONMap();

// Object that maps the tile ID to a spawn location constructor
// callback with the respective entity type. 
SpawnLocation.MappingStructure = class SLMappingStructure {
    constructor(name, classType, isOnlyPositionalData = false) {
        this.name = name;
        this.replicate = !isOnlyPositionalData;
        this.callback = (x, y) => new SpawnLocation(x, y, name, classType);
    }
};

SpawnLocation.setSpawnerByID = (id, name, classType, isOnlyPositionalData = false) => {
    SpawnLocation.ENTITY_SPAWN_IDS.set(id, new SpawnLocation.MappingStructure(name, classType, isOnlyPositionalData))
};

SpawnLocation.getSpawnerByID = (id) => {
    return SpawnLocation.ENTITY_SPAWN_IDS.get(id);
};

SpawnLocation.createSpawner = (tileID, x, y) => {
    return SpawnLocation.ENTITY_SPAWN_IDS.get(tileID).callback(x, y);
};

//SpawnLocation.setSpawnerByID(90, "LootCrate", LootCrate);
SpawnLocation.setSpawnerByID(105, "PlayerLobby", null, true);

module.exports = SpawnLocation;