import UI from "../UI.js"


class CAdmin {
    constructor(){
        this.socket = io("/admin");
        this.socket.on("adminUpdate", data => {
            if (Object.keys(data).length > 0) {
                console.log(data);
                UI.createTable(data, ["id", "mapName", "players", "entityCount"]);
            }
        });
    }
}

export default CAdmin;
