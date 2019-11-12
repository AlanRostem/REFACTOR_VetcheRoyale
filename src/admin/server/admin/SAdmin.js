class SAdmin {
    constructor(socket){
        this.socket = socket;
        this.socket.id = socket.id;
    }
}

module.exports = SAdmin;