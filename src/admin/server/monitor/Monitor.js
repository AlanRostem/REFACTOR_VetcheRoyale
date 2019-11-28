const Admin = require("../admin/SAdmin.js");
const ClientList = require("../../../server/Networking/ClientList.js");
var sessionManager = require("../passport/sessionManager.js");


class Monitor {
    constructor(io, server){
        this.socket = io;
        this.adminList = new ClientList();
        this.on("connection", admin => {
            console.log("\nEstablishing connection to admin... Admin ID: [ " + admin.id + " ]");
            let _admin = new Admin(admin, this.adminList, server);
            this.adminList.addClient(admin.id, _admin);
        });

        this.on("message", data =>{
            console.log(data);
        });
    }

    update(deltatime){
        sessionManager.update(deltatime)
    }

    on(event, callback){
        this.socket.on(event, callback);
    }

    emit(event, data){
        this.socket.emit(event, data);
    }
}
module.exports = Monitor;