import PacketBuffer from "../../../client/js/Networking/Client/PacketBuffer.js";

class CAdmin {
    constructor(monitor) {
        this.monitor = monitor;
        this.socket = io("/admin");
        this.callbacks = [];




        this.socket.on("adminUpdate", data => {

            this.callbacks.forEach(e => e(data));

            /*
                this.toHTML.createTable("container", "worldTable", this.currentType, this.packet, this.currentType(), (id, type) => {
                    this.toHTML.clearElement("container");
                    this.selectFromTable(id, type);
                    this.packet = {};
                });
            */


        });

    }

    emit(event, data){
        this.socket.emit(event, data)
    }

    on(event, callback) {
        this.socket.on(event, callback)
    }

    get dataPacket() {
        return this.packet;
    }

    set currentType(idx) {
        return this.currentTypeIndex = idx;
    }



    goBack() {
        this.selectFromTable(null, null, "GO_BACK");
    }

}

export default CAdmin;
