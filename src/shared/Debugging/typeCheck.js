// Pass in a class/type and then a parameter that
// is going to be checked. If the data type doesn't
// match the correct ones an error is thrown.
export default class typeCheck {
    // Pass in a class constructor to check if
    // the parameter is in the same instance.
    static instance(dataType, parameter) {
        if (!(parameter instanceof dataType)) {
            throw new DataTypeError(dataType);
        }
    }

    // TODO: Add a method to check an objects last class

    // Pass in a primitive data value and a parameter
    // to check if their data types match.
    static primitive(testValue, parameter) {
        if (typeof testValue !== typeof parameter) {
            throw new DataTypeError({name: typeof testValue});
        }
    }
}

class DataTypeError extends Error {
    constructor(dataType) {
        super("Data type mismatch, the corresponding type must be of instance " + dataType.name);
    }
}