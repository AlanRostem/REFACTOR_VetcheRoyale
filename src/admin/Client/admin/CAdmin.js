
class CAdmin {
    constructor(){
        this.socket = io("/admin");
        this.socket.disconnect();
    }
}

var admin =  new CAdmin();
export default CAdmin;
