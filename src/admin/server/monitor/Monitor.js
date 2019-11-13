const Admin = require("../admin/SAdmin.js");
const ClientList = require("../../../server/Networking/ClientList.js");

class Monitor {
    constructor(io){
        this.socket = io;
        this.adminList = new ClientList();
        this.on("connection", admin => {
            console.log("\nEstablishing connection to admin... Admin ID: [ " + admin.id + " ]");
            let _admin = new Admin(admin, this.adminList);
            this.adminList.addClient(admin.id, _admin);
        });

        this.on("message", data =>{
            console.log(data);
        });
    }

    on(event, callback){
        this.socket.on(event, callback);
    }

    emit(event, callback){
        this.socket.emit(event, callback);
    }
}
module.exports = Monitor;