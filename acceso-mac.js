const { app, BrowserWindow, dialog } = require("electron");
const os = require('os');
const path = require("path");

function crearVentanaPrincipal() {
  let ventanaPrincipal = new BrowserWindow({
    // resizable: false,
    // maximizable: false,
    // fullscreenable: false,
    // frame: false,
    icon: __dirname + "/tato.png",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    }, 
  });

  // ventanaPrincipal.maximize();
  ventanaPrincipal.loadFile("index.html");

  // Obtener la dirección MAC
  const interfaces = os.networkInterfaces();
  let macAddress;
  for (const name in interfaces) {
    const iface = interfaces[name];
    const ifaceWithMac = iface.find((iface) => iface.mac !== "00:00:00:00:00:00");
    if (ifaceWithMac) {
      macAddress = ifaceWithMac.mac;
      global.mac = macAddress;
      break;
    }
  }

  if (macAddress) {
    // Mostrar la dirección MAC en un diálogo de alerta
    dialog.showMessageBox(ventanaPrincipal, {
      message: "La dirección MAC es: " + macAddress,
      type: "info",
      buttons: ["OK"],
    });
  } else {
    // Mostrar un mensaje de error si no se pudo obtener la dirección MAC
    dialog.showMessageBox(ventanaPrincipal, {
      message: "No se pudo obtener la dirección MAC",
      type: "error",
      buttons: ["OK"],
    });
  }
}

app.whenReady().then(crearVentanaPrincipal);

app.on("window-all-closed", function () {
  app.quit();
});

app.on("activate", function () {
  if (BrowserWindow.getAllWindows().length === 0) {
    crearVentanaPrincipal();
  }
});
