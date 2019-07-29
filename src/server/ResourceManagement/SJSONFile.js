var fs = require("fs");

// Loads a JSON file and converts its data to
// an object.
class JSONFile {
    constructor(src) {
        this._fileContent = fs.readFileSync(src, 'utf8');
        this._objectContent = JSON.parse(this._fileContent);
    }

    get() {
        return this._objectContent;
    }
}

module.exports = JSONFile;