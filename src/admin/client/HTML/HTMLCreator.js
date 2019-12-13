import Table from "./TableCreator/Table.js"

Object.isJSON = function (obj) {
    return obj !== undefined && obj !== null && !(typeof obj === "number" && isNaN(obj)) && typeof obj !== "string" && typeof obj !== "number" && typeof obj !== "boolean";
};

class HTMLCreator {
    constructor(monitor) {
        this.creator = new Table(monitor);

        monitor.addUpdateCallback((data) => {
            if (this.creator)
                this.creator.update(data);
        });

        this.addDocReady(() => {
            $("#home").click(() => {
                this.creator = null;
            });

            $("#worlds").click(() => {
                this.creator = new Table(monitor);
            });
        })
    }


    addDocReady(callback) {
        $(document).ready(callback());
    };


    /*selectFromTable(property, type = "World", msgType = "SELECT_NEW") {
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
            $("#" + name).dataTable({
                "data": json,
                "columns": props.map(key => {
                    return {
                        "title": key,
                        "data": key,
                        "defaultContent": "",
                        "render": function (data, type, row) {
                            if (Object.isJSON(data)) {
                                let value = "";
                                for (let key in data)
                                    value += key + ": " + data[key] + " ";
                                return value;
                            }
                            return data;
                        }
                    }
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
                    }
                }]
            });

        });

    }

    updateTable(name, json) {
        let table = $("#" + name).DataTable();

        Object.keys(json).forEach(id => {
            let row = table.row("#" + $.escapeSelector(id));
            let rowData = row.data();
            if (json[id].toRemove) row.remove();
            else if (row && rowData) {
                Object.keys(json[id]).forEach(key => {
                    if (Object.isJSON(rowData[key]))
                        Object.keys(json[id][key]).forEach(prop => {
                            rowData[key][prop] = json[id][key][prop]
                        });
                    else
                        rowData[key] = json[id][key]
                });
                row.invalidate();
            } else {
                table.row.add(
                    json[id]
                );
            }

            table.draw(false);
        });
    }
*/


}

export default HTMLCreator;