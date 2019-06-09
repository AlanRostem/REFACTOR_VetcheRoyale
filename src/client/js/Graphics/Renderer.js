import Camera from "./Camera.js"
import Vector2D from "../../../shared/Math/Vector2D.js";
export default class R {

    static camera = new Camera(0, 0);

    static resolution = 160;
    static aspectRatio = {
        x: 2,
        y : 1
    };

    static screenDimensions = {
        x: R.aspectRatio.x * R.resolution,
        y: R.aspectRatio.y * R.resolution
    };

    static renderDistance = null; // TODO: Multiply an amount of tiles with tile size

    static canvas = null;
    static ctx = null;

    // Sets up an HTML canvas element and initializes
    // rendering elements.
    static setup() {
        R.canvas = document.createElement('canvas');
        R.ctx = R.canvas.getContext('2d');

        document.body.appendChild(R.canvas);
        document.body.style.margin = 0;

        R.canvas.style.width = "100%";

        R.canvas.width = R.screenDimensions.x;
        R.canvas.height = R.screenDimensions.y;

        R.canvas.style.backgroundColor = "black";
        R.canvas.style.imageRendering = "pixelated";

        window.onresize = e => {
            R.screenDimensions.x = R.aspectRatio.x * R.resolution;
            R.screenDimensions.y = R.aspectRatio.y * R.resolution;

            if (R.screenDimensions.x > 360) {
                R.screenDimensions.x = 320;
                R.screenDimensions.y = 160;
            }

            R.canvas.width = R.screenDimensions.x;
            R.canvas.height = R.screenDimensions.y;

            //camera.offset.x = R.screenDimensions.x / 2;
            //camera.offset.y = R.screenDimensions.y / 2;
        };
    }

    static get context() {
        if (R.ctx === null) {
            throw new Error("Rendering context is not defined! Maybe you forgot to set up the renderer.");
        }
        return R.ctx;
    }

    static get canvasElement() {
        if (R.canvas === null) {
            throw new Error("Canvas element context is not defined! Maybe you forgot to set up the renderer.");
        }
        return R.canvas;
    }

    static get screenSize() {
        return R.screenDimensions;
    }

    static clear() {
        R.context.clearRect(0, 0, R.canvas.width, R.canvas.height);
    }

    static drawText(str, x, y, color = "white", useCamera = false, size = 16) {
        R.context.save();
        //R.ctx.font = size + "px EXEPixelPerfect";
        R.context.fillStyle = color;
        R.context.fillText(str,
            x + useCamera ? R.camera.pos.x : 0,
            y + useCamera ? R.camera.pos.y : 0,
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
                x + useCamera ? R.camera.pos.x : 0,
                y + useCamera ? R.camera.pos.y : 0,
                thickness, thickness);
        }
    }

    static drawRect(color, x, y, width, height, useCamera = false) {
        R.context.save();
        R.context.fillStyle = color;
        R.context.fillRect(
            x + useCamera ? R.camera.pos.x : 0,
            y + useCamera ? R.camera.pos.y : 0,
            width,
            height
        );
        R.ctx.restore();
    }
}
