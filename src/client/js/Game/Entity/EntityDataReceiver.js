// Manages inbound entity data packs from the server.
// This singleton class also renders those entities.
import CEntity from "./CEntity.js"
export default class EntityDataReceiver {
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
        this._container[dataPack.id] = new CEntity(dataPack);
    }

    getEntity(entityData) {
        return this._container[entityData.id];
    }

    removeEntity(id) {
        delete this._container[id];
    }

    defineSocketEvents(client) {
        // Receives an array of entities in the proximity of the
        // client player object, and spawns them here as the player
        // connects.
        client.on('initEntity', array => {
            for (var entityData of array) {
                this.addEntityFromDataPack(entityData);
            }
        });

        client.on('updateEntity', dataPack => {
            for (var id in dataPack) {
                var entityData = dataPack[id];
                if (this.existsOnClient(entityData.id)) {
                    var existingEntity = this.getEntity(entityData);
                    existingEntity.update(entityData);
                } else {
                    console.log("Attempted to update a non existent entity. There's a hole in your programming...");
                }
            }
        });

        client.on('spawnEntity', entityData => {
            this.addEntityFromDataPack(entityData);
        });
        
        client.on('removeEntity', id => {
            if (this.existsOnClient(id)) {
                this.removeEntity(id);
            } else {
                console.log("Attempted to remove a non existent entity. Something's wrong here...")
            }
        });
    }

    drawEntities() {
        for (var id in this._container) {
            this._container[id].draw();
        }
    }
}