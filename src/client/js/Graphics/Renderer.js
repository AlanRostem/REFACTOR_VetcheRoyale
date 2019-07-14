import Camera from "./Camera.js"
import Vector2D from "../../../shared/code/Math/CVector2D.js";


const R = {

    _camera: new Camera(0, 0),

    _resolution: 160,
    _aspectRatio: {
        x: 2,
        y: 1
    },

    _screenDimensions: {
        x: 2 * 160, //R._aspectRatio.x * R._resolution,
        y: 160 //R._aspectRatio.y * R._resolution
    },

    _canvas: null,
    _ctx: null,

    // Sets up an HTML _canvas element and initializes
    // rendering elements.
    setup() {
        R._canvas = document.createElement('canvas');
        R._ctx = R._canvas.getContext('2d');

        document.body.appendChild(R._canvas);
        document.body.style.margin = 0;

        R._canvas.imageSmoothingEnabled = false;


        R._canvas.width = R._screenDimensions.x;
        R._canvas.height = R._screenDimensions.y;


        this.calibrateScreen();
        window.onresize = e => {
            this.calibrateScreen();
        };
    },

    calibrateScreen() {
        R._aspectRatio.x = window.innerWidth / window.innerHeight;
        R._aspectRatio.y = 1;

        R._screenDimensions.x = Math.round(R._aspectRatio.x * R._resolution);
        R._screenDimensions.y = Math.round(R._aspectRatio.y * R._resolution);

        if (R._screenDimensions.x > 360) {
            R._screenDimensions.x = 320;
            R._screenDimensions.y = 160;
        }

        R._canvas.width = R._screenDimensions.x;
        R._canvas.height = R._screenDimensions.y;

        R._camera._offset.x = R._screenDimensions.x / 2 | 0;
        R._camera._offset.y = R._screenDimensions.y / 2 | 0;
    },

    get camera() {
        return R._camera;
    },

    get context() {
        if (R._ctx === null) {
            throw new Error("Rendering context is not defined! Maybe you forgot to set up the renderer.");
        }
        return R._ctx;
    },

    get ctx() {
        if (R._ctx === null) {
            throw new Error("Rendering context is not defined! Maybe you forgot to set up the renderer.");
        }
        return R._ctx;
    },

    get canvasElement() {
        if (R._canvas === null) {
            throw new Error("Canvas element is not defined! Maybe you forgot to set up the renderer.");
        }
        return R._canvas;
    },

    get WIDTH() {
        return R._screenDimensions.x;
    },

    get HEIGHT() {
        return R._screenDimensions.y;
    },

    get screenSize() {
        return R._screenDimensions;
    },

    clear() {
        R.context.clearRect(0, 0, R._canvas.width, R._canvas.height);
    },

    drawText(str, x, y, color = "white", useCamera = false, size = 5) {
        R.context.save();
        R._ctx.font = size + "px CGpixel";
        R.context.fillStyle = "Blue";
        R.context.fillText(str,
            (x + (useCamera ? R._camera.boundPos.x : 0) | 0),
            (y + (useCamera ? R._camera.boundPos.y : 0) | 0),
        );
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
                (x + (useCamera ? R._camera._pos.x : 0) | 0),
                (y + (useCamera ? R._camera._pos.y : 0) | 0),
                thickness, thickness);
        }
    },

    drawRect(color, x, y, width, height, useCamera = false) {
        R.context.save();
        R.context.fillStyle = color;
        R.context.fillRect(
            (x + (useCamera ? R.camera.boundPos.x : 0) | 0),
            (y + (useCamera ? R.camera.boundPos.y : 0) | 0),
            width, height
        );
        R.context.restore();
    }
};

export default R;