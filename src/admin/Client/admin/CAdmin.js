import PacketBuffer from "../../../client/js/Networking/Client/PacketBuffer.js";


class CAdmin {
    constructor(JSONToHTML){
        this.socket = io("/admin");
        this.packet = {};
        this.toHTML = JSONToHTML;

        this.socket.on("adminUpdate", data => {
            if (Object.keys(data).length > 0) {
                this.packet = PacketBuffer.createPacket(this.packet, data);
                this.toHTML.createTable("container", "worldTable", this.packet,
                    ["id", "mapName", "players", "entityCount"], (id)=>{
                });
            }
        });

    }
}

export default CAdmin;
