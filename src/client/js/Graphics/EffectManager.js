import SpriteSheet from "../AssetManager/Classes/Graphical/SpriteSheet.js";
import ObjectNotationMap from "../../../shared/code/DataStructures/CObjectNotationMap.js";
import R from "./Renderer.js";

class EffectManager {
    constructor() {
        this.effects = [];
        this.sprite = new SpriteSheet("effects");
        this.animations = new ObjectNotationMap();
        const self = this;
        this.VisualEffect = class VisualEffect {
            constructor(x, y, name, duration = 0) {
                this.x = x;
                this.y = y;
                this.name = name;
                this.duration = duration;
                if (duration === 0) {
                    this.endOnSpriteAnim = true;
                }
                this.remove = false;
                let anim = self.animations.get(name);
                this.anim = new SpriteSheet.Animation(0, anim.endCol, anim.framesPerRow, anim.frameSpeed);
            }

            draw(deltaTime) {
                if (!this.endOnSpriteAnim) {
                    this.duration -= deltaTime;
                    this.remove = this.duration <= 0;
                } else {
                    this.remove = this.anim.currentCol === this.anim.framesPerRow - 1;
                }
                self.sprite.animate(this.name, this.anim, self.sprite.getWidth(this.name), self.sprite.getHeight(this.name));
                self.sprite.drawAnimated(this.x + R.camera.x, this.y + R.camera.y);
            }
        }
    }

    configureEffect(name, x, y, w, h, framesPerRow, animSpeed) {
        this.sprite.bind(name, x, y, w, h);
        this.animations.set(name, new SpriteSheet.Animation(0, framesPerRow - 1, framesPerRow, animSpeed))
    }

    createEffect(x, y, name, duration) {
        this.effects.push(new this.VisualEffect(x, y, name, duration))
    }

    draw(deltaTime) {
        for (let effect of this.effects) {
            effect.draw(deltaTime);
            if (effect.remove) {
                this.effects.splice(this.effects.indexOf(effect));
            }
        }
    }
}


export default new EffectManager();