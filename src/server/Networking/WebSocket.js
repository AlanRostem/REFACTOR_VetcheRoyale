class Client {
    constructor(self) {
        // Object given by socket.io
        this.self = self;
        this.defineEmitEvents(self);
    }

    get id() {
        return this.self.id;
    }

    get clientObject() {
        return this.self;
    }

    emit(eventType, data) {
        this.self.emit(eventType, data);
    }

    on(eventType, callback) {
        this.self.on(eventType, callback);
    }

    defineEmitEvents(data) {
        this.self.emit("connectClient", {id: data.id});
        this.self.on("connectClientCallback", data => {
            console.log("Client <" + data.id + "> successfully connected!");
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
            console.log("Establishing connection... Client ID: <" + client.id + ">");
            this.clientList.addClient(client.id, new Client(client));
        });
    }
}

module.exports = WebSocket;