// Composite class that retrieves input data
// the client emitted to the server.

const PacketValidator = require("./PacketValidator.js");

const TICK_RATE = 40;

function validateInput(input) {
    // TODO:
    return Math.abs(input.pressTime) < 1 / TICK_RATE;
}

class InputReceiver {
    constructor(client) {
        // Holds all key states of corresponding key codes
        this.keyStates = {};
        this.singlePressKeys = {};
        // Holds all mouse states of corresponding mouse button numbers
        this.mouseStates = {};
        this.singlePressMouseButtons = {};
        this.serverRef = null;

        client.addClientUpdateListener("processInput", data => {
            if (PacketValidator.validateData(client, data.input, "object")) {
                const input = data.input;
                if (validateInput(input)) {
                    this.applyInput(input, client);
                    client.setOutboundPacketData(
                        "lastProcessedInputSequence", input.sequence);
                }
            }
        });
    }

    applyInput(input, client) {
        this.keyStates = input.keyStates;
        this.mouseStates = input.mouseStates;
        this.mouseData = input.mouseData;
        if (this.serverRef)
            this.serverRef.dataBridge.transferClientEvent("listenToInput", client.id, {
                mouseStates: this.mouseStates,
                mouseData: this.mouseData,
                keyStates: this.keyStates
            });
    }

    hasPressedKey() {
        return Object.values(this.keyStates).indexOf(true) > -1
    }

    update(client, server) {
        if (!this.serverRef) {
            this.serverRef = server;
        }
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

    get keys() {
        return this.keyStates;
    }

    get mouseButtons() {
        return this.mouseStates;
    }
}

module.exports = InputReceiver;