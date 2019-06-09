import R from "./Graphics/Renderer.js"
import MyClient from "./Networking/MyClient.js"

var client = new MyClient(io());
io = undefined;

window.client = client;

R.setup();