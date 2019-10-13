import AssetManager from "../../AssetManager.js"
import SoundEffect from "./SoundEffect.js";

class AudioPool {
    constructor() {
        this.maxInstance = 10;
        this.sounds = [];
    }

    play(src, objPos, canPlay) {
        let sound = new SoundEffect(src, objPos, canPlay);
        sound.play();
        this.sounds.push(sound);
        return sound;
    }

    stop(src) {
        if (this.sounds[src] !== undefined) {
            this.sounds[src].stop(src);
            delete this.sounds[src];
        }
    }

    update() {
        for (let i in this.sounds) {
            this.sounds[i].findPan();
            if (this.sounds[i].isEnded) {
                this.sounds[i].stop();
                delete this.sounds[i];
            }
        }
    }
}

export default new AudioPool();