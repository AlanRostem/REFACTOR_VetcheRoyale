class SAdmin {
    constructor(socket, adminList, server) {
        this.socket = socket;
        this.id = socket.id;
        server.dataBridge.transferClientEvent("connectAdmin", this.id, {id: this.id});
        this.socket.on("disconnect", data => {
            adminList.removeClient(this.id);
            console.log("Disconnected [ " + this.id + " ]");
            server.dataBridge.transferClientEvent("removeAdmin", this.id, {id: this.id});
        });

    }
}

module.exports = SAdmin;