export default class MyClient {

    id = null;

    constructor(socket) {
        this.socket = socket;
        this.defineEmitEvents();
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