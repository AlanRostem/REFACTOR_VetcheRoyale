// Contains math functions we create here
function sqrt(x){
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
}

Number.prototype.fixed = function(n) { n = n || 3; return parseFloat(this.toFixed(n)); };

function addVec(a, b) {
    return {_x: (a._x + b._x).fixed(), _y: (a._y + b._y).fixed()};
}

function vecMulScalar(a, b) {
    return {_x: (a._x * b).fixed(), _y: (a._y * b).fixed()};
}

function vecSub(a, b) {
    return {_x: (a._x - b._x).fixed(), _y: (a._y - b._y).fixed()};
}

function linearInterpolation(p, n, t) {
    var _t = Number(t);
    _t = (Math.max(0, Math.min(1, _t))).fixed();
    return (p + _t * (n - p)).fixed();
}

function vectorLinearInterpolation(v, tv, t) {
    return {
        _x: linearInterpolation(v._x, tv._x, t),
        _y: linearInterpolation(v._y, tv._y, t)
    };
}

export {sqrt, linearInterpolation, vectorLinearInterpolation, vecMulScalar, vecSub, addVec}