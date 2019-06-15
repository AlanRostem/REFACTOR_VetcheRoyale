STileMap = require("../TileBased/STileMap.js");
testMap = require("../../../res/tileMaps/testMap.js");

class EntityManager {
    constructor(singleton = false) {
        this._container = {};
        this._entitiesQueuedToDelete = [];
        if (singleton) {
            this._tileMap = new STileMap(testMap);
        }
    }

    get tileMap() {
        return this._tileMap;
    }

    get container() {
        return this._container;
    }

    update(deltaTime) {
        this.updateEntities(deltaTime);
        this.refreshEntityDataPacks(deltaTime);
        for (var i = 0; i < this._entitiesQueuedToDelete.length; i++) {
           delete this._container[this._entitiesQueuedToDelete[i]];
           this._entitiesQueuedToDelete.splice(i);
        }
    }

    refreshEntityDataPacks(deltaTime) {
        for (var id in this._container) {
            if (this.exists(id)) {
                var entity = this._container[id];
                entity.updateDataPack(deltaTime);
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

    forEach(callback) {
        for (var id in this._container) {
            callback(this._container[id]);
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