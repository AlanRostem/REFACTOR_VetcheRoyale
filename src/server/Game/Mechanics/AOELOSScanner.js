const HitScanner = require("./HitScanner.js");
const VMath = require("../../../shared/code/Math/SCustomMath.js");

// Area of effect line of sight hit scanner
class AOELOSScanner extends HitScanner {
    constructor(radius, exceptions = [], entityCollision = true, tileCollision = true) {
        super(exceptions, entityCollision, tileCollision);
        this._radius = radius;
    }

}