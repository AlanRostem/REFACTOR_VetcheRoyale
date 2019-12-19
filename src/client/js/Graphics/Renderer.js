import Camera from "./Camera.js"
import Vector2D from "../../../shared/code/Math/CVector2D.js";


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
         * @param boundary {number} - Newline margin
         */
        drawText(str, x, y, color = "White", useCamera = false, boundary = 320, shade = true) {

            shade = true;
            var img = AssetManager.getMapImage("font" + (shade ? "Shade" : "") + color);
            var newLine = 0;
            var newLetter = 0;

            if (!img) return;
            if (str === undefined) return;
            str = str.toString();
            if (shade === false) {
                for (var i = 0; i < str.length; i++, newLetter++) {
                    if (newLetter * 5 > boundary) {
                        newLetter = 0;
                        newLine++;
                    }
                    if (str[i] === "\n") {
                        newLetter = -1;
                        newLine++;
                    } else {
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
            } else {
                for (var j = 0; j < str.length; j++, newLetter++) {
                    if (newLetter * 5 > boundary) {
                        newLetter = 0;
                        newLine++;
                    }
                    if (str[j] === "\n") {
                        newLetter = -1;
                        newLine++;
                    } else {
                        var asciiCode2 = (str[j].toUpperCase().charCodeAt(0)) - 32;
                        R.context.drawImage(img,
                            (asciiCode2 % 8 * 6),
                            ((asciiCode2 / 8) | 0) * 7,

                            6, 7,
                            Math.round(x + newLetter * 5 + (useCamera ? R.camera.x : 0)),
                            Math.round(y + newLine * 6 + (useCamera ? R.camera.y : 0)),
                            6, 7);
                    }
                }
            }
            R.context.restore();
        },


        drawLine(x0, y0, x1, y1, color = "White", thickness = 1, useCamera = false, space = 0, length = 1) {

            let counter = length;
            let drawPixel = true;

            let dim = thickness / 2 | 0;
            x0 = Math.round(x0) - dim;
            y0 = Math.round(y0) - dim;
            x1 = Math.round(x1) - dim;
            y1 = Math.round(y1) - dim;

            let dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
            let dy = Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
            let err = (dx > dy ? dx : -dy) / 2;

            while (true) {

                if ((counter-- && drawPixel) || !space) {
                    R.context.fillStyle = color;
                    R.context.fillRect(
                        Math.round(x0 + (useCamera ? R.camera.x : 0)),
                        Math.round(y0 + (useCamera ? R.camera.y : 0)),
                        thickness, thickness);
                }

                if (counter <= 0) {
                    drawPixel = !drawPixel;
                    counter = drawPixel ? length : space * thickness;
                }

                if (x0 === x1 && y0 === y1) break;

                var e2 = err;
                if (e2 > -dx) {
                    err -= dy;
                    x0 += sx;
                }
                if (e2 < dy) {
                    err += dx;
                    y0 += sy;
                }
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
        drawRect
            (color, x, y, width, height, useCamera = false, ctx = R.context) {
            ctx.save();
            ctx.fillStyle = color;
            ctx.fillRect(
                Math.round(x + (useCamera ? R.camera.displayPos.x : 0)),
                Math.round(y + (useCamera ? R.camera.displayPos.y : 0)),
                width, height);
            ctx.restore();
        }
        ,


        drawCroppedImage(img, cropX, cropY, cropW, cropH, x, y, w, h, useCamera = false) {
            if (img) {
                if (w === 0 || h === 0 || cropW === 0 || cropH === 0) return;
                R.context.drawImage(img, cropX, cropY, cropW, cropH,
                    Math.round(x + (useCamera ? R.camera.displayPos.x : 0)),
                    Math.round(y + (useCamera ? R.camera.displayPos.y : 0)),
                    Math.round(w),
                    Math.round(h));
            }
        }
        ,

        drawDebug() {
            R.drawText(R.debugStrings, 5, 5, "Green");
            R.debugStrings = "";
        }
    }
;

window.R = R;
export default R;