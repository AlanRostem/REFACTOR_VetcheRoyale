// All game rendering and UI elements
// should loop here.
export default class Scene {
    static start = false;

    static run() {
        // TODO: Setup calls here.
        Scene.tick();
    }

    static update() {

    }

    static draw() {

    }

    static tick() {
        Scene.update();
        Scene.draw();
        requestAnimationFrame(tick);
    }
}