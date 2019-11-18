import PacketBuffer from "../../client/js/Networking/Client/PacketBuffer.js";

Object.isJSON = function (obj) {
    return obj !== undefined && obj !== null && !(typeof obj === "number" && isNaN(obj)) && typeof obj !== "string" && typeof obj !== "number" && typeof obj !== "boolean";
};

class HTMLCreator {
    constructor(monitor) {
        this.monitor = monitor;
        this.jsondata = {};
        this.types = ["World", "Entity", "Player"];
        this.keys = [];
        this.currentTypeIndex = 0;
        this.f = true;


        this.monitor.addUpdateCallback((data) => {
            if (Object.keys(data).length)
                if (data.keys) {
                    this.addDocReady(() => {
                        this.createTable("container", "WorldTable",
                            Object.values(data.data), Object.values(data.keys),
                            (id) => {
                                this.currentTypeIndex++;
                                this.selectFromTable(id, this.currentType);
                            });
                    });
                } else {
                    this.updateTable("WorldTable", data.data)
                }
        });
    }

    selectFromTable(property, type = "World", msgType = "SELECT_NEW") {
        this.monitor.emit("adminToServer", {
            content: {
                prop: property,
                type: type
            },
            messageType: msgType
        });
    }

    get currentType() {
        return this.types[this.currentTypeIndex];
    }


    createTable(parent, name, json, props, callback = undefined) {
        parent = $("#" + parent);
        parent.empty().append($("<table/>", {
            "id": name,
            "class": "table table-hover table-striped table-bordered"
        }).css("width", "100%"));

        this.addDocReady(() => {
            var table = $("#" + name).dataTable({
                "data": json,

                "columns": props.map(key => {
                    return {"title": key, "data": key, "defaultContent": ""}
                }),

                "createdRow": function (row, data, index) {
                    $(row).attr('id', data.id);
                    if (callback)
                        $(row).click(() => {
                            callback(data.id)
                        })
                },

                "columnDefs": [{
                    "targets": '_all',
                    "createdCell": function (td, cellData, rowData, row, col) {
                        $(td).attr('class', Object.keys(rowData)[col]);
                        if (Object.isJSON(cellData)) {
                            $(td).empty();
                            $(td).append(Object.keys(cellData).map(key =>
                                $("<span/>", {"class": key}).append(key + ": " + cellData[key] + " ")
                            ))
                        }
                    }
                }]
            });

        });

    }


    updateTable(name, json) {
        let parent = $("#" + name + " tbody");
        Object.keys(json).forEach(id => {
            let row = parent.children("#" + $.escapeSelector(id));
            if (row.length)
                Object.keys(json[id]).forEach(key => {
                    let cell = row.children("." + key);
                    if (Object.isJSON(json[id][key]))
                        Object.keys(json[id][key]).forEach(prop => {
                         cell.children("." + prop).empty().append(prop + ": " + json[id][key][prop] + " ")
                        });
                    else
                        cell.empty().append(json[id][key]);

                })
        })
    }

    /*
    updateText(elm, json) {
        if (!Object.isJSON(json)) return json;
        return Object.keys(json).map(key => $("<p/>", {"class": key}).append(key + ":" + json[key]))
    }


    updateTable(parent, json, props, name, type, callback) {
        if (!parent.children("." + $.escapeSelector(name)).length) {
            parent.append($("<tr/>", {"class": "clickable-row " + name}).append(
                props.map(key => $("<td/>", {"class": key}).append(this.updateText(json[key]))[0])
            ));
            if (callback)
                this.addDocReady(() => {
                    parent.children("." + $.escapeSelector(name)).click(() => {
                        callback(name, type);
                    });
                });
        } else {
            props.forEach(key => {
                if (json[key] !== undefined) {
                    this.updateText(parent.children("." + $.escapeSelector(name)).children("." + $.escapeSelector(key)), json[key]);


                            if (!Object.isJSON(json[key]))
                                parent.children("." + $.escapeSelector(name)).children("." + $.escapeSelector(key)).contents().filter(function () {
                                return this.nodeType === 3;
                            }).first()[0].nodeValue = this.updateObject(json[key]);
                        }else {

                        }
                }
            })
        }

    };


    createTable(parent, name, type, json, props, callback = undefined) {
        parent = $("#" + parent);
        if (!parent.children("#" + $.escapeSelector(name)).length) {
            parent.append([
                $("<table/>", {"id": name, "class": "table table-hover table-striped table-bordered "}).append([
                    $("<thead/>").append($("<tr/>")).append(
                        props.map(key => $("<th/>", {"class": "th-sm"}).append(key).css({"font-size": "20px"})[0])),
                    $("<tbody/>")
                ])
            ])
        }

        Object.keys(json).forEach(key => {
            this.updateTable(parent.children("table").children("tbody"), json[key], props, key, type, callback)
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



    clearElement(elm) {
        $("#" + elm).empty();
    };*/

    addDocReady(callback) {
        $(document).ready(callback());
    };

}

export default HTMLCreator;