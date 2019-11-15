import PacketBuffer from "../../../client/js/Networking/Client/PacketBuffer.js";

class CAdmin {
    constructor(JSONToHTML) {
        this.socket = io("/admin");
        this.packet = {};
        this.toHTML = JSONToHTML;
        this.f = true;

        this.socket.on("adminUpdate", data => {
            if (Object.keys(data).length > 0) {
                this.packet = PacketBuffer.createPacket(this.packet, data);
                let t_forWorld = ["id", "mapName", "players", "entityCount"];
                this.toHTML.createTable(this.packet, t_forWorld, "worldTable", $("#container"), (id) => {
                    this.selectFromTable(id)
                });
            }
        });
    }

    goBack() {
        this.selectFromTable(null, null, "GO_BACK");
    }

    selectFromTable(property, type ="World", msgType = "SELECT_NEW") {
        this.socket.emit("adminToServer", {
            content: {
                prop: property,
                type: type
            },
            messageType: msgType
        });
    }
}

export default CAdmin;
