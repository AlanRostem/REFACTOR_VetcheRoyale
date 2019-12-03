// All game rendering and UI elements
// should loop here.

import R from "../Graphics/Renderer.js"
import AssetManager from "../AssetManager/AssetManager.js"
import AudioPool from "../AssetManager/Classes/Audio/AudioPool.js"
import CEventManager from "../CEventManager.js"
import UI from "../UI/UI.js";
import MiniMap from "../UI/MiniMap.js";
import KelvinBar from "../UI/KelvinBar.js";
import CrossHair from "../UI/Crosshair.js";
import HPBar from "../UI/HPBar.js";
import GunBox from "../UI/GunBox.js";
import ModBox from "../UI/ModBox.js";
import Stats from "../UI/Stats.js";


import TileMapManager from "./TileBased/TileMapManager.js"
import Announcement from "../UI/Announcement.js";
import EnemyDetector from "../UI/EnemyDetector.js";
import EffectManager from "../Graphics/EffectManager.js";

/**
 * The main object on the client that renders the game world and UI.
 * @namespace Scene
 * @memberOf ClientSide
 */
const Scene = {
    deltaTime: 0,
    lastTime: 0,
    currentMap: "MegaMap",
    entityManager: null,
    eventManager: null,
    clientRef: null,
    debugPause: false,


    /**
     * Get the current tile map name that is displayed
     * @memberOf Scene
     * @returns {string}
     */
    get currentMapName() {
        return Scene.currentMap;
    },

    set currentMapName(val) {
        Scene.currentMap = val;
    },

    get entities() {
        return Scene.entityManager;
    },

    /**
     * Initialization entry point for setting up certain things such as UI and game world variables on the client
     * @memberOf Scene
     */
    setup() {
        Scene.tileMaps = new TileMapManager();
        AssetManager.addDownloadCallback(() => {
            UI.setup(() => {
                UI.append(new MiniMap());
                UI.append(new Announcement());
                UI.append(new KelvinBar());
                UI.append(new HPBar());
                UI.append(new GunBox());
                UI.append(new ModBox());
                UI.append(new Stats(Scene.clientRef));
                UI.append(new EnemyDetector());
                UI.append(new CrossHair()); // Remember to keep this at the bottom
            });
            UI.init();
        });

    },

    /**
     * Retrieves the current displayed tile map
     * @memberOf Scene
     * @returns {CTileMap}
     */
    getCurrentTileMap() {
        return Scene.tileMaps.getMap(Scene.currentMapName);
    },

    /**
     * Start the client side application
     * @memberOf Scene
     * @param entityManager {CEntityManager} - Main client entity manager
     * @param client {CClient} - Reference to the end user object
     */
    run(entityManager, client) {
        Scene.clientRef = client;
        Scene.entityManager = entityManager;
        Scene.eventManager = new CEventManager(); // TODO::Kor ska denne?

        Scene.setup();
        Scene.tick();
    },

    /**
     * Game loop that runs after the asset manager successfully loads all assets
     * @memberOf Scene
     */
    update() {
        if (AssetManager.done() && !Scene.debugPause) {
            Scene.clientRef.update(Scene.entityManager, Scene.deltaTime);
            if (!Scene.clientRef.isReady()) return;
            Scene.eventManager.update(Scene.clientRef, Scene.deltaTime);
            UI.update(Scene.deltaTime, Scene.clientRef, Scene.entityManager);
            Scene.entityManager.updateEntities(Scene.deltaTime, Scene.clientRef, Scene.tileMaps.getMap(Scene.currentMap));
            R.camera.update();
            AudioPool.update();
        }
    },

    /**
     * Draw loop that runs after the asset manager successfully loads all assets
     * @memberOf Scene
     */
    draw() {
        R.clear();
        if (Scene.clientRef.disconnected) {
            R.drawText("YOU HAVE BEEN DISCONNECTED", (R.screenSize.x / 2 | 0) - "YOU HAVE BEEN DISCONNECTED".length * 4 / 2,
                R.screenSize.y / 2 | 0, "Red");
            R.drawText(Scene.clientRef.discReasonMsg, (R.screenSize.x / 2 | 0) -
                4 * Scene.clientRef.discReasonMsg.length / 2,
                (R.screenSize.y / 2 | 0) + 8, "Red");
            R.drawText(Scene.clientRef.discActionMsg, (R.screenSize.x / 2 | 0) -
                4 * Scene.clientRef.discActionMsg.length / 2,
                (R.screenSize.y / 2 | 0) + 16, "Red");
            return;
        }

        if (AssetManager.done()) {
            if (!Scene.clientRef.isReady()) return;
            Scene.tileMaps.getMap(Scene.currentMapName).draw();
            Scene.entityManager.drawEntities();
            EffectManager.draw(Scene.deltaTime);
            UI.draw();
            document.body.style.cursor = "none";
        } else {
            document.body.style.cursor = "default";
            var str = "Loading " +
                (((AssetManager.successCount + AssetManager.errorCount) / AssetManager.downloadQueue.length) * 100 | 0)
                + "%";
            R.drawText(str,
                (R.screenSize.x / 2 | 0) - R.context.measureText(str).width / 2,
                R.screenSize.y / 2 | 0,
                "Green");

            R.drawText("Sphinx of black quartz, judge my vow...",
                (R.screenSize.x / 3 | 0) - R.context.measureText(str).width / 2,
                R.screenSize.y / 1.5 | 0,
                "Green");

        }


        R.debug(Scene.clientRef.latency + "ms" + (Scene.clientRef.latency > 100 ? " is too high :3 xD to lobby" : ""));
        R.drawDebug();
    },

    tick(time) {
        if (time > 0)
            Scene.deltaTime = ((time - Scene.lastTime) / 1000).fixed(3);

        Scene.update();
        Scene.draw();

        if (time > 0)
            Scene.lastTime = time;

        requestAnimationFrame(Scene.tick);
    }
};

window.Scene = Scene;
export default Scene;
