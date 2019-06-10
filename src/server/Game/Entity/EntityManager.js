var Vector2D = require("../../../shared/Math/SVector2D.js");

class EntityManager {
    constructor() {
        this._container = {};

    }

    get container() {
        return this._container;
    }

    updateEntities() {
        for (var id in this._container) {
            if (this.exists(id)) {
                var entity = this._container[id];
                if (entity.toRemove) {
                    this.removeEntity(entity.id);
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
        // TODO: Add the ability to spawn an entity based on class type
        this._container[entity.id] = entity;
        entity.initFromEntityManager(this);
        entity.pos.x = x;
        entity.pos.y = y;
    }

    getEntity(id) {
        return this._container[id];
    }

    removeEntity(id) {
        delete this._container[id];
    }
}

module.exports = EntityManager;