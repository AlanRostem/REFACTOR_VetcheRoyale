const ONMap = require("../../shared/code/DataStructures/SObjectNotationMap.js");

class DataBridge {
    constructor() {
        this.inboundData = {};
        this.outboundData = {};
    }

    set receivedData(data) {
        this.onDataReceived(data);
        this.inboundData = data;
    }

    queueOutboundData(key, value) {
        this.outboundData[key] = value;
    }

    sendData() {
        return this.outboundData;
    }

    onDataReceived(data) {

    }


}

module.exports = DataBridge;