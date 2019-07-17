// All game rendering and UI elements
// should loop here.

import R from "../Graphics/Renderer.js"
import AssetManager from "../AssetManager/AssetManager.js"
import TileSheet from "../AssetManager/Classes/Graphical/TileSheet.js";
import CTileMap from "./TileBased/CTileMap.js";
import UI from "../UI/UI.js";
import MiniMap from "../UI/MiniMap.js";
import KelvinBar from "../UI/KelvinBar.js";
import CrossHair from "../UI/Crosshair.js";
import HPBar from "../UI/HPBar.js";
import TileMapManager from "./TileBased/TileMapManager.js"

const Scene = {
    _deltaTime: 0,
    _lastTime: 0,
    _entityManager: null,
    _clientRef: null,

    get deltaTime() {
        return Scene._deltaTime;
    },

    setup() {
        Scene.tileMaps = new TileMapManager();
        Scene.tileMaps.createMap("MegaMap","tilemaps/MegaMap.json");
        AssetManager.addDownloadCallback(() => {
            UI.setup(() => {
                UI.append(new MiniMap(Scene.tileMaps.getMap("MegaMap")));
                UI.append(new KelvinBar()); // TODO: Look in file Karli fix
                UI.append(new HPBar());     // TODO: Look in file Karli fix
                UI.append(new CrossHair()); // Remember to keep this at the bottom
            });
            UI.init();
        });

    },

    run(entityManager, client) {
        Scene._clientRef = client;
        Scene._entityManager = entityManager;

        Scene.setup();
        Scene.tick();
    },

    update() {
        if (AssetManager.done()) {
            Scene._clientRef.update(Scene._entityManager);
            UI.update(Scene._clientRef, Scene._entityManager);
            Scene._entityManager.updateEntities(Scene.deltaTime);
        }
    },

    draw() {
        R.clear();
        if (AssetManager.done()) {
            Scene.tileMaps.getMap("MegaMap").draw();
            Scene._entityManager.drawEntities();
            UI.draw();

        } else {
            var str = "Loading " +
                (((AssetManager.successCount + AssetManager.errorCount) / AssetManager.downloadQueue.length) * 100 | 0)
                + "%";
            R.drawText(str,
                (R.screenSize.x / 2 | 0) - R.context.measureText(str).width / 2,
                R.screenSize.y / 2 | 0,
                "white");
        }
    },

    stop() {
        window.cancelAnimationFrame(Scene.tick);
    },

    tick(time) {
        if (time > 0)
            Scene._deltaTime = (time - Scene._lastTime) / 1000;

        Scene.update();
        Scene.draw();

        if (time > 0)
            Scene._lastTime = time;

        requestAnimationFrame(Scene.tick);
    }
};

window.Scene = Scene; // TODO: Remove debug

export default Scene;