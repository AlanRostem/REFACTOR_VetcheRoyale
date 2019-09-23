const Client = require("./Client/SClient.js");
const ClientList = require("./ClientList.js");

String.random = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

// The main web socket of the server. This is a singleton class
class WebSocket {
    constructor(socket, matchMaker, server) {
       this.socket = socket; // Object given by socket.io
        if (!this.socket) {
            throw new Error("WebSocket class is missing an 'io' instance. The application is terminated.");
        }
        this.cl = new ClientList();
        this.defineSocketEvents(matchMaker, server);
    }

    defineSocketEvents(matchMaker, server) {
        this.socket.on("connection", client => {
            console.log("\nEstablishing connection... Client ID: [ " + client.id + " ]");

            if (this.cl.hasIP(client.handshake.address)) {
                //client.disconnect("Duplicate user");
                //console.log("Kicked duplicate client:", client.id);
                //return;
            }

            var _client = new Client(client, this.cl, server);
            this.cl.addClient(client.id, _client);
            matchMaker.queueClientToGame(_client);
        });
    }

    get clientList() {
        return this.cl.getContainer();
    }
}

module.exports = WebSocket;