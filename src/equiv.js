Object.equals = function (self, other) {
    if (!other || (typeof other === "number" && isNaN(other))) {
        //console.log("Object cannot equal to NaN, undefined or null!");
        return false;
    }

    let props1 = Object.keys(self);
    let props2 = Object.keys(other);

    if (props1.length === 0 && props2.length === 0) {
        return true;
    }
    if (props1.length !== props2.length) {
        //console.log("Object lengths didn't match!");
        return false;
    }


    for (let key of props1) {
        if (typeof self[key] === "object") {
            if (!Object.equals(self[key], other[key])) {
                //console.log("Object inside the object didn't match!");
                return false;
            }
            continue;
        }

        if (typeof self[key] === "function") {
            continue;
        }

        if (self[key] !== other[key]) {
            //console.log("Value inside the object didn't match!");
            return false;
        }
    }

    return true;
};

var o1 = {
    x: 1,
    y: 2,
    o: {
        x: 2,
        z: 10
    }
};

var o2 = {
    x: 1,
    y: 2,
    o: {
        x: 2,
        z: 10
    }
};

console.log(Object.equals(o1, o2));

o2.x = 10

console.log(Object.equals(o1, o2));
