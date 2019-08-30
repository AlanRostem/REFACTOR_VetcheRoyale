import AssetManager from "../../AssetManager.js"

export default class SoundEffect {
    constructor(src) {
        this.src = src;
    }

    play() {
        this.source = AssetManager.audioCtx.createBufferSource();
        this.source.buffer = AssetManager.get(this.src);
        this.source.connect(AssetManager.audioCtx.destination);
        this.source.start(0);
    }

    stop() {
        this.source.disconnect();
    }
};