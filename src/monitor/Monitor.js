ADMIN_PREFIX = "admin-";

class Monitor {
    constructor(app, io){
        this.app = app;
        this.io = io;
    }

    on(event, callback){
        this.io.on(ADMIN_PREFIX + event, callback);
    }

    emit(event, callback){
        this.io.emit(ADMIN_PREFIX + event, callback);
    }
}
module.exports = Monitor;