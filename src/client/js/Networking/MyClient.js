import InputListener from "../InputListener.js"
export default class MyClient {

    id = null;

    constructor(socket) {
        this.socket = socket;
        this.inputListener = new InputListener(this);
        this.addKeyEmitter(32, keyState => {
            //console.log(keyState);
        }); // TEST
        this.defineEmitEvents();
    }

    // Map a key code to the input listener with a
    // callback. This mapping function's difference
    // is that upon the key state the key state data
    // is sent to the server.
    addKeyEmitter(keyCode, callback) {
        if (callback === undefined) {
            this.inputListener.addMapping(keyCode, keyState => {
                this.emit("keyEvent", {keyCode: keyCode, keyState: keyState});
            });
        } else {
            this.inputListener.addMapping(keyCode, keyState => {
                callback(keyState);
                this.emit("keyEvent", {keyCode: keyCode, keyState: keyState});
            });
        }
    }

    emit(eventType, data) {
        this.socket.emit(eventType, data);
    }

    on(eventType, callback) {
        this.socket.on(eventType, callback);
    }

    defineEmitEvents() {
        // Establishes a full connection using a promise.
        // The server is then notified of a proper connection.
        const connectedPromise = new Promise(resolve => {
            this.socket.on('connectClient', data => {
                this.id = data.id;
                this.socket.emit("connectClientCallback", {id: this.id});
                resolve();
            });
        });
    }



}