const chalk = require("chalk");
const fs = require("fs");
const path = require("path");

let args = {};
try {
  const rawArg = process.argv[2];
  args = rawArg && rawArg.trim().startsWith("{") ? JSON.parse(rawArg) : {};
} catch (e) {
  console.error("[ARGS PARSE ERROR]", e.message);
  args = {};
}

const parsedPhone =
  args.ownernum && args.ownernum !== "default"
    ? String(args.ownernum).replace(/\D/g, "")
    : "6289603732786";
const parsedLimit = parseInt(args.limit, 10);
const defaultThumb = "Media2/theme/thumb.jpg";
let thumbArg = args.thumbnail || defaultThumb;
thumbArg = thumbArg.replace(/^bot[\\/]/, "");
let thumbPath = path.isAbsolute(thumbArg)
  ? thumbArg
  : path.join(__dirname, thumbArg);
if (!fs.existsSync(thumbPath)) thumbPath = defaultThumb;

global.limitawal = {
  free: Number.isInteger(parsedLimit) ? parsedLimit : 10,
};

// === Bot Config ===
global.gbown = "6289603732786";
global.wmbotzz = "©Soft Botz";
global.nobisnis = "6289603732786@s.whatsapp.net";
global.botId = args.id && args.id !== "default" ? args.id : "default";
global.botname =
  args.botname && args.botname !== "default" ? args.botname : "©Soft Botz";
global.footer =
  args.botname && args.botname !== "default" ? args.botname : "©Soft Botz";

global.ownernomer = parsedPhone + "@s.whatsapp.net";
global.owner = parsedPhone;
global.ownerNumber = [parsedPhone + "@s.whatsapp.net"];
global.ownername =
  args.owner && args.owner !== "default" ? args.owner : "Bang Dimz";

global.emailadm = args.ownEmail || "support@dimasbotzz.my.id";
global.webstore = args.ownWs || "https://store.dimasbotzz.my.id";
global.socialm =
  args.ownSocial || "https://chat.whatsapp.com/LQWNaDiQJSSFESkCVmgnIb";
global.location = args.ownLocation || "Indonesia, Central Javanese, Boyolali";

// === Link & Branding ===
global.ownerweb = args.web || "https://store.dimasbotzz.my.id";
global.websitex = args.webx || "https://t.me/dimzbotzzxyz";
global.channel =
  args.channel || "https://whatsapp.com/channel/0029VaFJJHh6hENqH3EYO33m/107";
global.wagc = args.gc || "https://chat.whatsapp.com/H8L7vKdAWwO4Ki169PTCXP";

global.themeemoji = args.themoji || "🔰";
global.wm = args.wm || "*Boyolali, Central Javanese, Indonesia 🇮🇩*";
global.wm1 = args.wm1 || "𝐃𝐢𝐦𝐚𝐬 𝐁𝐨𝐭𝐳𝐳-𝐌𝐃 ✗ 𝐀𝐫𝐭𝐢𝐟𝐢𝐜𝐢𝐚𝐥 𝐈𝐧𝐭𝐞𝐥𝐥𝐢𝐠𝐞𝐧𝐜𝐞";
global.botscript = "*Udah Gede Msih Nyari Sc🗿*";
global.creator = "6289603732786@s.whatsapp.net";
global.creator2 = "0@s.whatsapp.net";

// === Sticker Config ===
global.packname = args.sticker || "Sticker By";
global.author = args.author || "©Soft Botz";

// === Thumbnail ===
global.thumbnail = thumbPath;
global.thum = global.log0 = global.err4r = thumbPath;
global.defaultpp =
  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60";

// === Presence & Misc ===
global.online = true;
global.autoTyping = false;
global.autoRecord = false;
global.autobio = false;
global.autoblockmorroco = true;
global.antispam = false;
global.dprivate = false;
global.antiViewOnce = false;
global.Antibot = false;
global.antimedia = false;
global.antitagowner = false;
global.gconly = false;
global.santitagsw = false;

// === Document MIME types ===
global.doc1 =
  "application/vnd.openxmlformats-officedocument.presentationml.presentation";
global.doc2 =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
global.doc3 =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
global.doc4 = "application/zip";
global.doc5 = "application/pdf";
global.doc6 = "application/vnd.android.package-archive";

// === Extra ===
global.img = "https://porto.hsd.my.id/img/profile.jpg";
global.prefix = ["/", "!", ".", "#", "&"];
global.sessionName = args.sessionName || "session";
global.database = "database/databasedb.json";
global.hituet = 0;

// === Flaming Text URLs ===
global.flaming =
  "https://www6.flamingtext.com/net-fu/proxy_form.cgi?...&script=sketch-name&...";
global.fluming =
  "https://www6.flamingtext.com/net-fu/proxy_form.cgi?...&script=fluffy-logo&...";
global.flarun =
  "https://www6.flamingtext.com/net-fu/proxy_form.cgi?...&script=runner-logo&...";
global.flasmurf =
  "https://www6.flamingtext.com/net-fu/proxy_form.cgi?...&script=smurfs-logo&...";

// === API Keys ===
module.exports = {
  api: {
    removebg: ["dUE9iCY1MCizojqwT56BMsgG", "6Y7ARf43yFKsQLAd3KK72Tbs"],
    unscreen: ["N6J4Bjbyh2V4eqhAPTWYtFER", "fcKJkPstNXp4pjntYt3bR38E"],
    upscaling: "1255173112",
    imgsuper: [
      "198f69d4b2msh0021bb0690669a6p1f3a80jsn9cab1ae485cc",
      "85731a45bbmshf7bd86f09b300c2p14e544jsncd18a8d5dba2",
    ],
    speechtotext: ["897beebb3ac74ceeaa6f8d0903b2297a"],
  },
};

// === Auto Reload ===
let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(
    `${chalk.yellowBright.bgRed.bold("[ ᴅᴇᴛᴇᴄᴛᴇᴅ ]")} '${chalk.black.bold.bgGreenBright(
      __filename
    )} ${chalk.white.bgGrey.bold("ᴜᴘᴅᴀᴛᴇ")}'`
  );
  delete require.cache[file];
  require(file);
});
