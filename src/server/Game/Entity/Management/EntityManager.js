const Tile = require("../../TileBased/Tile.js");
const GameClock = require("../../Entity/Management/GameClock.js");
const SpatialHashGrid = require("./SpatialHashGrid.js");
const Rect = require("./CollisionBoundary.js");

/**
 * Updates entities and manages proximity queries in the spatial hash grid
 */
class EntityManager {
    constructor(globalManager = false, gameMap) {
        this.container = [];

        // If true it will be used as a global entity manager
        // for a game world. Otherwise it might have other use cases.
        if (globalManager) {
            this.tileMap = gameMap;
            this.gameClock = new GameClock(0);
            this.entitiesQueuedToDelete = [];

            // Create a singular spatial hash grid with the size of
            // the whole tile map.
            this.cellSpace = new SpatialHashGrid(
                this.tileMap.w * Tile.SIZE,
                this.tileMap.h * Tile.SIZE, 64, 64);

        }
    }

    get timeStamp() {
        return this.gameClock.serverTimeStamp;
    }

    // Call only when using this class as a global
    // world entity manager.
    update(deltaTime) {
        this.gameClock.update(deltaTime);
        this.updateEntities(deltaTime);
        this.refreshEntityDataPacks(deltaTime); // TODO: Determine if this is a performance caveat
    }

    // Regenerates data packs every frame for every entity
    // in the container.
    refreshEntityDataPacks(deltaTime) {
        for (let entity of this.container) {
            entity.updateDataPack(this, deltaTime);
        }
    }

    updateEntities(deltaTime) {
        for (let i = 0; i < this.container.length; i++) {
            let entity = this.container[i];
            entity.index = i;
            entity.update(this, deltaTime);
            if (entity.toRemove) {
                //this.container.splice(i, 1);
                this.removeEntity(i);
            }
        }
    }

    // Spawns an existing (or new) entity into the game world
    // on a given position.
    spawnEntity(x, y, entity) {
        this.container.push(entity);
        entity.initFromEntityManager(this);
        entity.pos.x = x;
        entity.pos.y = y;

        this.cellSpace.insert(entity);
        return entity;
    }

    getEntity(i) {
        return this.container[i];
    }

    // Assigns the entity as removed and queues
    // it to deletion.
    removeEntity(i) {
        this.getEntity(i).remove();
        this.cellSpace.remove(this.getEntity(i));
        this.container.splice(i, 1);
    }
}

module.exports = EntityManager;