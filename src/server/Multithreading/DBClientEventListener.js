const DataBridge = require("./DataBridge.js");

class DBClientEventListener extends DataBridge {
    onDataReceived(data) {
        super.onDataReceived(data);
    }
}

module.exports = DBClientEventListener;