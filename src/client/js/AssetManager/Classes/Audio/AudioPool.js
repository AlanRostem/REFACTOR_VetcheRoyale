import AssetManager from "../../AssetManager.js"
import SoundEffect from "./SoundEffect.js";

class AudioPool {
    constructor() {
        this.maxInstance = 10;
        this.SFXrefs = {};

    }

    play(src, objPos, canPlay) {
        if (this.SFXrefs[src] === undefined) {
            let sound = new SoundEffect(src, objPos, canPlay);
            sound.play();
            this.SFXrefs[src] = sound;
            return sound;
        } else this.SFXrefs[src].objPos = objPos;

    }

    update() {
        for (let key in this.SFXrefs) {
            this.SFXrefs[key].findPan();
            if (this.SFXrefs[key].isEnded)
            {
                this.SFXrefs[key].stop();
                delete this.SFXrefs[key];
            }
        }
    }

}

export default new AudioPool();