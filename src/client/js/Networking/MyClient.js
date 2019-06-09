export default class MyClient {

    id = null;

    constructor(socket) {
        this.socket = socket;
        const connectedPromise = new Promise(resolve => {
            this.socket.on('connectClient', data => {
                this.id = data.id;
                this.socket.emit("connectClientCallback", {id: this.id});
                console.log('Connected to server!');
                resolve();
            });
        });

        
    }
}