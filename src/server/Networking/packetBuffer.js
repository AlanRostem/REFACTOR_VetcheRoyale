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