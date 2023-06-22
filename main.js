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
  let ventanaPrincipal = new BrowserWindow({
    resizable: true,
    maximizable: true,
    fullscreenable: false,
    frame: true,
    icon: __dirname + "/icon.png",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    }, 
  });
  ventanaPrincipal.maximize();
  ventanaPrincipal.loadFile("system/index.html");
}

app.whenReady().then(crearVentanaPrincipal);
// app.on("window-all-closed", function () {
//   app.whenReady().then(crearVentanaPrincipal);
// });
app.on("activate", function () {
  if (BrowserWindow.getAllWindows().length === 0) {
    crearVentanaPrincipal();
  }
});
