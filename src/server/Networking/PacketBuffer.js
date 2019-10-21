Object.copy = function (obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = new obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
};


class PacketBuffer {
    constructor(){
        this.buffer = {};
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


    createPacket(packet, snapShot, first = true) {
        let data = Object.copy(packet);
        if (typeof snapShot !== "object" || !data) return snapShot;
        for (let key of Object.keys(snapShot)){
            data[key] = this.createPacket(data[key], snapShot[key], false);
        }

        return data;
    }

    export(values, composedEntity){
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


module.exports = PacketBuffer;