// Manages animations for an object
export default class AnimationManager {
    constructor() {
        this.animations = {};
    }

    // Sets the current animation key
    setCurrentAnimation(name) {
        this.currentAnimName = name;
    }

    // Map an Animation object to a key
    addAnimation(name, animation) {
        this.animations[name] = animation;
    }


    getAnimation(name) {
        if (!this.animations[name]) {
            throw new Error("No animation such as " + name + " found!");
        }
        return this.animations[name];
    }

    // Animates the current animation mapped to currentAnimName
    animate(spriteSheetObj, spriteLocationName, fw, fh) {
        spriteSheetObj.animate(spriteLocationName, this.getAnimation(this.currentAnimName), fw, fh);
    }
}