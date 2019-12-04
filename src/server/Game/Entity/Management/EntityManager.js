const Tile = require("../../TileBased/Tile.js");
const GameClock = require("../../Entity/Management/GameClock.js");
const QuadTree = require("./QuadTreeMap.js");
const Rect = require("./QTRect.js");

/**
 * Updates entities and manages proximity queries in the quad tree
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
        this.refreshEntityDataPacks(deltaTime); // TODO: Determine if this is a performance caveat
        for (let i = 0; i < this.entitiesQueuedToDelete.length; i++) {
            this.quadTree.remove(this.container[this.entitiesQueuedToDelete[i]]);
            this.container.splice(this.entitiesQueuedToDelete[i], 1);
            this.entitiesQueuedToDelete.splice(i, 1);
        }
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
            if (entity.toRemove) {
                //this.container.splice(i, 1);
                this.removeEntity(i);
                continue;
            }
            if (entity.constructor.name === "Player")
                entity.update(this, deltaTime);
            else entity.entitiesInProximity.update(this, deltaTime);
        }
    }

    // Spawns an existing (or new) entity into the game world
    // on a given position.
    spawnEntity(x, y, entity) {
        this.container.push(entity);
        entity.initFromEntityManager(this);
        entity.pos.x = x;
        entity.pos.y = y;

        this.qt.insert(entity);
        return entity;
    }

    getEntity(i) {
        return this.container[i];
    }

    // Assigns the entity as removed and queues
    // it to deletion.
    removeEntity(i) {
        this.getEntity(i).remove();
        this.entitiesQueuedToDelete.push(i);
    }
}

module.exports = EntityManager;