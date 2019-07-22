Tile = require("../../TileBased/Tile.js");
GameClock = require("../../Entity/Management/GameClock.js");
QuadTree = require("./QuadTree.js");
Rect = require("./QTRect.js");
class EntityManager {
    constructor(singleton = false, gameMap) {
        this._container = {};
        if (singleton) {
            this._entitiesQueuedToDelete = [];
            this._tileMap = gameMap;
            this._gameClock = new GameClock(0);

            this._qt = new QuadTree(new Rect(
                this._tileMap.w * Tile.SIZE / 2,
                this._tileMap.h * Tile.SIZE / 2,
                this._tileMap.w * Tile.SIZE / 2,
                this._tileMap.h * Tile.SIZE / 2,
            ));
        }
    }

    get quadTree() {
        return this._qt;
    }

    get timeStamp() {
        return this._gameClock.timeStamp;
    }

    get tileMap() {
        return this._tileMap;
    }

    get container() {
        return this._container;
    }

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

    // Spawns an existing entity into the game world
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

    removeEntity(id) {
        this.getEntity(id).remove();
        this._entitiesQueuedToDelete.push(id);
    }
}

module.exports = EntityManager;