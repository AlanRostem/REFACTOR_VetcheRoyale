const Tile = require("./Tile.js");
const LootCrate = require("../Entity/Loot/Boxes/LootCrate.js");

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

    spawnHere(entityManager) {
        entityManager.spawnEntity(this.x, this.y, new this._entityClass());
    }
}

// Retrieve it by Tile ID,
SpawnLocation.ENTITY_SPAWN_IDS = {};

SpawnLocation.setSpawnerByID = (id, name, classType, isOnlyPositionalData = false) => {
    SpawnLocation.ENTITY_SPAWN_IDS[id] = [name, isOnlyPositionalData, (x, y) => new SpawnLocation(x, y, name, classType)];
};

SpawnLocation.getSpawnerByID = (id) => {
    return SpawnLocation.ENTITY_SPAWN_IDS[id];
};

SpawnLocation.createSpawner = (tileID, x, y) => {
    return SpawnLocation.ENTITY_SPAWN_IDS[tileID][2](x, y);
};

//SpawnLocation.setSpawnerByID(90, "LootCrate", LootCrate);
SpawnLocation.setSpawnerByID(105, "PlayerLobby", null, true);

// Compositor class for TileMap that stores positions
// of certain entities to be spawned.
class TileSpawnPositionList {
    constructor(tileMap) {
        this._spawners = {};
        this.scanMap(tileMap);
    }

    getSpawnPosition(id) {
        return this._spawners[id];
    }



    scanMap(tileMap) {
        for (var y = 0; y < tileMap.h; y++) {
            for (var x = 0; x < tileMap.w; x++) {
                var tileID = tileMap.getID(x, y);
                if (SpawnLocation.getSpawnerByID(tileID)) {
                    if (!this._spawners[tileID]) {
                        this._spawners[tileID] = [];
                        this._spawners[tileID].push(SpawnLocation.createSpawner(tileID, x * Tile.SIZE, y * Tile.SIZE));
                    } else {
                        this._spawners[tileID].push(SpawnLocation.createSpawner(tileID, x * Tile.SIZE, y * Tile.SIZE));
                    }
                }
            }
        }
    }

    spawnAll(entityManager) {
        for (let tileID in this._spawners) {
            this.spawnAllOfType(tileID, entityManager);
        }
    }

    spawnAllOfType(id, entityManager) {
        if (!SpawnLocation.ENTITY_SPAWN_IDS[id][1]) {
            for (let spawner of this._spawners[id]) {
                spawner.spawnHere(entityManager);
            }
        }
    }

    spawnSpecificAtPos(id, entity, entityManager) {
        entityManager.spawnEntity(this._spawners[id][0].x, this._spawners[id][0].y, entity);
    }
}

module.exports = TileSpawnPositionList;