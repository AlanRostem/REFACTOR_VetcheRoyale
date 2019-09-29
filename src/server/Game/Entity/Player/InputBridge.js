class InputBridge {
    constructor() {
        // Holds all key states of corresponding key codes
        this.keyStates = {};
        this.singlePressKeys = {};
        // Holds all mouse states of corresponding mouse button numbers
        this.mouseStates = {};
        this.mouseData = {};
        this.mouseData.sinCenter = 0;
        this.mouseData.cosCenter = 1;
        this.mouseData.angleCenter = 0;

        this.mouseData.world = {
            x: 0,
            y: 0
        };
        this.singlePressMouseButtons = {};
    }

    mouseHeldDown(button) {
        return this.mouseStates[button];
    }

    singleMousePress(button) {
        var mouseState;
        if (this.mouseStates[button]) {
            if (!this.singlePressMouseButtons[button]) {
                mouseState = true;
            }
            this.singlePressMouseButtons[button] = true;
        } else {
            this.singlePressMouseButtons[button] = false;
            mouseState = false;
        }
        return mouseState;
    }

    keyHeldDown(keyCode) {
        return this.keyStates[keyCode];
    }

    singleKeyPress(keyCode) {
        var keyState;
        if (this.keyStates[keyCode]) {
            if (!this.singlePressKeys[keyCode]) {
                keyState = true;
            }
            this.singlePressKeys[keyCode] = true;
        } else {
            this.singlePressKeys[keyCode] = false;
            keyState = false;
        }
        return keyState;
    }

    set inputData(value) {
        this.mouseData = value.mouseData;
        this.keyStates = value.keyStates;
        this.mouseStates = value.mouseStates;
    }
}

module.exports = InputBridge;