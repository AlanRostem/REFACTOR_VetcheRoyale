class Table {
    constructor(monitor) {
        this.monitor = monitor;
        this.types = ["World", "Entity", "Player"];
        this.keys = [];
        this.currentTypeIndex = 0;
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
            else if (rowData) {
                Object.keys(json[id]).forEach(key => {
                    if (Object.isJSON(rowData[key]))
                        Object.keys(json[id][key]).forEach(prop => {
                            rowData[key][prop] = json[id][key][prop];
                        });
                    else
                        rowData[key] = json[id][key];
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

    addDocReady(callback) {
        $(document).ready(callback());
    };

    update(data) {
        if (Object.keys(data).length) {
            if (data.keys)
                this.addDocReady(() => {
                    this.createTable("container", "WorldTable",
                        Object.values(data.data), Object.values(data.keys),
                        (id) => {
                            if (this.currentTypeIndex < 1) {
                                this.currentTypeIndex++;
                                this.selectFromTable(id, this.currentType);
                            }
                        });
                });
            else
                this.addDocReady(() => {
                    this.updateTable("WorldTable", data.data);
                })
        }
    }
}

export default Table;