import {typeCheck} from "../../shared/code/Debugging/CtypeCheck.js"
import R from "./Graphics/Renderer.js"
import {sqrt} from "../../shared/code/Math/CCustomMath.js";

class InputBuffer {
    constructor(size = 30) {
        this._buffer = [];
        this._allocatedCodes = [];
        this._sequence = 0;
        this._size = size;
    }

    allocateKeyInput(keyCode) {
        if (!this._allocatedCodes.includes(keyCode)) {
            this._allocatedCodes.push(keyCode);
        }
    }

    popFront(count) {
        this._buffer.splice(0, count);
    }

    update(inputListener, client) {

        let tempBuffer = [];
        for (let key of this._allocatedCodes) {
            if (inputListener.getKey(key)) {
                tempBuffer.push(key);
            }
        }

        if (tempBuffer.length) {
            this._sequence++;

            let input = {
                inputs: tempBuffer,
                time: client.localTime,
                seq: this._sequence
            };

            this._buffer.push(input);
        }
    }

    processInput(client) {
        let ic = this._buffer.length;
        let buffer = this._buffer;
        if (ic) {
            for (let j = 0; j < ic; j++) {
                //don't process ones we already have simulated locally
                if (buffer[j].seq <= this.lastInputSeq) continue;

                let input = buffer[j].inputs;
                let c = input.length;
                for (var i = 0; i < c; ++i) {
                    let key = input[i];
                    switch (key) {
                        case 68: break; // Right
                        case 65: break; // Left
                        case 32: break; // Jump
                    }
                }
            }
        }

        //let resultVec =
        if (this._buffer.length) {
            this.lastInputSeq = buffer[ic - 1].seq;
        }
        //return resultVec
    }

    pushBack(input) {
        this._buffer.push(input);
    }

}

export default class InputListener {
    constructor(client) {
        this._inputBuffer = new InputBuffer();

        // Holds the current state of the key (up or down).
        this._keyStates = {};

        // Holds callback functions for each key code.
        this._keyCallbacks = {};

        this._mouseCallbacks = {};
        this._mouseStates = {};

        this._mouse = {
            x: 0,
            y: 0,
            cosCenter: 0,
            sinCenter: 0,
        };


        this.listenTo(client);
    }

    get mouse() {
        return this._mouse;
    }

    get buffer() {
        return this._inputBuffer;
    }

    getKey(keyCode) {
        return this._keyStates[keyCode];
    }

    getMouse(buttonCode) {
        return this._mouseStates[buttonCode];
    }


    update(client) {
        this._inputBuffer.update(this, client);
        client.setOutboundPacketData("input", {
            keyStates: this._keyStates,
            mouseData: this._mouse,
            mouseStates: this._mouseStates,
        });
    }

    // Set a callback function mapped to a key code.
    // Remember that one key code can have multiple
    // callbacks mapped to it, and they're all called
    // simultaneously.
    addKeyMapping(keyCode, callback) {
        typeCheck.primitive(0, keyCode);
        typeCheck.instance(Function, callback);
        if (this._keyCallbacks[keyCode]) {
            this._keyCallbacks[keyCode].push(callback);
        } else {
            this._keyCallbacks[keyCode] = [callback];
        }
        this._inputBuffer.allocateKeyInput(keyCode);
    }


    // Sets the key state once per key press/release
    // and calls the respective callback function.
    handleEvent(event) {
        const {keyCode} = event;
        if (!this._keyCallbacks.hasOwnProperty(keyCode)) return;

        event.preventDefault();
        const keyState = event.type === "keydown"; // Pressed = true, released = false
        if (this._keyStates[keyCode] === keyState) return;

        this._keyStates[keyCode] = keyState;
        for (var callback of this._keyCallbacks[keyCode]) {
            callback(keyState);
        }
    }

    addMouseMapping(mouseButton, callback) {
        typeCheck.primitive(0, mouseButton);
        typeCheck.instance(Function, callback);
        if (this._mouseCallbacks[mouseButton]) {
            this._mouseCallbacks[mouseButton].push(callback);
        } else {
            this._mouseCallbacks[mouseButton] = [callback];
        }
    }

    handleMouse(event) {
        const {which} = event;
        if (!this._mouseCallbacks.hasOwnProperty(which)) return;

        event.preventDefault();
        const mouseState = event.type === "mousedown"; // Pressed = true, released = false
        if (this._mouseStates[which] === mouseState) return;

        this._mouseStates[which] = mouseState;
        for (var callback of this._mouseCallbacks[which]) {
            callback(mouseState);
        }
    }

    listenTo(client) {
        window.addEventListener("keydown", event => {
            this.handleEvent(event);
        });

        window.addEventListener("keyup", event => {
            this.handleEvent(event);
        });

        window.addEventListener("mousedown", event => {
            this.handleMouse(event);
        });

        window.addEventListener("mouseup", event => {
            this.handleMouse(event);
        });

        window.addEventListener("mousemove", event => {
            this._mouse.x = Math.round(event.clientX * (R.screenSize.x / window.innerWidth));
            this._mouse.y = Math.round(event.clientY * (R.screenSize.y / window.innerHeight));

            var centerX = Math.round(R.screenSize.x / 2);
            var centerY = Math.round(R.screenSize.y / 2);

            var xx = this._mouse.x - centerX;
            var yy = this._mouse.y - centerY;
            var a = Math.atan2(yy, xx);

            this._mouse.sinCenter = Math.sin(a);
            this._mouse.cosCenter = Math.cos(a);
            this._mouse.angleCenter = a;

            this._mouse.world = {
                x: this._mouse.x - R.camera.boundPos.x,
                y: this._mouse.y - R.camera.boundPos.y,
            };


            /*
            console.log(
                Math.asin(this._mouse.sinCenter) * 180 / Math.PI,
                Math.acos(this._mouse.cosCenter) * 180 / Math.PI,
            );
            */

        });


        window.oncontextmenu = () => {
            return false;
        }
    }
}