const Client = require("./SClient.js");
const ClientList = require("./ClientList.js");

String.random = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};



class WebSocket {
    constructor(socket, matchMaker) {
       this._socket = socket;
        if (this._socket === null || this._socket === undefined) {
            throw new Error("WebSocket class is missing an 'io' instance. The application is terminated.");
        }
        this._clientList = new ClientList();
        this.defineSocketEvents(matchMaker);
    }

    defineSocketEvents(matchMaker) {
        this._socket.on("connection", client => {
            console.log("Establishing connection... Client ID: [ " + client.id + " ]");
            var _client = new Client(client, this._clientList);
            this._clientList.addClient(client.id, _client);
            matchMaker.queuePlayer(_client);
        });
    }

    get ioInstance() {
        return this._socket;
    }

    get clientList() {
        return this._clientList.getContainer();
    }
}

module.exports = WebSocket;