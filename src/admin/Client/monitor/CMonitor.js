import CAdmin from "../admin/CAdmin.js";
import JSONToHTML from "../JSONToHTML.js";

class CMonitor {
    constructor() {
        this.toHTML = new JSONToHTML();

        this.admin = new CAdmin(this.toHTML);

        this.toHTML.update($("#container"));


        $(".home").click(function () {
            this.toHTML.clearElement("#container");
        });

        $("#worlds").click(function () {
            this.toHTML.clearElement("#container");
            this.toHTML.createTable({
                "1": {id: "1", worldName: "Alan", data:undefined},
                "2": {id: "2", worldName: "Karl", data:{pos:{x:10,y:10}}},
                "3": {id: "3", worldName: "Benjamin", data:null},
                "4": {id: "4", worldName: "Anal", data:"hallp"},
            }, ["id", "worldName", "data"], true);
        });

        $("#players").click(function () {
            this.toHTML.clearElement("#container");
            this.toHTML.createTable({
                "1": {id: "1", playerName: "Alan", data:"dgaj"},
                "2": {id: "2", playerName: "Karl", data:"dgaj"},
                "3": {id: "3", playerName: "Benjamin", data:"dgaj"},
                "4": {id: "4", playerName: "Anal", data:"dgaj"},
            }, ["id", "playerName"], false);

        });

        $("#game").click(function () {
            let container = $("#container");
            if (!$("#container iframe").length){
                this.toHTML.clearElement("#container");
                let iframe = $("<iframe onload='this.contentWindow.focus()' src='/'/>");
                iframe.css({
                    "width":"2000",
                    "height":"1000",
                });
                container.append(iframe);

            }
            container.children("iframe")[0].contentWindow.focus();
        });



    }
}

var Monitor = new CMonitor();