const Tile = require("./Tile.js");
const LootCrate = require("../Entity/Loot/Boxes/LootCrate.js");

class SpawnerLocation {
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
SpawnerLocation.ENTITY_SPAWN_IDS = {};

SpawnerLocation.setSpawnerByID = (id, name, classType, isOnlyPositionalData = false) => {
    SpawnerLocation.ENTITY_SPAWN_IDS[id] = [name, isOnlyPositionalData, (x, y) => new SpawnerLocation(x, y, name, classType)];
};

SpawnerLocation.createSpawner = (tileID, x, y) => {
    return SpawnerLocation.ENTITY_SPAWN_IDS[tileID][2](x, y);
};

//SpawnerLocation.setSpawnerByID(90, "LootCrate", LootCrate);
SpawnerLocation.setSpawnerByID(105, "PlayerLobby", null, true);

// Compositor class for TileMap that stores positions
// of certain entities to be spawned.
class EntitySpawnerLocator {
    constructor(tileMap) {
        this._spawners = {};
        this.scanMap(tileMap);
    }

    scanMap(tileMap) {
        for (var y = 0; y < tileMap.h; y++) {
            for (var x = 0; x < tileMap.w; x++) {
                var tileID = tileMap.getID(x, y);
                if (SpawnerLocation.ENTITY_SPAWN_IDS[tileID]) {
                    if (!this._spawners[tileID]) {
                        this._spawners[tileID] = [];
                        this._spawners[tileID].push(SpawnerLocation.createSpawner(tileID, x * Tile.SIZE, y * Tile.SIZE));
                    } else {
                        this._spawners[tileID].push(SpawnerLocation.createSpawner(tileID, x * Tile.SIZE, y * Tile.SIZE));
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
        if (!SpawnerLocation.ENTITY_SPAWN_IDS[id][1]) {
            for (let spawner of this._spawners[id]) {
                spawner.spawnHere(entityManager);
            }
        }
    }

    spawnSpecificAtPos(id, entity, entityManager) {
        entityManager.spawnEntity(this._spawners[id][0].x, this._spawners[id][0].y, entity);
    }
}

module.exports = EntitySpawnerLocator;