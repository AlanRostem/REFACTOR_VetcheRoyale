// Loads and compiles JavaScript code.
// Useful to create code shared between
// the server and client.
const CSharedImportJS = (src) => {
    var content = {string: "", object: null};
    fetch(src)
        .then(resp => {
            return resp.text();
        })
        .then(blob => {
            content.string = blob;
            eval(content.string);
            content.object = subject;
            if (content.onload) {
                content.onload(subject);
            }
        });
    return content;
};

export default CSharedImportJS;