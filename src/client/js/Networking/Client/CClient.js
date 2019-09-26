import InputListener from "../../InputListener.js"
import R from "../../Graphics/Renderer.js";
import Scene from "../../Game/Scene.js"
import ONMap from "../../../../shared/code/DataStructures/CObjectNotationMap.js";
import ServerTimeSyncer from "../Interpolation/ServerTimeSyncer.js";

/**
 * Class representation of the client. Holds input callbacks and manages socket events.
 * An instance of this class can be found in the update methods as parameters in the
 * UIElement, CEntity, CEntityManager, InputListener and EntitySnapshotBuffer instances
 * and as the clientRef member in Scene.
 */
class CClient {
    constructor(socket) {
        this.socket = socket;
        this.id = socket.id;
        this.localTime = 0;
        this.serverUpdateCallbacks = new ONMap();
        this.clientEmitPacket = new ONMap();
        this.inputListener = new InputListener(this);
        this.timeSyncer = new ServerTimeSyncer();

        [32, 83, 68, 65, 87, 69, 71, 82, 81].forEach(keyCode => {
            this.addKeyEmitter(keyCode);
        });

        [1, 2, 3].forEach(mouseButton => {
            this.addMouseEmitter(mouseButton);
        });

        this.defineSocketEvents();
        this.latency = 0;
        this.discReasonMsg = "reason: server error";

    }


    onServerUpdateReceived(packet) {
        this.timeSyncer.onServerUpdate(this.latency);
        this.lastReceivedData = packet;
        for (let callback of this.serverUpdateCallbacks.array) {
            callback(packet);
        }
    }

    /**
     * Get the input listener instance from the client
     * @returns {InputListener}
     */
    get input() {
        return this.inputListener;
    }

    /**
     * Map a key code to the input listener with a
     * callback. This mapping function's difference
     * is that upon the key state the key state data
     * is sent to the server.
     * @param keyCode {number} - JS key code
     * @param callback {function} - Callback when pressing and releasing the key
     */
    addKeyEmitter(keyCode, callback) {
        this.inputListener.addKeyMapping(keyCode, keyState => {
            if (callback) {
                callback(keyState);
            }
        });
    }

    /**
     * Map (in an update loop) a piece of data to be sent to the server.
     * The data is present on the server as an object property with the
     * respective mapping name. It can be found in SClient.
     * @see SClient
     * @param key {string} - Mapping name
     * @param value {object} - Data values
     */
    setOutboundPacketData(key, value) {
        this.clientEmitPacket.set(key, value);
    }

    /**
     * Map a callback event for every tick the server sends packet data.
     * The callback takes the global packet data as a parameter.
     * @param eventName {string} - Mapping name
     * @param callback {function} - Callback executed every server frame (with latency)
     */
    addServerUpdateListener(eventName, callback) {
        this.serverUpdateCallbacks.set(eventName, callback);
    }

    /**
     * Reference to all the packet data gathered from the server
     * @returns {object}
     */
    get inboundPacket() {
        return this.lastReceivedData;
    }

    /**
     * Reference to all the packet data sent to the server
     */
    get outboundPacket() {
        return this.clientEmitPacket.object;
    }

    /**
     * Map a mouse code to the input listener with a
     * callback. This mapping function's difference
     * is that upon the key state the mouse button state data
     * is sent to the server.
     * @param mouseButton {number} - JS mouse code
     * @param callback {function} - Callback when pressing and releasing the mouse button
     */
    addMouseEmitter(mouseButton, callback) {
        this.inputListener.addMouseMapping(mouseButton, mouseState => {
            if (callback) {
                callback(keyState);
            }
        });
    }


    /**
     * Get the reference to the client player object
     * @returns {UserPlayer}
     */
    get player() {
        return this.eMgr.getEntityByID(this.id);
    }

    update(entityManager, deltaTime) {
        if (!this.eMgr) {
            this.eMgr = entityManager;
        }
        this.localTime += deltaTime;
        this.startTime = Date.now();
        if (this.inboundPacket) {
            if (this.inboundPacket.entityData[this.id]) {
                Scene.currentMapName = this.inboundPacket.gameData.mapName;
            } else {
                //if (e) entityManager.removeEntity(e.id);
                if (this.inboundPacket.spectatorSubject) {
                    let s = entityManager.getEntityByID(this.inboundPacket.spectatorSubject.id);
                    if (s) {
                        R.camera.update(s.output.pos);
                    }
                }
            }
        }
        this.inputListener.update(this);
        this.emit("clientPacketToServer", this.clientEmitPacket.object);
    }

    emit(eventType, data) {
        this.socket.emit(eventType, data);
    }

    on(eventType, callback) {
        this.socket.on(eventType, callback);
    }

    defineSocketEvents() {
        // Establishes a full connection using a promise.
        // The server is then notified of a proper connection.
        const connectedPromise = new Promise(resolve => {
            this.on('connectClient', data => {
                this.id = data.id;
                this.disconnected = false;
                this.socket.emit("connectClientCallback", {id: this.id});
                resolve();
            });
        });

        this.on('serverUpdateTick', packet => {
            this.latency = Math.abs(Date.now() - packet.now);
            this.onServerUpdateReceived(packet);
        });

        this.on('broadcast-newPlayer', data => {
            console.log("Connected: ", data.id + ".", "There are " + data.playerCount + " players online!");
        });

        this.on("gameEvent-changeMap", data => {
            Scene.currentMapName = data.mapName;
        });

        this.on("gameEvent-changeWorld", data => {

        });

        this.on("manualDisconnect", message => {
            this.discReasonMsg = "reason: " + message;
            this.disconnected = true;
            this.socket.close();
            document.body.style.cursor = "default";
        });

        this.on("disconnect", message => {
            this.discActionMsg = "action: " + message;
            this.disconnected = true;
            this.socket.close();
            document.body.style.cursor = "default";
        })
    }
}

export default CClient;