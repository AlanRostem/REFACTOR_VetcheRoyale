class UI {
    constructor() {
    }

    static elements = {};


    static update = function (client) {
        for (var key in UI.elements) {
            UI.elements[key].update(client);
        }
    };

    static draw = function () {
        for (var key in UI.elements) {
            UI.elements[key].draw();
        }
    };
}

try {
    module.exports = UI;
} catch (e) {
}

var ui = new UI();
