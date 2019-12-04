const Tile = require("../../TileBased/Tile.js");
const GameClock = require("../../Entity/Management/GameClock.js");
const QuadTree = require("./QuadTree.js");
const Rect = require("./QTRect.js");

/**
 * Updates entities and manages proximity queries in the quad tree
 */
class EntityManager {
    constructor(globalManager = false, gameMap) {
        this.container = {};

        // If true it will be used as a global entity manager
        // for a game world. Otherwise it might have other use cases.
        if (globalManager) {
            this.tileMap = gameMap;
            this.gameClock = new GameClock(0);
            this.entitiesQueuedToDelete = [];

            // Create a singular quad tree with the size of
            // the whole tile map.
            this.qt = new QuadTree(new Rect(
                this.tileMap.w * Tile.SIZE / 2,
                this.tileMap.h * Tile.SIZE / 2,
                this.tileMap.w * Tile.SIZE / 2,
                this.tileMap.h * Tile.SIZE / 2,
            ));
        }
    }

    get quadTree() {
        return this.qt;
    }

    get timeStamp() {
        return this.gameClock.serverTimeStamp;
    }

    // Call only when using this class as a global
    // world entity manager.
    update(deltaTime) {
        this.gameClock.update(deltaTime);
        this.updateEntities(deltaTime);
        this.refreshEntityDataPacks(deltaTime);
        for (let i = 0; i < this.entitiesQueuedToDelete.length; i++) {
            this.quadTree.remove(this.container[this.entitiesQueuedToDelete[i]]);
            delete this.container[this.entitiesQueuedToDelete[i]];
            this.entitiesQueuedToDelete.splice(i, 1);
        }
        // TODO: Update each "entitiesInProximity" and other emit related shit for each player here in a separate loop
    }

    // Regenerates data packs every frame for every entity
    // in the container.
    refreshEntityDataPacks(deltaTime) {
        for (let id in this.container) {
            if (this.exists(id)) {
                let entity = this.container[id];
                entity.updateDataPack(this, deltaTime);
            }
        }
    }

    updateEntities(deltaTime) {
        for (let id in this.container) {
            if (this.exists(id)) {
                let entity = this.container[id];
                if (entity.toRemove) {
                    this.removeEntity(entity.id);
                    continue;
                }
                entity.update(this, deltaTime);
            }
        }
    }

    exists(id) {
        return this.container.hasOwnProperty(id);
    }

    // Spawns an existing (or new) entity into the game world
    // on a given position.
    spawnEntity(x, y, entity) {
        this.container[entity.id] = entity;
        entity.initFromEntityManager(this);
        entity.pos.x = x;
        entity.pos.y = y;

        this.qt.insert(entity);
        return entity;
    }

    getEntity(id) {
        return this.container[id];
    }

    // Assigns the entity as removed and queues
    // it to deletion.
    removeEntity(id) {
        this.getEntity(id).remove();
        this.entitiesQueuedToDelete.push(id);
    }
}

module.exports = EntityManager;