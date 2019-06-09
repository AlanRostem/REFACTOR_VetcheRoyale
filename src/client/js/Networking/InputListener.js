import dataCheck from "../../../shared/Debugging/dataCheck.js"

export default class InputListener {
    constructor() {
        // Holds the current state of the key (up or down).
        this.keyStates = {};

        // Holds callback functions for each key code.
        this.keyCallbacks = {};

        this.listenTo();
    }

    addMapping(keyCode, callback) {
        dataCheck.primitive(0, keyCode);
        dataCheck.object(Function, callback);
        this.keyCallbacks[keyCode] = callback;
    }

    handleEvent(event) {
        const {keyCode} = event;
        if (!this.keyCallbacks.hasOwnProperty(keyCode)) {
            return;
        }
        event.preventDefault();
        const keyState = event.type === "keydown"; // Pressed = true, released = false
        if (this.keyStates[keyCode] === keyState) {
            return;
        }
        this.keyStates[keyCode] = keyState;
        this.keyCallbacks[keyCode](keyState);
    }

    listenTo() {
        window.addEventListener("keydown", event => {
            this.handleEvent(event);
        });

        window.addEventListener("keyup", event => {
            this.handleEvent(event);
        });
    }
}