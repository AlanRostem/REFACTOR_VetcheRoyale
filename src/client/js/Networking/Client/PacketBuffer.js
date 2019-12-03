class Empty {
}

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

Object.isJSON = function (obj) {
    return obj !== undefined && obj !== null && !(typeof obj === "number" && isNaN(obj)) && typeof obj !== "string" && typeof obj !== "number" && typeof obj !== "boolean";
};


Object.copy = function (obj, oneTimeValues = []) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = new obj.constructor();
    for (var key in obj) {
        if (oneTimeValues.find((e) => {
            return e === key
        })) continue;
        if (typeof obj[key] === "object") copy[key] = Object.copy(obj[key], oneTimeValues);
        else if (obj.hasOwnProperty(key)) copy[key] = obj[key];
    }
    return copy;
};

class PacketBuffer {
    constructor() {
        this.buffer = {};
    }

    clear() {
        this.buffer = new Empty();
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

    exportSnapshot(values, composedEntity, buffer = this.buffer, last = true) {
        if (!Object.isJSON(composedEntity)) return composedEntity;
        if (!Object.isJSON(buffer)) return composedEntity;
        let snapShot = new Empty();

        for (let key of values) {
            if (buffer.hasOwnProperty(key))
                if (Object.equals(composedEntity[key], buffer[key])) continue;
            snapShot[key] = this.exportSnapshot(Object.isJSON(composedEntity[key]) ? Object.keys(composedEntity[key]) : [], composedEntity[key], buffer[key], false);
            if (last) this.buffer[key] = Object.copy(composedEntity[key]);
        }
        return snapShot;
    }
}

PacketBuffer.validate = function (validObj, obj) {
    if (!Object.isJSON(validObj) || !Object.isJSON(obj)) {
        if (typeof obj !== validObj)
            console.error("expected typeof '" + validObj + "' value was: '" + typeof obj + "'");
        return;
    }

    for (let key in validObj) {
        if (Object.isJSON(validObj[key]))
            PacketBuffer.validate(validObj[key], obj[key])
        else if (typeof obj[key] !== validObj[key])
            console.error("expected typeof '" + validObj[key] + "' value was: '" + typeof obj[key] + "'");
    }
};

PacketBuffer.mergeSnapshot = function (obj, snapShot, oneTimeValues = []) {
    let data = Object.copy(obj, oneTimeValues);
    if (!Object.isJSON(snapShot) || data === undefined || data === null) return snapShot;
    if (Object.keys(snapShot).length === 0) return snapShot;
    for (let key of Object.keys(snapShot))
        data[key] = this.mergeSnapshot(data[key], snapShot[key], oneTimeValues);
    return data;
};


export default PacketBuffer;
