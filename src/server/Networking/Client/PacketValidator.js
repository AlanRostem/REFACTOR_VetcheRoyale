const PacketValidator = {
    validatePacket(client, packet) {
        if (packet === null || packet === undefined) {
            client.disconnect("Invalid packet");
            return false;
        }
        return true;
    },
    validateData(client, data, expectedType) {
        if (data === null || data === undefined || typeof data !== expectedType) {
            client.disconnect("Invalid packet data");
            return false;
        }
        return true;
    }
};

module.exports = PacketValidator;