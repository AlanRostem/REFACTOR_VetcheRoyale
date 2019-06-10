import R from "./Graphics/Renderer.js"
import MyClient from "./Networking/MyClient.js"
import Scene from "./Game/Scene.js"
import EntityDataReceiver from "./Game/Entity/EntityDataReceiver.js"

var client = new MyClient(io());
io = undefined; // Restricting console from using this function.
var entityDataReceiver = new EntityDataReceiver(client);

R.setup();
Scene.run(entityDataReceiver);