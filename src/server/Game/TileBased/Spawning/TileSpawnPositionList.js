const Tile = require("../Tile.js");
const LootCrate = require("../../Entity/Loot/Boxes/LootCrate.js");
const ONMap = require("../../../../shared/code/DataStructures/SObjectNotationMap.js");
const SpawnLocation = require("./SpawnLocation.js");

// Compositor class for TileMap that stores positions
// of certain entities to be spawned.
class TileSpawnPositionList {
    constructor(tileMap) {
        this._spawners = new ONMap();
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
                    if (!this._spawners.has(tileID)) {
                        if (SpawnLocation.getSpawnerByID(tileID).singleton) {
                            this._spawners.set(tileID, []);
                        } else {
                            this._spawners.set(tileID,
                                SpawnLocation.createSpawner(tileID, x * Tile.SIZE, y * Tile.SIZE));
                        }
                    }
                    if (SpawnLocation.getSpawnerByID(tileID).singleton) {
                        this._spawners.get(tileID).push(
                            SpawnLocation.createSpawner(
                                tileID, x * Tile.SIZE, y * Tile.SIZE));
                    }
                }
            }
        }
    }

    spawnAll(entityManager) {
        this._spawners.forEach((id, spawner) => {
           this.spawnAllOfType(id, entityManager);
        });
    }

    spawnAllOfType(id, entityManager) {
        if (!SpawnLocation.ENTITY_SPAWN_IDS[id][1]) {
            for (let spawner of this._spawners.get(id)) {
                spawner.spawnHere(entityManager);
            }
        }
    }

    spawnSpecificAtPos(id, entity, entityManager) {
        if (!SpawnLocation.getSpawnerByID(id).singleton) {
            entityManager.spawnEntity(this._spawners.get(id).x, this._spawners.get(id).y, entity);
        }
    }
}

module.exports = TileSpawnPositionList;