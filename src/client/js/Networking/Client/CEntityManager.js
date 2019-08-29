// Manages inbound entity data packs from the server.
// This singleton class also renders those entities.
import CEntity from "../../Game/Entity/CEntity.js"
import EntityTypeSpawner from "../../Game/Entity/Management/EntityTypeSpawner.js";

export default class CEntityManager {
    constructor(client) {
        this._clientRef = client;
        this._container = new Map();
        this.defineSocketEvents(client) // Used for composing the socket emit events here
    }

    clear() {
        this._container.clear();
    }

    existsOnClient(id) {
        return this._container.has(id);
    }

    addEntityFromDataPack(dataPack, client) {
        //if (dataPack._removed) return;
        let entity = EntityTypeSpawner.spawn(dataPack.entityType, dataPack, client);
        this._container.set(dataPack._id, entity);
        entity.onClientSpawn(dataPack, client);

        if (this._container.size < 1) return;
        let toArray = [...this._container.entries()];

        //if (dataPack._entityOrder >= toArray[toArray.length-2][1].getRealtimeProperty("_entityOrder")) return;
        this._container = new Map(toArray.sort((a, b) => {
            return a[1].getRealtimeProperty("_entityOrder") -
                   b[1].getRealtimeProperty("_entityOrder");
        }));
    }

    getEntity(entityData) {
        return this._container.get(entityData._id);
    }

    getEntityByID(id) {
        return this._container.get(id);
    }

    removeEntity(id) {
        this._container.get(id).onClientDelete(this._clientRef);
        this._container.delete(id);
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

        client.addServerUpdateListener("updateEntity", dataPack => {
            for (var id in dataPack.entityData) {
                var entityData = dataPack.entityData[id];
                if (this.existsOnClient(id)) {
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

    updateEntities(deltaTime, client, map) {
        for (var pair of this._container) {
            pair[1].update(deltaTime, client, map);
        }
    }

    drawEntities() {
        for (var pair of this._container) {
            pair[1].draw();
        }
    }
}