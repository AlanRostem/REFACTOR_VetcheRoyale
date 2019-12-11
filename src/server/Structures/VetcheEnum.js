class VetcheEnum {
    constructor(object) {
        this._indices = {};
        let i = 0;
        for (let key in object) {
            this[key] = object[key];
            this.indices[key] = i++;
        }

        Object.freeze(this);
    }

    ordinalOf(enumerator) {
        return this._indices[enumerator] || -1;
    }

}

module.exports = VetcheEnum;