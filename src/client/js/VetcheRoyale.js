import R from "./Graphics/Renderer.js"
import MyClient from "./Networking/MyClient.js"

var client = new MyClient(io());
io = undefined;

window.client = client;

R.setup();

R.drawRect("blue", 10, 10, 32, 32);