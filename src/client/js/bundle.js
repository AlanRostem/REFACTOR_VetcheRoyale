(function () {
    'use strict';

    // Pass in a class/type and then a parameter that
    // is going to be checked. If the data type doesn't
    // match the correct ones an error is thrown.
    class typeCheck {
        // Pass in a class constructor to check if
        // the parameter is in the same instance.
        static instance(dataType, parameter) {
            if (!(parameter instanceof dataType)) {
                throw new DataTypeError(dataType);
            }
        }

        // TODO: Add a method to check an object's last class

        // Pass in a primitive data value and a parameter
        // to check if their data types match.
        static primitive(testValue, parameter) {
            if (typeof testValue !== typeof parameter || isNaN(parameter)) {
                throw new DataTypeError({name: typeof testValue});
            }
        }
    }

    class DataTypeError extends Error {
        constructor(dataType) {
            super("Data type mismatch, the corresponding type must be of instance " + dataType.name);
        }
    }

    // Contains math functions we create here
    function sqrt(x){
        var s, t;

        s = 1;  t = x;
        while (s < t) {
            s <<= 1;
            t >>= 1;
        }

        do {
            t = s;
            s = (x / s + s) >> 1;
        } while (s < t);

        return t;
    }

    Number.prototype.fixed = function(n) { n = n || 3; return parseFloat(this.toFixed(n)); };

    function linearInterpolation(p, n, t) {
        var _t = Number(t);
        _t = (Math.max(0, Math.min(1, _t))).fixed();
        return (p + _t * (n - p)).fixed();
    }

    function vectorLinearInterpolation(v, tv, t) {
        return {
            x: linearInterpolation(v.x, tv.x, t),
            y: linearInterpolation(v.y, tv.y, t)
        };
    }

    // 2D vector with mathematical methods
    class Vector2D {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }

        add(vec) {
            typeCheck.instance(Vector2D, vec);
            this.x += vec.x;
            this.y += vec.y;
        }

        set(vec) {
            typeCheck.instance(Vector2D, vec);
            this.x = vec.x;
            this.y = vec.y;
        }

        dot(vec) {
            typeCheck.instance(Vector2D, vec);
            return this.x * vec.x + this.y * vec.y;
        }

        scale(val) {
            typeCheck.instance(Vector2D, vec);
            this.x *= val;
            this.y *= val;
        }

        static distance(a, b) {
            var x = b.x - a.x;
            var y = b.y - a.y;
            return sqrt(x**2 + y**2);
        }

        static angle(a, b) {
            typeCheck.instance(Vector2D, a);
            typeCheck.instance(Vector2D, b);
            let x = b.x - a.x;
            let y = b.y - a.y;
            return Math.atan2(y, x)
        }

        static intersect(a, b, c, d)
        {
            typeCheck.instance(Vector2D, a);
            typeCheck.instance(Vector2D, b);
            typeCheck.instance(Vector2D, c);
            typeCheck.instance(Vector2D, d);

            const r = new Vector2D (b.x - a.x, b.y - a.y);
            const s = new Vector2D (d.x - c.x, d.y- c.y);

            var dd = r.x * s.y - r.y * s.x;
            var u = ((c.x - a.x) * r.y - (c.y - a.y) * r.x) / dd;
            var t = ((c.x - a.x) * s.y - (c.y - a.y) * s.x) / dd;
            return (0 < u && u < 1 && 0 < t && t < 1);
        }

        static getIntersectedPos(a, b, c, d)
        {
            typeCheck.instance(Vector2D, a);
            typeCheck.instance(Vector2D, b);
            typeCheck.instance(Vector2D, c);
            typeCheck.instance(Vector2D, d);

            const r = new Vector2D (b.x - a.x, b.y - a.y);
            const s = new Vector2D (d.x - c.x, d.y- c.y);

            var dd = r.x * s.y - r.y * s.x;
            var t = ((c.x - a.x) * s.y - (c.y - a.y) * s.x) / dd;
            return new Vector2D(a.x + t * r.x, a.y + t * r.y);
        }
    }

    // Better version of the stock JS Map.
    // Iteration of this object is way better
    // for performance and easier to use.

    class ObjectNotationMap {
        constructor(allocation = Infinity) {
            this._jsonContainer = {};
            this._arrayContainer = [];
            this._count = 0;
            this._limit = allocation;
        }

        set(key, item) {
            if (this._count < this._limit) {
                this._jsonContainer[key] = item;
                this._arrayContainer.push(item);
                this._count++;
            }
            return item;
        }

        get(key) {
            return this._jsonContainer[key];
        }

        has(key) {
            return this._jsonContainer.hasOwnProperty(key);
        }

        remove(key) {
            this._count--;
            this._arrayContainer.splice(this._arrayContainer.indexOf(this._jsonContainer[key]));
            delete this._jsonContainer[key];
        }

        indexOfKey(key) {
            return this._arrayContainer.indexOf(this._jsonContainer[key]);
        }

        indexOfValue(value) {
            return this._arrayContainer.indexOf(value);
        }

        get length() {
            return this._count;
        }

        get array() {
            return this._arrayContainer;
        }

        get object() {
            return this._jsonContainer;
        }

        clear() {
            delete this["_jsonContainer"];
            this._count = 0;
            this._jsonContainer = {};
            this._arrayContainer = [];
        }

        forEach(callback) {
            for (var key in this._jsonContainer) {
                callback(key, this._jsonContainer[key]);
            }
        }
    }

    /**
     * Camera object that holds the positional data of where to offset
     * the view.
     */
    class Camera {
        /**
         * @param offsetX {number} - Offset relative to the viewport position on the x-axis
         * @param offsetY {number} - Offset relative to the viewport position on the y-axis
         */
        constructor(offsetX, offsetY) {
            this.displayPos = new Vector2D(0, 0);
            this.pos = {
                x: -(this.displayPos.x - offsetX),
                y: -(this.displayPos.y - offsetY)
            };

            this.offset = {
                x: offsetX,
                y: offsetY,
            };

            this.originalOffset = {
                x: offsetX,
                y: offsetY,
            };
            this.shifting = {
                x: 0,
                y: 0,
            };
            this.follow = new Vector2D(0, 0);
            this.camConfigs = new ObjectNotationMap();
            this.camConfigs.set("followPlayer", true);
            this.camConfigs.set("followEM", false);
            this.isShifted = false;
        }

        /**
         * Map a camera boolean configuration to your custom liking
         * @param name {string} - Mapping name
         * @param boolean {boolean} - True of false
         */
        setConfig(name, boolean) {
            this.camConfigs.set(name, boolean);
        }

        /**
         * Retrieve a mapped configuration of the camera (e.g. follow player or other objects)
         * @param string {string} - Mapping name
         * @returns {boolean}
         */
        config(string) {
            return this.camConfigs.get(string);
        }

        /**
         * Set the current following positions (reference to the vector)
         * @param pos {Vector2D} - Reference to the 2D vector
         */
        setCurrentFollowPos(pos) {
            this.follow = pos;
        }

        update() {
            if (this.isShifted) {
                this.offset.x = this.shifting.x;
                this.offset.y = this.shifting.y;
            }
            this.displayPos.x = -Math.round(this.follow.x - this.offset.x);
            this.displayPos.y = -Math.round(this.follow.y - this.offset.y);
            this.offset.x = this.originalOffset.x;
            this.offset.y = this.originalOffset.y;
            this.isShifted = false;
        }

        /**
         * Shift the camera temporarily by some arbitrary value
         * @param x {number} - Offset on the x-axis
         * @param y {number} - Offset on the y-axis
         */
        shift(x, y) {
            this.shifting.x = this.originalOffset.x + x;
            this.shifting.y = this.originalOffset.y + y;
            this.isShifted = true;
        }

        /**
         * Get the bound x-axis position
         * @returns {number}
         */
        get x() {
            return this.displayPos.x;
        }

        /**
         * Get the bound y-axis position
         * @returns {number}
         */
        get y() {
            return this.displayPos.y;
        }

        set displayPos(vec2D) {
            typeCheck.instance(Vector2D, vec2D);
            this._displayPos = vec2D;
        }

        get displayPos() {
            return this._displayPos;
        }
    }

    /**
     * Main rendering object of the client side application
     * @namespace R
     * @memberOf ClientSide
     */
    const R = {

        /**
         * The main viewport of the renderer.
         */
        camera: new Camera(0, 0),

        resolution: 160,
        aspectRatio: {
            x: 2,
            y: 1
        },

        debugStrings: "",

        /**
         * Current screen size of the canvas
         */
        screenDimensions: {
            x: 2 * 160, //R.aspectRatio.x * R.resolution,
            y: 160 //R.aspectRatio.y * R.resolution
        },


        canvas: null,
        ctx: null,

        /**
         * Sets up an HTML canvas element and initializes rendering elements.
         */
        setup() {
            R.canvas = document.createElement('canvas');
            R.ctx = R.canvas.getContext('2d');

            document.body.appendChild(R.canvas);
            document.body.style.margin = 0;

            R.canvas.imageSmoothingEnabled = false;


            R.canvas.width = R.screenDimensions.x;
            R.canvas.height = R.screenDimensions.y;


            this.calibrateScreen();
            window.onresize = e => {
                this.calibrateScreen();
            };
        },

        debug(...args) {
            let string = "";
            for (let arg of args) {
                string += arg + " ";
            }
            R.debugStrings += string + "\n";
        },

        calibrateScreen() {
            R.aspectRatio.x = window.innerWidth / window.innerHeight;
            R.aspectRatio.y = 1;

            R.screenDimensions.x = Math.round(R.aspectRatio.x * R.resolution);
            R.screenDimensions.y = Math.round(R.aspectRatio.y * R.resolution);

            if (R.screenDimensions.x > 360) {
                R.screenDimensions.x = 320;
                R.screenDimensions.y = 160;
            }

            R.canvas.width = R.screenDimensions.x;
            R.canvas.height = R.screenDimensions.y;

            R.camera.originalOffset.x = R.screenDimensions.x / 2 | 0;
            R.camera.originalOffset.y = R.screenDimensions.y / 2 | 0;
        },

        /**
         * Get the canvas rendering context.
         * @returns {CanvasRenderingContext2D}
         */
        get context() {
            if (R.ctx === null) {
                throw new Error("Rendering context is not defined! Maybe you forgot to set up the renderer.");
            }
            return R.ctx;
        },


        get canvasElement() {
            if (R.canvas === null) {
                throw new Error("Canvas element is not defined! Maybe you forgot to set up the renderer.");
            }
            return R.canvas;
        },

        get WIDTH() {
            return R.screenDimensions.x;
        },

        get HEIGHT() {
            return R.screenDimensions.y;
        },

        get screenSize() {
            return R.screenDimensions;
        },

        /**
         * Clears the screen every frame
         */
        clear() {
            R.context.clearRect(0, 0, R.canvas.width, R.canvas.height);
        },


        /**
         * Draws text using our very own pixel font
         * @param str {string} - Text to be drawn
         * @param x {number} - X position
         * @param y {number} - Y position
         * @param color {string} - White, Red, Green, Blue and Yellow are supported
         * @param useCamera {boolean} - Determines if the text should be a part of the camera viewport
         */
        drawText(str, x, y, color = "White", useCamera = false, boundary = this.screenSize.x) {
            R.context.save();
            var img = AssetManager.get("font/ascii" + color + ".png");

            var newLine = 0;
            var newLetter = 0;

            if (!img)  return;
            str = str.toString();
            for (var i = 0; i < str.length; i++, newLetter++) {
                if(x+newLetter*5 > boundary){ newLetter = 0; newLine++; }
                if(str[i] === "\n") { newLetter = -1; newLine++;}
                else {
                    var asciiCode = (str[i].toUpperCase().charCodeAt(0)) - 32;
                    R.context.drawImage(img,
                        (asciiCode % 8 * 4),
                        ((asciiCode / 8) | 0) * 5,
                        4, 5,
                        Math.round(x + newLetter * 5 + (useCamera ? R.camera.x : 0)),
                        Math.round(y + newLine * 6 + (useCamera ? R.camera.y : 0)),
                        4, 5);
                }
            }
            R.context.restore();
        },

        /**
         * Draws a line on the screen
         * @param startPos {Vector2D} - Start position
         * @param endPos {Vector2D} - End position
         * @param thickness {number} - Stroke width of the line
         * @param color {string} - CSS Color value
         * @param dotSpace {number} - Number of pixels between each dot for a dotted line
         * @param useCamera {boolean} - Determines if the text should be a part of the camera viewport
         */
        drawLine(startPos, endPos, thickness = 1, color = "white", dotSpace = 1, useCamera = false) {
            var a = Vector2D.angle(startPos, endPos);
            var d = Vector2D.distance(startPos, endPos) | 0;
            R.context.fillStyle = color;
            for (var i = 0; i < d; i += dotSpace) {
                var x = startPos.x + i * -Math.cos(a);
                var y = startPos.y + i * -Math.sin(a);
                R.context.fillRect(
                    Math.round(x + (useCamera ? R.camera.pos.x : 0)),
                    Math.round(y + (useCamera ? R.camera.pos.y : 0)),
                    thickness, thickness);
            }
        },

        /**
         * Draws a rectangle on the screen
         * @param color {string} - CSS color value
         * @param x {number} - X position
         * @param y {number} - Y position
         * @param width {number} - Width of the rectangle
         * @param height {number} - Height of the rectangle
         * @param useCamera {boolean} - Determines if the rect should be a part of the camera viewport
         */
        drawRect(color, x, y, width, height, useCamera = false, ctx = R.context) {
            ctx.save();
            ctx.fillStyle = color;
            ctx.fillRect(
                Math.round(x + (useCamera ? R.camera.displayPos.x : 0)),
                Math.round(y + (useCamera ? R.camera.displayPos.y : 0)),
                width, height);
            ctx.restore();
        },

        drawDebug() {
            R.drawText(R.debugStrings, 5, 5, "Green");
            R.debugStrings = "";
        }
    };

    window.R = R;

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
            };
            client.setOutboundPacketData("input", input);
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
            };


            if (this.getReconKey(68)) {
                input.pressTime = dtsec;
            } else if (this.getReconKey(65)) {
                input.pressTime = -dtsec;
            } else {
                input.pressTime = -dtsec;
                // TODO: Recon shit
            }

            client.setOutboundPacketData("input", input);
            this.mouse.world = {
                x: this.mouse.x - R.camera.displayPos.x,
                y: this.mouse.y - R.camera.displayPos.y,
            };

            //client.player.output.pos.x += input.pressTime * 65;
            //client.player.pendingKeys = input.keyStates;
            //client.player.output.pos.x += client.player.localVel.x = Math.sign(input.pressTime);

            this.pendingInputs.push(input);

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

            this.keyStates[keyCode] = keyState;
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
            };
        }
    }

    /**
     * Singleton class managing assets by their file extension
     * @memberOf ClientSide

     */
    class AssetManager$1 {

        constructor() {
            this.successCount = 0;
            this.errorCount = 0;
            this.cache = {};
            this.downloadQueue = [];
            this.downloadCallbacks = [];
            this.onFileDownloadedCallbacks = new ObjectNotationMap;
            this.maxPool = 5;

            // Web Audio API context:
            this.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioCtx = new AudioContext();
        }

        /**
         * Map a callback function to a file path. The callback is executed when the particular file successfully loads
         * @param path {string} - File path to the mapped file
         * @param callback {function} - Callback when the particular file is loaded
         */
        mapFilePathCallback(path, callback) {
            this.onFileDownloadedCallbacks.set(path, callback);
        }

        /**
         * Loads (using fetch API) a .json file and parses it. The method returns pair with the json string and parsed object
         * @param path {string} - File path of the .json
         * @param loadedCallback {function} - Callback executed when successfully loading
         * @param failureCallback {function} - Callback executed when loading fails
         * @returns {{string: string, object: {}}}
         */
        loadJSON(path, loadedCallback, failureCallback) {
            var text = {string: "", object: {}};
            fetch(path)
                .then(resp => {
                    var json = resp.json();
                    text.string = JSON.stringify(json);
                    return json;
                })
                .then(data => {
                    text.object = data;
                    loadedCallback();
                });
            return text;
        }

        /**
         * Queues assets from an asset configuration file to load and execute loading callbacks.
         * @param path {string} - File path to the configuration file containing all file names relative to the public/assets directory
         */
        queue(path) {
            let rawFile = new XMLHttpRequest();
            var allText = "";
            const _this = this;
            rawFile.open("GET", path, true);
            rawFile.onreadystatechange = function () {
                switch (rawFile.readyState) {
                    case 0 : // UNINITIALIZED
                    case 1 : // LOADING
                    case 2 : // LOADED
                    case 3 : // INTERACTIVE
                        break;
                    case 4 : // COMPLETED
                        allText = rawFile.responseText;
                        var lines = allText.split('\n');
                        for (var i = 0; i < lines.length; i++) {
                            lines[i] = lines[i].replace('\r', '');
                            _this.downloadQueue.push(lines[i]);
                        }

                        _this.download(() => {
                            for (var fun of _this.downloadCallbacks) {
                                fun();
                            }
                            _this.downloadCallbacks = null;
                            console.log('%cThe program loaded in ' + (_this.successCount) + ' assets.', 'color: green; font-weight: bold;');
                            if (_this.errorCount > 0) console.error(_this.errorCount + " asset(s) failed to load.");
                        }, false);
                        break;
                    default:
                        alert("error");
                }
            };
            rawFile.send(null);
        }

        download(downloadCallback) {
            if (this.downloadQueue.length === 0) {
                downloadCallback();
            }

            for (var i = 0; i < this.downloadQueue.length; i++) {
                var path = this.downloadQueue[i];
                var type = path.substring(path.lastIndexOf(('.')) + 1);
                const _this = this;

                switch (type) {
                    case "ogg":
                        var audio = new Audio();
                        audio.testPath = path;
                        audio.addEventListener('canplaythrough', function () {
                            _this.successCount++;
                            if (_this.done()) {
                                downloadCallback();
                            }

                            if (_this.onFileDownloadedCallbacks.has(this.testPath)) {
                                _this.onFileDownloadedCallbacks.get(this.testPath)(this.cache);
                                _this.onFileDownloadedCallbacks.remove(this.testPath);
                            }
                        }, false);

                        audio.addEventListener("error", function () {
                            _this.errorCount++;
                            if (_this.done()) {
                                downloadCallback();
                            }
                        }, false);

                        audio.src = "public/assets/audio/" + path;
                        this.cache[path] = audio;
                        break;
                    case "oggp":
                        path = path.slice(0, -1);
                        var cachePath = path + 'p';
                        this.cache[cachePath] = [];
                        var downloadAudio = new Audio();
                        downloadAudio.addEventListener('canplaythrough', function () {
                            _this.successCount++;
                            if (_this.done()) {
                                downloadCallback();
                            }

                            if (_this.onFileDownloadedCallbacks.has(this.testPath)) {
                                _this.onFileDownloadedCallbacks.get(this.testPath)(this.cache);
                                _this.onFileDownloadedCallbacks.remove(this.testPath);
                            }
                        }, false);

                        downloadAudio.addEventListener("error", function () {
                            _this.errorCount++;
                            if (_this.done()) {
                                downloadCallback();
                            }
                        }, false);

                        downloadAudio.src = "public/assets/audio/" + path;

                        /*for (var p = 0; p < _this.maxPool; p++) {
                            var audioPool = new Audio();
                            audioPool.src = downloadAudio.src;
                            this.cache[cachePath][p] = audioPool;
                        }*/
                        this.cache[cachePath] = downloadAudio;

                        break;
                    case "oggSE":
                           path = path.slice(0, -2);
                           let request = new XMLHttpRequest();
                           request.open("GET", "public/assets/audio/" + path, true);
                           request.responseType = "arraybuffer";
                           request.audioPath = path + "SE";
                           request.onload = () => {
                               _this.audioCtx.decodeAudioData(request.response, buffer => {
                                   _this.cache[request.audioPath] = buffer;
                                   console.log("Loaded!", buffer);
                               }, () => console.log("Audio loading error!"));

                               _this.successCount++;
                               if (_this.done()) {
                                   downloadCallback();
                               }

                               if (_this.onFileDownloadedCallbacks.has(this.testPath)) {
                                   _this.onFileDownloadedCallbacks.get(this.testPath)(this.cache);
                                   _this.onFileDownloadedCallbacks.remove(this.testPath);
                               }
                           };
                           request.send();
                        break;
                    case "png":
                        var img = new Image();
                        img.testPath = path;
                        img.addEventListener("load", function () {
                            _this.successCount++;
                            if (_this.done()) {
                                downloadCallback();
                            }

                            if (_this.onFileDownloadedCallbacks.has(this.testPath)) {
                                _this.onFileDownloadedCallbacks.get(this.testPath)(this.cache);
                                _this.onFileDownloadedCallbacks.remove(this.testPath);
                            }
                        }, false);
                        img.addEventListener("error", function () {
                            _this.errorCount++;
                            if (_this.done()) {
                                downloadCallback();
                            }
                        }, false);
                        img.src = "public/assets/img/" + path;
                        this.cache[path] = img;
                        break;
                    case "json":
                        var txt = _this.loadJSON("shared/res/" + path, () => {
                            _this.successCount++;
                            if (_this.done()) {
                                downloadCallback();
                            }
                            if (_this.onFileDownloadedCallbacks.has(this.testPath)) {
                                _this.onFileDownloadedCallbacks.get(this.testPath)(this.cache);
                                _this.onFileDownloadedCallbacks.remove(this.testPath);
                            }
                        }, () => {
                            _this.errorCount++;
                            if (_this.done()) {
                                downloadCallback();
                            }
                        });
                        txt.testPath = path;
                        this.cache[path] = txt;
                        break;
                    default:
                        window.alert("FILENAME ERROR");
                        break;
                }
            }
        }

        done() {
            return (this.downloadQueue.length === this.successCount + this.errorCount);
        }

        /**
         * Retrieve an asset (DOM object) from the cache
         * @param path {string} - Relative file path
         * @returns {object}
         */
        get(path) {
            if (this.cache[path] === undefined) console.warn("Resource not loaded yet: (" + path + "), or check if in cfg file!");
            else if (path.substring(path.lastIndexOf(('.')) + 1 === "oggp")) ;
            return this.cache[path];
        }

        addPainting(img, key) {
            this.cache[key] = img;
        }

        /**
         * Add a callback function to the queue when all assets are downloaded in the queue
         * @param callback {function} - Callback function
         */
        addDownloadCallback(callback) {
            this.downloadCallbacks.push(callback);
        }
    }

    const assMan = new AssetManager$1();

    class SoundEffect {
        constructor(src, objPos, canPlay = true) {
            this.src = src;
          //  this.volume = volume;
            this.objPos = objPos;

            this.canPlay = canPlay;
            this.isEnded = false;

            this.gainNode = assMan.audioCtx.createGain();

            this.pannerOptions = { pan: 0 };
            this.panner = new StereoPannerNode(assMan.audioCtx, this.pannerOptions);
        }

        play() {
            if (assMan.audioCtx.state === 'suspended') assMan.audioCtx.resume();

            if(this.canPlay) {
                this.source = assMan.audioCtx.createBufferSource();
                this.source.onended = () => {
                    this.isEnded = true;
                };

                this.source.buffer = assMan.get(this.src);
                this.source.connect(this.gainNode).connect(this.panner).connect(assMan.audioCtx.destination);
                this.source.start(0);
                this.canPlay = false;
            }
        }

        stop(src) {
            this.source.disconnect();
        }

        findPan(){
           // this.panner.pan.value = -Math.cos(Math.atan2(- R.camera.y + R.camera.offset.y - this.objPos.y,  - R.camera.x + R.camera.offset.x - this.objPos.x));
            this.panner.pan.value =  - ( - R.camera.x + R.camera.offset.x - this.objPos.x) / R.screenSize.x * 2;
            if(this.panner.pan.value > 1) this.panner.pan.value = 1;
            if(this.panner.pan.value < -1) this.panner.pan.value = -1;
            this.gainNode.gain.value < 0 ?  this.gainNode.gain.value = 0 : this.gainNode.gain.value = 1 - Vector2D.distance(this.objPos, R.camera.follow)/200;
            //console.log(Math.atan2(R.camera.y + R.camera.offset.y - this.objPos.y,  R.camera.x + R.camera.offset.x - (this.objPos.x | 0)), - R.camera.x + R.camera.offset.x, this.objPos.x);
            //console.log(this.panner.pan.value);
           // console.log(Math.atan2(this.objPos.y - R.camera.offset.y,  this.objPos.x - R.camera.offset.x));
      //      this.panner.pan.value < 1 ?  this.panner.pan.value+=0.05 : this.panner.pan.value = -1;
        }
    }

    class AudioPool {
        constructor() {
            this.maxInstance = 10;
            this.SFXrefs = {};

        }

        play(src, objPos, canPlay) {
            if (this.SFXrefs[src] === undefined) {
                let sound = new SoundEffect(src, objPos, canPlay);
                sound.play();
                this.SFXrefs[src] = sound;
                return sound;
            } else this.SFXrefs[src].objPos = objPos;

        }

        updatePos(src) {
            this.SFXrefs[src].objPos = objPos;
        }

        stop(src)
        {
            if(this.SFXrefs[src]!==undefined) {
                this.SFXrefs[src].stop(src);
                delete this.SFXrefs[src];
            }
        }

        update() {
            for (let key in this.SFXrefs) {
                this.SFXrefs[key].findPan();
                if (this.SFXrefs[key].isEnded)
                {
                    this.SFXrefs[key].stop();
                    delete this.SFXrefs[key];
                }
            }
        }
    }

    var AudioPool$1 = new AudioPool();

    /**
     * Class representation of a sprite sheet. Has many features such as cropping and animating.
     * @memberOf ClientSide

     */
    class SpriteSheet {
        /**
         * @param src {string} - Relative file path of the sprite sheet retrieved by AssetManager
         * @see AssetManager
         */
        constructor(src) {
            this.src = src;
            assMan.addDownloadCallback(() => {
                this.img = assMan.get(this.src);
            });
            /**
             * Map of rectangles representing sprite regions
             * @type {Map<string, SpriteSheet.Rect>}
             */
            this.offsetRects = new Map();
            this.posRect = new SpriteSheet.Rect(0, 0, 0, 0);
            this.animRect = new SpriteSheet.Rect(0, 0, 1, 1);
            this.offsetTileRect = new SpriteSheet.Rect(0, 0, 0, 0);
            this.centralOffset = 0;
        }

        /**
         * Map a name to a bounding rect on the sprite.
         * @param name {string} - Mapping name
         * @param ox {number} - Horizontal offset starting from top-left corner of the sprite
         * @param oy {number} - Vertical offset starting from top-left corner of the sprite
         * @param fw {number} - Frame width of the given sprite region
         * @param fh {number} - Frame height of the given sprite region
         */
        bind(name, ox, oy, fw, fh) {
            assMan.addDownloadCallback(() => {
                this.offsetRects.set(name, new SpriteSheet.Rect(ox, oy, fw, fh));
            });
        }

        /**
         * Manually crop the image and draw it. Called in a draw loop.
         * @param x {number} - Output position x
         * @param y {number} - Output position y
         * @param w {number} - Output position width
         * @param h {number} - Output position height
         * @param cropX {number} - Cropping value on the sprite
         * @param cropY {number} - Cropping value on the sprite
         * @param cropW {number} - Cropping value on the sprite
         * @param cropH {number} - Cropping value on the sprite
         * @param ctx {CanvasRenderingContext2D} - Default parameter to R.context. Can be overridden to draw on different canvases
         */
        drawCropped(cropX, cropY, cropW, cropH, x, y, w, h, ctx = R.context) {
            if (this.img) {
                if (w === 0 || h === 0 || cropW === 0 || cropH === 0) return;
                ctx.drawImage(this.img, cropX, cropY, cropW, cropH,
                    Math.round(x),
                    Math.round(y),
                    Math.round(w),
                    Math.round(h));
            }
        }

        /**
         * Draw a mapped part of the sprite that was bound by the bind() method
         * @param name {string} - Mapped bounding rect name
         * @param w {number} - Default parameter of frame width of the mapped portion
         * @param h {number} - Default parameter of frame height of the mapped portion
         * @param ctx {CanvasRenderingContext2D} - Default parameter to R.context. Can be overridden to draw on different canvases
         */
        drawStill(name, x, y, w = this.offsetRects.get(name).w, h = this.offsetRects.get(name).h, ctx = R.context) {
            if (this.img) {
                var rect = this.offsetRects.get(name);
                ctx.drawImage(this.img, rect.x, rect.y, rect.w, rect.h, Math.round(x), Math.round(y), w, h);
            }
        }

        /**
         * Retrieve the frame width in pixels of a bound sprite region
         * @param name {string} - Sprite region name
         * @returns {number}
         */
        getWidth(name) {
            return this.offsetRects.get(name).w;
        }

        /**
         * Retrieve the frame height in pixels of a bound sprite region
         * @param name {string} - Sprite region name
         * @returns {number}
         */
        getHeight(name) {
            return this.offsetRects.get(name).h;
        }

        /**
         * Call in a loop and it will cycle through all the respective animation frames.
         * In order for the animation to work properly it MUST call on an individual Animation
         * instance that belongs to an individual entity. This method must also be called BEFORE
         * the drawAnimated() method of the static SpriteSheet object.
         * @param name {string} - Respective sprite region mapping name
         * @param anim {Animation} - Instance of animation belonging to an instance of CEntity
         * @param fw {number} - Frame width of the sprite region
         * @param fh {number} - Frame height of the sprite region
         */
        animate(name, anim, fw, fh) {
            if (!this.offsetRects.get(name)) return;

            var deltaTime = Scene.deltaTime;

            if (!anim.paused) {
                if ((anim.passedTime += deltaTime) >= anim.frameSpeed) {
                    if (anim.currentCol < anim.endCol) {
                        anim.currentCol++;
                    } else {
                        anim.currentCol = anim.startCol;
                    }
                    anim.passedTime = 0;
                }
            }

            var width = fw;
            var height = fh;

            this.animRect.w = width;
            this.animRect.h = height;

            this.animRect.x = this.offsetRects.get(name).x + width * (anim.currentCol % anim.framesPerRow | 0);
            this.animRect.y = this.offsetRects.get(name).y + height * (anim.currentCol / anim.framesPerRow | 0);
        }

        /**
         * Calls upon R.context.save()
         */
        static beginChanges() {
            R.context.save();
        }

        /**
         * Calls upon R.context.restore()
         */
        static end() {
            R.context.restore();
        }

        /**
         * Sets the default central draw offset on the x-axis
         * @param value {number} - Pixel amount
         */
        setCentralOffset(value) {
            this.centralOffset = value;
        }

        /**
         * Flips the currently drawn sprite in a draw loop
         */
        flipX() {
            this.flipped = true;
        }

        /**
         * Call in a loop after calling this.animate to draw the cycling frames of the animation.
         * @param x {number} - Horizontal screen position
         * @param y {number} - Vertical screen position
         * @param w {number} - Output width of the sprite (defaults to the animation width)
         * @param h {number} - Output height of the sprite (defaults to the animation height)
         */
        drawAnimated(x, y, w = this.animRect.w, h = this.animRect.h) {
            if (!this.img) return;

            var rect = this.animRect;

            // FireFox compatibility sake
            if (rect.w === 0 || rect.h === 0) {
                this.flipped = false;
                return;
            }

            if (this.flipped) {
                R.context.translate(x - this.centralOffset, y - this.centralOffset);
                R.context.scale(-1, 1);
            }

            R.context.drawImage(this.img,
                rect.x, rect.y, rect.w, rect.h,
                Math.round(!this.flipped ? x - this.centralOffset : -w + this.centralOffset / 2),
                Math.round(!this.flipped ? y - this.centralOffset : 0),
                w, h);

            this.flipped = false;
        }
    }

    SpriteSheet.Rect = class {
        constructor(x, y, w, h) {
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;
        }

        setPos(x, y) {
            this.x = x;
            this.y = y;
        }
    };

    /**
     * Static interface for configuring different sprite animations
     * @type {SpriteSheet.Animation}
     */
    SpriteSheet.Animation = class Animation {
        /**
         *
         * @param startCol {number} - Start column relative to the mapped sprite region position
         * @param endCol {number} - End column relative to the mapped sprite region position
         * @param framesPerRow {number} - Number of frames per row if the animation has multiple rows relative to the mapped region
         * @param frameSpeed {number} - Frame speed in seconds
         */
        constructor(startCol, endCol, framesPerRow, frameSpeed) {
            this.startCol = startCol;
            this.endCol = endCol;
            this.framesPerRow = framesPerRow;
            this.frameSpeed = frameSpeed;

            this.currentCol = this.startCol;
            this.passedTime = 0;
            this.reversed = false;
            this.paused = false;
            this.centralOffset = 0;
        }
    };

    /**
     * An abstract class for UI elements
     */
    class UIElement {
        /**
         *
         * @param name {string} - A string for the name of the UI element
         * @param x {int} - x position of the UI element
         * @param y {int} - y position of the UI element
         * @param w {int} - width of the UI element
         * @param h {int} - height of the UI element
         */
        constructor(name, x, y, w, h) {
            this.pos = new Vector2D(x, y);
            this.width = w;
            this.height = h;
            this.id = name;

        }

        /**
         *
         * @param deltaTime {int} - Deltatime between ticks
         * @param client {Client} - The client
         * @param entityList {EntityManager} - List of entities
         */
        update(deltaTime, client, entityList) {

        }

        /**
         *
         */
        draw() {

        }
    }

    UIElement.defaultSpriteSheet = new SpriteSheet("ui/ui.png");

    const UI = {
        elements: {},
        setupCallback: () => {
            console.warn("No UI elements are set up!");
        },

        init() {
            UI.setupCallback();
        },

        setup(callback) {
            UI.setupCallback = callback;
        },

        append(element) {
            typeCheck.instance(UIElement, element);
            UI.elements[element.id] = element;
        },

        remove(element) {
            if (!UI.elements[element.id])
                console.warn("Attempted to remove a non-existent UI element.");
            delete UI.elements[element.id];
        },

        update(deltaTime, client, entityList) {
            for (var key in UI.elements) {
                UI.elements[key].update(deltaTime, client, entityList);
            }
        },

        draw() {
            for (var key in UI.elements) {
                UI.elements[key].draw();
            }
        },

        getElement(name) {
            return UI.elements[name];
        }
    };

    // Object that calls a provided function every
    // x seconds.
    class Timer {
        constructor(time, callback, loop = true) {
            this._maxTime = time;
            this._currentTime = 0;
            this._callback = callback;
            this._completed = false;
            this._loop = loop;
        }

        tick(deltaTime) {
            this._currentTime += deltaTime;
            if (this._currentTime >= this._maxTime) {
                if (!this._completed) {
                    this._callback();
                    this._currentTime = 0;
                    this._completed = !this._loop;
                }
            }
        }

        reset() {
            this._completed = false;
        }
    }

    class CGameEvent {

        constructor(e) {
            this.id = e.id;
            this.type = e.type;
            this.color = e.color;
            this.arg = e.arg;
            this.dead = false;
            this.life = new Timer(e.life, () => {
                this.dead = true;
            });
        }

        update(delaTime){
            this.life.tick(delaTime);
        }

        getEvent(){
            return this;
        }
    }

    //TODO:: Make it easier to add Objects that need events
    class CEventManager {
        constructor() {
            this.events = [];
            this.eventID = [];
            this.eventReceiver = {};
        }

        SGetEvent(client) {
            if (client.inboundPacket) {
                let evs = [];
                if (client.player)
                    if (client.player.output)
                        if (client.player.output._gameData)
                            if (client.player.output._gameData["Event"]) {
                                evs = client.player.output._gameData["Event"];
                                for (let e of evs) {
                                    let event = new CGameEvent(e);
                                    if (event && !this.eventID.includes(event.id)) {
                                        if (e.priority) {
                                            this.events.unshift(event);
                                            this.eventID.unshift(event.id);
                                        } else {
                                            this.events.push(event);
                                            this.eventID.push(event.id);
                                        }
                                    }
                                }
                            }
                if (client.inboundPacket.gameData)
                    if (client.inboundPacket.gameData["Event"] !== undefined) {
                        evs = client.inboundPacket["gameData"]["Event"];
                        for (let e of evs) {
                            let event = new CGameEvent(e);
                            if (event && !this.eventID.includes(event.id)) {
                                if (e.priority) {
                                    this.events.unshift(event);
                                    this.eventID.unshift(event.id);
                                } else {
                                    this.events.push(event);
                                    this.eventID.push(event.id);
                                }
                            }
                        }
                    }
            }
        }

        addEventReceiver(key, obj, callback) {
            this.eventReceiver[key] = {obj: obj, callback: callback};
        }


        distributeEvent() {
            for (let key in this.eventReceiver) {
                let e = this.events.filter((ev) => {
                    return this.eventReceiver[key].callback(ev) &&
                        (ev.type === "all" || ev.type.includes(key));
                });
                if (e) this.eventReceiver[key].obj.addEvent(e);
            }
        }

        update(client, delaTime) {
            this.SGetEvent(client);
            this.distributeEvent();
            for (var e = 0; e < this.events.length; e++) {
                this.events[e].update(delaTime);
                if (this.events[e].dead) {
                    this.eventID.splice(e, 1);
                    this.events.splice(e, 1);
                }
            }
        }
    }

    /**
     *
     */
    class MiniMap extends UIElement {
        constructor() {
            super("minimap", R.WIDTH - 36, 4, 1, 1);
            this.pPos = {x: 0, y: 0};
            this.tiles = {small: 32, big: 120};
            this.mapSize = "small";
            this.events = [];
            assMan.addDownloadCallback(() => {
                for (var key in Scene.tileMaps.getAllMaps()) {
                    var tileMap = Scene.tileMaps.getAllMaps()[key];
                    assMan.addPainting(this.paintImage(tileMap), tileMap.name);
                }
            });

            Scene.clientRef.inputListener.addKeyMapping(70, (keyState) => {
                if (keyState) this.mapSize = "big";
                else this.mapSize = "small";
            });

            Scene.eventManager.addEventReceiver(this.id, this, (ev) => {
                return ev.arg.hasOwnProperty('pos')
            });
        }


        /**
         *
         * @param tileMap {tileMap}
         * @returns {{mapInfo: {tileSizeH: number, tileSizeW: number, array: Array, name: *}, canvas: HTMLCanvasElement}}
         */
        paintImage(tileMap) {

            var obj = {
                small: {},
                big: {}
            };

            for (var key in obj) {
                obj[key].canvas = document.createElement('canvas');
                var ctx = obj[key].canvas.getContext('2d');

                obj[key].canvas.width = this.tiles[key] * 8;
                obj[key].canvas.height = this.tiles[key] * 8;

                obj[key].mapInfo = {
                    name: tileMap.name,
                    array: [],
                    tileSizeW: (tileMap.w / this.tiles[key]),
                    tileSizeH: (tileMap.h / this.tiles[key])
                };

                for (var k = 0; k < this.tiles[key]; k++) {
                    obj[key].mapInfo.array.push(new Array(this.tiles[key]).fill(0));
                }

                for (var i = 0; i < tileMap.h; i++) {
                    for (var j = 0; j < tileMap.w; j++) {
                        if (tileMap.isSolid(tileMap.array[i * tileMap.w + j])) {
                            obj[key].mapInfo.array
                                [i / obj[key].mapInfo.tileSizeH | 0]
                                [j / obj[key].mapInfo.tileSizeW | 0] += 1;
                        }
                    }
                }

                for (var y = 0; y < this.tiles[key]; y++) {
                    for (var x = 0; x < this.tiles[key]; x++) {
                        let color = "#ffffff";
                        if (obj[key].mapInfo.array[y][x] >=
                            Math.floor(obj[key].mapInfo.tileSizeW) *
                            Math.floor(obj[key].mapInfo.tileSizeH))
                            color = "#222034";
                        R.drawRect(color,
                            this.width * x,
                            this.height * y,
                            this.width, this.height,
                            false, ctx);
                    }
                }
            }
            return obj;
        }


        addEvent(e) {
            this.events = e;
        }


        posOnMap(pos) {

            var x = pos.x / 8 / this.image[this.mapSize].mapInfo.tileSizeW * this.width | 0;
            var y = pos.y / 8 / this.image[this.mapSize].mapInfo.tileSizeH * this.height | 0;

            return {x: x, y: y};
        }


        update(deltaTime, client, entityList) {
            //this.pos.set(new Vector2D(R.WIDTH - this.tiles[this.mapSize] - 4, 4));
            //this.mapSize = "small";

            if (this.mapSize === "small")
                this.pos.set(new Vector2D(R.screenSize.x - this.tiles[this.mapSize] - 4, 4));

            else
                this.pos.set(new Vector2D((R.screenSize.x - this.tiles[this.mapSize]) / 2, (R.screenSize.y - this.tiles[this.mapSize]) / 2));


            if (this.image === undefined
                || this.image[this.mapSize].mapInfo.name !== Scene.currentMap)
                this.image = assMan.get(Scene.currentMap);


            if (client.player)
                this.pPos = this.posOnMap(client.player.output.pos);
        }

        draw() {
            R.ctx.drawImage(
                this.image[this.mapSize].canvas,
                this.pos.x | 0,
                this.pos.y | 0,
                this.tiles[this.mapSize] * 8,
                this.tiles[this.mapSize] * 8
            );

            for (var e of this.events) {
                R.drawRect(
                    e.color,
                    this.pos.x + this.posOnMap(e.arg.pos).x | 0,
                    this.pos.y + this.posOnMap(e.arg.pos).y | 0,
                    1,
                    1
                );
            }

            R.drawRect(
                "Red",
                this.pos.x + this.pPos.x,
                this.pos.y + this.pPos.y,
                1,
                1
            );
        }
    }

    class KelvinBar extends UIElement {
        constructor() {
            super("kelvinbar", 0, 0, 32, 32);
            this.src = AssetManager.get("ui/KelvinBar.png");

            this.color = "Cyan";

            this.fullImage = AssetManager.get("ui/KelvinBar.png");

            this.glassTube = new Vector2D(22, 64);
            this.liquidFill = new Vector2D(4, 40);
            this.liquidTop = new Vector2D(4, 4);
            this.liquidTopCut = new Vector2D(0, 0);

            this.charge = 0;

            this.equippedGunID = -1;
            this.hasWeapon = false;

            this.animation = new SpriteSheet.Animation(0, 4, 5, 0.15);

            UIElement.defaultSpriteSheet.bind("liquidTop", 26, 128, 4, 8);
        }

        update(deltaTime, client, entityList) {

            if (client.player) {
                var gun = entityList.getEntityByID(client.player.output.invWeaponID);
                if (gun) {
                    this.charge = gun.output.superChargeData;

                    if (this.charge > 18) {
                        this.liquidTop.x = 4;
                        this.liquidTop.y = 8;
                        this.liquidTopCut.x = 0;
                        this.liquidTopCut.y = 4;

                    } else {
                        this.liquidTop.x = 4;
                        this.liquidTop.y = 4;
                        this.liquidTopCut.x = 0;
                        this.liquidTopCut.y = 0;
                    }
                    this.hasWeapon = true;
                } else {
                    this.charge = 0;
                    this.hasWeapon = false;
                }

                //this.hasWeapon = !(ClientEntity.getEntity(this.equippedGunID) === undefined || !ClientEntity.getEntity(this.equippedGunID).boundToPlayer);


                /*
                        this.pos.x = R.WIDTH - 33;
                        if (client.keys) {
                            if (client.keys[77]) {
                                if (!client.onePressKeys[77]) {
                                    this.toggle = !this.toggle;
                                    client.activateOnePressKey(77);
                                }
                            } else {
                                client.resetOnePressKey(77);
                            }
                        }
                        this.updateEvent();*/

            }
        }

        draw() {
            //console.warn("meh");
            //var gun = ClientEntity.getEntity(this.equippedGunID);
            if(this.hasWeapon) {

            R.ctx.save();

            var diff = this.liquidFill.y * this.charge / 100 | 0;

            // Draw Glass Tube
                UIElement.defaultSpriteSheet.drawCropped(
                    0,
                    124,
                    this.glassTube.x,
                    this.glassTube.y,
                    R.WIDTH - this.glassTube.x - 4 | 0,
                    R.HEIGHT - this.glassTube.y - 4 | 0,
                    this.glassTube.x,
                    this.glassTube.y);

            if (diff === 0) {
                return;
            }

            // Liquid Inside
            R.ctx.drawImage(this.src,
                this.glassTube.x,
                this.liquidFill.y - diff,
                this.liquidFill.x,
                diff,
                R.WIDTH - this.glassTube.x / 2 - this.liquidFill.x / 2 - 4 | 0,
                R.HEIGHT - 6 - diff,
                4,
                diff);
            // Liquid Top
                UIElement.defaultSpriteSheet.animate("liquidTop", this.animation, 4, 8);
                UIElement.defaultSpriteSheet.drawAnimated(
                    R.WIDTH - this.glassTube.x / 2 - this.liquidTop.x / 2 - 4 | 0,
                    R.HEIGHT - 9 - diff,
                    this.liquidTop.x,
                    this.liquidTop.y);
           // R.ctx.drawImage(this.src, this.glassTube.x + this.liquidFill.x + this.liquidTopCut.x, this.liquidTopCut.y, this.liquidTop.x, this.liquidTop.y, R.WIDTH - this.glassTube.x / 2 - this.liquidTop.x / 2 - 4 | 0, R.HEIGHT - 9 - diff, this.liquidTop.x, this.liquidTop.y);
            R.ctx.restore();
            }
        }

    }

    class CrossHair extends UIElement {
        constructor(id = "crosshair") {
            super(id, 0, 0, 1, 1);
            this.gap = 5;
            this.color = "lime";
        }

        update(deltaTime, client, entityList) {
            this.pos.x = client.input.mouse.x;
            this.pos.y = client.input.mouse.y;
            if (client.player) {
                let weapon = entityList.getEntityByID(client.player.getRealtimeProperty("invWeaponID"));
                if (weapon) {
                    this.gap = Math.floor(weapon.getRealtimeProperty("spreadAngle") * 25);
                }
            }
        }

        draw() {
            R.ctx.save();

            var gap = this.gap;

            for (var y = -1; y < 2; y += 2) {
                for (var x = -1; x < 2; x += 2) {
                    var xx = (this.pos.x + x * (gap | 0)) | 0;
                    var yy = (this.pos.y + y * (gap | 0)) | 0;
                    //R.ctx.fillRect(xx, yy, 1,  1);

                    R.drawRect(this.color, xx - x, yy, 1, 1);
                    R.drawRect(this.color, xx, yy - y, 1, 1);
                }
            }
            R.drawRect(this.color, this.pos.x, this.pos.y, 1, 1);

            R.ctx.restore();
        }
    }

    class HPBar extends UIElement {
        constructor() {
            super("hpbar", 0, 0, 32, 32);
            this.src = AssetManager.get("ui/ui.png");

            this.glassTube = new Vector2D(54, 12); // Old 80 and 76
            this.HPjuice = new Vector2D(50, 8);

            this.HPlength = 0;
        }

        update(deltaTime, client, entityList) {
            if (client.player)
                this.HPlength = client.player.output.hp * this.HPjuice.x / 100 | 0;
        }

        draw() {
            R.ctx.save();
            /*
            R.drawText("B.I.G Motorizer\n" +
                "Description: Motor driven death machine.\n" +
                "Ammo Capacity: 36\n" +
                "Primary Attack: Charge-up salvo: Rapid-6-shot-burst micro missile launcher. Missiles travel harmonically. Needs to be charged up to fire. \n" +
                "Mod: Thunder pulse: Use the charge-up motor to generate an EMP beam that stuns enemies.\n" +
                "Super: Transform: Transform the weapon up to 3 times to give it upgrades.\n" +
                "1st form: Turbo Engine - No charge-up time and full auto but fire at a slower fire rate that builds up as you fire.\n" +
                "2nd form: Induction Motor - Use Thunder Pulse as you fire.\n" +
                "3rd form: Precision Choke - Rounds travel directly\n" +
                "\n" +
                "\n" +
                "\n", 0, 0, "Green", false, 200);
            */


            if (this.HPlength === 0) {
                return;
            }

            // Liquid Inside
            UIElement.defaultSpriteSheet.drawCropped(
                0,
                this.glassTube.y,
                this.HPlength,
                this.HPjuice.y,
                6,
                R.HEIGHT - this.glassTube.y - 2,
                this.HPlength,
                this.HPjuice.y,
            );

            // Draw Glass Tube
            UIElement.defaultSpriteSheet.drawCropped(
                0,
                0,
                this.glassTube.x,
                this.glassTube.y,
                4,
                R.HEIGHT - this.glassTube.y - 4 | 0,
                this.glassTube.x,
                this.glassTube.y);

            R.ctx.restore();
        }

    }

    class GunBox extends UIElement {
        constructor() {
            super("gunbox", 0, 0, 32, 32);

            this.gunSprites = new SpriteSheet("ui/gunBoxGuns.png");

            this.frame = new Vector2D(64, 32);
            this.backGround = new Vector2D(60, 28);

            this.hasWeapon = false;

            this.playerAmmo = 0;
            this.loadedAmmo = 0;

        }

        update(deltaTime, client, entityList) {
            if (client.player) {
                let gun = entityList.getEntityByID(client.player.output.invWeaponID);
                if (gun) {
                    this.hasWeapon = true;
                    this.playerAmmo = client.player.output.invAmmo;
                    this.loadedAmmo = gun.output.currentAmmo;
                    this.iconID = gun.iconID;
                } else {
                    this.hasWeapon = false;
                }
            }
        }

        draw() {

            if (this.hasWeapon) {
                R.ctx.save();

                R.drawText(this.loadedAmmo + "/" + this.playerAmmo, R.WIDTH - 72, R.HEIGHT - 44, "Green", false);

                UIElement.defaultSpriteSheet.drawCropped(
                    0,
                    36,
                    this.frame.x,
                    this.frame.y,
                    R.WIDTH - 92,
                    R.HEIGHT - 36,
                    this.frame.x,
                    this.frame.y,
                );

                UIElement.defaultSpriteSheet.drawCropped(
                    this.frame.x,
                    36,
                    this.backGround.x,
                    this.backGround.y,
                    R.WIDTH - 90,
                    R.HEIGHT - 34,
                    this.backGround.x,
                    this.backGround.y,
                );

               this.gunSprites.drawCropped(
                    0,
                    this.iconID * this.backGround.y,
                    this.backGround.x,
                    this.backGround.y,
                    R.WIDTH - 90,
                    R.HEIGHT - 34,
                    this.backGround.x,
                    this.backGround.y,
                );

                R.ctx.restore();
            }

        }

    }

    class ModBox extends UIElement {
        constructor() {
            super("modbox", 0, 0, 32, 32);
            this.src = AssetManager.get("ui/ui.png");

            this.frame = new Vector2D(16, 16);
            this.backGround = new Vector2D(12, 12);
            this.icon = new Vector2D(8, 8);

            this.hasWeapon = false;
            this.canUseMod = false;
            this.onCoolDown = false;
            this.modActive = false;

            this.modPercent = 0;
            this.durationPercent = 0;

            this.iconID = 0;

        }

        update(deltaTime, client, entityList) {
            if (client.player) {
                let gun = entityList.getEntityByID(client.player.output.invWeaponID);

                this.hasWeapon = false;
                if (gun) {
                    this.hasWeapon = true;

                    this.canUseMod = gun.output.canUseMod;

                    this.modPercent = 100 -
                        ((gun.output.modAbilityData.currentCoolDown / gun.output.modAbilityData.maxCoolDown) * 100) | 0;

                    this.onCoolDown = gun.output.modAbilityData.onCoolDown;

                    this.durationPercent = (1 / this.backGround.y * 100) +
                        ((gun.output.modAbilityData.currentDuration / gun.output.modAbilityData.maxDuration) * 100) | 0;

                    this.modActive = gun.output.modAbilityData.active;

                    this.iconID = gun.iconID;
                }
            }
        }

        draw() {
            if (this.hasWeapon) {
                R.ctx.save();

                // ModBox dark background
                UIElement.defaultSpriteSheet.drawCropped(
                    this.frame.x,
                    68,
                    this.backGround.x,
                    this.backGround.y,
                    R.WIDTH - 108,
                    R.HEIGHT - 30 + this.backGround.y,
                    this.backGround.x,
                    this.backGround.y,
                );

                // Foreground when on Cool Down
                if (this.onCoolDown)
                    UIElement.defaultSpriteSheet.drawCropped(
                        this.frame.x + this.backGround.x,
                        68,
                        this.backGround.x,
                        this.backGround.y * this.modPercent / 100 | 0,
                        R.WIDTH - 108,
                        R.HEIGHT - 6 - ((this.backGround.y * this.modPercent / 100) | 0),
                        this.backGround.x,
                        this.backGround.y * this.modPercent / 100 | 0,
                    );

                // Foreground when ready to use mod
                if (this.canUseMod && !this.modActive)
                    R.drawRect("White",
                        R.WIDTH - 108,
                        R.HEIGHT - 18,
                        this.backGround.x,
                        this.backGround.y);


                // When the mod is active(duration)
                if (this.modActive)
                    R.drawRect("White",
                        R.WIDTH - 108,
                        R.HEIGHT - 6 - ((this.backGround.y * this.durationPercent / 100) | 0),
                        this.backGround.x,
                        this.backGround.y * this.durationPercent / 100 | 0);

                // Weapon Icon
                UIElement.defaultSpriteSheet.drawCropped(
                    40 + this.iconID * this.icon.x,
                    76,
                    this.icon.x,
                    this.icon.x,
                    R.WIDTH - 106,
                    R.HEIGHT - 16,
                    this.icon.x,
                    this.icon.x,
                );

                // Frame around modbox
                UIElement.defaultSpriteSheet.drawCropped(
                    0,
                    68,
                    this.frame.x,
                    this.frame.y,
                    R.WIDTH - 110,
                    R.HEIGHT - 36 + this.frame.y,
                    this.frame.x,
                    this.frame.y,
                );

                R.ctx.restore();
            }
        }
    }

    class Stats extends UIElement {
        constructor() {
            super("stats", 0, 0, 32, 32);
            this.src = AssetManager.get("ui/ui.png");

            this.frame = new Vector2D(8, 8);

            this.killCount = 0;
            this.playersAlive = 0;

        }

        update(deltaTime, client, entityList) {
            if (client.player)
                if (client.player.output)
                    if (client.player.output.statData)
                        this.killCount = client.player.output.statData.Kills;
            if (client.inboundPacket)
                if (client.inboundPacket.gameData) {
                    this.playersAlive = client.inboundPacket.gameData.playerCount;
                }
        }


        draw() {
            R.ctx.save();
            UIElement.defaultSpriteSheet.drawCropped(
                40,
                68,
                this.frame.x,
                this.frame.y,
                R.WIDTH - 36,
                R.HEIGHT - 122,
                this.frame.x,
                this.frame.y,
            );
            R.drawText(this.playersAlive, R.WIDTH - 36 + this.frame.x + 2, R.HEIGHT - 120, "White", false);
            UIElement.defaultSpriteSheet.drawCropped(
                this.frame.x + 40,
                68,
                this.frame.x,
                this.frame.y,
                R.WIDTH - 36,
                R.HEIGHT - 122 + this.frame.y + 2,
                this.frame.x,
                this.frame.y,
            );
            R.drawText(this.killCount, R.WIDTH - 36 + this.frame.x + 2, R.HEIGHT - 120 + this.frame.y + 2, "Red");

            R.ctx.restore();
        }
    }

    /**
     * Object that get .json files loaded and parsed by the asset manager
     * @see AssetManager
     * @memberOf ClientSide

     */
    class JSONFile {
        /**
         * @param src {string} - Relative file path made by the asset manager
         * @param downloadCallback {function} - Callback when the source is loaded by the asset manager
         */
        constructor(src, downloadCallback) {
            this.src = src;
            this.fileContent = "";
            this.objectContent = {};
            var _this = this;
            assMan.addDownloadCallback(() => {
                _this.fileContent = assMan.get(src).string;
                _this.objectContent = assMan.get(src).object;
                downloadCallback(this.objectContent);
            });
        }

        /**
         * Retrieve the parsed object data
         * @returns {object}
         */
        get() {
            return this.objectContent;
        }
    }

    /**
     * Takes a tile map and tile sheet then draws the entire tile map.
     * @memberOf ClientSide

     */
    class TileSheet extends SpriteSheet {
        /**
         * @param src {string} - Tile sheet image source from AssetManager
         * @param tileSize {number} - Tile size
         * @param map {CTileMap} - Tile map object
         * @see AssetManager
         * @see CTileMap
         */
        constructor(src, tileSize, map) {
            super(src);
            this.tileSize = tileSize;
            assMan.addDownloadCallback(() => {
                this.tilesPerRow = (this.img.width / tileSize) | 0;
                this.image = this.paintImage(map);
            });
        }

        /**
         * Generate a new image out of the tile map array using the tile set image
         * @param map {CTileMap} - Tile map object
         * @returns {HTMLCanvasElement}
         */
        paintImage(map) {
            var canvas = document.createElement('canvas');
            canvas.width = map.w * this.tileSize;
            canvas.height = map.h * this.tileSize;
            var ctx = canvas.getContext('2d');
            for (var y = 0; y <= map.h; y++) {
                for (var x = 0; x <= map.w; x++) {
                    if (map.getID(x, y) > map.dontDrawID && map.withinRange(x, y)) {
                        var tile = map.getID(x, y) - 1;
                        var tileRow = Math.floor(tile / this.tilesPerRow);
                        var tileCol = Math.floor(tile % this.tilesPerRow);
                        this.drawCropped(
                            (tileCol * this.tileSize), (tileRow * this.tileSize),
                            this.tileSize, this.tileSize,
                            x * this.tileSize,
                            y * this.tileSize,
                            this.tileSize, this.tileSize,
                            ctx);
                        /*
                        ctx.fillStyle = "yellow";
                        ctx.fillText(tile + 1,
                            x * this.tileSize,
                            y * this.tileSize + 8)
                         */
                    }
                }
            }
            return canvas;
        }

        /**
         * Draw the image to the main canvas
         */
        draw() {
            R.context.drawImage(this.image, R.camera.displayPos.x, R.camera.displayPos.y);
        }
    }

    /**
     * Tile map class for the client. It reads the shared .json file for the tile map
     * that the server also has access to.
     */
    class CTileMap {
        constructor(jsonSrc, imgSrc, name) {
            var _this = this;
            this.name = name;
            this.json = new JSONFile(jsonSrc, object => {
                _this.array = object.layers[0].data;
                _this.w = object.width;
                _this.h = object.height;
                _this.tileSheet = new TileSheet(imgSrc, 8, _this);
            });
            this.dontDrawID = 0;
        }

        /**
         * Draws the entire tile map on the canvas in the game loop.
         */
        draw() {
            if (this.tileSheet) {
                this.tileSheet.draw();
            }
        }

        getID(x, y) {
            return this.array[x + this.w * y];
        }

        withinRange(x, y) {
            return x >= 0 && x <= this.w && y >= 0 && y <= this.h;
        }

        isSolid(id) {
            return id < 17 && id !== 0;
        }
    }

    /**
     *  Holds data of tile maps loaded from JSON
     */
    class TileMapManager {
        constructor() {
            this.maps = {};
        }

        /**
         * Makes a new tile map object from a .json tile map source
         * @param name {string} - Name of the tile map
         * @param src {string} - Relative file path of the tile map source file
         */
        createMap(name, src) {
            this.maps[name] = new CTileMap(src, "tileSet.png", name);
        }

        /**
         * Retrieves all the generated tile maps
         * @returns {object}
         */
        getAllMaps(){
            return this.maps;
        }

        /**
         * Retrieve a tile map by name
         * @param name {string} - Name of the tile map that was made
         * @returns {CTileMap}
         */
        getMap(name) {
            return this.maps[name];
        }

    }

    /**
     *
     */
    class Announcement extends UIElement {
        /**
         * Sets UI image and timer for event position
         */
        constructor() {
            super("announcement", R.WIDTH / 2 - 64 | 0, 0, 128, 18);
            this.pos.y = -this.height - 4;
            this.event = undefined;

            this.timer = new Timer(0.01, () => {
                if (this.event !== undefined && this.pos.y >= 0)
                    this.event.arg.x--;
            });

            Scene.eventManager.addEventReceiver(this.id, this,(ev)=>{
                return !ev.arg.hasOwnProperty('shown') &&
                    ev.arg.hasOwnProperty('string')
            });
        }

        /**
         * Adds an event to be displayed and adds properties to the event
         * @param e {CGameEvent} - Event to be displayed
         */
        addEvent(e) {
            if (Array.isArray(e) && e.length > 0) {
                this.event = e[0];
                this.event.arg.shown = true;
                this.event.arg.dString = "";
                this.event.arg.x = this.width - 10;
            }
        }

        /**
         * Finds the substring to display
         */
        updateEvent() {
            if (this.event !== undefined) {
                this.start = this.event.arg.x <= 0 ? -this.event.arg.x / 5 | 0 : 0;
                this.event.arg.dString = this.event.arg.string.substring(
                    this.start,
                    (this.width - this.event.arg.x - 5) / 5 | 0);
                if (this.event.arg.x + this.event.arg.string.length * 5 - 1 <= 0 )
                    this.event = undefined;

            }
        }

        /**
         * Removes the announcementbox if there is no event to display
         */
        animation() {
            if (this.event !== undefined) {
                if (this.pos.y < 0)
                    this.pos.y++;
            } else {
                if (this.pos.y >= -this.height - 4) {
                    this.pos.y--;
                }
            }
        }

        /**
         *
         * @param deltaTime {int} - Deltatime between game ticks
         * @param client {Client} - The client
         * @param entityList {EntityManager} - List of entities
         */
        update(deltaTime, client, entityList) {
            this.pos.x = R.WIDTH / 2 - 64 | 0;
            this.animation();
            this.updateEvent();
            this.timer.tick(deltaTime);
        }

        /**
         *
         */
        draw() {
            if (this.pos.y > -this.height - 4) {

                UIElement.defaultSpriteSheet.drawCropped(
                    this.pos.x,
                    this.pos.y + 6,
                    this.width - 10,
                    this.height - 4,
                    0, 110,
                    118, 14,
                );

                if (this.event !== undefined) {
                    R.drawText(
                        this.event.arg.dString,
                        this.pos.x + this.event.arg.x + this.start * 5 + 1,
                        this.pos.y + 11, this.event.color
                    );
                }


                UIElement.defaultSpriteSheet.drawCropped(
                    this.pos.x - 5,
                    this.pos.y,
                    this.width,
                    this.height + 4,
                    0, 88,
                    128, 22,
                );
            }
        }
    }

    class EnemyDetector extends UIElement {
        constructor(x, y) {
            super("enemyDetector", x, y, 10, 10);
            this.found = {};
            this.maxFlashTime = .5;
            this.flashTime = 0;
            this.showScope = false;
        }

        showCentralPoint() {
            this.showScope = true;
        }

        queryPositions(positions) {
            this.found = positions;
        }

        draw() {
            super.draw();
            let enemies = Object.keys(this.found).length;
            let color = "Red";
            if (enemies > 0) {
                color = this.flashTime < this.maxFlashTime / 2 ? "Red" : "White";
                this.flashTime -= Scene.deltaTime;
                if (this.flashTime <= 0) {
                    this.flashTime = this.maxFlashTime;
                }
                let string = "Enemy detected: " + enemies;
                R.drawText(string,
                    R.screenSize.x / 2 - string.length * 2,
                    R.screenSize.y / 2 - 16, color);
            }
            for (let id in this.found) {
                let pos = this.found[id];
                let disp = {};
                disp.x = pos.x + R.camera.x;
                disp.y = pos.y + R.camera.y;
                let offset = 5;
                let dim = 2;
                let push = 10;
                let pushX = 0;
                let pushY = 0;
                if (disp.x < 0) {
                    disp.x = offset;
                    pushX = push;
                }
                if (disp.y < 0) {
                    disp.y = offset;
                    pushY = push;
                }
                if (disp.x > R.screenSize.x) {
                    disp.x = R.screenSize.x - offset;
                    pushX = -push;
                }
                if (disp.y > R.screenSize.y) {
                    disp.y = R.screenSize.y - offset;
                    pushY = -push;
                }
                let distance = Vector2D.distance(Scene.clientRef.player.getRealtimeProperty("pos"), pos) / 8 | 0;
                R.drawText(distance + "m", disp.x + pushX - 5, disp.y + pushY, color);
                R.drawRect(color.toLowerCase(), disp.x, disp.y, dim, dim);
            }
            this.found = {};

            if (this.showScope) {
                R.drawRect("red", R.screenSize.x / 2, R.screenSize.y / 2 - 1, 1,1);
                R.drawRect("red", R.screenSize.x / 2 - 1, R.screenSize.y / 2, 1,1);
                R.drawRect("red", R.screenSize.x / 2 + 1, R.screenSize.y / 2, 1,1);
                R.drawRect("red", R.screenSize.x / 2, R.screenSize.y / 2 + 1, 1,1);
            }

            this.showScope = false;

        }

    }

    // All game rendering and UI elements

    /**
     * The main object on the client that renders the game world and UI.
     * @namespace Scene
     * @memberOf ClientSide
     */
    const Scene = {
        deltaTime: 0,
        lastTime: 0,
        currentMap: "MegaMap",
        entityManager: null,
        eventManager: null,
        clientRef: null,


        /**
         * Get the current tile map name that is displayed
         * @memberOf Scene
         * @returns {string}
         */
        get currentMapName() {
            return Scene.currentMap;
        },

        set currentMapName(val) {
            Scene.currentMap = val;
        },

        get entities() {
            return Scene.entityManager;
        },

        /**
         * Initialization entry point for setting up certain things such as UI and game world variables on the client
         * @memberOf Scene
         */
        setup() {
            Scene.tileMaps = new TileMapManager();
            Scene.tileMaps.createMap("MegaMap", "tilemaps/MegaMap.json");
            Scene.tileMaps.createMap("lobby", "tilemaps/lobby.json");
            Scene.tileMaps.createMap("hub", "tilemaps/hub.json");
            assMan.addDownloadCallback(() => {
                UI.setup(() => {
                    UI.append(new MiniMap());
                    UI.append(new Announcement());
                    UI.append(new KelvinBar());
                    UI.append(new HPBar());
                    UI.append(new GunBox());
                    UI.append(new ModBox());
                    UI.append(new Stats());
                    UI.append(new EnemyDetector());
                    UI.append(new CrossHair()); // Remember to keep this at the bottom
                });
                UI.init();
            });

        },

        /**
         * Retrieves the current displayed tile map
         * @memberOf Scene
         * @returns {CTileMap}
         */
        getCurrentTileMap() {
            return Scene.tileMaps.getMap(Scene.currentMapName);
        },

        /**
         * Start the client side application
         * @memberOf Scene
         * @param entityManager {CEntityManager} - Main client entity manager
         * @param client {CClient} - Reference to the end user object
         */
        run(entityManager, client) {
            Scene.clientRef = client;
            Scene.entityManager = entityManager;
            Scene.eventManager = new CEventManager(); // TODO::Kor ska denne?

            Scene.setup();
            Scene.tick();
        },

        /**
         * Game loop that runs after the asset manager successfully loads all assets
         * @memberOf Scene
         */
        update() {
            if (assMan.done()) {
                Scene.clientRef.update(Scene.entityManager, Scene.deltaTime);
                Scene.eventManager.update(Scene.clientRef, Scene.deltaTime);
                UI.update(Scene.deltaTime, Scene.clientRef, Scene.entityManager);
                Scene.entityManager.updateEntities(Scene.deltaTime, Scene.clientRef, Scene.tileMaps.getMap(Scene.currentMap));
                R.camera.update();
                AudioPool$1.update();
            }
        },

        /**
         * Draw loop that runs after the asset manager successfully loads all assets
         * @memberOf Scene
         */
        draw() {
            R.clear();
            if (Scene.clientRef.disconnected) {
                R.drawText("YOU HAVE BEEN DISCONNECTED", (R.screenSize.x / 2 | 0) - "YOU HAVE BEEN DISCONNECTED".length * 4 / 2,
                    R.screenSize.y / 2 | 0, "Red");
                R.drawText(Scene.clientRef.discReasonMsg, (R.screenSize.x / 2 | 0) -
                    4 * Scene.clientRef.discReasonMsg.length / 2,
                    (R.screenSize.y / 2 | 0) + 8, "Red");
                R.drawText(Scene.clientRef.discActionMsg, (R.screenSize.x / 2 | 0) -
                    4 * Scene.clientRef.discActionMsg.length / 2,
                    (R.screenSize.y / 2 | 0) + 16, "Red");
                return;
            }

            if (assMan.done()) {
                Scene.tileMaps.getMap(Scene.currentMapName).draw();
                Scene.entityManager.drawEntities();
                UI.draw();
                document.body.style.cursor = "none";
            } else {
                document.body.style.cursor = "default";
                var str = "Loading " +
                    (((assMan.successCount + assMan.errorCount) / assMan.downloadQueue.length) * 100 | 0)
                    + "%";
                R.drawText(str,
                    (R.screenSize.x / 2 | 0) - R.context.measureText(str).width / 2,
                    R.screenSize.y / 2 | 0,
                    "Green");

                R.drawText("Sphinx of black quartz, judge my vow...",
                    (R.screenSize.x / 3 | 0) - R.context.measureText(str).width / 2,
                    R.screenSize.y / 1.5 | 0,
                    "Green");

            }
            
            R.debug(Scene.clientRef.latency + "ms");
            R.drawDebug();
        },

        tick(time) {
            if (time > 0)
                Scene.deltaTime = (time - Scene.lastTime) / 1000;

            Scene.update();
            Scene.draw();

            if (time > 0)
                Scene.lastTime = time;

            requestAnimationFrame(Scene.tick);
        }
    };

    Math.clamp = function (a, b, c) {
        return Math.max(b, Math.min(c, a));
    };

    class ServerTimeSyncer {

        constructor() {
            this.integrator = 0;
            this.totalDrift = 0;
            this.serverTicks = 0;
            this.startTime = this.getNow();
            this.expectedTime = this.getNow() + ServerTimeSyncer.SERVER_STEP_MS;
            this.simulationTime = 0;
        }

        get ping() {
            return this.latency;
        }

        onServerUpdate(ping) {
            this.latency = ping;
            this.serverTicks++;
            var timeDifference = this.expectedTime - this.getNow();
            this.integrator = this.integrator * 0.9 + timeDifference;

            var adjustment = Math.clamp(this.integrator * 0.01, -0.1, 0.1);
            this.totalDrift += adjustment;
            this.expectedTime += ServerTimeSyncer.SERVER_STEP_MS;
        }

        getNow() {
            return Date.now() + this.totalDrift;
        }

        moveSimulation() {
            if (this.getNow() - this.simulationTime > ServerTimeSyncer.STEP_MS) {
                this.simulationTime += ServerTimeSyncer.STEP_MS;
                return true; //did step
            }
            return false; //did not step
        }

        serverDelta(delta) {
            return this.serverTicks * ServerTimeSyncer.SERVER_STEP_MS - delta;
        }

        timeSinceStart() {
            return this.getNow() - this.startTime;
        }

    }
    ServerTimeSyncer.SERVER_STEP_MS = 100; // Time offset of 100ms
    ServerTimeSyncer.STEP_MS = 16;

    /**
     * Class representation of the client. Holds input callbacks and manages socket events.
     * An instance of this class can be found in the update methods as parameters in the
     * UIElement, CEntity, CEntityManager, InputListener and EntitySnapshotBuffer instances
     * and as the clientRef member in Scene.
     */
    class CClient {
        constructor(socket, tickRate = 24) {
            this.socket = socket;
            this.id = socket.id;
            this.localTime = 0;
            this.serverUpdateCallbacks = new ObjectNotationMap();
            this.clientEmitPacket = new ObjectNotationMap();
            this.inputListener = new InputListener(this);
            this.timeSyncer = new ServerTimeSyncer();

            [32, 83, 68, 65, 87, 69, 70, 71, 82, 81].forEach(keyCode => {
                this.addKeyEmitter(keyCode);
            });

            [1, 2, 3].forEach(mouseButton => {
                this.addMouseEmitter(mouseButton);
            });

            // Establishes a full connection using a promise.
            // The server is then notified of a proper connection.
            new Promise(resolve => {
                this.defineSocketEvents();
                resolve();
            });
            this.latency = 0;
            this.discReasonMsg = "reason: server error";
        }

        onServerUpdateReceived(packet) {
            this.timeSyncer.onServerUpdate(this.latency);
            this.lastReceivedData = packet;
            for (let callback of this.serverUpdateCallbacks.array) {
                callback(packet);
            }
        }

        /**
         * Get the input listener instance from the client
         * @returns {InputListener}
         */
        get input() {
            return this.inputListener;
        }

        /**
         * Map a key code to the input listener with a
         * callback. This mapping function's difference
         * is that upon the key state the key state data
         * is sent to the server.
         * @param keyCode {number} - JS key code
         * @param callback {function} - Callback when pressing and releasing the key
         */
        addKeyEmitter(keyCode, callback) {
            this.inputListener.addKeyMapping(keyCode, keyState => {
                if (callback) {
                    callback(keyState);
                }
            });
        }

        /**
         * Map (in an update loop) a piece of data to be sent to the server.
         * The data is present on the server as an object property with the
         * respective mapping name. It can be found in SClient.
         * @see SClient
         * @param key {string} - Mapping name
         * @param value {object} - Data values
         */
        setOutboundPacketData(key, value) {
            this.clientEmitPacket.set(key, value);
        }

        /**
         * Map a callback event for every tick the server sends packet data.
         * The callback takes the global packet data as a parameter.
         * @param eventName {string} - Mapping name
         * @param callback {function} - Callback executed every server frame (with latency)
         */
        addServerUpdateListener(eventName, callback) {
            this.serverUpdateCallbacks.set(eventName, callback);
        }

        /**
         * Reference to all the packet data gathered from the server
         * @returns {object}
         */
        get inboundPacket() {
            return this.lastReceivedData;
        }

        /**
         * Reference to all the packet data sent to the server
         */
        get outboundPacket() {
            return this.clientEmitPacket.object;
        }

        /**
         * Map a mouse code to the input listener with a
         * callback. This mapping function's difference
         * is that upon the key state the mouse button state data
         * is sent to the server.
         * @param mouseButton {number} - JS mouse code
         * @param callback {function} - Callback when pressing and releasing the mouse button
         */
        addMouseEmitter(mouseButton, callback) {
            this.inputListener.addMouseMapping(mouseButton, mouseState => {
                if (callback) {
                    callback(keyState);
                }
            });
        }


        /**
         * Get the reference to the client player object
         * @returns {UserPlayer}
         */
        get player() {
            return this.eMgr.getEntityByID(this.id);
        }

        update(entityManager, deltaTime) {
            if (!this.eMgr) {
                this.eMgr = entityManager;
            }
            this.localTime += deltaTime;
            this.startTime = Date.now();
            if (this.inboundPacket) {
                if (this.inboundPacket.gameData) {
                    Scene.currentMapName = this.inboundPacket.gameData.mapName;
                } else {
                    //if (e) entityManager.removeEntity(e.id);
                    if (this.inboundPacket.spectatorSubject) {
                        let s = entityManager.getEntityByID(this.inboundPacket.spectatorSubject.id);
                        if (s) {
                            R.camera.update(s.output.pos);
                        }
                    }
                }
            }
            this.inputListener.update(this);
        }

        emit(eventType, data) {
            this.socket.emit(eventType, data);
        }

        on(eventType, callback) {
            this.socket.on(eventType, callback);
        }

        defineSocketEvents() {
            this.on('connectClient', data => {
                this.id = data.id;
                this.disconnected = false;
                this.socket.emit("connectClientCallback", {id: this.id});
                const _this = this;
                setInterval(function () {
                    if (_this.clientEmitPacket.length > 0) {
                        _this.emit("clientPacketToServer", _this.clientEmitPacket.object);
                        _this.clientEmitPacket.clear();
                    }
                }, 1000 / data.tickRate);
            });

            this.on('serverUpdateTick', packet => {
                this.onServerUpdateReceived(packet);
            });

            this.on('broadcast-newPlayer', data => {
                console.log("Connected: ", data.id + ".", "There are " + data.playerCount + " players online!");
            });

            // TODO: Deprecate if needed
            this.on("gameEvent-changeMap", data => {
                Scene.currentMapName = data.mapName;
            });

            this.on("pong", data => {
                this.latency = data || 0;
            });

            this.on("manualDisconnect", message => {
                this.onDisconnect("reason: " + message);
            });

            this.on("disconnect", message => {
                this.onDisconnect("action: " + message);
            });
        }

        onDisconnect(message) {
            this.discActionMsg = message;
            this.disconnected = true;
            this.socket.close();
            document.body.style.cursor = "default";
        }
    }

    // Buffers data inbound packs of entities
    const SMOOTHING_PERCENTAGE = .36;

    class EntitySnapshotBuffer {
        constructor(initDataPack) {
            this.output = initDataPack;
            this.buffer = []; // Keeps snapshots of the history
            this.size = 4;
        }

        get length() {
            return this.buffer.length;
        }

        get first() {
            return this.buffer[0];
        }

        get last() {
            return this.buffer[this.length - 1];
        }

        get(i) {
            return this.buffer[i];
        }

        pushBack(data) {
            this.buffer.push(data);
        }

        popFront(alloc = 1) {
            this.buffer.splice(0, alloc);
        }

        t_directServerUpdate(data, entity) {
            entity.output = data;
        }

        onServerUpdateReceived(data, entity, client) {
            //this.tdirectServerUpdate(data, entity);
            data.localTimeStamp = Date.now();
            this.pushBack(data);
            if (this.length > this.size) {
                this.popFront();
            }
        }


        // Run this in an entity's updateFromDataPack method
        updateFromServerFrame(data, entity, client) {
            this.t_directServerUpdate(data, entity, client);
            //this.onServerUpdateReceived(data, entity, client)
        }

        // Use client parameter to detect input
        updateFromClientFrame(deltaTime, entity, client) {
            let currentTime = Date.now() - client.latency;
            let target = null;
            let previous = null;
            for (let i = 0; i < this.length - 1; i++) {
                let point = this.get(i);
                let next = this.get(i + 1);
                if (currentTime > point.timeStamp && currentTime < next.timeStamp) {
                    target = next;
                    previous = point;
                    break;
                }
            }

            if (!target) {
                target = previous = this.get(0);
            }

            if (target && previous) {
                let targetTime = target.serverTimeStamp;
                var difference = targetTime - currentTime;
                var maxDiff = (target.serverTimeStamp - previous.serverTimeStamp).fixed(3);
                var timePoint = (difference / maxDiff).fixed(3);

                if (isNaN(timePoint) || Math.abs(timePoint) === Infinity) {
                    timePoint = 0;
                }
                for (let key in target) {
                    if (key !== "pos") {
                        entity.output[key] = target[key];
                    }
                }

                entity.output.pos =
                    vectorLinearInterpolation(entity.output.pos,
                        vectorLinearInterpolation(previous.pos, target.pos, timePoint),
                        SMOOTHING_PERCENTAGE);
            }
        }

        remove(i) {
            this.buffer.splice(i);
        }


    }

    /**
     * The visual representation of entities present on the server.
     * @memberOf ClientSide
     */
    class CEntity {
        /**
         * @param initDataPack {object} - Initial packet data sent by the server. Constructor is called when the server emits
         * the 'initEntity' or 'spawnEntity' socket event.
         */
        constructor(initDataPack) {
            /**
             * The output entity data to be used around the entire client side application. This data will be tuned
             * from client prediction, server reconciliation and entity interpolation.
             * @type {Object}
             */
            this.output = initDataPack;

            /**
             * Packet buffer tuning the entity data
             * @type {EntitySnapshotBuffer}
             */
            this.dataBuffer = new EntitySnapshotBuffer(initDataPack);

            this.color = this.output.color;
            this.width = this.output.width;
            this.height = this.output.height;
        }

        /**
         * Method called every server tick (with latency)
         * @param dataPack {object} - Packet data sent every server tick
         * @param client {CClient} - Reference to the end user object
         * @see CClient
         */
        updateFromDataPack(dataPack, client) {
            this.color = this.output.color;
            this.width = this.output.width;
            this.height = this.output.height;
            this.dataBuffer.updateFromServerFrame(dataPack, this, client);
        }

        /**
         * Method called every client tick in the game loop on the Scene object
         * @param deltaTime {number} - Time between every frame on the client
         * @param client {CClient} - Reference to the end user object
         * @see Scene
         */
        update(deltaTime, client) {
            //this.dataBuffer.updateFromClientFrame(deltaTime, this, client);
        }

        /**
         * Returns the property value of the entity based on correct interpolations in sync with the server (output property).
         * @param string {string} - Property name
         * @returns {object}
         */
        getRealtimeProperty(string) {
            return this.output[string];
        }

        /**
         * Overridable event called when the entity shows up on the client
         * @param dataPack {object} - Initial data pack (shows up in constructor too)
         * @param client {CClient} - Reference to the end user object
         */
        onClientSpawn(dataPack, client) {

        }

        /**
         * Overridable event called when the entity is removed on the server.
         * @param client {CClient} - Reference to the end user object
         */
        onClientDelete(client) {

        }

        /**
         * Overridable event called every frame in the game loop. Do custom drawing here.
         */
        draw() {
            R.drawRect(this.color,
                this.output.pos.x /*+ (this.output.vel.x * Scene.deltaTime | 0) */,
                this.output.pos.y /*+ (this.output.vel.y * Scene.deltaTime | 0) */,
                this.width, this.height, true);
            /*

            R.drawText(this.output.eType,
                this.output.pos.x - R.ctx.measureText(this.output.eType).width / 4,
                this.output.pos.y, "Blue", true);
        */
        }
    }

    CEntity.defaultSprite = new SpriteSheet("entity/entities.png");

    /**
    * Manages animations for an object by mapping certain Animation objects to strings.
     * @memberOf ClientSide
     */
    class AnimationManager {
        constructor() {
            this.animations = {};
        }

        /**
        * Sets the current animation key to be played.
        * @param name {string} - String that decides the current animation to be played.
         */
        setCurrentAnimation(name) {
            this.currentAnimName = name;
        }

        /**
         * Creates a new animation mapped to a name.
         * @param name {string} - Name of the new animation.
         * @param animation {Animation} - Object with sprite animation configurations.
         */
        addAnimation(name, animation) {
            this.animations[name] = animation;
        }


        /**
         * Retrieve an existing animation.
         * @param name {string} - The mapped name of an existing animation.
         * @return {Animation}
         */
        getAnimation(name) {
            if (!this.animations[name]) {
                throw new Error("No animation such as " + name + " found!");
            }
            return this.animations[name];
        }

        /**
         * Function run in a draw loop that updates the animation frames.
         * @param spriteSheetObj {SpriteSheet} - Respective sprite sheet object
         * @param spriteLocationName {string} - Mapped location name of the sprite
         * @param fw {number} - Frame width of the sprite region
         * @param fh {number} - Frame height of the sprite region
         */
        animate(spriteSheetObj, spriteLocationName, fw, fh) {
            spriteSheetObj.animate(spriteLocationName, this.getAnimation(this.currentAnimName), fw, fh);
        }
    }

    /**
     * Other players in the game. Overrides update and draw methods of CEntity and contains sprite
     * and animation data.
     * @see CEntity
     * @memberOf ClientSide

     */
    class RemotePlayer extends CEntity {
        constructor(dataPack) {
            super(dataPack);
            this.animations = new AnimationManager();
            this.animations.addAnimation("run", new SpriteSheet.Animation(0, 5, 16, 0.1));
            this.animations.addAnimation("stand", new SpriteSheet.Animation(6, 6, 16, 0.1));
            this.animations.addAnimation("jump", new SpriteSheet.Animation(0, 0, 16, 0.1));
            this.animations.addAnimation("fall", new SpriteSheet.Animation(5, 5, 16, 0.1));
            this.animations.setCurrentAnimation("stand");
        }


        update(deltaTime, client) {
            super.update(deltaTime, client);
            this.animations.setCurrentAnimation(this.output.movementState.main);
        }

        draw() {
            this.animations.animate(RemotePlayer.sprite, this.output.teamName, 16, 16);
            SpriteSheet.beginChanges();
            if (this.output.movementState.direction === "left") {
                RemotePlayer.sprite.flipX();
            }
            RemotePlayer.sprite.drawAnimated(
                Math.round(this.output.pos.x) + R.camera.displayPos.x,
                Math.round(this.output.pos.y) + R.camera.displayPos.y);
            SpriteSheet.end();
        }
    }

    RemotePlayer.sprite = new SpriteSheet("entity/player.png");


    RemotePlayer.sprite.bind("red", 0, 0, 16 * 16, 16);
    RemotePlayer.sprite.bind("blue", 0, 16, 16 * 16, 16);
    RemotePlayer.sprite.bind("yellow", 0, 32, 16 * 16, 16);
    RemotePlayer.sprite.bind("green", 0, 48, 16 * 16, 16);
    RemotePlayer.sprite.setCentralOffset(4);

    const TILE_SIZE = 8;


    /**
     * The player the client controls. It contains the client side prediction code and the interface
     * for events happening only to the user end player entity.
     * @memberOf ClientSide

     */
    class UserPlayer extends RemotePlayer {
        constructor(data) {
            super(data);
            this.serverState = data;
            this.localVel = new Vector2D(0, 0);
            this.localSides = {
                left: false,
                right: false,
                top: false,
                bottom: false,
                reset: () => {
                    this.localSides.left = this.localSides.right = this.localSides.top = this.localSides.bottom = false;
                }
            };
        }

        updateFromDataPack(dataPack, client) {
            this.dataBuffer.t_directServerUpdate(dataPack, this);
            //super.updateFromDataPack(dataPack, client);
            //this._serverState = dataPack;
            //this._output = dataPack;
            //this.updateRemainingServerData(client);
            //this.serverReconciliation(client);
        }

        overlapTile(pos, e) {
            return pos.y + this.height > e.y
                && pos.y < (e.y + TILE_SIZE)
                && pos.x + this.width > e.x
                && pos.x < (e.x + TILE_SIZE);
        }

        t_drawGhost() {
            R.ctx.save();
            R.ctx.globalAlpha = 0.4;
            //this.animations.animate(RemotePlayer.sprite, this.serverState.teamName, 16, 16);
            SpriteSheet.beginChanges();
            if (this.serverState.movementState.direction === "left") {
                RemotePlayer.sprite.flipX();
            }
            RemotePlayer.sprite.drawAnimated(
                Math.round(this.serverState.pos.x) + R.camera.displayPos.x,
                Math.round(this.serverState.pos.y) + R.camera.displayPos.y);
            SpriteSheet.end();
            R.ctx.restore();
        }

        draw() {
            super.draw();
            //this.t_drawGhost();
        }

        update(deltaTime, client, currentMap) {
            super.update(deltaTime, client);
            this.currentMap = currentMap;
            this.weapon = Scene.entities.getEntityByID(this.output.invWeaponID);
            if (R.camera.config("followPlayer")) {
                R.camera.setCurrentFollowPos(this.getRealtimeProperty("centerData"));
            }
            //console.log(Date.now() - client.latency, this.serverState.serverTimeStamp);
            /*
            let t = client.latency / 1000;
            if (Date.now() - client.latency <= this.serverState.serverTimeStamp) {
                this.output.pos =
                    vectorLinearInterpolation(this.output.pos,
                        vectorLinearInterpolation(this.serverState.pos, this.localPos, 60 * t),
                        .36);
            } else {
                this.output.pos = this.localPos;
            }

             */
            R.camera.setConfig("followPlayer", true);
        }

        updateRemainingServerData(client) {
            for (let key in this.serverState) {
                if (key !== "pos") {
                    this.output[key] = this.serverState[key];
                }
            }
            //this.localPos.x = this.serverState.pos.x;
            //this.localPos.y = this.serverState.pos.y;
        }

        physics(deltaTime, client, currentMap) {
            this.localSides.reset();
            this.output.pos.x += this.localVel.x;
            this.reconciledCollisionCorrectionX(currentMap);
            this.reconciledCollisionCorrectionY(currentMap);
        }

        reconciledCollisionCorrectionX(currentMap) {
            let pos = this.output.pos;
            var cx = Math.floor(pos.x / TILE_SIZE);
            var cy = Math.floor(pos.y / TILE_SIZE);

            var proxy = 2; // Amount of margin of tiles around entity

            var tileX = Math.floor(this.width / TILE_SIZE) + proxy;
            var tileY = Math.floor(this.height / TILE_SIZE) + proxy;

            for (var y = -proxy; y < tileY; y++) {
                for (var x = -proxy; x < tileX; x++) {
                    var xx = cx + x;
                    var yy = cy + y;

                    let tile = {
                        x: xx * TILE_SIZE,
                        y: yy * TILE_SIZE,
                    };

                    let id = currentMap.getID(xx, yy);
                    if (currentMap.isSolid(id)) {
                        if (this.overlapTile(pos, tile)) {
                            if (pos.x + this.width > tile.x
                                //&& this.oldPos.x + this.width <= tile.x
                                && this.localVel.x > 0
                            ) {
                                pos.x = tile.x - this.width;
                                this.localVel.x = 0;
                                this.localSides.right = true;
                            }
                            if (pos.x < tile.x + TILE_SIZE
                                //&& this.oldPos.x >= tile.x + TILE_SIZE
                                && this.localVel.x < 0
                            ) {
                                pos.x = tile.x + TILE_SIZE;
                                this.localVel.x = 0;
                                this.localSides.left = true;
                            }
                        }
                    }
                }
            }
        }

        reconciledCollisionCorrectionY(currentMap) {
            let pos = this.output.pos;
            var cx = Math.floor(pos.x / TILE_SIZE);
            var cy = Math.floor(pos.y / TILE_SIZE);

            var proxy = 2; // Amount of margin of tiles around entity

            var tileX = Math.floor(this.width / TILE_SIZE) + proxy;
            var tileY = Math.floor(this.height / TILE_SIZE) + proxy;

            for (var y = -proxy; y < tileY; y++) {
                for (var x = -proxy; x < tileX; x++) {
                    var xx = cx + x;
                    var yy = cy + y;

                    let tile = {
                        x: xx * TILE_SIZE,
                        y: yy * TILE_SIZE,
                    };

                    let id = currentMap.getID(xx, yy);
                    if (currentMap.isSolid(id)) {
                        if (this.overlapTile(pos, tile)) {
                            if (pos.y + this.height > tile.y && this.oldPos.y + this.height <= tile.y) {
                                pos.y = tile.y - this.height;
                                this.localSides.bottom = true;
                            }
                            if (pos.y < tile.y + TILE_SIZE && this.oldPos.y >= tile.y + TILE_SIZE) {
                                pos.y = tile.y + TILE_SIZE;
                                this.localSides.top = true;
                            }
                            /*
                            if (this.localVel.y > 0) {
                            }
                            if (this.localVel.y < 0) {
                            }
                             */
                        }
                    }
                }
            }
        }

        serverReconciliation(client) {
            let pending = client.input.pending;
            let j = 0;
            while (j < pending.length) {
                let input = pending[j];
                if (input.sequence <= client.inboundPacket.lastProcessedInputSequence) {
                    pending.splice(j, 1);
                } else {
                    this.oldPos = this.output.pos;
                    this.localVel.x = 0;

                    if (input.keyStates[68]) {
                        if (!this.localSides.right) {
                            this.localVel.x = 1;

                        }
                    }

                    if (input.keyStates[65]) {
                        if (!this.localSides.left) {
                            this.localVel.x = -1;
                        }
                    }

                    this.physics(input.pressTime, client, this.currentMap);


                    j++;
                }
            }
        }
    }

    class CWeapon extends CEntity {
        constructor(data, iconID) {
            super(data);
            this.iconID = iconID;
        }

        onFire(client, deltaTime) {

        }

        onDrop(client, deltaTime) {

        }

        update(deltaTime, client) {
            super.update(deltaTime, client);
            if (this.getRealtimeProperty("firing") && this.getRealtimeProperty("equippedToPlayer")) {
                this.onFire(client, deltaTime);
            }

            if (this.getRealtimeProperty("dropped")) {
                this.onDrop(client, deltaTime);
            }
        }

        draw() {
            if (!this.getRealtimeProperty("equippedToPlayer")) {

                let name = this.getRealtimeProperty("displayName") + "-World";
                let rect = CWeapon.sprite.offsetRects.get(name);
                if (rect) {
                    let pos = this.getRealtimeProperty("pos");
                    let h = this.getRealtimeProperty("height");
                    CWeapon.sprite.drawStill(name,
                        pos.x - rect.w / 2 + R.camera.x,
                        pos.y + R.camera.y - Math.abs(rect.h - h));
                } else {
                    let pos = this.getRealtimeProperty("pos");
                    let h = this.getRealtimeProperty("height");
                    rect = CWeapon.sprite.offsetRects.get("none");
                    CWeapon.sprite.drawStill("none",
                        pos.x - rect.w / 2 + R.camera.x,
                        pos.y + R.camera.y - Math.abs(rect.h - h));
                }
            }
        }
    }

    CWeapon.sprite = new SpriteSheet("entity/guns.png");
    CWeapon.sprite.bind("KE-6H-World", 64, 37, 28, 11);
    CWeapon.sprite.bind("C-KER .90-World", 64, 96, 32, 16);
    CWeapon.sprite.bind("SEW-9-World", 64, 64, 26, 10);
    CWeapon.sprite.bind("Interlux-World", 64, 76, 26, 12);
    CWeapon.sprite.bind("none", 64, 52, 27, 12);

    class CBottle extends CEntity {
        draw() {
            let pos = this.getRealtimeProperty("pos");
            CEntity.defaultSprite.drawStill(this.getRealtimeProperty("type"),
                pos.x + R.camera.x,
                pos.y + R.camera.y, 8, 8);
        }
    }
    CEntity.defaultSprite.bind("ammo", 0, 0, 8, 8);
    CEntity.defaultSprite.bind("charge", 8, 0, 8, 8);
    CEntity.defaultSprite.bind("health", 16, 0, 8, 8);

    class CPortal extends CEntity {
        constructor(d) {
            super(d);
            this.animation = new SpriteSheet.Animation(0, 3, 4, 0.1);
        }

        draw() {
            let pos = this.getRealtimeProperty("pos");
            CEntity.defaultSprite.animate("portal", this.animation, 10, 16);
            CEntity.defaultSprite.drawAnimated(
                pos.x + R.camera.x,
                pos.y + R.camera.y - 3, 10, 16);
        }
    }
    CEntity.defaultSprite.bind("portal", 0, 8, 10 * 4, 16);

    class SoundPoop {
        constructor() {
            this.MAX_INSTANCE_COUNT = 10;
        }

        play(src) {
            let sound = new SoundEffect(src);
            sound.play();
            return sound;
        }
    }

    var SoundManager = new SoundPoop();

    class CKE_6H extends CWeapon {
        constructor(data)
        {
            super(data, 2);
        }
        onFire(client, deltaTime) {
            super.onFire(client, deltaTime);
            SoundManager.play("Weapons/ke-6h_s.oggSE");
        }
    }

    class CBIGMotorizer extends CWeapon {
        constructor(data)
        {
            super(data, 4);
        }
        onFire(client, deltaTime) {
            super.onFire(client, deltaTime);
            SoundManager.play("Weapons/motorizer_s.oggSE");
        }

        draw() {
            super.draw();
            if (this.output.thunderPulsePos) {
                R.drawLine(
                    new Vector2D(this.output.pos.x, this.output.pos.y),
                    new Vector2D(this.output.thunderPulsePos.x, this.output.thunderPulsePos.y),
                    1, "blue", 1, true);
            }
        }
    }

    class CSEW_9 extends CWeapon {

        constructor(data) {
            super(data, 1);
            this.isShooting = false;
        }

        onFire(client, deltaTime) {
            super.onFire(client, deltaTime);
        }

        update(deltaTime, client) {
            super.update(deltaTime, client);
            this.player = Scene.entityManager.getEntityByID(this.output.playerID);
            this.isShooting = this.getRealtimeProperty("isShooting");
            if(this.isShooting) AudioPool$1.play("Weapons/sew-9_a.oggSE", this.output.misPos, this.isShooting);
            else AudioPool$1.stop("Weapons/sew-9_a.oggSE");
        }

        draw() {
            super.draw();

            let superAbility = this.getRealtimeProperty("superAbilitySnap");
            let player = this.player;
            if(!player) return;
            let right = (player.output.movementState.direction === "right") ? 1 : -1;
            if (superAbility) {
                lightning(player.output.pos.x + player.output.width / 2, player.output.pos.y + player.output.height / 2, 200, 0, 0, right);
            }
        }
    }

    function lightning(x, y, length, yVal, life, right) {

        if (length-- > 0) {

            R.drawRect("White", x, y, 1, 1, true);
            R.drawRect("Cyan", x + right, y, 1, 1, true);

            let nx = x + (Math.random() * 2 | 0) * right;
            let ny = y + (yVal ? 0 : ((Math.random() * 2 | 0)) * ((Math.random() * 2 | 0) ? 1 : -1));
            lightning(nx, ny, length, life ? 0 : ny - y, life ? --life : 2, right);
        }
    }

    class CCKER90 extends CWeapon {
        constructor(props) {
            super(props, 0);
            this.toLerp = {
                x: 0,
                y: 0,
            };
            this.maxDist = 1000;
        }

        onDrop(client, deltaTime) {
            super.onDrop(client, deltaTime);
            this.toLerp.x = 0;
            this.toLerp.y = 0;
        }

        update(deltaTime, client) {
            super.update(deltaTime, client);
            if (this.getRealtimeProperty("playerID") !== client.id) return;
            let isScoping = this.getRealtimeProperty("dataIsScoping");
            if (isScoping) {
                if (client.input.getMouse(3)) {
                    let from = {x: 0, y: 0};
                    let center = {x: R.screenSize.x / 2, y: R.screenSize.y / 2};
                    let d = Vector2D.distance(client.input.mouse, center);
                    d *= 6;
                    if (d >= this.maxDist) d = this.maxDist;
                    let to = {x: -d * client.input.mouse.cosCenter, y: -d * client.input.mouse.sinCenter};
                    this.toLerp = vectorLinearInterpolation(this.toLerp,
                        vectorLinearInterpolation(from, to, .2), .2);
                    UI.getElement("enemyDetector").showCentralPoint();
                }
            } else {
                let to = {x: 0, y: 0};
                this.toLerp = vectorLinearInterpolation(this.toLerp,
                    vectorLinearInterpolation(this.toLerp, to, .2), .2);
            }
            R.camera.shift(this.toLerp.x, this.toLerp.y);
            UI.getElement("enemyDetector").queryPositions(this.getRealtimeProperty("found"));
        }
    }

    class CInterlux extends CWeapon {

        constructor(data) {
            super(data, 3);

            this.lines = null;
        }

        onFire(client, deltaTime) {
            super.onFire(client, deltaTime);

        }

        update(deltaTime, client) {
            this.player = Scene.entityManager.getEntityByID(this.output.playerID);
            this.lines = this.getRealtimeProperty("lines");
            super.update(deltaTime, client);
        }

        draw() {
            super.draw();
            R.ctx.save();

            //console.log(this.lines);
            let r = Scene.clientRef.inboundPacket.gameData.debugData.scanBox;
            if (r)
                if (Object.keys(r).length > 0) {
                    R.ctx.beginPath();
                    R.ctx.strokeStyle = "Green";
                    R.ctx.lineWidth = 2;
                    R.ctx.rect(
                        r.sx + R.camera.x,
                        r.sy + R.camera.y,
                        -(r.sx - r.ex),
                        -(r.sy - r.ey));
                    R.ctx.stroke();
                }

            for (var i = 0; i <= this.lines.length - 2; i += 2) {
                R.ctx.beginPath();
                R.ctx.strokeStyle = "Red";
                R.ctx.moveTo(this.lines[i].x + R.camera.x, this.lines[i].y + R.camera.y);
                R.ctx.lineTo(this.lines[i + 1].x + R.camera.x, this.lines[i + 1].y + R.camera.y);
                R.ctx.stroke();

            }
            R.ctx.restore();
        }

    }

    class Invisible extends CEntity {
        draw() {}
    }

    class CElectricSphere extends CEntity {

        onClientDelete(client) {
            super.onClientDelete(client);
            R.camera.setConfig("followPlayer", true);
        }

        update(deltaTime, client) {
            super.update(deltaTime, client);


            if (this.getRealtimeProperty("ownerID") !== client.id) return;
            if (!this.getRealtimeProperty("secondary")) return;
            R.camera.setConfig("followPlayer", false);
            R.camera.setCurrentFollowPos(this.output.pos);
        }
    }

    /**
     * Creates client versions of inbound entity data by mapping extended classes (CEntity) to the entity
     * constructor name from the server.
     * @see CEntity
     * @type {object}
     * @memberOf ClientSide
     * @namespace
     */
    const EntityTypeSpawner = {
        functions: {},

        /**
         * Map a class type (extends CEntity) to a constructor name of the respective server entity
         * @param name {string} - Server entity constructor name
         * @param classType {Function} - Class constructor
         * @memberOf EntityTypeSpawner
         */
        createSpawner(name, classType) {
            EntityTypeSpawner.functions[name] = data => {
                return new classType(data);
            };
        },
        spawn(name, data, client) {
            if (!EntityTypeSpawner.functions[name]) {
                console.warn("Entity with name " + name + " does not exist in the spawner.");
                return new CEntity(data);
            }
            if (client.id === data.id)
                return new UserPlayer(data);

            return EntityTypeSpawner.functions[name](data);
        }
    };


    EntityTypeSpawner.createSpawner("Player", RemotePlayer);
    EntityTypeSpawner.createSpawner("SEntity", CEntity);

    EntityTypeSpawner.createSpawner("Bottle", CBottle);
    EntityTypeSpawner.createSpawner("Portal", CPortal);

    EntityTypeSpawner.createSpawner("AttackWeapon", CWeapon);
    EntityTypeSpawner.createSpawner("BIGMotorizer", CBIGMotorizer);
    EntityTypeSpawner.createSpawner("CKER90", CCKER90);
    EntityTypeSpawner.createSpawner("KE_6H", CKE_6H);
    EntityTypeSpawner.createSpawner("SEW_9", CSEW_9);
    EntityTypeSpawner.createSpawner("Interlux", CInterlux);

    EntityTypeSpawner.createSpawner("SuperDamage", Invisible);
    EntityTypeSpawner.createSpawner("ElectricSphere", CElectricSphere);

    // Manages inbound entity data packs from the server.

    // TODO: Add docs if needed
    class CEntityManager {
        constructor(client) {
            this.clientRef = client;
            this.container = new Map();
            this.defineSocketEvents(client); // Used for composing the socket emit events here
        }

        clear() {
            this.container.clear();
        }

        existsOnClient(id) {
            return this.container.has(id);
        }

        addEntityFromDataPack(dataPack, client) {
            //if (dataPack.removed) return;
            let entity = EntityTypeSpawner.spawn(dataPack.entityType, dataPack, client);
            this.container.set(dataPack.id, entity);
            entity.onClientSpawn(dataPack, client);

            if (this.container.size < 1) return;
            let toArray = [...this.container.entries()];

            //if (dataPack.entityOrder >= toArray[toArray.length-2][1].getRealtimeProperty("entityOrder")) return;
            this.container = new Map(toArray.sort((a, b) => {
                return a[1].getRealtimeProperty("entityOrder") -
                    b[1].getRealtimeProperty("entityOrder");
            }));
        }

        getEntity(entityData) {
            return this.container.get(entityData.id);
        }

        getEntityByID(id) {
            return this.container.get(id);
        }

        removeEntity(id) {
            this.container.get(id).onClientDelete(this.clientRef);
            this.container.delete(id);
        }

        removeOutOfBoundsEntity(id) {
            this.container.delete(id);
        }

        defineSocketEvents(client) {
            // Receives an array of entities in the proximity of the
            // client player object, and spawns them here as the player
            // connects.
            client.on('initEntity', dataPack => {
                for (var id in dataPack) {
                    var entityData = dataPack[id];
                    this.addEntityFromDataPack(entityData, client);
                }
            });

            client.on('removeEntity', id => {
                if (this.existsOnClient(id)) {
                    if (id !== client.id) {
                        this.removeEntity(id);
                    }
                } else {
                    console.warn("Attempted to remove a non existent entity. Something's wrong here...");
                }
            });

            client.on('removeOutOfBoundsEntity', id => {
                if (this.existsOnClient(id)) {
                    if (id !== client.id && id !== client.player.output.invWeaponID) {
                        this.removeOutOfBoundsEntity(id);
                    }
                } else {
                    console.error("Attempted to remove a non existent entity:", id);
                }
            });

            client.addServerUpdateListener("updateEntity", dataPack => {
                for (var id in dataPack.entityData) {
                    var entityData = dataPack.entityData[id];
                    if (this.existsOnClient(id)) {
                        var existingEntity = this.getEntity(entityData);
                        existingEntity.updateFromDataPack(entityData, client);
                    } else {
                        console.error("Attempted to update a non existent entity:", entityData.eType, "with ID:", entityData.id);
                        //throw new Error("Attempted to update a non existent entity. There's a hole in your programming...");
                    }
                }
            });

            client.on("gameEvent-changeWorld", data => {
                this.clear();
                this.addEntityFromDataPack(data, client);
            });

            client.on('spawnEntity', entityData => {
                this.addEntityFromDataPack(entityData, client);
            });

        }

        updateEntities(deltaTime, client, map) {
            for (var pair of this.container) {
                pair[1].update(deltaTime, client, map);
            }
        }

        drawEntities() {
            for (var pair of this.container) {
                pair[1].draw();
            }
        }
    }

    window.ping = () => {
        return Scene.clientRef.latency;
    };

    window.client = () => {
        return Scene.clientRef;
    };

    window.player = () => {
        return Scene.clientRef.player;
    };

    window.entities = () => {
        return Scene.entityManager.container;
    };

    /**
     * @namespace ClientSide
     */

    // This is the initialization entry point

    var client = new CClient(io());
    io = undefined; // Restricting console from using this function.
    var entityDataReceiver = new CEntityManager(client);

    window.AssetManager = assMan;
    assMan.queue("client/config/assets.cfg");

    R.setup();
    Scene.run(entityDataReceiver, client);

}());
