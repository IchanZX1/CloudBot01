const fs = require("fs");

const datajson = {
  welcome: "./database/welcome.json",
  left: "./database/left.json",
  owner: "./database/owner.json",
  setwel: "./database/setwel.json",
  setleft: "./database/setleft.json",
  data: "./database/database.json",
  autosticker: "./database/autosticker.json",
  ntnsfw: "./database/nsfw.json",
  ntlokasi: "./database/antilokasi.json",
  ntlokasi2: "./database/antilokasi2.json",
  ntvirtex: "./database/antivirus.json",
  ntvirtex2: "./database/antivirus2.json",
  nttoxic: "./database/antitoxic.json",
  nttoxic2: "./database/antitoxic2.json",
  ntmedia: "./database/antimedia.json",
  ntmedia2: "./database/antimedia2.json",
  ntlinkgc: "./database/antilinkgc.json",
  ntlinkgc2: "./database/antilinkgc2.json",
  ntlinkgc30: "./database/anti30gb.json",
  ntlinkgcwa: "./database/antiwame.json",
  ntlinkgcwa2: "./database/antiwame2.json",
  ntilinkall: "./database/antilinkall.json",
  ntilinkall2: "./database/antilinkall2.json",
  ntlinkgcsalur: "./database/antisaluran.json",
  ntlinkgcsalur2: "./database/antisaluran2.json",
  ntbot: "./database/antibot.json",
  ntclose: "./database/autoclose.json",
  ntopen: "./database/autoopen.json",
  ntpromosi: "./database/antipromosi.json",
  ntilinktwt: "./database/antilinktwitter.json",
  ntilinktwt2: "./database/antilinktwitter2.json",
  ntilinktt: "./database/antilinktiktok.json",
  ntilinktt2: "./database/antilinktiktok2.json",
  ntilinktg: "./database/antilinktelegram.json",
  ntilinktg2: "./database/antilinktelegram2.json",
  ntilinkfb: "./database/antilinkfacebook.json",
  ntilinkfb2: "./database/antilinkfacebook2.json",
  ntilinkig: "./database/antilinkinstagram.json",
  ntilinkig2: "./database/antilinkinstagram2.json",
  ntilinkytch: "./database/antilinkytchannel.json",
  ntilinkytch2: "./database/antilinkytchannel2.json",
  ntilinkytvid: "./database/antilinkytvideo.json",
  ntilinkytvid2: "./database/antilinkytvideo2.json",
  antiluar: "./database/antiluar.json",
  ntpuan: "./database/antipuan.json",
  setintro: "./database/setintro.json",
  mute: "./database/mute.json",
  tecnsfw: "./database/tecnsfw.json",
};

const db = {
  welcome: [],
  left: [],
  owner: [],
  setwel: {},
  setleft: {},
  setintro: {},
  data: {
    sticker: {},
    database: {},
    game: {},
    others: {},
    users: {},
    chats: {},
    settings: {},
  },

  autosticker: [],
  ntnsfw: [],
  ntlokasi: [],
  ntlokasi2: [],
  ntvirtex: [],
  ntvirtex2: [],
  nttoxic: [],
  nttoxic2: [],
  ntmedia: [],
  ntmedia2: [],
  ntlinkgc: [],
  ntlinkgc2: [],
  ntlinkgc30: [],
  ntlinkgcwa: [],
  ntlinkgcwa2: [],
  ntilinkall: [],
  ntilinkall2: [],
  ntlinkgcsalur: [],
  ntlinkgcsalur2: [],
  ntbot: [],
  ntclose: [],
  ntopen: [],
  ntpromosi: [],
  ntilinktwt: [],
  ntilinktwt2: [],
  ntilinktt: [],
  ntilinktt2: [],
  ntilinktg: [],
  ntilinktg2: [],
  ntilinkfb: [],
  ntilinkfb2: [],
  ntilinkig: [],
  ntilinkig2: [],
  ntilinkytch: [],
  ntilinkytch2: [],
  ntilinkytvid: [],
  ntilinkytvid2: [],
  antiluar: [],
  ntpuan: [],
  mute: [],
  tecnsfw: [],
};

const flags = {};
for (const name in datajson) {
  flags[name] = false;
}

function load(path, fallback) {
  try {
    return JSON.parse(fs.readFileSync(path));
  } catch {
    return fallback;
  }
}

for (const name in datajson) {
  db[name] = load(datajson[name], db[name]);
}

function markChanged(name) {
  if (flags[name] !== undefined) {
    flags[name] = true;
  }
}

function saveIfChanged() {
  for (const name in flags) {
    if (flags[name]) {
      fs.writeFileSync(datajson[name], JSON.stringify(db[name], null, 2));
      flags[name] = false;
      console.log(`[SAVE] ${name} database disimpan`);
    }
  }
}

setInterval(saveIfChanged, 3000);

module.exports = {
  db,
  markChanged,
  forceSave: saveIfChanged,
};
