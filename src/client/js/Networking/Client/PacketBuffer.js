Object.equals = function (self, other) {
    if (typeof other === "number" && isNaN(other)) {
        //console.log("Object cannot equal to NaN, undefined or null!");
        return false;
    }

    if (other === null || other === undefined || self === null || self === undefined) {
        return self === other;
    }

    if (typeof self !== "object" || typeof other !== "object") {
        return self === other;
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


Object.copy = function (obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = new obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
};

class PacketBuffer {
    constructor() {
        this.buffer = {};
    }

    exportInitValues(values, composedEntity) {
        let snapShot = {};
        for (let key of values) {
            snapShot[key] = composedEntity[key];
            if (typeof composedEntity[key] === "object") {
                this.buffer[key] = Object.copy(composedEntity[key]);
            } else {
                this.buffer[key] = composedEntity[key];
            }
        }
        return snapShot;
    }

    export(values = Object.keys(this.buffer), composedEntity) {
        let snapShot = {};

        for (let key of values) {
            if (Object.equals(composedEntity[key], this.buffer[key])) continue;
            snapShot[key] = composedEntity[key];
            if (typeof composedEntity[key] === "object") {
                this.buffer[key] = Object.copy(composedEntity[key]);
            } else {
                this.buffer[key] = composedEntity[key];
            }
        }
        return snapShot;
    }
}

export default PacketBuffer;