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
    return {x: (a.x + b.x).fixed(), y: (a.y + b.y).fixed()};
}

function vecMulScalar(a, b) {
    return {x: (a.x * b).fixed(), y: (a.y * b).fixed()};
}

function vecSub(a, b) {
    return {x: (a.x - b.x).fixed(), y: (a.y - b.y).fixed()};
}

function linearInterpolation(p, n, t) {
    var _t = Number(t);
    _t = (Math.max(0, Math.min(1, _t))).fixed();
    return (p + _t * (n - p)).fixed();
}

function vectorLinearInterpolation(v, tv, t) {
    return {
        x: linearInterpolation(v.x, tv.x, t),
        y: linearInterpolation(v.y, tv.y, t)
    };
}

export {sqrt, linearInterpolation, vectorLinearInterpolation, vecMulScalar, vecSub, addVec}