Object.isJSON = function (obj) {
    return obj !== undefined && obj !== null && !(typeof obj === "number" && isNaN(obj)) && typeof obj !== "string" && typeof obj !== "number" && typeof obj !== "boolean";
};

const UI = {

    update(elm, snapshot){
        if (snapshot === undefined) return;
        if (!Object.isJSON(snapshot)) {
            return elm.contents().filter(function () {
                return this.nodeType === 3;
            }).first()[0].nodeValue = snapshot;
        }
        Object.keys(snapshot).forEach(e => {
            UI.update(elm.children("." + e), snapshot[e]);
        });
    },

    createTable(json, props, name, clickable = false, parent = $("#container")) {
        parent.append([
            $("<table/>", {"class": "table table-hover table-striped table-bordered "}).append([
                $("<thead/>").append($("<tr/>")).append(
                    props.map(e => $("<th/>", {"class": "th-sm"}).append(e)[0])),
                $("<tbody/>", {"id": name}).append(Object.keys(json).map(e =>
                    $("<tr/>", {"class": "clickable-row " + e, "data-href": "#" + e}).append(props.map(x =>
                        $("<td/>", {"class": x}).append(json[e][x])[0]))))
            ])
        ]);
        if (clickable)
            jQuery(document).ready(function ($) {
                $(".clickable-row").click(function () {
                    window.location = $(this).data("href");
                });
            });
    },

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

        UI.addDocReady(() => {
            root.children("li").children(".badge").last().append(nextRoot.children("li").length);
            root.children("li").children("div").last().click(function () {
                $(this).siblings().toggle();
            });
        });

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