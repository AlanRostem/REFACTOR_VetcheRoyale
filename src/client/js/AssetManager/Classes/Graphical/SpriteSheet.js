import AssetManager from "../../AssetManager.js"
import R from "../../../Graphics/Renderer.js";
import Scene from "../../../Game/Scene.js";


/**
 * Class representation of a sprite sheet. Has many features such as cropping and animating.
 * @memberOf ClientSide
 */
class SpriteSheet {
    /**
     * @param src {string} - Relative file path of the sprite sheet retrieved by AssetManager
     * @see AssetManager
     */
    constructor(src) {
        this.src = src;
        AssetManager.addDownloadCallback(() => {
            this.img = AssetManager.get(this.src);
        });
        /**
         * Map of rectangles representing sprite regions
         * @type {Map<string, SpriteSheet.Rect>}
         */
        this.offsetRects = new Map();
        this.posRect = new SpriteSheet.Rect(0, 0, 0, 0);
        this.animRect = new SpriteSheet.Rect(0, 0, 1, 1);
        this.offsetTileRect = new SpriteSheet.Rect(0, 0, 0, 0);
        this.centralOffset = 0;
    }

    /**
     * Map a name to a bounding rect on the sprite.
     * @param name {string} - Mapping name
     * @param ox {number} - Horizontal offset starting from top-left corner of the sprite
     * @param oy {number} - Vertical offset starting from top-left corner of the sprite
     * @param fw {number} - Frame width of the given sprite region
     * @param fh {number} - Frame height of the given sprite region
     */
    bind(name, ox, oy, fw, fh) {
        AssetManager.addDownloadCallback(() => {
            this.offsetRects.set(name, new SpriteSheet.Rect(ox, oy, fw, fh));
        });
    }

    /**
     * Manually crop the image and draw it. Called in a draw loop.
     * @param x {number} - Output position x
     * @param y {number} - Output position y
     * @param w {number} - Output position width
     * @param h {number} - Output position height
     * @param cropX {number} - Cropping value on the sprite
     * @param cropY {number} - Cropping value on the sprite
     * @param cropW {number} - Cropping value on the sprite
     * @param cropH {number} - Cropping value on the sprite
     * @param ctx {CanvasRenderingContext2D} - Default parameter to R.context. Can be overridden to draw on different canvases
     */
    drawCropped(cropX, cropY, cropW, cropH, x, y, w, h, ctx = R.context) {
        if (this.img) {
            if (w === 0 || h === 0 || cropW === 0 || cropH === 0) return;
            ctx.drawImage(this.img, cropX, cropY, cropW, cropH,
                Math.round(x),
                Math.round(y),
                Math.round(w),
                Math.round(h));
        }
    }

    /**
     * Draw a mapped part of the sprite that was bound by the bind() method
     * @param name {string} - Mapped bounding rect name
     * @param w {number} - Default parameter of frame width of the mapped portion
     * @param h {number} - Default parameter of frame height of the mapped portion
     * @param ctx {CanvasRenderingContext2D} - Default parameter to R.context. Can be overridden to draw on different canvases
     */
    drawStill(name, x, y, w = this.offsetRects.get(name).w, h = this.offsetRects.get(name).h, ctx = R.context) {
        if (this.img) {
            var rect = this.offsetRects.get(name);
            ctx.drawImage(this.img, rect.x, rect.y, rect.w, rect.h, Math.round(x), Math.round(y), w, h);
        }
    }

    /**
     * Retrieve the frame width in pixels of a bound sprite region
     * @param name {string} - Sprite region name
     * @returns {number}
     */
    getWidth(name) {
        return this.offsetRects.get(name).w;
    }

    /**
     * Retrieve the frame height in pixels of a bound sprite region
     * @param name {string} - Sprite region name
     * @returns {number}
     */
    getHeight(name) {
        return this.offsetRects.get(name).h;
    }

    /**
     * Call in a loop and it will cycle through all the respective animation frames.
     * In order for the animation to work properly it MUST call on an individual Animation
     * instance that belongs to an individual entity. This method must also be called BEFORE
     * the drawAnimated() method of the static SpriteSheet object.
     * @param name {string} - Respective sprite region mapping name
     * @param anim {Animation} - Instance of animation belonging to an instance of CEntity
     * @param fw {number} - Frame width of the sprite region
     * @param fh {number} - Frame height of the sprite region
     */
    animate(name, anim, fw, fh) {
        if (!this.offsetRects.get(name)) return;

        var deltaTime = Scene.deltaTime;

        if (!anim.paused) {
            if ((anim.passedTime += deltaTime) >= anim.frameSpeed) {
                if (anim.currentCol < anim.endCol) {
                    anim.currentCol++;
                } else {
                    anim.currentCol = anim.startCol;
                }
                anim.passedTime = 0;
            }
        }

        var width = fw;
        var height = fh;

        this.animRect.w = width;
        this.animRect.h = height;

        this.animRect.x = this.offsetRects.get(name).x + width * (anim.currentCol % anim.framesPerRow | 0);
        this.animRect.y = this.offsetRects.get(name).y + height * (anim.currentCol / anim.framesPerRow | 0);
    }

    /**
     * Calls upon R.context.save()
     */
    static beginChanges() {
        R.context.save();
    }

    /**
     * Calls upon R.context.restore()
     */
    static end() {
        R.context.restore();
    }

    /**
     * Sets the default central draw offset on the x-axis
     * @param value {number} - Pixel amount
     */
    setCentralOffset(value) {
        this.centralOffset = value;
    }

    /**
     * Flips the currently drawn sprite in a draw loop
     */
    flipX() {
        this.flipped = true;
    }

    /**
     * Call in a loop after calling this.animate to draw the cycling frames of the animation.
     * @param x {number} - Horizontal screen position
     * @param y {number} - Vertical screen position
     * @param w {number} - Output width of the sprite (defaults to the animation width)
     * @param h {number} - Output height of the sprite (defaults to the animation height)
     */
    drawAnimated(x, y, w = this.animRect.w, h = this.animRect.h) {
        if (!this.img) return;

        var rect = this.animRect;

        // FireFox compatibility sake
        if (rect.w === 0 || rect.h === 0) {
            this.flipped = false;
            return;
        }

        if (this.flipped) {
            R.context.translate(x - this.centralOffset, y - this.centralOffset);
            R.context.scale(-1, 1);
        }

        R.context.drawImage(this.img,
            rect.x, rect.y, rect.w, rect.h,
            Math.round(!this.flipped ? x - this.centralOffset : -w + this.centralOffset / 2),
            Math.round(!this.flipped ? y - this.centralOffset : 0),
            w, h);

        this.flipped = false;
    }

    drawCroppedAnimated(cropX, cropY, cropW, cropH, x, y, w = this.animRect.w, h = this.animRect.h, ctx = R.context) {
        if (!this.img) return;

        var rect = this.animRect;

        // FireFox compatibility sake
        if (rect.w === 0 || rect.h === 0) {
            this.flipped = false;
            return;
        }

        if (this.flipped) {
            R.context.translate(x - this.centralOffset, y - this.centralOffset);
            R.context.scale(-1, 1);
        }

        if (w === 0 || h === 0 || cropW === 0 || cropH === 0) return;

        R.context.drawImage(this.img,
            rect.x - cropX, rect.y - cropY, cropW, cropH,
            Math.round(!this.flipped ? x - this.centralOffset : -w + this.centralOffset / 2),
            Math.round(!this.flipped ? y - this.centralOffset : 0),
            Math.round(w),
            Math.round(h));

        this.flipped = false;
    }

}

SpriteSheet.Rect = class {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    setPos(x, y) {
        this.x = x;
        this.y = y;
    }
};

/**
 * Static interface for configuring different sprite animations
 * @type {SpriteSheet.Animation}
 */
SpriteSheet.Animation = class Animation {
    /**
     *
     * @param startCol {number} - Start column relative to the mapped sprite region position
     * @param endCol {number} - End column relative to the mapped sprite region position
     * @param framesPerRow {number} - Number of frames per row if the animation has multiple rows relative to the mapped region
     * @param frameSpeed {number} - Frame speed in seconds
     */
    constructor(startCol, endCol, framesPerRow, frameSpeed) {
        this.startCol = startCol;
        this.endCol = endCol;
        this.framesPerRow = framesPerRow;
        this.frameSpeed = frameSpeed;

        this.currentCol = this.startCol;
        this.passedTime = 0;
        this.reversed = false;
        this.paused = false;
        this.centralOffset = 0;
    }
};

export default SpriteSheet;