import CTileMap from "./CTileMap.js";
import AssetManager from "../../AssetManager/AssetManager.js"

/**
 *  Holds data of tile maps loaded from JSON
 */
class TileMapManager {
    constructor() {
        this.maps = {};
        AssetManager.addDownloadCallback(() => {
            for (let key in AssetManager.get("all_tilemaps.json").object) {
                if (key !== "tileSize") {
                    this.createMap(key);
                }
            }
        });
    }

    /**
     * Makes a new tile map object from a .json tile map source
     * @param name {string} - Name of the tile map
     */
    createMap(name) {
        this.maps[name] = new CTileMap("worldTileSet", name);
    }

    /**
     * Retrieves all the generated tile maps
     * @returns {object}
     */
    getAllMaps(){
        return this.maps;
    }

    /**
     * Retrieve a tile map by name
     * @param name {string} - Name of the tile map that was made
     * @returns {CTileMap}
     */
    getMap(name) {
        return this.maps[name];
    }

}

export default TileMapManager;