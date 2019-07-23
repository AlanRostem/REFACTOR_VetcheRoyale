// Manages inbound entity data packs from the server.
// This replicate class also renders those entities.
import CEntity from "../CEntity.js"
import EntityTypeSpawner from "./EntityTypeSpawner.js";

export default class EntityDataReceiver {
    constructor(client) {
        this._clientRef = client;
        this._container = {};
        this.defineSocketEvents(client) // Used for composing the socket emit events here
    }

    clear() {
        this._container = {};
    }

    existsOnClient(id) {
        return this._container.hasOwnProperty(id);
    }

    addEntityFromDataPack(dataPack, client) {
        //if (dataPack._removed) return;
        (this._container[dataPack._id] = EntityTypeSpawner.spawn(dataPack.entityType, dataPack))
            .onClientSpawn(dataPack, client);
    }

    getEntity(entityData) {
        return this._container[entityData._id];
    }

    getEntityByID(id) {
        return this._container[id];
    }

    removeEntity(id) {
        this._container[id].onClientDelete(this._clientRef);
        delete this._container[id];
    }

    defineSocketEvents(client) {
        // Receives an array of entities in the proximity of the
        // client player object, and spawns them here as the player
        // connects.
        client.on('initEntity', dataPack => {
            for (var id in dataPack) {
                var entityData = dataPack[id];
                this.addEntityFromDataPack(entityData, client);
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
                    existingEntity.updateFromDataPack(entityData, client);
                } else {
                    //console.warn("Attempted to update a non existent entity. There's a hole in your programming...");
                    throw new Error("Attempted to update a non existent entity. There's a hole in your programming...");
                }
            }
        });

        client.on("gameEvent-changeWorld", data => {
           this.clear();
           this.addEntityFromDataPack(data, client);
        });

        client.on('spawnEntity', entityData => {
            this.addEntityFromDataPack(entityData, client);
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