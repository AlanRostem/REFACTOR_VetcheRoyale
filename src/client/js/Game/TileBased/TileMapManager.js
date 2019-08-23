import CTileMap from "./CTileMap.js";

// Holds data of tile maps loaded from JSON
export default class TileMapManager {
    constructor() {
        this._maps = {};
    }

    createMap(name, src) {
        this._maps[name] = new CTileMap(src, "tileSet.png", name);
    }

    getAllMaps(){
        return this._maps;
    }

    getMap(name) {
        return this._maps[name];
    }

}