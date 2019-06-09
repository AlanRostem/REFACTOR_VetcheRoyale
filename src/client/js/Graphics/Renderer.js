import Camera from "./Camera.js"
export default class R {

    static camera = new Camera();

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
}

window.R = R;