const fs = require("fs");

// Loads and compiles JavaScript code.
// Useful to create code shared between
// the server and client.
const SSharedImportJS = (src) => {
    let content = fs.readFileSync(src, 'utf8');
    eval(content);
    return subject;
};

module.exports = SSharedImportJS;