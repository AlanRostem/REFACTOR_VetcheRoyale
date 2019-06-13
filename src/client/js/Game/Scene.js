// All game rendering and UI elements
// should loop here.

import R from "../Graphics/Renderer.js"
import EntityDataReceiver from "./Entity/EntityDataReceiver.js"

export default class Scene {
    static _start = false;
    static _deltaTime = 0;
    static _lastTime = 0;
    static _entityManager = null;
    static _clientRef = null;

    static get deltaTime() {
        if (Scene._deltaTime === 0) {
            console.log("WARNING: Attempted to retrieve a delta time of zero.");
        }
        return Scene._deltaTime;
    }

    static run(entityManager, client) {
        Scene._clientRef = client;
        Scene._entityManager = entityManager;
        Scene.tick();
    }

    static update() {
        Scene._clientRef.update();
        Scene._entityManager.t_UpdateEntityData(Scene.deltaTime);
        Scene._entityManager.updateEntities(Scene.deltaTime);
    }

    static draw() {
        R.clear();
        Scene._entityManager.drawEntities();
    }

    static tick(time) {
        if (time > 0)
            Scene._deltaTime = (time - Scene._lastTime) / 1000;

        Scene.update();
        Scene.draw();

        if (time > 0)
            Scene._lastTime = time;

        requestAnimationFrame(Scene.tick);
    }
}