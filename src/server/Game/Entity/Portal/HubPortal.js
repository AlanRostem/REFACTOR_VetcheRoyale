const Portal = require("./Portal.js");

class HubPortal extends Portal {
    constructor(x, y, gameID, destinationWorldID, destinationPos, frameColor) {
        super(x, y, destinationPos, frameColor);
        this._homeWorldID = gameID;
        this._destinationWorldID = destinationWorldID;
    }

}