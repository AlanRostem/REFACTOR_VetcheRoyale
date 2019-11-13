Object.isJSON = function (obj) {
    return obj !== undefined && obj !== null && !(typeof obj === "number" && isNaN(obj)) && typeof obj !== "string" && typeof obj !== "number" && typeof obj !== "boolean";
};

const UI = {
    createTable(json, props, clickable = false, parent = "#container") {
        let table = $("<table class='table table-hover table-striped table-bordered'/>");
        let thead = $("<thead/>");
        table.append(thead);
        let tr = $("<tr/>");
        thead.append(tr);

        for (let pro of props)
            tr.append($("<th class='th-sm'/>").append(pro));

        let tbody = $("<tbody/>");
        table.append(tbody);

        for (let key in json) {
            let tr = $("<tr/>");
            tbody.append(tr);

            if (clickable)
                $(tr).click(function () {
                    window.location = '#' + key;
                });

            for (let pro of props)
                tr.append($("<td class='th-sm'/>").append(json[key][pro]));
        }

        $(parent).append(table);
    },


    displayJson(json, name, root = $("<ul class='list-group'/>")) {
        if (!Object.isJSON(json)) return null;
        let list = $("<li class='list-group-item '/>");
        let ul = $("<ul class=''/>");

        root.append(list.append($("<span style='cursor: pointer;' class='root '/>").append(name)));
        list.append(ul);

        $(document).ready(()=>{
            $(".root").click(function () {
                $(this).siblings().toggle();
            });
        });

        for (let key in json){
            if (!Object.isJSON(json[key])){
                let li = $("<li class='list-group-item '/>");
                ul.append(li.append(key +": "+json[key]));
            }
            else {
                ul.append(this.displayJson(json[key], key, ul));
            }
        }
        return root;
    },

    addDocReady(callback) {
        $(document).ready(callback());
    },

    clearElement(elm) {
        $(elm).empty();
    }
};

export default UI;