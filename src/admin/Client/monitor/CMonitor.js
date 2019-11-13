import CAdmin from "../admin/CAdmin.js";
import UI from "../UI.js";

class CMonitor {
    constructor(){
        this.admin = new CAdmin();
        UI.createTable({
            "1": {id:"1", worldName: "Alan"},
            "2": {id:"2", worldName: "Karl"},
            "3": {id:"3", worldName: "Benjamin"},
            "4": {id:"4", worldName: "Anal"},
        }, ["id", "worldName"], true);

    }
}

var Monitor = new CMonitor();