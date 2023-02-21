const { app, BrowserWindow } = require("electron");
const path = require("path");
function crearVentanaPrincipal() {
  let ventanaPrincipal = new BrowserWindow({
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    frame: false,
    icon: __dirname + "/tato.png",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    }, 
  });
  ventanaPrincipal.maximize();
  ventanaPrincipal.loadFile("index.html");
}
app.whenReady().then(crearVentanaPrincipal);
app.on("window-all-closed", function () {
  app.whenReady().then(crearVentanaPrincipal);
});
app.on("activate", function () {
  if (BrowserWindow.getAllWindows().length === 0) {
    crearVentanaPrincipal();
  }
});
