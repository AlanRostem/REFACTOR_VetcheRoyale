class ClassInit {
    prop = 10;
}

class ConInit {
    constructor(props) {
        this.prop = 10;
    }
}

async function testAlgorithmTime(algorithm) {
    let start = Date.now();
    algorithm();
    console.log("Algorithm", algorithm.name, "took", Date.now() - start + "ms");
}

let count = 10000000;

testAlgorithmTime(function byConInit() {
    for (let i = 0; i < count; i++)
        new ConInit()
}).then(r => 1);

testAlgorithmTime(function byClassInit() {
    for (let i = 0; i < count; i++)
        new ClassInit()
}).then(r => 1);

