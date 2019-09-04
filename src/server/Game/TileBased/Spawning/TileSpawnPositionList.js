const Tile = require("../Tile.js");
const ONMap = require("../../../../shared/code/DataStructures/SObjectNotationMap.js");
const SpawnLocation = require("./SpawnLocation.js");

// Compositor class for TileMap that stores positions
// of certain entities to be spawned.
class TileSpawnPositionList {
    constructor(tileMap) {
        this.spawners = new ONMap();
        this.portals = new ONMap();
        this.scanMap(tileMap);
    }

    // Scans the entire tile map for tile ID's used to
    // spawn entities then creates SpawnLocation objects
    // respective to the mapped ID.
    scanMap(tileMap) {
        for (var y = 0; y < tileMap.h; y++) {
            for (var x = 0; x < tileMap.w; x++) {
                var tileID = tileMap.getID(x, y);
                if (SpawnLocation.getSpawnerByID(tileID)) {
                    if (!this.spawners.has(tileID)) {
                        if (SpawnLocation.getSpawnerByID(tileID).replicate) {
                            this.spawners.set(tileID, []);
                        } else {
                            this.spawners.set(tileID,
                                SpawnLocation.createSpawner(tileID, x * Tile.SIZE, y * Tile.SIZE));
                        }
                    }
                    if (SpawnLocation.getSpawnerByID(tileID).replicate) {
                        this.spawners.get(tileID).push(
                            SpawnLocation.createSpawner(
                                tileID, x * Tile.SIZE, y * Tile.SIZE));
                    }
                }
            }
        }
    }

    // Spawns all entities.
    spawnAll(entityManager) {
        this.spawners.forEach((id, spawner) => {
           this.spawnAllOfType(id, entityManager);
        });
    }

    // Spawns all entities of a certain based on the mapped tile ID.
    spawnAllOfType(id, entityManager) {
        if (SpawnLocation.ENTITY_SPAWN_IDS.get(id).replicate) {
            for (let spawner of this.spawners.get(id)) {
                spawner.spawnHere(entityManager);
            }
        }
    }

    // Spawns an entity in the parameter to a positional data version
    // of a SpawnLocation object.
    spawnSpecificAtPos(id, entity, entityManager) {
        if (!SpawnLocation.getSpawnerByID(id).replicate) {
            entityManager.spawnEntity(this.spawners.get(id).x, this.spawners.get(id).y, entity);
        }
        return entity;
    }

    getSpawnerType(id) {
        return SpawnLocation.getSpawnerByID(id);
    }
}

module.exports = TileSpawnPositionList;