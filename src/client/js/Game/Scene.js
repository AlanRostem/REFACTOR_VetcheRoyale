// All game rendering and UI elements
// should loop here.

import R from "../Graphics/Renderer.js"
export default class Scene {
    static start = false;

    static run() {
        // TODO: Setup calls here.
        Scene.tick();
    }

    static update() {

    }

    static draw() {
        R.clear();
    }

    static tick() {
        Scene.update();
        Scene.draw();
        requestAnimationFrame(tick);
    }
}