import CTileMap from "./CTileMap.js";

// Holds data of tile maps loaded from JSON
export default class TileMapManager {
    constructor() {
        this.maps = {};
    }

    createMap(name, src) {
        this.maps[name] = new CTileMap(src, "tileSet.png", name);
    }

    getAllMaps(){
        return this.maps;
    }

    getMap(name) {
        return this.maps[name];
    }

}