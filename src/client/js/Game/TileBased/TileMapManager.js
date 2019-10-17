import CTileMap from "./CTileMap.js";

/**
 *  Holds data of tile maps loaded from JSON
 */
class TileMapManager {
    constructor() {
        this.maps = {};
    }

    /**
     * Makes a new tile map object from a .json tile map source
     * @param name {string} - Name of the tile map
     * @param src {string} - Relative file path of the tile map source file
     */
    createMap(name, src) {
        this.maps[name] = new CTileMap(src, "tileSet.png", name);
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