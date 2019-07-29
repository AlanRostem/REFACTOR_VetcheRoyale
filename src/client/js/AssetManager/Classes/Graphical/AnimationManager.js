// Manages animations for an object
export default class AnimationManager {
    constructor() {
        this._animations = {};
    }

    // Sets the current animation key
    setCurrentAnimation(name) {
        this._currentAnimName = name;
    }

    // Map an Animation object to a key
    addAnimation(name, animation) {
        this._animations[name] = animation;
    }


    getAnimation(name) {
        if (!this._animations[name]) {
            throw new Error("No animation such as " + name + " found!");
        }
        return this._animations[name];
    }

    // Animates the current animation mapped to _currentAnimName
    animate(spriteSheetObj, spriteLocationName, fw, fh) {
        spriteSheetObj.animate(spriteLocationName, this.getAnimation(this._currentAnimName), fw, fh);
    }
}