import typeCheck from "../Debugging/CtypeCheck.js"
import {sqrt} from "./CCustomMath.js"

// 2D vector with mathematical methods
export default class Vector2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(vec) {
        this.x += vec.x;
        this.y += vec.y;
    }

    set(vec) {
        this.x = vec.x;
        this.y = vec.y;
    }

    dot(vec) {
        return this.x * vec.x + this.y * vec.y;
    }

    scale(val) {
        this.x *= val;
        this.y *= val;
    }

    static distance(a, b) {
        var x = b.x - a.x;
        var y = b.y - a.y;
        return sqrt(x ** 2 + y ** 2);
    }

    static abs(vec) {
        return Math.sqrt(vec.x ** 2 + vec.y ** 2)
    }

    static angle(a, b) {
        let x = b.x - a.x;
        let y = b.y - a.y;
        return Math.atan2(y, x)
    }

    static intersect(a, b, c, d) {


        const r = new Vector2D(b.x - a.x, b.y - a.y);
        const s = new Vector2D(d.x - c.x, d.y - c.y);

        var dd = r.x * s.y - r.y * s.x;
        var u = ((c.x - a.x) * r.y - (c.y - a.y) * r.x) / dd;
        var t = ((c.x - a.x) * s.y - (c.y - a.y) * s.x) / dd;
        return (0 < u && u < 1 && 0 < t && t < 1);
    }

    static getIntersectedPos(a, b, c, d) {


        const r = new Vector2D(b.x - a.x, b.y - a.y);
        const s = new Vector2D(d.x - c.x, d.y - c.y);

        var dd = r.x * s.y - r.y * s.x;
        var t = ((c.x - a.x) * s.y - (c.y - a.y) * s.x) / dd;
        return new Vector2D(a.x + t * r.x, a.y + t * r.y);
    }
}
