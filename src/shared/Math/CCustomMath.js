function sqrt(x){
    var s, t;

    s = 1;  t = x;
    while (s < t) {
        s <<= 1;
        t >>= 1;
    }//decide the value of the first tentative

    do {
        t = s;
        s = (x / s + s) >> 1;//x1=(N / x0 + x0)/2 : recurrence formula
    } while (s < t);

    return t;
}

Number.prototype.fixed = function(n) { n = n || 3; return parseFloat(this.toFixed(n)); };

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

export {sqrt, linearInterpolation, vectorLinearInterpolation}