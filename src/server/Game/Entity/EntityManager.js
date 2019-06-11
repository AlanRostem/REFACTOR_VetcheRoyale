class EntityManager {
    constructor() {
        this._container = {};
        this._entitiesQueuedToDelete = [];
    }

    get container() {
        return this._container;
    }

    update() {
        this.updateEntities();
        this.refreshEntityDataPacks();
        for (var i = 0; i < this._entitiesQueuedToDelete.length; i++) {
           delete this._container[this._entitiesQueuedToDelete[i]];
           this._entitiesQueuedToDelete.splice(i);
        }
    }

    refreshEntityDataPacks() {
        for (var id in this._container) {
            if (this.exists(id)) {
                var entity = this._container[id];
                entity.updateDataPack();
            }
        }
    }

    updateEntities() {
        for (var id in this._container) {
            if (this.exists(id)) {
                var entity = this._container[id];
                if (entity.toRemove) {
                    this.removeEntity(entity.id);
                    continue;
                }
                entity.update(this);
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