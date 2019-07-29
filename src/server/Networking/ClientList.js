
// Data structure that keeps track of all the
// clients connected to the server.
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
            this._container[id].removed = true;
            delete this._container[id];
        } else {
            console.log("WARNING: Attempted to delete a non-existent client.")
        }
    }

    forEach(callback) {
        for (var id in this._container) {
            callback(this._container[id]);
        }
    }
}

module.exports = ClientList;