const ONMap = require("../../shared/code/DataStructures/SObjectNotationMap.js");
// Data structure that keeps track of all the
// clients connected to the server.
class ClientList {
    constructor() {
        this.container = {};
        this.IPS = new ONMap();
    }

    getContainer() {
        return this.container;
    }

    get length() {
        return Object.keys(this.container).length;
    }

    getClient(id) {
        /*
        if (!this.container.hasOwnProperty(id)) {
            console.log("WARNING: Client list is returning undefined on 'getClient':", id, new Error());
        }
         */
        return this.container[id];
    }

    addClient(id, client) {
        this.IPS.set(client.socket.handshake.address, true);
        this.container[id] = client;
        return client;
    }

    hasIP(ip) {
        return this.IPS.get(ip);
    }

    removeClient(id) {
        if (this.container.hasOwnProperty(id)) {
            this.container[id].removed = true;
            this.IPS.remove(this.container[id].socket.handshake.address);
            delete this.container[id];
        } else {
            console.log("WARNING: Attempted to delete a non-existent client.")
        }
    }

    forEach(callback) {
        for (var id in this.container) {
            callback(this.container[id]);
        }
    }

}

module.exports = ClientList;