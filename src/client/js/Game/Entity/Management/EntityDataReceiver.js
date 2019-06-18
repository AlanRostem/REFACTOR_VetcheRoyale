// Manages inbound entity data packs from the server.
// This singleton class also renders those entities.
import CEntity from "../CEntity.js"
export default class EntityDataReceiver {

    _previousDataContainer = {};
    _container = {};

    static _entityTypeSpawner = {}; // Map container with class constructors mapped to respective entities
    constructor(client) {
        this.defineSocketEvents(client) // Used for composing the socket emit events here
    }

    existsOnClient(id) {
        return this._container.hasOwnProperty(id);
    }

    addEntityFromDataPack(dataPack) {
        // TODO: Add the ability to spawn an entity based on class type
        this._container[dataPack._id] = new CEntity(dataPack);
    }

    getEntity(entityData) {
        return this._container[entityData._id];
    }

    getEntityByID(id) {
        return this._container[id];
    }

    removeEntity(id) {
        delete this._container[id];
    }

    defineSocketEvents(client) {
        // Receives an array of entities in the proximity of the
        // client player object, and spawns them here as the player
        // connects.
        client.on('initEntity', dataPack => {
            for (var id in dataPack) {
                var entityData = dataPack[id];
                this.addEntityFromDataPack(entityData);
            }
        });

        client.on('removeEntity', id => {
            if (this.existsOnClient(id)) {
                this.removeEntity(id);
            } else {
                console.warn("Attempted to remove a non existent entity. Something's wrong here...")
            }
        });

        client.on('updateEntity', dataPack => {

            for (var id in dataPack) {
                var entityData = dataPack[id];
                if (this.existsOnClient(id)) {
                    entityData.latency = client._latency;
                    var existingEntity = this.getEntity(entityData);
                    existingEntity.updateFromDataPack(entityData);
                } else {
                    console.warn("Attempted to update a non existent entity. There's a hole in your programming...");
                }
            }
        });

        client.on('spawnEntity', entityData => {
            this.addEntityFromDataPack(entityData);
        });

    }

    updateEntities(deltaTime) {
        for (var id in this._container) {
            this._container[id].update(deltaTime);
        }
    }

    drawEntities() {
        for (var id in this._container) {
            this._container[id].draw();
        }
    }
}