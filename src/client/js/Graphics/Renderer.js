import Camera from "./Camera.js"
import Vector2D from "../../../shared/Math/CVector2D.js";
export default class R {

    static _camera = new Camera(0, 0);

    static _resolution = 160;
    static _aspectRatio = {
        x: 2,
        y : 1
    };

    static _screenDimensions = {
        x: R._aspectRatio.x * R._resolution,
        y: R._aspectRatio.y * R._resolution
    };

    static _renderDistance = null; // TODO: Multiply an amount of tiles with tile size

    static _canvas = null;
    static _ctx = null;

    // Sets up an HTML _canvas element and initializes
    // rendering elements.
    static setup() {
        R._canvas = document.createElement('canvas');
        R._ctx = R._canvas.getContext('2d');

        document.body.appendChild(R._canvas);
        document.body.style.margin = 0;

        R._canvas.style.width = "100%";
        R._canvas.style.height = "100%";

        R._canvas.width = R._screenDimensions.x;
        R._canvas.height = R._screenDimensions.y;

        R._canvas.style.backgroundColor = "black";
        R._canvas.style.imageRendering = "pixelated";

        this.calibrateScreen();
        window.onresize = e => {
            this.calibrateScreen();
        };
    }

    static calibrateScreen() {
        R._aspectRatio.x = window.innerWidth / window.innerHeight;
        R._aspectRatio.y = 1;

        R._screenDimensions.x = R._aspectRatio.x * R._resolution;
        R._screenDimensions.y = R._aspectRatio.y * R._resolution;

        if (R._screenDimensions.x > 360) {
            R._screenDimensions.x = 320;
            R._screenDimensions.y = 160;
        }

        R._canvas.width = R._screenDimensions.x;
        R._canvas.height = R._screenDimensions.y;

        //R._camera._offset.x = R._screenDimensions.x / 2;
        //R._camera._offset.y = R._screenDimensions.y / 2;
    }

    static get camera() {
        return R._camera;
    }

    static get context() {
        if (R._ctx === null) {
            throw new Error("Rendering context is not defined! Maybe you forgot to set up the renderer.");
        }
        return R._ctx;
    }

    static get canvasElement() {
        if (R._canvas === null) {
            throw new Error("Canvas element context is not defined! Maybe you forgot to set up the renderer.");
        }
        return R._canvas;
    }

    static get screenSize() {
        return R._screenDimensions;
    }

    static clear() {
        R.context.clearRect(0, 0, R._canvas.width, R._canvas.height);
    }

    static drawText(str, x, y, color = "white", useCamera = false, size = 16) {
        R.context.save();
        R._ctx.font = size + "px EXEPixelPerfect";
        R.context.fillStyle = color;
        R.context.fillText(str,
            x + (useCamera ? R._camera._pos.x : 0),
            y + (useCamera ? R._camera._pos.y : 0),
        );
        R.context.restore();
    }

    static drawLine(startPos, endPos, thickness = 1, color = "white", dotSpace = 1, useCamera = false) {
        var a = Vector2D.angle(startPos, endPos) | 0;
        var d = Vector2D.distance(startPos, endPos) | 0;
        R.context.fillStyle = color;
        for (var i = 0; i < d; i+= dotSpace) {
            var x = startPos.x + i * Math.cos(a);
            var y = startPos.y + i * Math.sin(a);
            R.context.fillRect(
                x + (useCamera ? R._camera._pos.x : 0),
                y + (useCamera ? R._camera._pos.y : 0),
                thickness, thickness);
        }
    }

    static drawRect(color, x, y, width, height, useCamera = false) {
        R.context.save();
        R.context.fillStyle = color;
        R.context.fillRect(
            x + (useCamera ? R._camera._pos.x : 0),
            y + (useCamera ? R._camera._pos.y : 0),
            width,
            height
        );
        R.context.restore();
    }
}