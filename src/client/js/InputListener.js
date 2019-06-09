import typeCheck from "../../shared/Debugging/typeCheck.js"

export default class InputListener {
    constructor() {
        // Holds the current state of the key (up or down).
        this.keyStates = {};

        // Holds callback functions for each key code.
        this.keyCallbacks = {};

        this.listenTo();
    }

    // Set a callback function mapped to a key code.
    // Remember that one key code can have multiple
    // callbacks mapped to it, and they're all called
    // simultaneously.
    addMapping(keyCode, callback) {
        typeCheck.primitive(0, keyCode);
        typeCheck.object(Function, callback);
        if (this.keyCallbacks[keyCode]) {
            this.keyCallbacks[keyCode].push(callback);
        } else {
            this.keyCallbacks[keyCode] = [callback];
        }
    }

    // Sets the key state once per key press/release
    // and calls the respective callback function.
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
        for (var callback of this.keyCallbacks[keyCode]) {
            callback(keyState);
        }
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