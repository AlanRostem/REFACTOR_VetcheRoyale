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

export {sqrt}