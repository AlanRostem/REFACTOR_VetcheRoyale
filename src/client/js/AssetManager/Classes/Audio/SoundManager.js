import AssetManager from "../../AssetManager.js"
import SoundEffect from "./SoundEffect.js";

class SoundPoop {
    constructor() {
        this.MAX_INSTANCE_COUNT = 10;
    }

    play(src) {
        let sound = new SoundEffect(src);
        sournd.play();
        return sound;
    }
}

export default new SoundPoop();