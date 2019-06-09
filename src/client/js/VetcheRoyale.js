import R from "./Graphics/Renderer.js"
import MyClient from "./Networking/MyClient.js"
import Scene from "./Game/Scene.js"

var client = new MyClient(io());
io = undefined; // Restricting console from using this function.

R.setup();
Scene.run();