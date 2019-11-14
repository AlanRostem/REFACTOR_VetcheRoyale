import UI from "../UI.js"
import PacketBuffer from "../../../client/js/Networking/Client/PacketBuffer.js";


class CAdmin {
    constructor(){
        this.socket = io("/admin");
        this.packet = {};
        this.f = true;
        this.socket.on("adminUpdate", data => {
            if (Object.keys(data).length > 0) {
                this.packet = PacketBuffer.createPacket(this.packet, data);
               // UI.displayJson(this.packet, "world", $("#container"));
                if (this.f){
                    this.f = false;
                    UI.createTable(this.packet, ["id", "mapName", "players", "entityCount"], "worldTable");
                }
                UI.update($("#worldTable"), data);

            }
        });
    }
}

export default CAdmin;
