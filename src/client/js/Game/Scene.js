// All game rendering and UI elements
// should loop here.

import R from "../Graphics/Renderer.js"
import AssetManager from "../AssetManager/AssetManager.js"
import UI from "../UI/UI.js";
import MiniMap from "../UI/MiniMap.js";
import KelvinBar from "../UI/KelvinBar.js";
import CrossHair from "../UI/Crosshair.js";
import HPBar from "../UI/HPBar.js";
import GunBox from "../UI/GunBox.js";
import ModBox from "../UI/ModBox.js";
import Stats from "../UI/Stats.js";


import TileMapManager from "./TileBased/TileMapManager.js"

const Scene = {
    _deltaTime: 0,
    _lastTime: 0,
    _currentMap: "MegaMap",
    _entityManager: null,
    _clientRef: null,

    get deltaTime() {
        return Scene._deltaTime;
    },

    get currentMapName() {
        return Scene._currentMap;
    },

    set currentMapName(val) {
        Scene._currentMap = val;
    },

    get entities() {
        return Scene._entityManager;
    },

    setup() {
        Scene.tileMaps = new TileMapManager();
        Scene.tileMaps.createMap("MegaMap", "tilemaps/MegaMap.json");
        Scene.tileMaps.createMap("lobby", "tilemaps/lobby.json");
        AssetManager.addDownloadCallback(() => {
            UI.setup(() => {
                UI.append(new MiniMap(Scene.tileMaps.getMap(Scene._clientRef.player.output._gameData.mapName)));
                UI.append(new KelvinBar());
                UI.append(new HPBar());
                UI.append(new GunBox());
                UI.append(new ModBox());
                UI.append(new Stats());
                UI.append(new CrossHair()); // Remember to keep this at the bottom
            });
            UI.init();
        });

    },

    getCurrentTileMap() {
        return Scene.tileMaps.getMap(Scene.currentMapName);
    },

    run(entityManager, client) {
        Scene._clientRef = client;
        Scene._entityManager = entityManager;

        Scene.setup();
        Scene.tick();
    },

    update() {
        if (AssetManager.done()) {
            Scene._clientRef.update(Scene._entityManager, Scene.deltaTime);
            UI.update(Scene._clientRef, Scene._entityManager);
            Scene._entityManager.updateEntities(Scene.deltaTime, Scene._clientRef, Scene.tileMaps.getMap(Scene._currentMap));
            let e = Scene._clientRef.player;
            if (e) {
                R.camera.update(e.getRealtimeProperty("_center"));
            }
        }
    },

    draw() {
        R.clear();
        if (AssetManager.done()) {
            Scene.tileMaps.getMap(Scene.currentMapName).draw();
            Scene._entityManager.drawEntities();
            UI.draw();
            R.drawText(Scene._clientRef._latency + "ms", 4, 4, "white");

        } else {
            var str = "Loading " +
                (((AssetManager.successCount + AssetManager.errorCount) / AssetManager.downloadQueue.length) * 100 | 0)
                + "%";
            R.drawText(str,
                (R.screenSize.x / 2 | 0) - R.context.measureText(str).width / 2,
                R.screenSize.y / 2 | 0,
                "white");

            R.drawText("Sphinx of black quartz, judge my vow...",
                (R.screenSize.x / 3 | 0) - R.context.measureText(str).width / 2,
                R.screenSize.y / 1.5 | 0,
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