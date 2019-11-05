// Manages inbound entity data packs from the server.
// This singleton class also renders those entities.
import EntityTypeSpawner from "./EntityTypeSpawner.js";
import PacketBuffer from "../../../Networking/Client/PacketBuffer.js";

// TODO: Add docs if needed
export default class CEntityManager {
    constructor(client) {
        this.clientRef = client;
        this.container = new Map();
        this.defineSocketEvents(client) // Used for composing the socket emit events here
    }

    clear() {
        this.container.clear();
    }

    existsOnClient(id) {
        return this.container.has(id);
    }

    spawnEntityFromDataPack(dataPack, client) {
        //if (dataPack.removed) return;
        let entity = EntityTypeSpawner.spawn(dataPack.init.entityType, dataPack, client);
        this.container.set(dataPack.init.id, entity);
        entity.onClientSpawn(dataPack, client);
        if (this.container.size < 1) return;
        let toArray = [...this.container.entries()];

        //if (dataPack.entityOrder >= toArray[toArray.length-2][1].getRealtimeProperty("entityOrder")) return;
        this.container = new Map(toArray.sort((a, b) => {
            return a[1].getRealtimeProperty("entityOrder") -
                b[1].getRealtimeProperty("entityOrder");
        }));
    }

    addEntityFromDataPack(dataPack, client) {
        //if (dataPack.removed) return;
        let entity = EntityTypeSpawner.spawn(dataPack.init.entityType, dataPack, client);
        this.container.set(dataPack.init.id, entity);
        entity.onClientAdd(dataPack, client);
        if (this.container.size < 1) return;
        let toArray = [...this.container.entries()];

        //if (dataPack.entityOrder >= toArray[toArray.length-2][1].getRealtimeProperty("entityOrder")) return;
        this.container = new Map(toArray.sort((a, b) => {
            return a[1].getRealtimeProperty("entityOrder") -
                b[1].getRealtimeProperty("entityOrder");
        }));
    }

    getEntity(entityData) {
        return this.container.get(entityData.id);
    }

    getEntityByID(id) {
        return this.container.get(id);
    }

    removeEntity(id) {
        this.container.get(id).onClientDelete(this.clientRef);
        this.container.delete(id);
    }

    removeOutOfBoundsEntity(id) {
        this.container.delete(id);
    }

    defineSocketEvents(client) {
        // Receives an array of entities in the proximity of the
        // client player object, and spawns them here as the player
        // connects.
        client.on('initEntity', dataPack => {
            for (var id in dataPack) {
                var entityData = dataPack[id];
                this.spawnEntityFromDataPack(entityData, client);
            }
        });

        client.on('removeEntity', id => {
            if (this.existsOnClient(id)) {
                if (id !== client.id) {
                    this.removeEntity(id);
                }
            } else {
                console.warn("Attempted to remove a non existent entity. Something's wrong here...")
            }
        });

        client.on('removeOutOfBoundsEntity', id => {
            if (this.existsOnClient(id)) {
                if (id !== client.id) {
                    if (client.player) {
                        if (id === client.player.output.invWeaponID) return;
                    }
                    this.removeOutOfBoundsEntity(id);
                }
            } else {
                console.error("Attempted to remove a non existent entity:", id)
            }
        });

        client.addServerUpdateListener("updateEntity", dataPack => {
            for (var id in dataPack.entityData) {
                var entityData = dataPack.entityData[id];
                if (this.existsOnClient(id)) {
                    var existingEntity = this.getEntityByID(id);
                    if (existingEntity.constructor.name === "CCKER90")
                        console.log(entityData.found);
                    entityData = PacketBuffer.createPacket(existingEntity.output, entityData);
                    existingEntity.updateFromDataPack(entityData, client);

                } else {
                    console.error("Attempted to update a non existent entity:", entityData.eType, "with ID:", entityData.id);
                    //throw new Error("Attempted to update a non existent entity. There's a hole in your programming...");
                }
            }
        });

        client.on("gameEvent-changeWorld", data => {
            this.clear();
            this.spawnEntityFromDataPack(data, client);
        });

        client.on('spawnEntity', entityData => {
            this.spawnEntityFromDataPack(entityData, client);
        });

        client.on('addEntity', entityData => {
            this.addEntityFromDataPack(entityData, client);
        });
    }

    updateEntities(deltaTime, client, map) {
        for (var pair of this.container) {
            pair[1].update(deltaTime, client, map);
        }
    }

    drawEntities() {
        for (var pair of this.container) {
            pair[1].draw();
        }
    }
}