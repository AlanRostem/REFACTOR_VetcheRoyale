export default class AnimationManager {
    constructor() {
        this._animations = {};
    }

    setCurrentAnimation(name) {
        this._currentAnimName = name;
    }

    addAnimation(name, animation) {
        this._animations[name] = animation;
    }

    getAnimation(name) {
        if (!this._animations[name]) {
            throw new Error("No animation found!");
        }
        return this._animations[name];
    }

    animate(spriteSheetObj, spriteLocationName, fw, fh) {
        spriteSheetObj.animate(spriteLocationName, this.getAnimation(this._currentAnimName), fw, fh);
    }
}