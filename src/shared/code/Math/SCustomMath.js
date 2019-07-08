import {sqrt} from "./CCustomMath";

const VMath = {
    sqrt: function sqrt(x){
        var s, t;

        s = 1;  t = x;
        while (s < t) {
            s <<= 1;
            t >>= 1;
        }

        do {
            t = s;
            s = (x / s + s) >> 1;
        } while (s < t);

        return t;
    },

    lerp: function linearInterpolation(p, n, t) {
        var _t = Number(t);
        _t = (Math.max(0, Math.min(1, _t))).fixed();
        return (p + _t * (n - p)).fixed();
    },

    vLerp: function vectorLinearInterpolation(v, tv, t) {
        return {
            _x: linearInterpolation(v._x, tv._x, t),
            _y: linearInterpolation(v._y, tv._y, t)
        };
    },

    sin(pos1, pos2) {
        var yy = pos2.y - pos2.y;
        var m = sqrt(xx**2 + yy**2);
        return yy / m;
    },

    cos(pos1, pos2) {
        var xx = pos2.x - pos2.x;
        var m = sqrt(xx**2 + yy**2);
        return xx / m;
    }
};

Number.prototype.fixed = function(n) { n = n || 3; return parseFloat(this.toFixed(n)); };

module.exports = VMath;