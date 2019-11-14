Object.isJSON = function (obj) {
    return obj !== undefined && obj !== null && !(typeof obj === "number" && isNaN(obj)) && typeof obj !== "string" && typeof obj !== "number" && typeof obj !== "boolean";
};

const UI = {
    createTable(json, props, clickable = false, parent = "#container") {
        $(parent).append([
            $("<table/>", {"class": "table table-hover table-striped table-bordered'"}).append([
                $("<thead/>").append($("<tr/>")).append(
                    props.map(e => $("<th/>", {"class": "'th-sm'"}).append(e)[0])),
                $("<tbody/>").append(Object.keys(json).map(e =>
                    $("<tr/>", {"class": "clickable-row", "data-href": "#" + e}).append(props.map(x =>
                        $("<td/>").append(json[e][x])[0]))))
            ])
        ]);
        if (clickable)
            jQuery(document).ready(function ($) {
                $(".clickable-row").click(function () {
                    window.location = $(this).data("href");
                });
            });
    },

    displayJson(json, name, root, firstName = name) {
        if (!Object.isJSON(json))
            return root.append($("<li/>", {"class": "list-group-item"}).append("<b>" + name + "</b>: " + json));

        if (!root.is("ul")) {
            let u = $("<ul id='" + name + "'/>");
            root.append(u);
            root = u;
        }

        let nextRoot = $("<ul/>").css("display", "none");

        root.append([
            $("<li/>", {"class": "list-group-item"}).append([
                $("<span/>", {"class": "badge"}).css("cursor", "pointer"),
                $("<div/>").css({"cursor":"pointer","width":"100%"}).append("<b>" + name + "</b>"),
                nextRoot
            ])
        ]);

        if (!Object.keys(json).length) return root;
        for (let key in json) {
            this.displayJson(json[key], key, nextRoot, firstName);
        }

        $(document).ready(() => {
            root.children("li").children(".badge").append(root.children("li").find("li").length);
            root.children("li").children("div").click(function () {
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