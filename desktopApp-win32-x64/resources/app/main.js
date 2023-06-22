const fs = require("fs");
const { app, BrowserWindow, dialog, Menu,ipcMain  } = require("electron");
const os = require("os");
const path = require("path");
const CryptoJS = require("crypto-js");
const hoy = new Date();
const dia = hoy.getDate().toString().padStart(2, "0");
const mes = (hoy.getMonth() + 1).toString().padStart(2, "0");
const anio = hoy.getFullYear().toString();
const fechaActual = `${dia}/${mes}/${anio}`;
const key = require("./readKey");

function crearVentanaPrincipal() {
  let app2;
  // Leer archivo de fecha
  let ventanaPrincipal;
  // fs.readFile("./fecha.txt", "utf-8", (err, data) => {

  key.obtenerKey((err, data) => {
    if (err) {
      dialog.showErrorBox("Error", "No se pudo leer el archivo de fecha");
      return;
    }
    // dialog.showErrorBox("Error", fechaDesn2 );
    // Crear y cargar ventana principal

    const menuTemplate = []; // quitamos todas las opciones del menu para que incluso con alt no accedan
    const menu = Menu.buildFromTemplate(menuTemplate);
    ventanaPrincipal = new BrowserWindow({
      // opciones de ventana
      resizable: false,
      // maximizable: true,
      // fullscreenable: false,
      // frame: false, // Ocultaria todas las barras
      autoHideMenuBar: true, // Oculta la barra de menu
      icon: __dirname + "/tato.png",
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
      },
    });
    ventanaPrincipal.setMenu(menu);
    // Construir ruta relativa a la carpeta 'app'
    // Cargar la página en la ventana principal
    if (data.success) {
      ventanaPrincipal.loadFile("index.html");
    } else {
      const filePath = path.join(__dirname, "negado.html");
      ventanaPrincipal.loadURL(
        `file://${filePath}?error=${data.codeErr}&mac=${
          data.extra ? data.extra : ""
        }`
      );
    }
  });
  ventanaPrincipal.webContents.on("did-finish-load", () => {
    mainWindow.webContents.executeJavaScript(
      `require('${path.join(__dirname, "scripts", "renderer.js")}')`
    );
  });
}

app.whenReady().then(crearVentanaPrincipal);

//Si la app se cierra
// app.on("window-all-closed", function () {
//   app.quit();
// });

//Si no existen ventanas de la app
// app.on("activate", function () {
//   if (BrowserWindow.getAllWindows().length === 0) {
//     crearVentanaPrincipal();
//   }
// });
