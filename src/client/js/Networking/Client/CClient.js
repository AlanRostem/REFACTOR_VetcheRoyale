import InputListener from "../../InputListener.js"
import R from "../../Graphics/Renderer.js";
import Scene from "../../Game/Scene.js"
import ONMap from "../../../../shared/code/DataStructures/CObjectNotationMap.js";
import ServerTimeSyncer from "../Interpolation/ServerTimeSyncer.js";


// Class representation of the client. Holds input callbacks
// and manages socket events.
export default class CClient {
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

    get input() {
        return this.inputListener;
    }

    // Map a key code to the input listener with a
    // callback. This mapping function's difference
    // is that upon the key state the key state data
    // is sent to the server.
    addKeyEmitter(keyCode, callback) {
        this.inputListener.addKeyMapping(keyCode, keyState => {
            if (callback) {
                callback(keyState);
            }
        });
    }

    get inputBufferArray() {
        return this.inputListener.inputBuffer.buffer;
    }

    setOutboundPacketData(key, value) {
        this.clientEmitPacket.set(key, value);
    }

    addServerUpdateListener(eventName, callback) {
        this.serverUpdateCallbacks.set(eventName, callback);
    }



    get inboundPacket() {
        return this.lastReceivedData;
    }

    get outboundPacket() {
        return this.clientEmitPacket.object;
    }

    addMouseEmitter(mouseButton, callback) {
        this.inputListener.addMouseMapping(mouseButton, mouseState => {
            if (callback) {
                callback(keyState);
            }
        });
    }

    static getPing() {
        return CClient.ping;
    }

    static get ping() {
        return this.latency;
    }

    get player() {
        return this.eMgr.getEntityByID(this.id);
    }

    update(entityManager, deltaTime) {
        if (!this.eMgr) {
            this.eMgr = entityManager;
        }
        this.localTime += deltaTime;
        this.startTime = Date.now();
        var e = entityManager.getEntityByID(this.id);
        if (e) {
            Scene.currentMapName = this.player.output.gameData.mapName;
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
            this.discReasonMsg = "reason: " +message;
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