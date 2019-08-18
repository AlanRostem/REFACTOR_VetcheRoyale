const GameClock = require("../../Entity/Management/GameClock.js");
const QuadTree = require("./QuadTree.js");
const Rect = require("./QTRect.js");
const TileCollider = require("../../TileBased/STileCollider.js");

// Updates entities and manages proximity queries in the quad tree
class EntityManager {
    constructor(globalManager = false, gameMap) {
        this._container = {};

        // If true it will be used as a global entity manager
        // for a game world. Otherwise it might have other use cases.
        if (globalManager) {
            this._entitiesQueuedToDelete = [];
            this._tileMap = gameMap;
            this._gameClock = new GameClock(0);

            // Create a singular quad tree with the size of
            // the whole tile map.
            this._qt = new QuadTree(new Rect(
                this._tileMap.w * TileCollider.TILE_SIZE / 2,
                this._tileMap.h * TileCollider.TILE_SIZE / 2,
                this._tileMap.w * TileCollider.TILE_SIZE / 2,
                this._tileMap.h * TileCollider.TILE_SIZE / 2,
            ));
        }
    }

    get quadTree() {
        return this._qt;
    }

    get timeStamp() {
        return this._gameClock.serverTimeStamp;
    }

    get tileMap() {
        return this._tileMap;
    }

    get container() {
        return this._container;
    }

    // Call only when using this class as a global
    // world entity manager.
    update(deltaTime) {
        this._gameClock.update(deltaTime);
        this.updateEntities(deltaTime);
        this.refreshEntityDataPacks(deltaTime);
        for (var i = 0; i < this._entitiesQueuedToDelete.length; i++) {
            this.quadTree.remove(this._container[this._entitiesQueuedToDelete[i]]);
            delete this._container[this._entitiesQueuedToDelete[i]];
            this._entitiesQueuedToDelete.splice(i);
        }
    }

    // Regenerates data packs every frame for every entity
    // in the container.
    refreshEntityDataPacks(deltaTime) {
        for (var id in this._container) {
            if (this.exists(id)) {
                var entity = this._container[id];
                entity.updateDataPack(this, deltaTime);
            }
        }
    }

    updateEntities(deltaTime) {
        for (var id in this._container) {
            if (this.exists(id)) {
                var entity = this._container[id];
                if (entity.toRemove) {
                    this.removeEntity(entity.id);
                    continue;
                }
                entity.update(this, deltaTime);
            }
        }
    }

    exists(id) {
        return this._container.hasOwnProperty(id);
    }

    // Spawns an existing (or new) entity into the game world
    // on a given position.
    spawnEntity(x, y, entity) {
        this._container[entity.id] = entity;
        entity.initFromEntityManager(this);
        entity.pos.x = x;
        entity.pos.y = y;

        this._qt.insert(entity);
        return entity;
    }

    getEntity(id) {
        return this._container[id];
    }

    // Assigns the entity as removed and queues
    // it to deletion.
    removeEntity(id) {
        this.getEntity(id).remove();
        this._entitiesQueuedToDelete.push(id);
    }
}

module.exports = EntityManager;