class Client {
    constructor(socket, clientList) {
        // Object given by socket.io
        this.socket = socket;
        this.defineEmitEvents(self, clientList);
    }

    get id() {
        return this.socket.id;
    }

    emit(eventType, data) {
        this.socket.emit(eventType, data);
    }

    on(eventType, callback) {
        this.socket.on(eventType, callback);
    }

    defineEmitEvents(socket, clientList) {
        this.socket.emit("connectClient", {id: socket.id});
        this.socket.on("connectClientCallback", data => {
            console.log("Client [ " + data.id + " ] successfully connected!");
        });

        this.socket.on("disconnect", data => {
            clientList.removeClient(this.id);
            console.log("Disconnected [ " + this.id + " ]");
        });
    }
}

class ClientList {
    constructor() {
        this.container = {};
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