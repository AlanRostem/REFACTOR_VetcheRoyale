import {typeCheck} from "../../shared/code/Debugging/CtypeCheck.js"
import R from "./Graphics/Renderer.js"
import {sqrt} from "../../shared/code/Math/CCustomMath.js";

export default class InputListener {
    constructor(client) {

        // Holds the current state of the key (up or down).
        this._keyStates = {};
        this._localKeys = {};

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

        this._buffer = [];
        this._pendingInputs = [];
        this._allocatedCodes = [];
        this._sequence = 0;

        this.listenTo(client);
        let input = {
            keyStates: this._keyStates,
            mouseData: this._mouse,
            mouseStates: this._mouseStates,
            sequence: this._sequence,
        };
        client.setOutboundPacketData("input", input);
    }

    update(client) {
        var now_ts = +new Date();
        var last_ts = this.last_ts || now_ts;
        var dt_sec = (now_ts - last_ts) / 1000.0;
        this.last_ts = now_ts;

        let input = {
            keyStates: this._keyStates,
            mouseData: this._mouse,
            mouseStates: this._mouseStates,
            sequence: this._sequence++,
        };

        // TODO: Calculate press time for each of the
        // TODO: different input types (keys or mouse)
        if (this.getReconKey(68)) {
            input.pressTime = dt_sec;
        } else if (this.getReconKey(65)) {
            input.pressTime = -dt_sec;
        } else {
            return;
        }

        client.setOutboundPacketData("input", input);
        this._mouse.world = {
            x: this._mouse.x - R.camera.boundPos.x,
            y: this._mouse.y - R.camera.boundPos.y,
        };

        // TODO: CLIENT SIDE PREDICTION
        //client.player._output._pos._x += input.pressTime * 65;
        //client.player._pendingKeys = input.keyStates;
        //client.player._output._pos._x += client.player._localVel.x = Math.sign(input.pressTime);

        this._pendingInputs.push(input);

    }

    get pending() {
        return this._pendingInputs;
    }

    get mouse() {
        return this._mouse;
    }

    getReconKey(keyCode) {
        return this._keyStates[keyCode];
    }

    getLocalKey(keyCode) {
        return this._localKeys[keyCode];
    }

    getMouse(buttonCode) {
        return this._mouseStates[buttonCode];
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
    }


    // Sets the key state once per key press/release
    // and calls the respective callback function.
    handleEvent(event) {
        const {keyCode} = event;
        if (!this._keyCallbacks.hasOwnProperty(keyCode)) return;

        event.preventDefault();
        const keyState = event.type === "keydown"; // Pressed = true, released = false
        this._localKeys[keyCode] = keyState;
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