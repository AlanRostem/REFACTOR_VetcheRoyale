import CAdmin from "../admin/CAdmin.js";
import UI from "../UI.js";

class CMonitor {
    constructor(){
        this.admin = new CAdmin();
        UI.createTable({
            "423423dsadas1": {id:"4", worldName: "naaaii"},
            "423423dsadas2": {id:"42", worldName: "naaaii"},
            "423423dsadas3": {id:"423", worldName: "naaaii"},
            "423423dsadas4": {id:"4234", worldName: "naaaii"},
        }, ["id", "worldName"]);

    }
}

var Monitor = new CMonitor();