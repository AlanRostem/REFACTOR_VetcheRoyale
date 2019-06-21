import InputListener from "../InputListener.js"
import R from "../Graphics/Renderer.js";
export default class MyClient {

    static _ping = 1;

    constructor(socket) {
        this._socket = socket;
        this.id = socket.id;
        this._inputListener = new InputListener(this);

        [32, 83, 68, 65, 87].forEach(keyCode => {
            this.addKeyEmitter(keyCode);
        });

        this.defineSocketEvents();
        this._startTime = Date.now();
        this._latency = Date.now() - this._startTime;
    }

    // Map a key code to the input listener with a
    // callback. This mapping function's difference
    // is that upon the key state the key state data
    // is sent to the server.
    addKeyEmitter(keyCode, callback) {
        if (callback === undefined) {
            this._inputListener.addMapping(keyCode, keyState => {
                this.emit("keyEvent", {keyCode: keyCode, keyState: keyState});
            });
        } else {
            this._inputListener.addMapping(keyCode, keyState => {
                callback(keyState);
                this.emit("keyEvent", {keyCode: keyCode, keyState: keyState});
            });
        }
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

    update(entityManager) {
        if (!this._eMgr) {
            this._eMgr = entityManager;
        }
        this._startTime = Date.now();
        this.emit("_ping");
        var e = entityManager.getEntityByID(this.id);
        if (e) {
            R.camera.update(e._targetState._pos);
        }
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

        this.on('_pong', () => {
            this._latency = Date.now() - this._startTime;
            MyClient._ping = this._latency;
        });

        this.on('broadcast-newPlayer', data => {
           console.log("Connected: ", data.id + ".", "There are " + data.playerCount + " players online!");
        });


        // TODO: Remove test
        this.on("t_getQuadTree", data => {

        });
    }
}