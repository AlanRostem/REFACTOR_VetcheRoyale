function tileTest() {
    var TS = 8;
    var width = 8;
    var height = 16;
    var tileX = Math.floor(width / TS) + 1;
    var tileY = Math.floor(height / TS) + 1;

    var a = [];
    var i = 0;
    for (var y = -1; y < tileY; y++) {
        a.push([]);
        for (var x = -1; x < tileX; x++) {
            a[i].push(x + ", " + y);
        }
        i++;
    }
    console.table(a);
}
