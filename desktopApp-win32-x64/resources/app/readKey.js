const fs = require("fs");
const CryptoJS = require("crypto-js");
const os = require("os");
function readLicence(callback) {
  fs.readFile("./fecha.txt", "utf-8", (err, data) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, desenciptarLicence(data.trim()));
    }
  });
}

function encriptar(texto, key) {
  return CryptoJS.AES.encrypt(texto, key).toString();
}

function desencriptar(textoEncriptado, key) {
  const bytes = CryptoJS.AES.decrypt(textoEncriptado, key);
  return bytes.toString(CryptoJS.enc.Utf8);
}

function desenciptarLicence(licence) {
  const key = "keySystem";
  const separado = desencriptar(licence, key).split(";");
  return validateLicence({
    dateLicence: desencriptar(separado[1], key),
    macLicence: desencriptar(separado[0], key),
  });
}

function validateLicence(data) {
  // 500 -- Error general 510 error de fecha 520 error de mac no coincide 521 error para obtener la mac
  var resultValidation = { success: false, codeErr: 500 };

  if (new Date(data.dateLicence) >= new Date()) {
    // Obtener la dirección MAC
    const interfaces = os.networkInterfaces();
    let macAddress;
    for (const name in interfaces) {
      const iface = interfaces[name];
      const ifaceWithMac = iface.find(
        (iface) => iface.mac !== "00:00:00:00:00:00"
      );
      if (ifaceWithMac) {
        macAddress = ifaceWithMac.mac;
        global.mac = macAddress;
        +macAddress;
        break;
      }
    }
    if (macAddress) {
      // Mostrar la dirección MAC en un diálogo de alerta
      if (macAddress.toString() == data.macLicence.toString()) {
        resultValidation = { success: true, codeErr: null };
      } else {
        resultValidation = {
          success: false,
          codeErr: 520,
          extra: macAddress.toString(), // retornamos la mac para usarla 
        };
      }
      // dialog.showMessageBox(ventanaPrincipal, {
      //   message: macAddress + ";" + fechaDesn1 + ";",
      //   type: "info",
      //   buttons: ["OK"],
      // });
    } else {
      resultValidation = { success: false, codeErr: 521 };
    }
  } else {
    resultValidation = { success: false, codeErr: 510 };
  }
  return resultValidation;
}
// module.exports = { encriptar, desencriptar };
module.exports = { obtenerKey: readLicence };
