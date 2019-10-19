import {typeCheck} from "../../shared/code/Debugging/CtypeCheck.js"
import R from "./Graphics/Renderer.js"
import {sqrt} from "../../shared/code/Math/CCustomMath.js";
import PacketBuffer from "./Networking/Client/PacketBuffer.js";

 class InputListener {
    constructor(client) {

        // Holds the current state of the key (up or down).
        this.keyStates = {};
        this.localKeys = {};

        // Holds callback functions for each key code.
        this.keyCallbacks = {};

        this.mouseCallbacks = {};
        this.mouseStates = {};

        this.mouse = {
            x: 0,
            y: 0,
            cosCenter: 0,
            sinCenter: 0,
        };

        this.buffer = [];
        this.pendingInputs = [];
        this.sequence = 0;

        this.listenTo(client);
        let input = {
            keyStates: this.keyStates,
            mouseData: this.mouse,
            mouseStates: this.mouseStates,
            sequence: this.sequence,
            pressTime: 400
        };
        this.objectInputKeys = ["keyStates", "mouseData", "mouseStates", "sequence", "pressTime"];
        client.setOutboundPacketData("input", input);

        this.packetBuffer = new PacketBuffer;
    }

    update(client) {
        var nowts = +new Date();
        var lastts = this.lastts || nowts;
        var dtsec = (nowts - lastts) / 1000.0;
        this.lastts = nowts;

        let input = {
            keyStates: this.keyStates,
            mouseData: this.mouse,
            mouseStates: this.mouseStates,
            sequence: this.sequence++,
            pressTime: 400
        };

        let pa = this.packetBuffer.export(this.objectInputKeys, input, client.clientEmitPacket.object.input);
        client.setOutboundPacketData("input", pa);
        //console.log(pa);


        this.mouse.world = {
            x: this.mouse.x - R.camera.displayPos.x,
            y: this.mouse.y - R.camera.displayPos.y,
        };
    }

    get pending() {
        return this.pendingInputs;
    }


    getReconKey(keyCode) {
        return this.keyStates[keyCode];
    }

    getLocalKey(keyCode) {
        return this.localKeys[keyCode];
    }

    getMouse(buttonCode) {
        return this.mouseStates[buttonCode];
    }




    // Set a callback function mapped to a key code.
    // Remember that one key code can have multiple
    // callbacks mapped to it, and they're all called
    // simultaneously.
    addKeyMapping(keyCode, callback) {
        typeCheck.primitive(0, keyCode);
        typeCheck.instance(Function, callback);
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
        if (!this.keyCallbacks.hasOwnProperty(keyCode)) return;

        event.preventDefault();
        const keyState = event.type === "keydown"; // Pressed = true, released = false
        this.localKeys[keyCode] = keyState;
        if (this.keyStates[keyCode] === keyState) return;

        if (keyState) this.keyStates[keyCode] = keyState;
        else delete this.keyStates[keyCode];
        for (var callback of this.keyCallbacks[keyCode]) {
            callback(keyState);
        }
    }

    addMouseMapping(mouseButton, callback) {
        typeCheck.primitive(0, mouseButton);
        typeCheck.instance(Function, callback);
        if (this.mouseCallbacks[mouseButton]) {
            this.mouseCallbacks[mouseButton].push(callback);
        } else {
            this.mouseCallbacks[mouseButton] = [callback];
        }
    }

    handleMouse(event) {
        const {which} = event;
        if (!this.mouseCallbacks.hasOwnProperty(which)) return;

        event.preventDefault();
        const mouseState = event.type === "mousedown"; // Pressed = true, released = false
        if (this.mouseStates[which] === mouseState) return;

        this.mouseStates[which] = mouseState;
        for (var callback of this.mouseCallbacks[which]) {
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
            this.mouse.x = Math.round(event.clientX * (R.screenSize.x / window.innerWidth));
            this.mouse.y = Math.round(event.clientY * (R.screenSize.y / window.innerHeight));

            var centerX = Math.round(R.screenSize.x / 2);
            var centerY = Math.round(R.screenSize.y / 2);

            var xx = this.mouse.x - centerX;
            var yy = this.mouse.y - centerY;
            var a = Math.atan2(yy, xx);

            this.mouse.sinCenter = Math.sin(a);
            this.mouse.cosCenter = Math.cos(a);
            this.mouse.angleCenter = a;

            this.mouse.world = {
                x: this.mouse.x - R.camera.displayPos.x,
                y: this.mouse.y - R.camera.displayPos.y,
            };



            /*
            console.log(
                Math.asin(this.mouse.sinCenter) * 180 / Math.PI,
                Math.acos(this.mouse.cosCenter) * 180 / Math.PI,
            );
            */

        });


        window.oncontextmenu = () => {
            return false;
        }
    }
}

export default InputListener;