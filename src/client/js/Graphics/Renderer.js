import Camera from "./Camera.js"
import Vector2D from "../../../shared/code/Math/CVector2D.js";


const R = {

    camera: new Camera(0, 0),

    resolution: 160,
    aspectRatio: {
        x: 2,
        y: 1
    },

    screenDimensions: {
        x: 2 * 160, //R.aspectRatio.x * R.resolution,
        y: 160 //R.aspectRatio.y * R.resolution
    },

    canvas: null,
    ctx: null,

    // Sets up an HTML canvas element and initializes
    // rendering elements.
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

    clear() {
        R.context.clearRect(0, 0, R.canvas.width, R.canvas.height);
    },

    drawText(str, x, y, color = "White", useCamera = false, size = 5) {
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

    drawRect(color, x, y, width, height, useCamera = false) {
        R.context.save();
        R.context.fillStyle = color;
        R.context.fillRect(
            Math.round(x + (useCamera ? R.camera.boundPos.x : 0)),
            Math.round(y + (useCamera ? R.camera.boundPos.y : 0)),
            width, height
        );
        R.context.restore();
    }
};

window.R = R;
export default R;