import AssetManager from "../AssetManager.js"
import R from "../../Graphics/Renderer.js";

export default class SpriteSheet {

    static Rect = class {
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

    static Animation = class {
        constructor(startCol, endCol, framesPerRow, frameSpeed) {
            this.startCol = startCol;
            this.endCol = endCol;
            this.framesPerRow = framesPerRow;
            this.frameSpeed = frameSpeed;

            this.currentCol = this.startCol;
            this.passedTime = 0;
            this.reversed = false;
            this.paused = false;
        }
    };

    constructor(src) {
        this.src = src;
        this.offsetRects = new Map();
        this.posRect = new SpriteSheet.Rect(0, 0, 0, 0);
        this.animRect = new SpriteSheet.Rect(0, 0, 0, 0);
        this.offsetTileRect = new SpriteSheet.Rect(0, 0, 0, 0);
    }

    get img() {
        return AssetManager.get(this.src);
    }

    bind(name, ox, oy, fw, fh) {
        this.offsetRects.set(name, new SpriteSheet.Rect(ox, oy, fw, fh));
    }

    drawCropped(x, y, w, h, cropX, cropY, cropW, cropH, ctx = R.context) {
        ctx.drawImage(this.img, cropX, cropY, cropW, cropH, x, y, w, h);
    }

    drawStill(name, x, y, w = this.offsetRects.get(name).w, h = this.offsetRects.get(name).h, ctx = R.context) {
        if (!this.img.isLoaded) return;
        var rect = this.offsetRects.get(name);
        ctx.drawImage(this.img, rect.x, rect.y, rect.w, rect.h, x, y, w, h);
    }

    getWidth(name) {
        return this.offsetRects.get(name).w;
    }

    getHeight(name) {
        return this.offsetRects.get(name).h;
    }

    animate(name, anim) {
        var deltaTime = 0;
        try {deltaTime = Game.deltaTime/1000;}
        catch (e) {deltaTime = 0;}

        if  (!anim.paused) {
            if ((anim.passedTime += deltaTime) >= anim.frameSpeed) {
                if (anim.currentCol < anim.endCol) {
                    anim.currentCol++;
                } else {
                    anim.currentCol = anim.startCol;
                }
                anim.passedTime = 0;
            }
        }

        var width = this.offsetRects.get(name).w;
        var height = this.offsetRects.get(name).h;

        this.animRect.x = this.offsetRects.get(name).x + width * (anim.currentCol % anim.framesPerRow | 0);
        this.animRect.y = this.offsetRects.get(name).y + height * (anim.currentCol / anim.framesPerRow | 0);
        this.animRect.w = width;
        this.animRect.h = height;
    }

    drawAnimated(x, y, w, h) {
        if (!this.img.isLoaded) return;
        var rect = this.animRect;
        R.context.drawImage(this.img, rect.x, rect.y, rect.w, rect.h, x, y, w, h);
    }
}