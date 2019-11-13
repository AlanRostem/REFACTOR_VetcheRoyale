class SAdmin {
    constructor(socket, adminList){
        this.socket = socket;
        this.id = socket.id;
        this.socket.on("disconnect", data => {
            adminList.removeClient(this.id);
            console.log("Disconnected [ " + this.id + " ]");
        });
        this.dataSelector = new DataSelector(this.gameWorlds.object, "id", "mapName", "players", "entityCount");

    }
}

module.exports = SAdmin;