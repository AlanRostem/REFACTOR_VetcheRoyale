import AssetManager from "../../AssetManager.js"
import R from "../../../Graphics/Renderer.js"
import Vector2D from "../../../../../shared/code/Math/CVector2D.js";

const MAX_DISTANCE = 320;

export default class SoundEffect {
    constructor(src, objPos, canPlay = true) {
        this.src = src;
        //  this.volume = volume;
        this.objPos = objPos;

        this.canPlay = canPlay;
        this.isEnded = false;

        this.gainNode = AssetManager.audioCtx.createGain();

        this.pannerOptions = {pan: 0};
        this.panner = new StereoPannerNode(AssetManager.audioCtx, this.pannerOptions);
    }

    play(src = this.src, objPos = this.objPos, canPlay = true) {
        if (AssetManager.audioCtx.state === 'suspended') AssetManager.audioCtx.resume();

        if (this.canPlay) {
            this.source = AssetManager.audioCtx.createBufferSource();
            this.source.onended = () => {
                this.isEnded = true;
            };

            this.source.buffer = AssetManager.get(this.src);
            this.source.connect(this.gainNode).connect(this.panner).connect(AssetManager.audioCtx.destination);
            this.source.start(0);
            this.canPlay = false;
        }
    }

    updatePanPos(obj) {
        this.objPos = obj;
    }

    stop() {
        this.source.disconnect();
        this.isEnded = true;
    }

    findPan() {
        if (!this.objPos) {
            return;
        }

        let pan = -(-R.camera.x + R.camera.offset.x - this.objPos.x) / R.screenSize.x * 2;
        this.gainNode.gain.value < 0 ? this.gainNode.gain.value = 0 : this.gainNode.gain.value = 1 - Vector2D.distance(this.objPos, R.camera.follow) / MAX_DISTANCE;
        if (this.gainNode.gain.value < 0) {
            this.gainNode.gain.value = 0;
        }
        if (pan > 1 || pan < -1) {
            pan = Math.sign(pan);
        }
        this.panner.pan.value = pan;

        // this.panner.pan.value = -Math.cos(Math.atan2(- R.camera.y + R.camera.offset.y - this.objPos.y,  - R.camera.x + R.camera.offset.x - this.objPos.x));
        // console.log(Math.atan2(R.camera.y + R.camera.offset.y - this.objPos.y,  R.camera.x + R.camera.offset.x - (this.objPos.x | 0)), - R.camera.x + R.camera.offset.x, this.objPos.x);
        // console.log(this.panner.pan.value);
        // console.log(Math.atan2(this.objPos.y - R.camera.offset.y,  this.objPos.x - R.camera.offset.x));
        // this.panner.pan.value < 1 ?  this.panner.pan.value+=0.05 : this.panner.pan.value = -1;
    }
};