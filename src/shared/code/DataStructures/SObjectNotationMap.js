// Better version of the stock JS Map.
// Iteration of this object is way better
// for performance and easier to use.

class ObjectNotationMap {
    constructor(allocation = Infinity) {
        this._jsonContainer = {};
        this._arrayContainer = [];
        this._count = 0;
        this._limit = allocation;
    }

    set(key, item) {
        if (this._count < this._limit) {
            if (!this.has(key)) {
                this._arrayContainer.push(item);
                this._count++;
            } else {
                let i = this._arrayContainer.indexOf(this._jsonContainer[key]);
                this._arrayContainer[i] = item;
            }
            this._jsonContainer[key] = item;
        }
        return item;
    }

    get(key) {
        return this._jsonContainer[key];
    }

    has(key) {
        return this._jsonContainer.hasOwnProperty(key);
    }

    remove(key) {
        this._count--;
        this._arrayContainer.splice(this._arrayContainer.indexOf(this._jsonContainer[key]));
        delete this._jsonContainer[key];
    }


    indexOfKey(key) {
        return this._arrayContainer.indexOf(this._jsonContainer[key]);
    }

    indexOfValue(value) {
        return this._arrayContainer.indexOf(value);
    }

    get length() {
        return this._count;
    }

    get array() {
        return this._arrayContainer;
    }

    get object() {
        return this._jsonContainer;
    }

    clear() {
        if (this._count === 0) {
            return;
        }
        this._count = 0;
        delete this["_jsonContainer"];
        this._jsonContainer = {};
        delete this["_arrayContainer"];
        this._arrayContainer = [];
    }

    forEach(callback) {
        for (var key in this._jsonContainer) {
            callback(key, this._jsonContainer[key]);
        }
    }
}

module.exports = ObjectNotationMap;