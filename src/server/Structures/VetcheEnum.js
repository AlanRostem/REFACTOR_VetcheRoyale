class VetcheEnum {
    constructor(...objects) {
        this._indices = {};
        let i = 0;
        for (let object of objects) {
            for (let key in object) {
                this[key] = object[key];
                this._indices[key] = i++;
            }
        }

        Object.freeze(this);
    }

    ordinalOf(enumerator) {
        return this._indices[enumerator] || -1;
    }

}

module.exports = VetcheEnum;