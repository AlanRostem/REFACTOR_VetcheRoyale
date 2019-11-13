import CAdmin from "../admin/CAdmin.js";
import UI from "../UI.js";

class CMonitor {
    constructor() {
        this.admin = new CAdmin();
        $("#container").append(UI.displayJson({
            id: "2",
            worldName: "Karl",
            data:{
                pos:{
                    x:10,
                    y:10
                },
                test:"test2"
            }
        },"world"));

        $(".home").click(function () {
            UI.clearElement("#container");
        });

        $("#worlds").click(function () {
            UI.clearElement("#container");
            UI.createTable({
                "1": {id: "1", worldName: "Alan", data:undefined},
                "2": {id: "2", worldName: "Karl", data:{pos:{x:10,y:10}}},
                "3": {id: "3", worldName: "Benjamin", data:null},
                "4": {id: "4", worldName: "Anal", data:"hallp"},
            }, ["id", "worldName", "data"], true);
        });

        $("#players").click(function () {
            UI.clearElement("#container");
            UI.createTable({
                "1": {id: "1", playerName: "Alan"},
                "2": {id: "2", playerName: "Karl"},
                "3": {id: "3", playerName: "Benjamin"},
                "4": {id: "4", playerName: "Anal"},
            }, ["id", "playerName"], true);

        });

        $("#game").click(function () {
            let container = $("#container");
            if (!$("#container iframe").length){
                UI.clearElement("#container");
                let iframe = $("<iframe onload='this.contentWindow.focus()' src='/'/>");
                iframe.css({

                    "width":"2000",
                    "height":"1000",
                });
                container.append(iframe);
            }
        });
    }
}

var Monitor = new CMonitor();