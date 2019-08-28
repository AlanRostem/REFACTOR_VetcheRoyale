import Scene from "./Game/Scene.js"

window.ping = () => {
    return Scene._clientRef._latency;
};

window.client = () => {
    return Scene._clientRef;
};

window.player = () => {
    return Scene._clientRef.player;
};

window.entities = () => {
    return Scene._entityManager._container;
};

export default {}