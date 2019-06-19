STileMap = require("../../TileBased/STileMap.js");
Tile = require("../../TileBased/Tile.js");
testMap = require("../../../../res/tileMaps/testMap.js");
GameClock = require("../../Entity/Management/GameClock.js");
QuadTree = require("./QuadTree.js");
Entity = require("../SEntity.js");

class EntityManager {
    constructor(singleton = false) {
        this._container = {};
        this._entitiesQueuedToDelete = [];
        if (singleton) {
            this._tileMap = new STileMap(testMap);
            this._gameClock = new GameClock(0);

            this._qt = new QuadTree(0, 0, this._tileMap.w * Tile.SIZE, this._tileMap.h * Tile.SIZE, 0);

            // TODO: Remove test
            for (var i = 0; i < 50; i++) {
                var w = this._tileMap.w * Tile.SIZE;
                var h = this._tileMap.h * Tile.SIZE;
                this.spawnEntity(Math.random() * w, Math.random() * h, new Entity(0, 0, 32, 32));
            }
        }
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

        // TODO: Remove test:
        this._qt.insert(entity);
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