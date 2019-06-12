Client = require("./SClient.js");

class ClientList {
    constructor() {
        this._container = {};
    }

    getContainer() {
        return this._container;
    }

    get length() {
        return Object.keys(this._container).length;
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
    constructor(socket, entityManager) {
       this._socket = socket;
        if (this._socket === null || this._socket === undefined) {
            throw new Error("WebSocket class is missing an 'io' instance. The application is terminated.");
        }
        this._clientList = new ClientList();
        this.defineSocketEvents(entityManager);
    }

    defineSocketEvents(entityManager) {
        this._socket.on("connection", client => {
            console.log("Establishing connection... Client ID: [ " + client.id + " ]");
            this._clientList.addClient(client.id, new Client(client, this._clientList, entityManager));
        });
    }

    get clientList() {
        return this._clientList.getContainer();
    }
}

module.exports = WebSocket;