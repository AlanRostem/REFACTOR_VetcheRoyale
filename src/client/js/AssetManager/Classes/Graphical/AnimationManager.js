/**
* Manages animations for an object by mapping certain Animation objects to strings.
 * @memberOf ClientSide
 */
class AnimationManager {
    constructor() {
        this.animations = {};
    }

    /**
    * Sets the current animation key to be played.
    * @param name {string} - String that decides the current animation to be played.
     */
    setCurrentAnimation(name) {
        this.currentAnimName = name;
    }

    /**
     * Creates a new animation mapped to a name.
     * @param name {string} - Name of the new animation.
     * @param animation {Animation} - Object with sprite animation configurations.
     */
    addAnimation(name, animation) {
        this.animations[name] = animation;
    }


    /**
     * Retrieve an existing animation.
     * @param name {string} - The mapped name of an existing animation.
     * @return {Animation}
     */
    getAnimation(name) {
        if (!this.animations[name]) {
            throw new Error("No animation such as " + name + " found!");
        }
        return this.animations[name];
    }

    getCurrentAnim() {
        return this.animations[this.currentAnimName];
    }

    /**
     * Function run in a draw loop that updates the animation frames.
     * @param spriteSheetObj {SpriteSheet} - Respective sprite sheet object
     * @param spriteLocationName {string} - Mapped location name of the sprite
     * @param fw {number} - Frame width of the sprite region
     * @param fh {number} - Frame height of the sprite region
     */
    animate(spriteSheetObj, spriteLocationName, fw, fh) {
        spriteSheetObj.animate(spriteLocationName, this.getAnimation(this.currentAnimName), fw, fh);
    }
}

export default AnimationManager;