class QTRect {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    contains(entity) {
        return !(entity.pos.x > this.x + this.w ||
            entity.pos.x + entity.width < this.x - this.w ||
            entity.pos.y > this.y + this.h ||
            entity.pos.y + entity.height < this.y - this.h);
    }

    intersects(range) {
        return !(range.x - range.w > this.x + this.w ||
            range.x + range.w < this.x - this.w ||
            range.y - range.h > this.y + this.h ||
            range.y + range.h < this.y - this.h);
    }
}

module.exports = QTRect;