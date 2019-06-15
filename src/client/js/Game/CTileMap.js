import TileSheet from "../AssetManager/Classes/TileSheet.js";

export default class CTileMap {
    constructor() {
        this.t_array = mappu;
        this.t_array.w = 480;
        this.t_array.h = 272;
        this.t_array.dontDrawID = 0;
        this.t_array. withinRange = (x, y) => {
            return x >= 0 && x <= this.t_array.w && y >= 0 && y <= this.t_array.h;
        }
    }
}