import InputListener from "../../InputListener.js"
import R from "../../Graphics/Renderer.js";
import Scene from "../../Game/Scene.js"
import ONMap from "../../../../shared/code/DataStructures/CObjectNotationMap.js";


// Class representation of the client. Holds input callbacks
// and manages socket events.
export default class MyClient {

    constructor(socket) {
        this._socket = socket;
        this.id = socket.id;
        this._localTime = 0;
        this._inputListener = new InputListener(this);

        [32, 83, 68, 65, 87, 69, 71, 82, 81].forEach(keyCode => {
            this.addKeyEmitter(keyCode);
        });

        [1, 2, 3].forEach(mouseButton => {
            this.addMouseEmitter(mouseButton);
        });

        this._serverUpdateCallbacks = new ONMap();
        this._clientEmitPacket = new ONMap();

        this.defineSocketEvents();
        this._latency = 0;
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

    get inputBufferArray() {
        return this._inputListener._inputBuffer._buffer;
    }

    setOutboundPacketData(key, value) {
        this._clientEmitPacket.set(key, value);
    }

    addServerUpdateListener(eventName, callback) {
        this._serverUpdateCallbacks.set(eventName, callback);
    }

    onServerUpdateReceived(packet) {
        this._receivedData = packet;
        for (let callback of this._serverUpdateCallbacks.array) {
            callback(packet);
        }
    }

    get inboundPacket() {
        return this._receivedData;
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
        return MyClient._ping;
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
            R.camera.update(e.getRealtimeProperty("_center"));
        }
        this._inputListener.update(this);
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
            this._latency = Date.now() - packet.now;
            MyClient._ping = this._latency;
            this.onServerUpdateReceived(packet);
        });

        this.on('broadcast-newPlayer', data => {
           console.log("Connected: ", data.id + ".", "There are " + data.playerCount + " players online!");
        });

        this.on("gameEvent-changeMap", data => {
            Scene.currentMapName = data.mapName
        });

        this.on("gameEvent-changeWorld", data => {

        });
    }
}

MyClient._ping = 1;