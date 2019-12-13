async function testAlgorithmTime(algorithm) {
    let start = Date.now();
    algorithm();
    console.log("Algorithm", algorithm.name, "took", Date.now() - start + "ms");
}

let count = 10000000000;
let x = 10000000;
let y = 10000000;
testAlgorithmTime(function byObject() {
    for (let i = 0; i < count; i++) {
        let obj = {
            x: x + 1,
            y: y + 1,
        };
    }
}).then(r => null);

testAlgorithmTime(function byNumber() {
    for (let i = 0; i < count; i++) {
        let x0 = x + 1;
        let y0 = y + 1;
    }
}).then(r => null);



