import typeCheck from "../../../shared/code/Debugging/CtypeCheck.js";
import UIElement from "./UIElement.js";

const UI = {
    elements: {},
    setupCallback: () => {
        console.warn("No UI elements are set up!")
    },

    init() {
        UI.setupCallback();
    },

    setup(callback) {
        UI.setupCallback = callback;
    },

    append(element) {
        typeCheck.instance(UIElement, element);
        UI.elements[element.id] = element;
    },

    remove(element) {
        if (!UI.elements[element.id])
            console.warn("Attempted to remove a non-existent UI element.");
        delete UI.elements[element.id];
    },

    update(deltaTime, client, entityList) {
        for (var key in UI.elements) {
            UI.elements[key].update(deltaTime, client, entityList);
        }
    },

    draw() {
        for (var key in UI.elements) {
            UI.elements[key].draw();
        }
    },

    getElement(name) {
        return UI.elements[name];
    }
};

export default UI;