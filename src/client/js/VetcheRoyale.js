import R from "./Graphics/Renderer.js"
import MyClient from "./Networking/MyClient.js"

var client = new MyClient(io());
io = undefined; // Restricting console from using this function.

R.setup();
R.drawRect("blue", 100, 50, 32, 32); // Single call test