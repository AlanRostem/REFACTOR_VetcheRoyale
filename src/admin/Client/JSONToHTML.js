Object.isJSON = function (obj) {
    return obj !== undefined && obj !== null && !(typeof obj === "number" && isNaN(obj)) && typeof obj !== "string" && typeof obj !== "number" && typeof obj !== "boolean";
};

class JSONToHTML {

    update(elm, snapshot) {
        if (snapshot === undefined) return;
        if (!Object.isJSON(snapshot)) {
            return elm.contents().filter(function () {
                return this.nodeType === 3;
            }).first()[0].nodeValue = snapshot;
        }
        Object.keys(snapshot).forEach(e => {
            this.update(elm.children("." + e), snapshot[e]);
        });
    };


    updateTable(parent, json, props, name) {
        if (!parent.children("." + name).length) {
            parent.append($("<tr/>", {"class": "clickable-row " + name, "data-href": "#" + name}).append(
                props.map(key => $("<td/>", {"class": key}).append(json[key])[0])
            ));
        }
        else {
            props.forEach(key =>{
                if(json[key] !== undefined){
                    parent.children("." + name).children("." + key).contents().filter(function () {
                        return this.nodeType === 3;
                    }).first()[0].nodeValue = json[key];
                }
            });
        }

    };


    createTable(json, props, name, clickable = false, parent = $("#container")) {
        if (!parent.children("#" + name).length) {
            parent.append([
                $("<table/>", {"id": name, "class": "table table-hover table-striped table-bordered "}).append([
                    $("<thead/>").append($("<tr/>")).append(
                        props.map(e => $("<th/>", {"class": "th-sm"}).append(e)[0])),
                    $("<tbody/>")
                ])
            ])
        }

        Object.keys(json).forEach(key => {
            this.updateTable(parent.children("table").children("tbody"), json[key], Object.keys(json[key]), key)
        });
    };

    displayJson(json, name, root = $("<ul/>")) {
        if (!root.is("ul")) {
            let u = $("<ul id='" + name + "'/>");
            root.append(u);
            root = u;
        }

        if (!Object.isJSON(json))
            return ($("<li/>", {"class": "list-group-item " + name}).append("<b>" + name + ": </b>" + json).appendTo(root));

        let nextRoot = $("<ul/>", {"class": ""}).css("display", "none");

        root.append([
            $("<li/>", {"class": " list-group-item " + name}).append([
                $("<span/>", {"class": "badge"}).css("cursor", "pointer"),
                $("<div/>").css({"cursor": "pointer", "width": "100%"}).append("<b>" + name + "</b>"),
                nextRoot.append(Object.keys(json).forEach((e) => {
                        this.displayJson(json[e], e, nextRoot)
                    })
                )
            ])
        ]);

        this.addDocReady(() => {
            root.children("li").children(".badge").last().append(nextRoot.children("li").length);
            root.children("li").children("div").last().click(function () {
                $(this).siblings().toggle();
            });
        });

        return root;
    };

    static addDocReady(callback) {
        $(document).ready(callback());
    };

    static clearElement(elm) {
        $(elm).empty();
    };

}

export default JSONToHTML;