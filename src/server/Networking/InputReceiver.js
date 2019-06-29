class InputReceiver {
    constructor(client) {
        // Holds all key states of corresponding key codes
        this._keyStates = {};
        this._singlePressKeys = {};
        // Holds all mouse states of corresponding mouse button numbers
        this._mouseStates = {};

        client.on("keyEvent", data => {
            this._keyStates[data.keyCode] = data.keyState;
        });

        client._socket.on("mouseEvent", data => {
            this._mouseStates[data.mouseButton] = data.mouseState;
        });

        client.on("mouseMoveEvent", data => {
            this._mouseData = data;
        });
    }

    get mouseData() {
        return this._mouseData;
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