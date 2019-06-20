import typeCheck from "../../../shared/Debugging/CtypeCheck.js";
import UIElement from "./UIElement.js";

export default class UI {
    constructor() {
    }

    static elements = {};
    static setupCallback = () => { console.warn("No UI elements are set up!") };

    static init() {
        UI.setupCallback();
    }

    static setup(callback) {
        UI.setupCallback = callback;
    }

    static append(element) {
        typeCheck.instance(UIElement, element);
        UI.elements[element.id] = element;
    }

    static remove(element) {
        if (!UI.elements[element.id])
            console.warn("Attempted to remove a non-existent UI element.");
        delete UI.elements[element.id];
    }

    static update(client) {
        for (var key in UI.elements) {
            UI.elements[key].update(client);
        }
    };

    static draw() {
        for (var key in UI.elements) {
            UI.elements[key].draw();
        }
    };
}
