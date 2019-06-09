import InputListener from "./InputListener.js"
export default class MyClient {

    id = null;

    constructor(socket) {
        this.socket = socket;
        this.inputListener = new InputListener(this);
        this.addKeyEmitter(32);
        this.defineEmitEvents();
    }

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
        const connectedPromise = new Promise(resolve => {
            this.socket.on('connectClient', data => {
                this.id = data.id;
                this.socket.emit("connectClientCallback", {id: this.id});
                resolve();
            });
        });
    }



}