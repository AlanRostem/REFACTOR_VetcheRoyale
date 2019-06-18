// All game rendering and UI elements
// should loop here.

import R from "../Graphics/Renderer.js"
import AssetManager from "../AssetManager/AssetManager.js"
import TileSheet from "../AssetManager/Classes/TileSheet.js";
import CTileMap from "./CTileMap.js";

export default class Scene {
    static _deltaTime = 0;
    static _lastTime = 0;
    static _entityManager = null;
    static _clientRef = null;
    static _t_tm = new CTileMap();

    static get deltaTime() {
        if (Scene._deltaTime === 0) {
            console.warn("Attempted to retrieve a delta time of zero.");
        }
        return Scene._deltaTime;
    }

    static setup() {
        AssetManager.addDownloadCallback(() => {
            Scene.t_ts = new TileSheet("tileSet.png", 8, Scene._t_tm);
        });
    }

    static run(entityManager, client) {
        Scene._clientRef = client;
        Scene._entityManager = entityManager;
        Scene.setup();
        Scene.tick();
    }

    static update() {
        if (AssetManager.done()) {
            Scene._clientRef.update(Scene._entityManager);
            Scene._entityManager.updateEntities(Scene.deltaTime);
        }
    }

    static draw() {
        R.clear();

        if (AssetManager.done()) {
            if (Scene.t_ts) {
                Scene.t_ts.draw(Scene._t_tm);
            }
            Scene._entityManager.drawEntities();
        } else {
            var str = "Loading " +
                (((AssetManager.successCount + AssetManager.errorCount) / AssetManager.downloadQueue.length) * 100 | 0)
                + "%";
            R.drawText(str,
                (R.screenSize.x / 2 | 0) - R.context.measureText(str).width / 2,
                R.screenSize.y / 2 | 0,
                "white");
        }
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