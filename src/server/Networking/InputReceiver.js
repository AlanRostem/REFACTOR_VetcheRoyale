// Composite class that retrieves input data
// the client emitted to the server.
class InputReceiver {
    constructor(client) {
        // Holds all key states of corresponding key codes
        this._keyStates = {};
        this._singlePressKeys = {};
        // Holds all mouse states of corresponding mouse button numbers
        this._mouseStates = {};
        this._singlePressMouseButtons = {};

        client.addClientUpdateListener("inputEvent", data => {
            const input = data.input;
            this._keyStates = input.keyStates;
            this._mouseStates = input.mouseStates;
            this._mouseData = input.mouseData;
            this.lastInputSeq = input.lastInputSeq;
        });
    }

    update(client) {
        this.processInput(client);
    }

    processInput(client) {
        client.setOutboundPacketData("lastServerInputSeq", this.lastInputSeq);
    }

    get mouseData() {
        return this._mouseData;
    }

    mouseHeldDown(button) {
        return this._mouseStates[button];
    }

    singleMousePress(button) {
        var mouseState;
        if (this._mouseStates[button]) {
            if (!this._singlePressMouseButtons[button]) {
                mouseState = true;
            }
            this._singlePressMouseButtons[button] = true;
        } else {
            this._singlePressMouseButtons[button] = false;
            mouseState = false;
        }
        return mouseState;
    }

    keyHeldDown(keyCode) {
        return this._keyStates[keyCode];
    }

    singleKeyPress(keyCode) {
        var keyState;
        if (this._keyStates[keyCode]) {
            if (!this._singlePressKeys[keyCode]) {
                keyState = true;
            }
            this._singlePressKeys[keyCode] = true;
        } else {
            this._singlePressKeys[keyCode] = false;
            keyState = false;
        }
        return keyState;
    }

    get keys() {
        return this._keyStates;
    }

    get mouseButtons() {
        return this._mouseStates;
    }
}

module.exports = InputReceiver;