// Positional range calculation rect that starts at
// the center.
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

    // My version of finding an entity that is contained within a bounding
    // rect. The other ones are from Coding Train, but I don't like them.
    myContains(e) {
        var x = this.x - this.w;
        var y = this.y - this.h;
        var w = this.w * 2;
        var h = this.h * 2;
        return y + h > e.pos.y
            &&  y < (e.pos.y + e.height)
            && x + w > e.pos.x
            &&  x < (e.pos.x + e.width);

    }

    intersects(range) {
        return !(range.x - range.w > this.x + this.w ||
            range.x + range.w < this.x - this.w ||
            range.y - range.h > this.y + this.h ||
            range.y + range.h < this.y - this.h);
    }
}

module.exports = QTRect;