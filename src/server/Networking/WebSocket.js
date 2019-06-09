class Client {
    constructor(socket, clientList) {
        // Object given by _socket.io
        this._socket = socket;

        this._socket.emit("connectClient", {id: socket.id});
        // Holds all key states of corresponding key codes
        this._keyStates = {
            32: false
        };
        this.defineEmitEvents(socket, clientList);
    }

    get id() {
        return this._socket.id;
    }

    get socket() {
        return this._socket;
    }

    getKeyState(keyCode) {
        return this._keyStates[keyCode];
    }

    emit(eventType, data) {
        this._socket.emit(eventType, data);
    }

    on(eventType, callback) {
        this._socket.on(eventType, callback);
    }

    defineEmitEvents(socket, clientList) {
        this._socket.on("connectClientCallback", data => {
            console.log("Client [ " + data.id + " ] successfully connected!");
        });

        this._socket.on("disconnect", data => {
            clientList.removeClient(this.id);
            console.log("Disconnected [ " + this.id + " ]");
        });

        this._socket.on("keyEvent", data => {
            this._keyStates[data.keyCode] = data.keyState;
        })
    }
}

class ClientList {
    constructor() {
        this._container = {};
    }

    getContainer() {
        return this._container;
    }

    getClient(id) {
        if (!this._container.hasOwnProperty(id)) {
            console.log("WARNING: Client list is returning undefined on 'getClient'");
        }
        return this._container[id];
    }

    addClient(id, client) {
        this._container[id] = client;
        return client;
    }

    removeClient(id) {
        if (this._container.hasOwnProperty(id)) {
            delete this._container[id];
        } else {
            console.log("WARNING: Attempted to delete a non-existent client.")
        }
    }
}

class WebSocket {
    constructor(socket) {
       this._socket = socket;
        if (this._socket === null || this._socket === undefined) {
            throw new Error("WebSocket class is missing an 'io' instance. The application is terminated.");
        }
        this._clientList = new ClientList();
        this.defineEmitEvents();
    }

    defineEmitEvents() {
        this._socket.on("connection", client => {
            console.log("Establishing connection... Client ID: [ " + client.id + " ]");
            this._clientList.addClient(client.id, new Client(client, this._clientList));
        });
    }
}

module.exports = WebSocket;