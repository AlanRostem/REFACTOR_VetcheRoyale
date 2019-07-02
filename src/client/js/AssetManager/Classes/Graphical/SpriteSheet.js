import AssetManager from "../../AssetManager.js"
import R from "../../../Graphics/Renderer.js";
import Scene from "../../../Game/Scene.js";


export default class SpriteSheet {
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
        AssetManager.addDownloadCallback(() => {
            this.offsetRects.set(name, new SpriteSheet.Rect(ox, oy, fw, fh));
        });
    }

    drawCropped(x, y, w, h, cropX, cropY, cropW, cropH, ctx = R.context) {
        ctx.drawImage(this.img, cropX, cropY, cropW, cropH, x, y, w, h);
    }

    drawStill(name, x, y, w = this.offsetRects.get(name).w, h = this.offsetRects.get(name).h, ctx = R.context) {
        var rect = this.offsetRects.get(name);
        ctx.drawImage(this.img, rect.x, rect.y, rect.w, rect.h, x, y, w, h);
    }

    getWidth(name) {
        return this.offsetRects.get(name).w;
    }

    getHeight(name) {
        return this.offsetRects.get(name).h;
    }

    animate(name, anim, fw, fh) {
        var deltaTime = Scene.deltaTime;

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

        var width = fw;
        var height = fh;

        this.animRect.x = this.offsetRects.get(name).x + width * (anim.currentCol % anim.framesPerRow | 0);
        this.animRect.y = this.offsetRects.get(name).y + height * (anim.currentCol / anim.framesPerRow | 0);
        this.animRect.w = width;
        this.animRect.h = height;
    }

    static beginChanges() {
        R.context.save();
    }

    static end() {
        R.context.restore();
    }

    setCentralOffset(value) {
        this.centralOffset = value;
    }

    flipX() {
        this.flipped = true;
    }

    drawAnimated(x, y, w = this.animRect.w, h = this.animRect.h) {
        var rect = this.animRect;
        if (this.flipped) {
            R.context.translate(x - this.centralOffset, y - this.centralOffset);
            R.context.scale(-1, 1);
        }
        R.context.drawImage(this.img,
            rect.x, rect.y, rect.w, rect.h,
            (!this.flipped ? x - this.centralOffset : -w + this.centralOffset / 2 | 0),
            (!this.flipped ? y - this.centralOffset : 0),
            w, h
        );
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

SpriteSheet.Animation = class {
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