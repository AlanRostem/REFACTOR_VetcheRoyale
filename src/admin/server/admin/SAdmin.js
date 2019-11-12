class SAdmin {
    constructor(socket, adminList){
        this.socket = socket;
        this.id = socket.id;
        this.socket.on("disconnect", data => {
            adminList.removeClient(this.id);
            console.log("Disconnected [ " + this.id + " ]");
        });
    }
}

module.exports = SAdmin;