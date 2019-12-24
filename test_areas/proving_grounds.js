function callback(e) {
    console.log(item + e);
}

function event(e, callback) {
    let item = 10;
    callback.bind().apply(e);
}

event(10, callback);