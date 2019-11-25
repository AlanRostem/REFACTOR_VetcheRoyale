import CAdmin from "../admin/CAdmin.js";
import HTMLCreator from "../HTMLCreator.js";

class CMonitor {
    constructor() {
        this.admin = new CAdmin(this);
        this.HTMLCreator = new HTMLCreator(this);
    }

    setHTMLData(data){
        this.HTMLCreator.jsondata = data;
    }

    addUpdateCallback(callback){
        this.admin.callbacks.push(callback);
    }

    emit(event, packet) {
        this.admin.emit(event, packet);
    }

}


var Monitor = new CMonitor();

