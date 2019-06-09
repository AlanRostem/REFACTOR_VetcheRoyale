export function createErrorObject() {
    try { throw Error('WARNING') } catch(err) { return err; }
}