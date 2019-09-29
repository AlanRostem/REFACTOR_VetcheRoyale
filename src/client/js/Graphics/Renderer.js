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
    drawText(str, x, y, color = "White", useCamera = false) {
        R.context.save();
        var img = AssetManager.get("font/ascii" + color + ".png");

        if (!img)  return;
        str = str.toString();
        for (var i = 0; i < str.length; i++) {
            var asciiCode = (str[i].toUpperCase().charCodeAt(0)) - 32;
            R.context.drawImage(img,
                (asciiCode % 8 * 4),
                ((asciiCode / 8) | 0) * 5,
                4, 5,
                Math.round(x + i * 5 + (useCamera ? R.camera.x : 0)),
                Math.round(y + (useCamera ? R.camera.y : 0)),
                4, 5);
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
        var a = Vector2D.angle(startPos, endPos) | 0;
        var d = Vector2D.distance(startPos, endPos) | 0;
        R.context.fillStyle = color;
        for (var i = 0; i < d; i += dotSpace) {
            var x = startPos.x + i * Math.cos(a);
            var y = startPos.y + i * Math.sin(a);
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
    }
};

window.R = R;
export default R;