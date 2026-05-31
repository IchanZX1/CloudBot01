const chalk = require("chalk");
const fs = require("fs");

global.mess = {
  limit0:
    "Limit kamu sudah habis silahkan ketik .limit untuk mengecek sisa limit, limit akan di reset otomatis setiap jam 00:00 wib atau hubungi owner",
  success: "_Done Kak (*´>ω<))ω｀●)_",
  wait: "*_⏳ Sabar, Sedang Di Proses..._*",
  mowner: "*⛔ Fitur ini hanya bisa di akses oleh owner ku*",
};

let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.redBright(`Update'${__filename}'`));
  delete require.cache[file];
  require(file);
});
