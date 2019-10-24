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

Object.copy = function (obj, oneTimeValues = []) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = new obj.constructor();
    for (var key in obj) {
//        if(oneTimeValues.find((e)=>{return e === key})) continue;
        if (typeof obj[key] === "object") copy[key] = Object.copy(obj[key], oneTimeValues);
        else if (obj.hasOwnProperty(key)) copy[key] = obj[key];
    }
    return copy;
};



class PacketBuffer {
    constructor(){
        this.buffer = {};
    }

    creatSnapShot(values, composedEntity, buffer) {
        if (!buffer) return composedEntity;
        let snapShot = {};
        if (typeof composedEntity !== "object") snapShot = composedEntity;
        for (let key of values) {
            if (Object.equals(composedEntity[key], buffer[key])) continue;
            if (typeof composedEntity[key] === "object")
                snapShot[key] = this.creatSnapShot(Object.keys(buffer[key]), composedEntity[key], buffer[key]);
            else if (composedEntity[key] !== buffer[key]) snapShot[key] = composedEntity[key];
        }
        return snapShot;
    }

    exportInitValues(values, composedEntity){
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

    export(values, composedEntity) {
        let snapShot = {};
        for (let key of values) {
            if (Object.equals(composedEntity[key], this.buffer[key])) continue;
            if (composedEntity[key] !== undefined && composedEntity[key] !== null) {
                snapShot[key] = this.creatSnapShot(Object.keys(composedEntity[key]), composedEntity[key], this.buffer[key]);
            }
            if (typeof composedEntity[key] === "object") {
                this.buffer[key] = Object.copy(composedEntity[key]);
            } else {
                this.buffer[key] = composedEntity[key];
            }
        }
        return snapShot;
    }
}

PacketBuffer.createPacket = function (packet, snapShot, oneTimeValues = []) {
    let data = Object.copy(packet, oneTimeValues);
    if (typeof snapShot !== "object" || !data) return snapShot;
    if (snapShot)
        for (let key of Object.keys(snapShot)){
            if(oneTimeValues.find((e)=>{ return e === key })) continue;
            data[key] = this.createPacket(data[key], snapShot[key], oneTimeValues);
        }
    return data;
};


module.exports = PacketBuffer;