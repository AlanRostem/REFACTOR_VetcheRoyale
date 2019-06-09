class Client {
    constructor(socket, clientList) {
        // Object given by socket.io
        this.socket = socket;

        this.socket.emit("connectClient", {id: socket.id});
        // Holds all key states of corresponding key codes
        this.keyStates = {
            32: false
        };
        this.defineEmitEvents(socket, clientList);
    }

    get id() {
        return this.socket.id;
    }

    getKeyState(keyCode) {
        return this.keyStates[keyCode];
    }

    emit(eventType, data) {
        this.socket.emit(eventType, data);
    }

    on(eventType, callback) {
        this.socket.on(eventType, callback);
    }

    defineEmitEvents(socket, clientList) {
        this.socket.on("connectClientCallback", data => {
            console.log("Client [ " + data.id + " ] successfully connected!");
        });

        this.socket.on("disconnect", data => {
            clientList.removeClient(this.id);
            console.log("Disconnected [ " + this.id + " ]");
        });

        this.socket.on("keyEvent", data => {
            this.keyStates[data.keyCode] = data.keyState;
        })
    }
}

class ClientList {
    constructor() {
        this.container = {};
    }

    getContainer() {
        return this.container;
    }

    getClient(id) {
        if (!this.container.hasOwnProperty(id)) {
            console.log("WARNING: Client list is returning undefined on 'getClient'");
        }
        return this.container[id];
    }

    addClient(id, client) {
        this.container[id] = client;
        return client;
    }

    removeClient(id) {
        if (this.container.hasOwnProperty(id)) {
            delete this.container[id];
        } else {
            console.log("WARNING: Attempted to delete a non-existent client.")
        }
    }
}

class WebSocket {
    constructor(socket) {
       this.socket = socket;
        if (this.socket === null || this.socket === undefined) {
            throw new Error("WebSocket class is missing an 'io' object. The application is terminated.");
        }
        this.clientList = new ClientList();
        this.defineEmitEvents();
    }

    defineEmitEvents() {
        this.socket.on("connection", client => {
            console.log("Establishing connection... Client ID: [ " + client.id + " ]");
            this.clientList.addClient(client.id, new Client(client, this.clientList));
        });
    }
}

module.exports = WebSocket;