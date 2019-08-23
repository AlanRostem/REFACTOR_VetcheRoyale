import InputListener from "../../InputListener.js"
import R from "../../Graphics/Renderer.js";
import Scene from "../../Game/Scene.js"
import ONMap from "../../../../shared/code/DataStructures/CObjectNotationMap.js";
import ServerTimeSyncer from "../Interpolation/ServerTimeSyncer.js";


// Class representation of the client. Holds input callbacks
// and manages socket events.
export default class CClient {

    constructor(socket) {
        this._socket = socket;
        this.id = socket.id;
        this._localTime = 0;
        this._serverUpdateCallbacks = new ONMap();
        this._clientEmitPacket = new ONMap();
        this._inputListener = new InputListener(this);
        this._timeSyncer = new ServerTimeSyncer();

        [83, 87, 69, 71, 82, 81].forEach(keyCode => {
            this.addKeyEmitter(keyCode);
        });

        [32, 68, 65].forEach(keyCode => {
           this.allocateClientPredKey(keyCode);
        });

        [1, 2, 3].forEach(mouseButton => {
            this.addMouseEmitter(mouseButton);
        });

        this.defineSocketEvents();
        this._latency = 0;

    }

    onServerUpdateReceived(packet) {
        this._timeSyncer.onServerUpdate(this._latency);
        this._lastReceivedData = packet;
        for (let callback of this._serverUpdateCallbacks.array) {
            callback(packet);
        }
    }

    get input() {
        return this._inputListener;
    }

    // Map a key code to the input listener with a
    // callback. This mapping function's difference
    // is that upon the key state the key state data
    // is sent to the server.
    addKeyEmitter(keyCode, callback) {
        this._inputListener.addKeyMapping(keyCode, keyState => {
            if (callback) {
                callback(keyState);
            }
        });
    }

    allocateClientPredKey(keyCode, callback) {
        this.addKeyEmitter(keyCode, callback);
        if (!this.input._allocatedCodes.includes(keyCode))
            this.input._allocatedCodes.push(keyCode);
    }

    setOutboundPacketData(key, value) {
        this._clientEmitPacket.set(key, value);
    }

    addServerUpdateListener(eventName, callback) {
        this._serverUpdateCallbacks.set(eventName, callback);
    }

    get inboundPacket() {
        return this._lastReceivedData;
    }

    get outboundPacket() {
        return this._clientEmitPacket.object;
    }

    addMouseEmitter(mouseButton, callback) {
        this._inputListener.addMouseMapping(mouseButton, mouseState => {
            if (callback) {
                callback(keyState);
            }
        });
    }

    static getPing() {
        return CClient._ping;
    }

    static get ping() {
        return this._latency;
    }

    get player() {
        return this._eMgr.getEntityByID(this.id);
    }

    update(entityManager, deltaTime) {
        if (!this._eMgr) {
            this._eMgr = entityManager;
        }
        this._localTime += deltaTime;
        this._startTime = Date.now();
        var e = entityManager.getEntityByID(this.id);
        if (e) {
            Scene.currentMapName = this.player.output._gameData.mapName;
        }
        this.emit("clientPacketToServer", this._clientEmitPacket.object);
    }

    get localTime() {
        return this._localTime;
    }

    emit(eventType, data) {
        this._socket.emit(eventType, data);
    }

    on(eventType, callback) {
        this._socket.on(eventType, callback);
    }

    defineSocketEvents() {
        // Establishes a full connection using a promise.
        // The server is then notified of a proper connection.
        const connectedPromise = new Promise(resolve => {
            this.on('connectClient', data => {
                this.id = data.id;
                this._socket.emit("connectClientCallback", {id: this.id});
                resolve();
            });
        });

        this.on('serverUpdateTick', packet => {
            this._latency = Math.abs(Date.now() - packet.now);
            CClient._ping = this._latency;
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
    }
}

CClient._ping = 1;