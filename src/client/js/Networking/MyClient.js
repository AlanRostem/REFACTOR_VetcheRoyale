import InputListener from "../InputListener.js"
export default class MyClient {

    id = null;

    constructor(socket) {
        this._socket = socket;
        this._inputListener = new InputListener(this);
        this.addKeyEmitter(32, keyState => {
            //console.log(keyState);
        }); // TEST
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

    update() {
        this._startTime = Date.now();
        this.emit("_ping");
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
        });
    }

}