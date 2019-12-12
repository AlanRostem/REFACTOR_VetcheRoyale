import R from "./Graphics/Renderer.js"
import Scene from "./Game/Scene.js"
import AssMan from "./AssetManager/AssetManager.js";
import ConsoleCommands from "./ConsoleCommands.js";

/**
 * @namespace ClientSide
 */

// This is the initialization entry point
window.AssetManager = AssMan;
AssMan.queue("client/config/assets.cfg");

R.setup();
Scene.run();
