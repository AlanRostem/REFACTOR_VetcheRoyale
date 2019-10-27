const ONMap = require("../../../../shared/code/DataStructures/SObjectNotationMap");

const INPUT_MAPPER = new class {
    constructor() {
        this.mouseMappings = new ONMap;
        this.keyMappings = new ONMap;

        this.addInputMapping("mouse", "modAbility", 3);
        this.addInputMapping("key", "modAbility", 87);
    }

    addInputMapping(inputType, mappingName, ...mappingCodes) {
        if (this[inputType + "Mappings"]) {
            if (!this[inputType + "Mappings"].has(mappingName)) {
                this[inputType + "Mappings"].set(mappingName, []);
            }
            this[inputType + "Mappings"].get(mappingName).push(...mappingCodes);
        }
    }

    getSinglePressMapping(inputType, mappingName, inputBridge) {
        if (this[inputType + "Mappings"]) {
            let mapping = this[inputType + "Mappings"];
            let states = inputBridge[inputType + "States"];
            if (states) {
                for (let inputState of mapping.get(mappingName)) {
                    switch (inputType) {
                        case "mouse":
                            if (inputBridge.singleMousePress(inputState)) return true;
                            break;
                        case "key":
                            if (inputBridge.singleKeyPress(inputState)) return true;
                            break;
                    }
                }
            }
        }
        return false;
    }


    getHeldDownMapping(inputType, mappingName, inputBridge) {
        if (this[inputType + "Mappings"]) {
            let mapping = this[inputType + "Mappings"];
            let states = inputBridge[inputType + "States"];
            if (states) {
                for (let inputState of mapping.get(mappingName)) {
                    switch (inputType) {
                        case "mouse":
                            if (inputBridge.mouseHeldDown(inputState)) return true;
                            break;
                        case "key":
                            if (inputBridge.keyHeldDown(inputState)) return true;
                            break;
                    }
                }
            }
        }
        return false;
    }

};

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

    singleMappingPress(mappingName) {
        return INPUT_MAPPER.getSinglePressMapping("key", mappingName, this)
            || INPUT_MAPPER.getSinglePressMapping("mouse", mappingName, this);
    }

    heldDownMapping(mappingName) {
        return INPUT_MAPPER.getHeldDownMapping("key", mappingName, this)
            || INPUT_MAPPER.getHeldDownMapping("mouse", mappingName, this);
    }

    set inputData(value) {
        this.mouseData = value.mouseData;
        this.keyStates = value.keyStates;
        this.mouseStates = value.mouseStates;
    }
}

module.exports = InputBridge;