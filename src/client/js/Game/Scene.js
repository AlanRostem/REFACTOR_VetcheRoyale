// All game rendering and UI elements
// should loop here.

import R from "../Graphics/Renderer.js"
import AssetManager from "../AssetManager/AssetManager.js"
import TileSheet from "../AssetManager/Classes/TileSheet.js";
import CTileMap from "./CTileMap.js";
import MyClient from "../Networking/MyClient.js";
import UI from "../UI/UI.js";
import MiniMap from "../UI/MiniMap.js";

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
            UI.setup(() => {
                UI.append(new MiniMap(Scene._t_tm));
            });
            UI.init();
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
            UI.update(Scene._clientRef);
            Scene._entityManager.updateEntities(Scene.deltaTime);
        }
    }

    static draw() {
        R.clear();
        if (AssetManager.done()) {
            if (Scene.t_ts) {
                Scene.t_ts.draw(Scene._t_tm);
                UI.draw(undefined);
            }
            Scene._entityManager.drawEntities();

            if (MyClient._qt)
            for (var rect of MyClient._qt) {
                if (rect.normal) {
                    R.context.strokeStyle = "red";
                    R.context.lineWidth = 2;
                    R.context.strokeRect(
                        rect.x
                        + R.camera.boundPos.x,
                        rect.y
                        + R.camera.boundPos.y,
                        rect.w, rect.h);
                } else {
                    R.context.strokeStyle = "lime";
                    R.context.lineWidth = 2;
                    R.context.strokeRect(
                        rect.x - rect.w
                        + R.camera.boundPos.x,
                        rect.y - rect.h
                        + R.camera.boundPos.y,
                        rect.w * 2, rect.h * 2);
                }
            }

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