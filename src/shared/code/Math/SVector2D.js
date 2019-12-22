var typeCheck = require("../Debugging/StypeCheck.js");

// 2D vector with mathematical methods
class Vector2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(vec) {
        typeCheck.instance(Vector2D, vec);
        this.x += vec.x;
        this.y += vec.y;
    }

    set(vec) {
        typeCheck.instance(Vector2D, vec);
        this.x = vec.x;
        this.y = vec.y;
    }

    dot(vec) {
        typeCheck.instance(Vector2D, vec);
        return this.x * vec.x + this.y * vec.y;
    }

    static scale(vec, val) {
        let u = new Vector2D(vec.x, vec.y);
        u.x *= val;
        u.y *= val;
        return u;
    }

    static abs(vec) {
        return Math.sqrt(vec.x ** 2 + vec.y ** 2)
    }

    static distance(a, b) {
        var x = b.x - a.x;
        var y = b.y - a.y;
        return Math.sqrt(x ** 2 + y ** 2);
    }

    static angle(a, b) {
        let x = b.x - a.x;
        let y = b.y - a.y;
        return Math.atan2(y, x)
    }

    static onSegment(p, q, r) {
        return q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) &&
            q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y)
    }

    static orientation(p, q, r) {
        let val = (q.y - p.y) * (r.x - q.x) -
            (q.x - p.x) * (r.y - q.y);

        if (val === 0) return 0;

        return (val > 0) ? 1 : 2;
    }

    static intersect(p1, q1, p2, q2) {

        // Find the four orientations needed for general and
        // special cases
        let o1 = this.orientation(p1, q1, p2);
        let o2 = this.orientation(p1, q1, q2);
        let o3 = this.orientation(p2, q2, p1);
        let o4 = this.orientation(p2, q2, q1);

        // General case
        if (o1 !== o2 && o3 !== o4)
            return true;

        // Special Cases
        // p1, q1 and p2 are colinear and p2 lies on segment p1q1
        if (o1 === 0 && this.onSegment(p1, p2, q1)) return true;

        // p1, q1 and q2 are colinear and q2 lies on segment p1q1
        if (o2 === 0 && this.onSegment(p1, q2, q1)) return true;

        // p2, q2 and p1 are colinear and p1 lies on segment p2q2
        if (o3 === 0 && this.onSegment(p2, p1, q2)) return true;

        // p2, q2 and q1 are colinear and q1 lies on segment p2q2
        if (o4 === 0 && this.onSegment(p2, q1, q2)) return true;

        return false; // Doesn't fall in any of the above cases

        /*
        const r = new Vector2D(b.x - a.x, b.y - a.y);
        const s = new Vector2D(d.x - c.x, d.y - c.y);

        var dd = r.x * s.y - r.y * s.x;
        var u = ((c.x - a.x) * r.y - (c.y - a.y) * r.x) / dd;
        var t = ((c.x - a.x) * s.y - (c.y - a.y) * s.x) / dd;
        return (0 < u && u < 1 && 0 < t && t < 1);
         */
    }

    static getIntersectedPos(a, b, c, d) {

        const r = new Vector2D(b.x - a.x, b.y - a.y);
        const s = new Vector2D(d.x - c.x, d.y - c.y);

        var dd = r.x * s.y - r.y * s.x;
        var t = ((c.x - a.x) * s.y - (c.y - a.y) * s.x) / dd;
        return new Vector2D(a.x + t * r.x, a.y + t * r.y);
    }
}

module.exports = Vector2D;