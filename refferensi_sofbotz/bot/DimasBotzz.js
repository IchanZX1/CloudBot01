/*
CREDIT BY DREAM DIMZZ
MALAS NGEFIX NYA,KLO MAU FIX SENDIRI
SC NO SCAN, SUDAH MENGGUNAKAN PAIRING,
UNTUK GANTI NOMOR PAIRING ADA DI SETINGGS.JS

Cara merapikan file DimasBotzz.js
1, install npm i prettier
2, npx prettier --write DimasBotzz.js

Cara ke dua windows, macbook dll
1, npm install rome
2, npx rome init
3, npx rome format DimasBotzz.js

npm install -g prettier eslint
eslint --init

prettier --write "*.js"
eslint --fix "*.js"
*/

/* eslint-disable no-loss-of-precision */
/* eslint-disable no-useless-catch */
/* eslint-disable no-duplicate-case */
/* eslint-disable no-case-declarations */
/* eslint-disable no-unreachable */
/* eslint-disable no-useless-escape */
/* eslint-disable no-async-promise-executor */
/* eslint-disable no-empty */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-func-assign */
/* eslint-disable no-constant-condition */

const { args } = require("./settings");
require("./message/msg");
const { db, forceSave, markChanged } = require("./lib/config");
const { modul } = require("./module");
const {
  os,
  axios,
  baileys,
  chalk,
  cheerio,
  child_process,
  crypto,
  cookie,
  FileType,
  fetch,
  fs,
  ffmpeg,
  process,
  moment,
  ms,
  speed,
  syntaxerror,
  util,
  ytdl,
  googleTTS,
} = modul;
const { exec, spawn, execSync } = child_process;
const {
  BufferJSON,
  WA_DEFAULT_EPHEMERAL,
  generateWAMessageFromContent,
  proto,
  generateWAMessageContent,
  generateWAMessage,
  prepareWAMessageMedia,
  areJidsSameUser,
  getContentType,
  generateMessageID,
} = baileys;
const {
  default: DimzBotConnect,
  makeWaSocket,
  socket,
} = require("@whiskeysockets/baileys");
const baileysPkg = require("@whiskeysockets/baileys/package.json");
const baileysversion = baileysPkg.version;
const ownName = global.ownername;
const ownNumber = global.ownernomer || "6289603732786";
const botName = global.botname || "Dimazz Botz";
const stikerpack = global.packname;
const stikerauth = global.author;
const botId = global.botId;
console.log("id:", botId);

let puppeteer;
try {
  puppeteer = require("puppeteer");
} catch {
  puppeteer = require("puppeteer-core");
}
async function createBrowser(options) {
  const browser = await puppeteer.launch({
    ...options,
    ...(process.env.HOME === "/data/data/com.termux/files/home"
      ? {
          browser: "firefox",
          executablePath: "/data/data/com.termux/files/usr/bin/firefox",
        }
      : {}),
    headless: true,
  });
  return browser;
}

const debug = (...args) => {
  if (
    process.env.NODE_ENV === "development" ||
    process.env.LEVEL === "debug" ||
    process.env.LEVEL === "trace"
  ) {
    console.trace("[DEBUG]", ...args);
  }
};

const { Chess } = require("chess.js");
const dirlimit = "./database/limits";
const { initLimit, loadLimitDB, saveLimitDB } = require("./lib/limit.js");
initLimit(botId, global.limitawal.free);
const {
  addExp,
  addCoins,
  getUserExp,
  loadExpData,
  saveExpData,
  getRank,
  getProgressBar,
  checkCooldown,
  setCooldown,
} = require("./game/exp");
const {
  ITEMS,
  TOOLS,
  getInventory,
  runMining,
  buyTool,
  sellItem,
  getToolList,
  getItemList,
} = require("./game/mining");
const { getData, setData, getGlobal, setGlobal } = require("./lib/globaldata");
const anon = require("./lib/menfess");
const { zeta } = require("./crab/zeta");
const { all } = require("./crab/all");
const { inst } = require("./crab/inst");
const { sticker, addExif } = require("./lib/sticker");
const { genius } = require("./crab/genius");
const { hololive } = require("./crab/hololive_rvc");

const {
  UploadFileUgu,
  webp2mp4File,
  UpHardianto,
  floNime,
  shojib,
  uptoibb,
  drizzup,
  uploadPomf,
} = require("./lib/uploader");
const {
  getLimit,
  reduceLimit,
  setLimit,
  hasLimit,
  resetAllUserLimit,
  checkLimit,
} = require("./lib/limit.js");
const yts = require("./lib/yt-search");
const FakeUseragent = require("fake-useragent");
const { v4: uuidv4 } = require("uuid");
const similarity = require("similarity");
const exifr = require("exifr");
const { Fbdl3 } = require("./lib/fbdl3");
const {
  clockString,
  parseMention,
  formatp,
  tanggal,
  day,
  bulan,
  tahun,
  weton,
  getTime,
  isUrl,
  sleep,
  runtime,
  fetchJson,
  getBuffer,
  jsonformat,
  format,
  reSize,
  generateProfilePicture,
  getRandom,
} = require("./lib/myfunc");
const { color, bgcolor } = require("./lib/color");
const { delay } = require("@whiskeysockets/baileys");
const readFile = util.promisify(fs.readFile);
const si = require("systeminformation");
const https = require("https");
const more = String.fromCharCode(8206);
const readmore = more.repeat(4001);
const { promisify, TextEncoder } = require("util");
const { pipeline } = require("stream");
const cron = require("node-cron");
const schedule = require("node-schedule");
const streamPipeline = promisify(pipeline);
const path = require("path");
const vm = require("node:vm");
const { toBuffer } = require("qrcode");
const archiver = require("archiver");
const { HttpsProxyAgent } = require("https-proxy-agent");
const { getRandomProxyAgent } = require("./lib/proxy");
const owner = [ownNumber];
const BadXeon = JSON.parse(fs.readFileSync("./database/bad.json"));
const warnFilePath = "./database/warn.json";
const loadWarnings = () => {
  if (!fs.existsSync(warnFilePath)) {
    return {};
  }
  return JSON.parse(fs.readFileSync(warnFilePath));
};

const saveWarnings = (data) => {
  fs.writeFileSync(warnFilePath, JSON.stringify(data, null, 2));
};

function loadSewaData() {
  try {
    return JSON.parse(fs.readFileSync("./database/sewa.json", "utf8"));
  } catch (error) {
    return {
      sewa: {},
    };
  }
}

function saveSewaData(data) {
  fs.writeFileSync("./database/sewa.json", JSON.stringify(data, null, 2));
}

const db_intro = db.setintro;
const welcome = db.welcome || [];
const left = db.left || [];

// GAME DATA
const threshold = 0.72;
let family100 = {};
let asahotak = {};
let caklontong = {};
let enhance = {};
let lengkapikalimat = {};
let mathgame = {};
let siapaaku = {};
let susunkata = {};
let tekateki = {};
let tebakaplikasi = {};
let tebakbendera = {};
let tebakff = {};
let tebakgame = {};
let tebakgambar = {};
let tebakhero = {};
let tebakjkt48 = {};
let tebakkimia = {};
let tebakkabupaten = {};
let tebakkalimat = {};
let tebakkata = {};
let tebaklirik = {};
let tebakml = {};
let tebaktebakan = {};
let games = {};

global.db = new Proxy(db.data, {
  set(target, prop, value) {
    target[prop] = value;
    markChanged("data");
    return true;
  },
});

global.db.data = JSON.parse(fs.readFileSync("./lib/database.json"));
if (global.db.data)
  global.db.data = {
    users: {},
    chats: {},
    database: {},
    settings: {},
    command: {},
    ...(global.db.data || {}),
  };

global.datacopy ??= {};

cron.schedule("*/30 * * * *", () => {
  const f = (x) => JSON.stringify(x, null, 2);

  fs.writeFileSync("./database/owner.json", f(owner));
  fs.writeFileSync("./lib/database.json", f(global.db.data));

  const db = {
    ...global.db,
  };
  delete db.data;
  fs.writeFileSync("./database/database.json", f(db));
});

cron.schedule(
  "0 0 * * *",
  () => {
    let user = Object.keys(global.db.data.users);
    let limitUser = global.limitawal.free;
    for (let jid of user) {
      global.db.data.users[jid].limit += limitUser;
    }
  },
  {
    scheduled: true,
    timezone: "Asia/Jakarta",
  }
);

cron.schedule(
  "0 0 * * *",
  () => {
    try {
      for (const file of fs.readdirSync(dirlimit)) {
        if (file.startsWith("limit_") && file.endsWith(".json")) {
          const botId = file.replace("limit_", "").replace(".json", "");
          let limits = loadLimitDB(botId);
          const defaultLimit = limits.__default || global.limitawal.free;
          for (let id in limits) {
            if (id !== "__default") {
              limits[id].limit = defaultLimit;
            }
          }
          saveLimitDB(botId, limits);
        }
      }
      console.log(`[RESET LIMIT] Semua limit berhasil direset jam 00:00 WIB`);
    } catch (e) {
      console.error("[RESET LIMIT] Gagal me-reset limit karena error!", e);
    }
  },
  {
    scheduled: true,
    name: "reset limit",
    timezone: "Asia/Jakarta",
  }
);

module.exports = DimzBot = async (DimzBot, m, chatUpdate, store) => {
  async function appenTextMessage(text, chatUpdate) {
    let messages = await generateWAMessage(
      m.chat,
      {
        text: text,
        mentions: m.mentionedJid,
      },
      {
        userJid: DimzBot.user.id,
        quoted: m.quoted && m.quoted.fakeObj,
      }
    );
    messages.key.fromMe = areJidsSameUser(m.sender, DimzBot.user.id);
    messages.key.id = m.key.id;
    messages.pushName = m.pushName;
    if (m.isGroup) messages.participant = m.sender;
    let msg = {
      ...chatUpdate,
      messages: [proto.WebMessageInfo.fromObject(messages)],
      type: "append",
    };
    DimzBot.ev.emit("messages.upsert", msg);
  }

  const { type, quotedMsg, mentioned, now, fromMe } = m;

  if (m.mtype === "reactionMessage") return; // skip pesan react

  let body =
    m.mtype === "interactiveResponseMessage"
      ? JSON.parse(
          m.message.interactiveResponseMessage.nativeFlowResponseMessage
            .paramsJson
        ).id
      : m.mtype === "conversation"
        ? m.message.conversation
        : m.mtype == "imageMessage"
          ? m.message.imageMessage.caption
          : m.mtype == "videoMessage"
            ? m.message.videoMessage.caption
            : m.mtype == "extendedTextMessage"
              ? m.message.extendedTextMessage.text
              : m.mtype == "buttonsResponseMessage"
                ? m.message.buttonsResponseMessage.selectedButtonId
                : m.mtype == "listResponseMessage"
                  ? m.message.listResponseMessage.singleSelectReply
                      .selectedRowId
                  : m.mtype == "templateButtonReplyMessage"
                    ? m.message.templateButtonReplyMessage.selectedId
                    : m.mtype == "messageContextInfo"
                      ? m.message.buttonsResponseMessage?.selectedButtonId ||
                        m.message.listResponseMessage?.singleSelectReply
                          .selectedRowId ||
                        m.text
                      : m.mtype === "editedMessage"
                        ? m.message.editedMessage.message.protocolMessage
                            .editedMessage.extendedTextMessage
                          ? m.message.editedMessage.message.protocolMessage
                              .editedMessage.extendedTextMessage.text
                          : m.message.editedMessage.message.protocolMessage
                              .editedMessage.conversation
                        : m.mtype === "viewOnceMessage"
                          ? m.message.viewOnceMessage.message.imageMessage
                              ?.caption ||
                            m.message.viewOnceMessage.message.videoMessage
                              ?.caption ||
                            ""
                          : "";
  if (typeof body !== "string") body = "";
  const budy = typeof m.text == "string" ? m.text : "";
  const prefa = [".", "!", "?", "/", "#"];
  const prefixg = [".", "!", "?", "#"];
  var prefix = prefa
    ? /^[°π÷¶∆/£¢€¥✓|!?#%^&.^]/gi.test(body)
      ? body.match(/^[°π÷¶∆/£¢€¥✓|!?#%^&.^]/gi)[0]
      : " "
    : (prefa ?? prefixg);
  const chath = body;
  const pes = body;
  const content = JSON.stringify(m.message);
  const isCmd = body.startsWith(prefix);
  const from = m.key.remoteJid;
  const messagesD = body.slice(0).trim().split(/ +/).shift().toLowerCase();
  let command = "";
  const sisalimit = checkLimit(botId, m.sender);
  if (body.startsWith(prefix)) {
    const afterPrefix = body.slice(prefix.length).trim();
    const firstWord = afterPrefix.split(/ +/).shift().toLowerCase();
    if (firstWord) {
      command = firstWord;
    }
  }
  const argss = body.trim().split(/ +/).slice(1);
  const pushname = m.pushName || "Nothing";
  const botNumber = await DimzBot.decodeJid(DimzBot.user.id);
  const OwnerDimz =
    [
      ((global.ownernomer || "") + "").replace(/[^0-9]/g, ""),
      ...(getData(botId, "global").owners || []),
    ]
      .map((v) => v.split("@")[0])
      .includes(m.sender.split("@")[0]) || m.key.fromMe;
  const GlobalOwner = [global.gbown + "@s.whatsapp.net"].includes(m.sender);
  const botnumber = m.sender == botNumber ? true : true;
  const q = argss.join(" ");
  const text = q;
  const quoted = m.quoted ? m.quoted : m;
  const mime = quoted?.msg?.mimetype || quoted?.mimetype || "";
  const qmsg = quoted.msg || quoted;
  const isMedia = /image|video|sticker|audio/.test(mime);
  const isImage = type == "imageMessage";
  const isVideo = type == "videoMessage";
  const isAudio = type == "audioMessage";
  const isSticker = type == "stickerMessage";
  const isQuotedImage =
    type === "extendedTextMessage" && content.includes("imageMessage");
  const isQuotedLocation =
    type === "extendedTextMessage" && content.includes("locationMessage");
  const isQuotedVideo =
    type === "extendedTextMessage" && content.includes("videoMessage");
  const isQuotedSticker =
    type === "extendedTextMessage" && content.includes("stickerMessage");
  const isQuotedAudio =
    type === "extendedTextMessage" && content.includes("audioMessage");
  const isQuotedContact =
    type === "extendedTextMessage" && content.includes("contactMessage");
  const isQuotedDocument =
    type === "extendedTextMessage" && content.includes("documentMessage");
  const groupMetadata = m.isGroup
    ? await DimzBot.groupMetadata(m.chat).catch((e) => {})
    : "";
  const groupName = m.isGroup && groupMetadata ? groupMetadata.subject : [];
  const participants =
    m.isGroup && groupMetadata ? groupMetadata.participants : [];
  m.mentionedJid = m.mentionedJid.map((v) => {
    const { jid } = participants.find(
      ({ id, lid }) => id === v || lid === v
    ) || {
      jid: v,
    };
    return jid;
  });
  const groupAdmins = m.isGroup
    ? participants
        .filter((v) => v.admin === "admin" || v.admin === "superadmin")
        .map((v) => v.jid)
    : [];
  const rawParticipant = m.isGroup
    ? m.key?.participant || m.participant || null
    : null;
  const sender = m.isGroup
    ? participants.find((p) => p.id === (m.key.participant || m.participant))
        ?.jid || m.sender
    : m.key.remoteJid;
  const senderNumber = (m.sender || "").split("@")[0];
  const groupMembership =
    m.isGroup && groupMetadata ? groupMetadata.membership : [];
  const groupMembers =
    m.isGroup && groupMetadata ? groupMetadata.participants : [];
  const isBotAdmins = m.isGroup ? groupAdmins.includes(botNumber) : false;
  const isGroupAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false;
  const isAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false;
  const isDrizzMedia = m.mtype;
  const CACHE_TTL = 60 * 1000;
  global._banCache = global._banCache || {
    ts: 0,
    set: new Set(),
  };

  async function getBanSet() {
    if (Date.now() - global._banCache.ts > CACHE_TTL) {
      const list = await DimzBot.fetchBlocklist().catch(() => []);
      global._banCache.set = new Set(Array.isArray(list) ? list : []);
      global._banCache.ts = Date.now();
    }
    return global._banCache.set;
  }

  const banSet = await getBanSet();
  const isBanned = banSet.has(m.sender);
  const mentionUser = [
    ...new Set([
      ...(m.mentionedJid || []),
      ...(m.quoted ? [m.quoted.sender] : []),
    ]),
  ];
  const mentionByTag =
    type == "extendedTextMessage" &&
    m.message.extendedTextMessage.contextInfo != null
      ? m.message.extendedTextMessage.contextInfo.mentionedJid
      : [];
  const mentionByReply =
    type == "extendedTextMessage" &&
    m.message.extendedTextMessage.contextInfo != null
      ? m.message.extendedTextMessage.contextInfo.participant || ""
      : "";
  const numberQuery =
    q.replace(new RegExp("[()+-/ +/]", "gi"), "") + "@s.whatsapp.net";
  const usernya = mentionByReply ? mentionByReply : mentionByTag[0];
  const Input = mentionByTag[0]
    ? mentionByTag[0]
    : mentionByReply
      ? mentionByReply
      : q
        ? numberQuery
        : false;

  // global database
  const groupId = m.chat;
  const botData = getData(botId, groupId);
  const botGlobal2 = getData(botId, "global");

  const Antilinkgc = m.isGroup ? (botData.antilinkgc ?? false) : false;
  const Antilinkgc2 = m.isGroup ? (botData.antilinkgc2 ?? false) : false;
  const Antilinkgcsalur = m.isGroup
    ? (botData.antilinkgcsalur ?? false)
    : false;
  const Antilinkgcsalur2 = m.isGroup
    ? (botData.antilinkgcsalur2 ?? false)
    : false;
  const Antilinkgcwa = m.isGroup ? (botData.antilinkgcwa ?? false) : false;
  const Antilinkgcwa2 = m.isGroup ? (botData.antilinkgcwa2 ?? false) : false;
  const AntiLinkYoutubeVid = m.isGroup
    ? (botData.antilinkytvid ?? false)
    : false;
  const AntiLinkYoutubeVid2 = m.isGroup
    ? (botData.antilinkytvid2 ?? false)
    : false;
  const AntiLinkYoutubeChannel = m.isGroup
    ? (botData.antilinkytch ?? false)
    : false;
  const AntiLinkYoutubeChannel2 = m.isGroup
    ? (botData.antilinkytch2 ?? false)
    : false;
  const AntiLinkInstagram = m.isGroup ? (botData.antilinkig ?? false) : false;
  const AntiLinkInstagram2 = m.isGroup ? (botData.antilinkig2 ?? false) : false;
  const AntiLinkFacebook = m.isGroup ? (botData.antilinkfb ?? false) : false;
  const AntiLinkFacebook2 = m.isGroup ? (botData.antilinkfb2 ?? false) : false;
  const AntiLinkTiktok = m.isGroup ? (botData.antilinktt ?? false) : false;
  const AntiLinkTiktok2 = m.isGroup ? (botData.antilinktt2 ?? false) : false;
  const AntiLinkTelegram = m.isGroup ? (botData.antilinktg ?? false) : false;
  const AntiLinkTelegram2 = m.isGroup ? (botData.antilinktg2 ?? false) : false;
  const AntiLinkTwitter = m.isGroup ? (botData.antilinktwt ?? false) : false;
  const AntiLinkTwitter2 = m.isGroup ? (botData.antilinktwt2 ?? false) : false;
  const AntiLinkAll = m.isGroup ? (botData.antilinkall ?? false) : false;
  const AntiLinkAll2 = m.isGroup ? (botData.antilinkall2 ?? false) : false;
  const antiMedia = m.isGroup ? (botData.antimedia ?? false) : false;
  const antiMedia2 = m.isGroup ? (botData.antimedia2 ?? false) : false;
  const antiToxic = m.isGroup ? (botData.antitoxic ?? false) : false;
  const antiToxic2 = m.isGroup ? (botData.antitoxic2 ?? false) : false;
  const isMute = m.isGroup ? (botData.mute ?? false) : false;
  const antiLokasi = m.isGroup ? (botData.antilokasi ?? false) : false;
  const antiLokasi2 = m.isGroup ? (botData.antilokasi2 ?? false) : false;
  const antiPromosi = m.isGroup ? (botData.antipromosi ?? false) : false;
  const antiPolling = m.isGroup ? (botData.antipolling ?? false) : false;
  const antiPolling2 = m.isGroup ? (botData.antipolling2 ?? false) : false;
  const isWelcome = m.isGroup ? db.welcome.includes(m.chat) : false;
  const isLeft = m.isGroup ? db.left.includes(m.chat) : false;

  const botGlobal = (await getGlobal(botId)) || {};

  let gd = botGlobal.global_disabled || {};

if (typeof gd === "string") {
  try {
    gd = JSON.parse(gd);
  } catch {
    gd = {};
  }
}

  // database disabled
  function isFeatureDisabled(botGlobal, feature) {
    if (!botGlobal || !botGlobal.global_disabled) return false;
    return botGlobal.global_disabled[feature] === true;
  }

  const xtime = moment.tz("Asia/Jakarta").format("HH:mm:ss");
  const xdate = moment.tz("Asia/Jakarta").format("DD/MM/YYYY");
  const time2 = moment().tz("Asia/Jakarta").format("HH:mm:ss");
  if (time2 < "23:59:00") {
    var dbottimewisher = `Selamat Malam`;
  }
  if (time2 < "19:00:00") {
    var dbottimewisher = `Selamat Malam`;
  }
  if (time2 < "18:00:00") {
    var dbottimewisher = `Selamat Sore`;
  }
  if (time2 < "15:00:00") {
    var dbottimewisher = `Selamat Siang`;
  }
  if (time2 < "11:00:00") {
    var dbottimewisher = `Selamat Pagi`;
  }
  if (time2 < "05:00:00") {
    var dbottimewisher = `Selamat Pagi`;
  }

  const fmeta = {
    key: {
      remoteJid: "13135550002@s.whatsapp.net",
      fromMe: false,
      id: "FAKE_CATALOG_META",
      participant: "13135550002@s.whatsapp.net",
    },
    message: {
      productMessage: {
        product: {
          productImage: {
            mimetype: "image/jpeg",
            jpegThumbnail: Buffer.alloc(0),
          },
          title: botName,
          description: "Panel • Script • API • Bot WhatsApp",
          currencyCode: "IDR",
          priceAmount1000: "1000000000",
          retailerId: "dimas-botzz",
          productImageCount: 1,
        },
        businessOwnerJid: "13135550002@s.whatsapp.net",
      },
    },
  };

  const fverif = {
    key: {
      remoteJid: "0@s.whatsapp.net",
      participant: "0@s.whatsapp.net",
      fromMe: false,
      id: "",
    },
    message: {
      conversation: botName,
    },
  };

  const fquoted = {
    key: {
      remoteJid: "0@s.whatsapp.net",
      participant: "0@s.whatsapp.net",
      fromMe: false,
      id: "",
    },
    message: {
      conversation: `${prefix + command} ${text}`,
    },
  };

  const fanti = {
    key: {
      fromMe: false,
      participant: "0@s.whatsapp.net",
      remoteJid: "0@s.whatsapp.net",
    },
    message: {
      orderMessage: {
        itemCount: 2026,
        status: 200,
        thumbnail: fs.readFileSync("./Media2/theme/thumb.jpg"),
        surface: 200,
        message: "📢𝐒𝐞𝐬𝐮𝐚𝐭𝐮 𝐓𝐞𝐫𝐝𝐞𝐭𝐞𝐤𝐬𝐢 𝐃𝐢 𝐆𝐫𝐮𝐩 𝐈𝐧𝐢",
        orderTitle: ownName,
        sellerJid: "0@s.whatsapp.net",
      },
    },
    contextInfo: {
      forwardingScore: 999,
      isForwarded: true,
    },
    sendEphemeral: true,
  };

  const fakeintro = {
    key: {
      participant: `0@s.whatsapp.net`,
      ...(m.chat
        ? {
            remoteJid: "0@s.whatsapp.net",
          }
        : {}),
    },
    message: {
      extendedTextMessage: {
        text: `*_Intro Dulu Yuk Biar Saling Kenal😄_*\n*🗓Tanggal:* ${xdate}\n*⌚Jam:* ${xtime}`,
        title: ``,
        jpegThumbnail: ``,
      },
    },
  };

  const fmenfessverif = {
    key: {
      remoteJid: "0@s.whatsapp.net",
      participant: "0@s.whatsapp.net",
      fromMe: false,
      id: "",
    },
    message: {
      conversation: botName,
    },
  };

  const fmenfess = {
    key: {
      participant: `0@s.whatsapp.net`,
      ...(m.chat
        ? {
            remoteJid: "0@s.whatsapp.net",
          }
        : {}),
    },
    message: {
      extendedTextMessage: {
        text: `*🗓Tanggal:* *${day(Date.now())} ${weton(Date.now())}, ${tanggal(Date.now())}-${bulan(Date.now())}-${tahun(Date.now())}*\n*⌚Jam:* ${xtime}`,
        title: ``,
        jpegThumbnail: ``,
      },
    },
  };

  const StickAdmin = async () => {
    let StikerReply = fs.readFileSync("Media2/theme/sticker_reply/admin.webp");
    await DimzBot.sendMessage(
      from,
      {
        sticker: StikerReply,
      },
      {
        quoted: m,
      }
    );
  };
  const StickBotAdmin = async () => {
    let StikerReply = fs.readFileSync(
      "Media2/theme/sticker_reply/botadmin.webp"
    );
    await DimzBot.sendMessage(
      from,
      {
        sticker: StikerReply,
      },
      {
        quoted: m,
      }
    );
  };
  const StickGroup = async () => {
    let StikerReply = fs.readFileSync("Media2/theme/sticker_reply/group.webp");
    await DimzBot.sendMessage(
      from,
      {
        sticker: StikerReply,
      },
      {
        quoted: m,
      }
    );
  };
  const StickPrivate = async () => {
    let StikerReply = fs.readFileSync(
      "Media2/theme/sticker_reply/private.webp"
    );
    await DimzBot.sendMessage(
      from,
      {
        sticker: StikerReply,
      },
      {
        quoted: m,
      }
    );
  };

  const reply = (teks) => {
    DimzBot.sendMessage(
      from,
      {
        text: teks,
        contextInfo: {
          forwardingScore: 9999999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: "120363179857645465@newsletter",
            newsletterName: "☰『✦ Powered by softbotz.my.id ✦』",
          },
        },
      },
      {
        quoted: m,
      }
    );
  };

  const replyfooter = async (teks) => {
    const msg = generateWAMessageFromContent(
      m.chat,
      {
        interactiveMessage: {
          body: {
            text: ``,
          },
          footer: {
            text: botName,
          },
          header: {
            title: teks,
            hasMediaAttachment: false,
          },
          nativeFlowMessage: {
            buttons: [
              {
                title: botName,
              },
            ],
          },
        },
      },
      {
        quoted: m,
      }
    );
    DimzBot.relayMessage(m.chat, msg.message, {});
  };

  const replyerror = async (teks) => {
    await sendDimzBotMessage(
      from,
      {
        text: teks,
        mentions: [sender],
        contextInfo: {
          mentionedJid: [m.sender],
          forwardingScore: 9999999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: "120363179857645465@newsletter",
            serverMessageId: 167,
            newsletterName: "☰『✦ Powered by softbotz.my.id ✦』",
          },
          externalAdReply: {
            showAdAttribution: false,
            renderLargerThumbnail: true,
            title: botName,
            containsAutoReply: true,
            mediaType: 1,
            thumbnailUrl: "https://telegra.ph/file/d42fe7eb6aa7eb5aeea05.jpg",
          },
        },
      },
      {
        quoted: m,
      }
    );
  };
  const locnsfw = async (teks) => {
    DimzBot.relayMessage(
      m.chat,
      {
        liveLocationMessage: {
          degreesLatitude: 35.685506276233525,
          degreesLongitude: 139.75270667105852,
          accuracyInMeters: 0,
          degreesClockwiseFromMagneticNorth: 2,
          caption: teks,
          sequenceNumber: 2,
          timeOffset: 3,
          contextInfo: {
            mentionedJid: [m.sender],
          },
        },
      },
      {
        quoted: fverif,
      }
    );
  };

  if (m.chat.endsWith("@s.whatsapp.net")) {
    this.menfes = this.menfes ? this.menfes : {};

    let room = Object.values(this.menfes).find(
      (room) => [room.a, room.b].includes(m.sender) && room.state === "CHATTING"
    );

    if (room) {
      if (/^.*(next|leave|start)/.test(body)) return;
      if (
        [
          ".next",
          ".leave",
          ".stop",
          ".start",
          "Cari Partner",
          "Keluar",
          "Lanjut",
          "Stop",
        ].includes(body)
      )
        return;

      let find = Object.values(this.menfes).find((menpes) =>
        [menpes.a, menpes.b].includes(m.sender)
      );
      let other = find.a == m.sender ? find.b : find.a;

      await m.copyNForward(
        other,
        true,
        m.quoted && m.quoted.fromMe
          ? {
              contextInfo: {
                ...m.msg.contextInfo,
                participant: other,
              },
            }
          : {}
      );
    }
  }

  if (m.chat.endsWith("@s.whatsapp.net")) {
    let room = Object.values(anon.anonymous).find(
      (p) => p.state == "CHATTING" && p.check(sender)
    );

    if (room) {
      let other = room.other(sender);

      m.copyNForward(
        other,
        true,
        m.quoted && m.quoted.fromMe
          ? {
              contextInfo: {
                ...m.msg.contextInfo,
                participant: other,
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                  newsletterJid: "120363179857645465@newsletter",
                  newsletterName: "☰『✦ Powered by softbotz.my.id ✦』",
                },
              },
            }
          : {}
      );
    }
  }

  // antipolling
  if (botData.antipolling && m.isGroup) {
    // Cek untuk versi polling lama DAN baru (V3)
    if (m.message?.pollCreationMessage || m.message?.pollCreationMessageV3) {
      try {
        if (isAdmins || m.key.fromMe || OwnerDimz) return;

        await DimzBot.sendMessage(
          m.chat,
          {
            text: `🚫 *Anti-Polling Aktif!*\n\n@${sender.split("@")[0]} kamu tidak diizinkan membuat polling di grup ini.`,
            mentions: [sender],
          },
          {
            quoted: m,
          }
        );

        await DimzBot.sendMessage(m.chat, {
          delete: {
            remoteJid: m.chat,
            fromMe: false,
            id: m.key.id,
            participant: sender,
          },
        });

        await sleep(3000);
        return DimzBot.groupParticipantsUpdate(m.chat, [m.sender], "remove");
      } catch (err) {
        console.error("❌ Gagal hapus polling:", err);
      }
    }
  }

  // antipolling 2
  if (botData.antipolling2 && m.isGroup) {
    // Cek untuk versi polling lama DAN baru (V3)
    if (m.message?.pollCreationMessage || m.message?.pollCreationMessageV3) {
      try {
        if (isAdmins || m.key.fromMe || OwnerDimz) return;

        await DimzBot.sendMessage(
          m.chat,
          {
            text: `🚫 *Anti-Polling2 Aktif!*\n\n@${sender.split("@")[0]} kamu tidak diizinkan membuat polling di grup ini.`,
            mentions: [sender],
          },
          {
            quoted: m,
          }
        );

        await DimzBot.sendMessage(m.chat, {
          delete: {
            remoteJid: m.chat,
            fromMe: false,
            id: m.key.id,
            participant: sender,
          },
        });
      } catch (err) {
        console.error("❌ Gagal hapus polling:", err);
      }
    }
  }

  if (botData.antipromosi) {
    let messagesD = (
      m.text ||
      m.message?.extendedTextMessage?.text ||
      m.message?.imageMessage?.caption ||
      m.message?.videoMessage?.caption ||
      ""
    ).toLowerCase();

    const promoRegex =
      /\b(promo|diskon|voucher|flash sale|harga spesial|penawaran|kode promo|gratis ongkir|cashback|harga? pm|list panel|list harga panel|belanja sekarang|diskon besar-besaran|toko kami|menjual berbagai jenis|ready nokos|ready bot|ready panel|ready config|jasa bug|hingga 100gb|kuota internet gratis|spesial harga|harga murah|toko online|promo terbatas|diskon gede|harga termurah|potongan harga|free shipping|super sale|penawaran menarik|belanja hemat|belanja cerdas|promo hari ini|pembelian sekarang|bonus langsung|harga terjangkau|diskon langsung|voucher belanja|gratis hadiah|gratis pulsa|diskon tambahan|flash promo|cashback langsung|voucher spesial|special offer|pembayaran cepat|promo eksklusif|harga gila|belanja hemat|harga besar|harga off|potongan besar|limited offer|flash sale besar|gratis ongkir sepanjang tahun|promo bulanan|diskon akhir bulan|diskon item tertentu|diskon produk pilihan|penawaran terbatas|bonus extra|cashback untuk member|diskon akhir pekan|harga spesial hari ini|sale besar-besaran|need sewa whatsapp|sewa whatsapp|resiko ban sementara|ban dibawah 7 menit no pay|ban dibawah 7 menit|minimal 2 bulan keatas|khusus wa yang udah login|wa yang udah login|dipakai buat spm promosi|dipakai buat spam promosi|kontak pribadi aman|100 followers 10rb pulsa|followers tiktok|yang mau beli klik wa ini|di jamin murah|untuk harga)\b/g;

    if (promoRegex.test(messagesD)) {
      if (
        m.text ||
        m.message?.extendedTextMessage?.text ||
        m.message?.imageMessage?.caption ||
        m.message?.videoMessage?.caption
      ) {
        if (isAdmins || m.key.fromMe || OwnerDimz) return;

        await DimzBot.sendMessage(m.chat, {
          delete: {
            remoteJid: m.chat,
            fromMe: false,
            id: m.key.id,
            participant: m.key.participant,
          },
        });

        await DimzBot.sendMessage(
          from,
          {
            text: `\`\`\`「 ⚠️ Anti Promosi ⚠️ 」\`\`\`\n\nHalo @${
              m.sender.split("@")[0]
            }, *Mohon jangan promosi di grup ini ya, ngeyel di kick!*`,
            contextInfo: {
              mentionedJid: [m.sender],
            },
          },
          {
            quoted: fanti,
          }
        );
      }
    }
  }

  // anti bot
  if (db.ntbot.includes(m.chat)) {
    const rawMsg = m.message?.viewOnceMessage?.message || m.message || {};
    const mtype = Object.keys(rawMsg)[0];
    const msg = rawMsg[mtype] || {};

    const buttonTypes = ["dambrut"];

    const botIdPrefixes = [
      "IZUMI-",
      "Laurine-",
      "false_",
      "true_",
      "BAE",
      "3EB",
      "bot_",
      "msgid_",
    ];
    const messageId = m.key?.id || "";
    const isAdminsOrOwner = isAdmins || m.key?.fromMe || OwnerDimz;
    const pengirim = m.sender;
    const nama = m.pushName || "User";

    let isDetected = false;
    let detectedLabel = "";
    let extraReason = "";

    if (buttonTypes.includes(mtype)) {
      isDetected = true;
      switch (mtype) {
        case "dambrut":
          detectedLabel = "📥";
          break;
        default:
          detectedLabel = "❓ Unknown Interaktif";
          break;
      }
      extraReason = "Jenis pesan interaktif";
    }

    const matchedPrefix = botIdPrefixes.find((prefix) =>
      messageId.startsWith(prefix)
    );
    const isBotId = Boolean(matchedPrefix);
    if (isBotId && !isDetected) {
      isDetected = true;
      detectedLabel = `🤖 Pesan Bot`;
      extraReason = "Aktifitasnya mencurigakan";
    }

    if (isDetected && !isAdminsOrOwner) {
      console.log(
        chalk.red(`[⚠️ BOT DETECTED]`) +
          ` ${pengirim} (${nama}) via ${detectedLabel} - ID: ${messageId}`
      );

      await DimzBot.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          fromMe: false,
          id: m.key.id,
          participant: m.key.participant || pengirim,
        },
      });

      await DimzBot.sendMessage(
        m.chat,
        {
          text: `
🤖  *BOT WHATSAPP TERDETEKSI*  🤖
━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤  *USER*      : @${pengirim.split("@")[0]}
📛  *NAMA*    : ${nama}
🎯  *TIPE*        : ${detectedLabel}
📝  *ALASAN* : ${extraReason}
🚫  *STATUS*  : 『☠ AUTO KICK ENABLED ☠』
━━━━━━━━━━━━━━━━━━━━━━━━━━━
💾 SYSTEM LOG:
  ➤ MODULE  : DBOT_INTRUSION_SCANNER
  ➤ CORE        : DRIZZCORE ENGINE vΩ9.99
  ➤ MODE       : ACTIVE MONITORING
  ➤ ACTION    : FORCE REMOVE
  
  ⬢ 『 @${pengirim.split("@")[0]} 』 TELAH DIKENALI SEBAGAI *ANOMALI BOT*
  
🔐 SYSTEM DEFENSE: [ ACTIVE ]
🌐 FIREWALL: [ 🔥 DEPLOYING SANCTION ]
⚙️ ENGINE vX.7.2 - D1MZ PROTOCOL INITIATED
⏳ DI KICK DALAM 3 DETIK

📩 \`\`\`Byee Byee Bott\`\`\``,
          contextInfo: {
            mentionedJid: [pengirim],
            externalAdReply: {
              title: `SYSTEM ANTI-BOT 2026`,
              thumbnailUrl:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZmneuFfDo0NrYIdz4r-z4s0zNu1h4GD8nYOzz730LknhKKnbg0MxXH6O6&s=10",
              containsAutoReply: true,
              sourceUrl: `${wagc}`,
              mediaType: 1,
              renderLargerThumbnail: true,
            },
          },
        },
        {
          quoted: fanti,
        }
      );

      await sleep(3000);
      return DimzBot.groupParticipantsUpdate(m.chat, [m.sender], "remove");
    }
  }

  // Anti Media
  if (botData.antimedia && m.isGroup) {
    if (
      m.message?.imageMessage ||
      m.message?.videoMessage ||
      m.message?.documentMessage ||
      m.message?.audioMessage ||
      m.message?.stickerMessage ||
      m.message?.extendedTextMessage?.contextInfo?.quotedMessage?.audioMessage
    ) {
      if (isAdmins || m.key.fromMe || OwnerDimz) return;

      await DimzBot.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          fromMe: false,
          id: m.key.id,
          participant: m.key.participant,
        },
      });

      await DimzBot.sendMessage(
        from,
        {
          text: `\`\`\`「 ⚠️Media Tidak Diizinkan⚠️ 」\`\`\`\n\nHalo @${
            m.sender.split("@")[0]
          } *Jangan Kirim Media Di Grup Ini, Kalau Ngeyel Ntar Aku Kick*`,
          contextInfo: {
            mentionedJid: [m.sender],
          },
        },
        {
          quoted: fanti,
        }
      );
      await sleep(3000);
      return DimzBot.groupParticipantsUpdate(m.chat, [m.sender], "remove");
    }
  }

  // Anti Media 2
  if (botData.antimedia2 && m.isGroup) {
    if (
      m.message?.imageMessage ||
      m.message?.videoMessage ||
      m.message?.documentMessage ||
      m.message?.audioMessage ||
      m.message?.stickerMessage ||
      m.message?.extendedTextMessage?.contextInfo?.quotedMessage?.audioMessage
    ) {
      if (isAdmins || m.key.fromMe || OwnerDimz) return;

      await DimzBot.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          fromMe: false,
          id: m.key.id,
          participant: m.key.participant,
        },
      });

      await DimzBot.sendMessage(
        from,
        {
          text: `\`\`\`「 ⚠️Media Tidak Diizinkan⚠️ 」\`\`\`\n\nHalo @${
            m.sender.split("@")[0]
          } *Jangan Kirim Media Di Grup Ini, Kalau Ngeyel Ntar Aku Kick*`,
          contextInfo: {
            mentionedJid: [m.sender],
          },
        },
        {
          quoted: fanti,
        }
      );
    }
  }

  const antitagsw = JSON.parse(fs.readFileSync("./database/antitagsw.json"));
  const Antitagsw = m.isGroup && m.chat in antitagsw;

  if (Antitagsw) {
    if (m.message.groupStatusMentionMessage) {
      if (isAdmins) return;
      if (OwnerDimz) return;
      if (!isBotAdmins) return StickBotAdmin();

      await DimzBot.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          fromMe: false,
          id: m.key.id,
          participant: m.key.participant,
        },
      });
      await DimzBot.sendMessage(
        from,
        {
          text: `
*Maaf @${m.sender.split`@`[0]} Grup ini tidak mengizinkan group mention/tag story whatsapp ke group!*
`,
          contextInfo: {
            mentionedJid: [m.sender],
          },
        },
        {
          quoted: fanti,
        }
      );
      await delay(5000);

      if (antitagsw[m.chat] === "kick") {
        await DimzBot.groupParticipantsUpdate(m.chat, [m.sender], "remove");
      }
    }
  }

  // Anti Link
  if (botData.antilinkgc && m.isGroup) {
    if (budy.match(/chat\.whatsapp\.com/i)) {
      if (!isBotAdmins) return StickBotAdmin();

      const gclink = `https://chat.whatsapp.com/${await DimzBot.groupInviteCode(m.chat)}`;
      const isLinkThisGc = new RegExp(gclink, "i");
      const isOwnLink = isLinkThisGc.test(m.text);

      if (isOwnLink || isAdmins || OwnerDimz) return;

      const kice = m.sender;

      await DimzBot.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          fromMe: false,
          id: m.key.id,
          participant: m.key.participant,
        },
      });

      await DimzBot.sendMessage(
        from,
        {
          text: `\`\`\`「 ⚠️ Grup Link Detected ⚠️ 」\`\`\`\n\n@${
            kice.split("@")[0]
          } telah ditendang karena mengirimkan tautan grup lain di grup ini.`,
          contextInfo: {
            mentionedJid: [kice],
          },
        },
        {
          quoted: fanti,
        }
      );

      await delay(5000);
      await DimzBot.groupParticipantsUpdate(m.chat, [m.sender], "remove");
    }
  }

  // Anti Link2
  if (botData.antilinkgc2 && m.isGroup) {
    if (/chat\.whatsapp\.com/i.test(budy)) {
      if (!isBotAdmins) return StickBotAdmin();

      const gclink = `https://chat.whatsapp.com/${await DimzBot.groupInviteCode(m.chat)}`;
      const isLinkThisGc = new RegExp(gclink, "i");
      const isOwnLink = isLinkThisGc.test(m.text);

      if (isOwnLink || isAdmins || OwnerDimz) return;

      const kice = m.sender;

      await DimzBot.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          fromMe: false,
          id: m.key.id,
          participant: m.key.participant,
        },
      });

      await DimzBot.sendMessage(
        from,
        {
          text: `\`\`\`「 ⚠️ Grup Link Detected ⚠️ 」\`\`\`\n\n*antilinkgc2 aktif*\nJangan diulangi lagi ya @${
            kice.split("@")[0]
          } 😡`,
          contextInfo: {
            mentionedJid: [kice],
          },
        },
        {
          quoted: fanti,
        }
      );
    }
  }

  // Anti Link Saluran WA
  if (botData.antisaluran && m.isGroup) {
    const isSaluran =
      budy.includes("https://whatsapp.com/channel") ||
      m.msg?.contextInfo?.forwardedNewsletterMessageInfo;
    debug({
      isSaluran,
      hasMsg: !!m.msg,
      message: m.message,
    });

    if (isSaluran) {
      const jidSaluran =
        m.msg?.contextInfo?.forwardedNewsletterMessageInfo?.newsletterJid;
      if (jidSaluran === "120363179857645465@newsletter") return;

      if (!isBotAdmins) return StickBotAdmin();
      if (m.text?.includes(global.saluran)) return;
      if (isAdmins || OwnerDimz) return;

      const kice = m.sender;

      await DimzBot.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          fromMe: false,
          id: m.key.id,
          participant: m.key.participant,
        },
      });

      await DimzBot.sendMessage(
        from,
        {
          text: `\`\`\`「 ⚠️ Link Saluran WA Detected ⚠️ 」\`\`\`\n\n*Anti Saluran* aktif!\n@${
            kice.split("@")[0]
          } akan dikeluarkan karena mengirimkan tautan saluran.`,
          contextInfo: {
            mentionedJid: [kice],
          },
        },
        {
          quoted: fanti,
        }
      );

      await delay(5000);
      await DimzBot.groupParticipantsUpdate(m.chat, [m.sender], "remove");
    }
  }

  if (botData.antisaluran2 && m.isGroup) {
    const isSaluran =
      budy.includes("https://whatsapp.com/channel") ||
      m.msg?.contextInfo?.forwardedNewsletterMessageInfo;
    debug({
      isSaluran,
      hasMsg: !!m.msg,
      message: m.message,
    });

    if (isSaluran) {
      const jidSaluran =
        m.msg?.contextInfo?.forwardedNewsletterMessageInfo?.newsletterJid;
      if (jidSaluran === "120363179857645465@newsletter") return;

      if (!isBotAdmins) return StickBotAdmin();
      if (m.text?.includes(global.saluran)) return;
      if (isAdmins || OwnerDimz) return;

      const kice = m.sender;

      await DimzBot.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          fromMe: false,
          id: m.key.id,
          participant: m.key.participant,
        },
      });

      await DimzBot.sendMessage(
        from,
        {
          text: `\`\`\`「 ⚠️ Link Saluran WA Detected ⚠️ 」\`\`\`\n\n*Anti Saluran 2* aktif!\n@${
            kice.split("@")[0]
          }, jangan kirim link saluran lagi.`,
          contextInfo: {
            mentionedJid: [kice],
          },
        },
        {
          quoted: fanti,
        }
      );
    }
  }

  // Anti wa.me
  if (botData.antilinkgcwa && m.isGroup) {
    if (budy.includes("wa.me")) {
      if (!isBotAdmins) return StickBotAdmin();
      if (isAdmins || OwnerDimz) return;

      const kice = m.sender;

      await DimzBot.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          fromMe: false,
          id: m.key.id,
          participant: m.key.participant,
        },
      });

      await DimzBot.sendMessage(
        from,
        {
          text: `\`\`\`「 ⚠️ Link wa.me Detected ⚠️ 」\`\`\`\n\n*Anti wa.me* aktif!\n@${
            kice.split("@")[0]
          } telah dikick karena mengirimkan tautan wa.me.`,
          contextInfo: {
            mentionedJid: [kice],
          },
        },
        {
          quoted: fanti,
        }
      );

      await DimzBot.groupParticipantsUpdate(m.chat, [m.sender], "remove");
    }
  }

  if (botData.antilinkgcwa2 && m.isGroup) {
    if (budy.includes("wa.me")) {
      if (!isBotAdmins) return StickBotAdmin();
      if (isAdmins || OwnerDimz) return;

      const kice = m.sender;

      await DimzBot.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          fromMe: false,
          id: m.key.id,
          participant: m.key.participant,
        },
      });

      await DimzBot.sendMessage(
        from,
        {
          text: `\`\`\`「 ⚠️ Link wa.me Detected ⚠️ 」\`\`\`\n\n*Anti wa.me 2* aktif!\n@${
            kice.split("@")[0]
          } jangan diulang lagi.`,
          contextInfo: {
            mentionedJid: [kice],
          },
        },
        {
          quoted: fanti,
        }
      );
    }
  }

  // Anti Lokasi
  if (botData.antilokasi && m.isGroup) {
    if (isDrizzMedia === "locationMessage") {
      if (!isBotAdmins) return StickBotAdmin();
      if (isAdmins) return sendText("Admin bebas ygy, sungkem kepada admin 😎");
      if (OwnerDimz)
        return sendText("Owner mah bebas ygy, sungkem kepada owner 👑");

      const kice = m.sender;

      await DimzBot.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          fromMe: false,
          id: m.key.id,
          participant: m.key.participant,
        },
      });

      await DimzBot.sendMessage(
        from,
        {
          text: `\`\`\`「 📍 Lokasi Terdeteksi 」\`\`\`\n\n@${
            kice.split("@")[0]
          } telah dikick karena mengirim lokasi.`,
          contextInfo: {
            mentionedJid: [kice],
          },
        },
        {
          quoted: fanti,
        }
      );

      await DimzBot.groupParticipantsUpdate(m.chat, [m.sender], "remove");
    }
  }

  if (botData.antilokasi2 && m.isGroup) {
    if (isDrizzMedia === "locationMessage") {
      if (!isBotAdmins) return StickBotAdmin();
      if (isAdmins || OwnerDimz) return;

      const kice = m.sender;

      await DimzBot.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          fromMe: false,
          id: m.key.id,
          participant: m.key.participant,
        },
      });

      await DimzBot.sendMessage(
        from,
        {
          text: `\`\`\`「 📍 Lokasi Terdeteksi 」\`\`\`\n\nAntiLokasi2 aktif!\n@${
            kice.split("@")[0]
          } jangan kirim lokasi lagi.`,
          contextInfo: {
            mentionedJid: [kice],
          },
        },
        {
          quoted: fanti,
        }
      );
    }
  }

  // Anti Toxic
  if (botData.antitoxic && m.isGroup) {
    let msg = (
      m.text ||
      m.message?.extendedTextMessage?.text ||
      m.message?.imageMessage?.caption ||
      m.message?.videoMessage?.caption ||
      ""
    )
      .toLowerCase()
      .replace(/[.,!?;:()'"`]/g, " ");

    if (BadXeon.some((bad) => new RegExp(`\\b${bad}\\b`, "i").test(msg))) {
      if (isAdmins || m.key.fromMe || OwnerDimz) return;

      const kice = m.sender;
      await DimzBot.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          fromMe: false,
          id: m.key.id,
          participant: m.key.participant,
        },
      });

      await DimzBot.sendMessage(
        from,
        {
          text: `\`\`\`「 ⚠️ Pesan Tidak Ramah 」\`\`\`\n\n@${
            kice.split("@")[0]
          } telah dikick karena menggunakan kata kasar.`,
          contextInfo: {
            mentionedJid: [kice],
          },
        },
        {
          quoted: fanti,
        }
      );

      await DimzBot.groupParticipantsUpdate(m.chat, [m.sender], "remove");
    }
  }

  if (botData.antitoxic2 && m.isGroup) {
    let msg = (
      m.text ||
      m.message?.extendedTextMessage?.text ||
      m.message?.imageMessage?.caption ||
      m.message?.videoMessage?.caption ||
      ""
    )
      .toLowerCase()
      .replace(/[.,!?;:()'"`]/g, " ");

    if (BadXeon.some((bad) => new RegExp(`\\b${bad}\\b`, "i").test(msg))) {
      if (isAdmins || m.key.fromMe || OwnerDimz) return;

      const kice = m.sender;
      await DimzBot.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          fromMe: false,
          id: m.key.id,
          participant: m.key.participant,
        },
      });

      await DimzBot.sendMessage(
        from,
        {
          text: `\`\`\`「 ⚠️ Pesan Tidak Ramah 」\`\`\`\n\n@${
            kice.split("@")[0]
          } jangan diulang lagi ya.`,
          contextInfo: {
            mentionedJid: [kice],
          },
        },
        {
          quoted: fanti,
        }
      );
    }
  }

  //antilink youtube video by xeon
  if (botData.antilinkytvid && m.isGroup) {
    if (budy.includes("https://youtu.be/")) {
      if (!isBotAdmins) return;
      const info = `\`\`\`「 YouTube Video Link Detected 」\`\`\`\n\n*Admin mah bebas ygy 🗿*`;
      if (isAdmins || m.key.fromMe || OwnerDimz) return reply(info);

      const kice = m.sender;

      await DimzBot.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          fromMe: false,
          id: m.key.id,
          participant: m.key.participant,
        },
      });

      await DimzBot.groupParticipantsUpdate(m.chat, [m.sender], "remove");
      await DimzBot.sendMessage(
        from,
        {
          text: `\`\`\`「 YouTube Video Link Detected 」\`\`\`\n\n@${
            kice.split("@")[0]
          } telah dikick karena mengirim link video YouTube.`,
          contextInfo: {
            mentionedJid: [kice],
          },
        },
        {
          quoted: fanti,
        }
      );
    }
  }

  if (botData.antilinkytvid2 && m.isGroup) {
    if (budy.includes("https://youtu.be/")) {
      if (!isBotAdmins) return;
      const info = `\`\`\`「 YouTube Video Link Detected 」\`\`\`\n\n*Admin mah bebas ygy 🗿*`;
      if (isAdmins || m.key.fromMe || OwnerDimz) return reply(info);

      const kice = m.sender;

      await DimzBot.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          fromMe: false,
          id: m.key.id,
          participant: m.key.participant,
        },
      });

      await DimzBot.sendMessage(
        from,
        {
          text: `\`\`\`「 YouTube Video Link Detected 」\`\`\`\n\nMode 2 aktif — @${
            kice.split("@")[0]
          } jangan diulang lagi.`,
          contextInfo: {
            mentionedJid: [kice],
          },
        },
        {
          quoted: fanti,
        }
      );
    }
  }

  if (botData.antilinkytch && m.isGroup) {
    if (budy.includes("https://youtube.com/")) {
      if (!isBotAdmins) return;
      const info = `\`\`\`「 YouTube Channel Link Detected 」\`\`\`\n\n*Admin mah bebas ygy 🗿*`;
      if (isAdmins || m.key.fromMe || OwnerDimz) return reply(info);

      const kice = m.sender;

      await DimzBot.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          fromMe: false,
          id: m.key.id,
          participant: m.key.participant,
        },
      });

      await DimzBot.groupParticipantsUpdate(m.chat, [m.sender], "remove");
      await DimzBot.sendMessage(
        from,
        {
          text: `\`\`\`「 YouTube Channel Link Detected 」\`\`\`\n\n@${
            kice.split("@")[0]
          } telah dikick karena mengirim link channel YouTube.`,
          contextInfo: {
            mentionedJid: [kice],
          },
        },
        {
          quoted: fanti,
        }
      );
    }
  }

  if (botData.antilinkytch2 && m.isGroup) {
    if (budy.includes("https://youtube.com/")) {
      if (!isBotAdmins) return;
      const info = `\`\`\`「 YouTube Channel Link Detected 」\`\`\`\n\n*Admin mah bebas ygy 🗿*`;
      if (isAdmins || m.key.fromMe || OwnerDimz) return reply(info);

      const kice = m.sender;

      await DimzBot.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          fromMe: false,
          id: m.key.id,
          participant: m.key.participant,
        },
      });

      await DimzBot.sendMessage(
        from,
        {
          text: `\`\`\`「 YouTube Channel Link Detected 」\`\`\`\n\nMode 2 aktif — @${
            kice.split("@")[0]
          } jangan diulang lagi.`,
          contextInfo: {
            mentionedJid: [kice],
          },
        },
        {
          quoted: fanti,
        }
      );
    }
  }

  // ===== Instagram =====
  if (botData.antilinkig && m.isGroup) {
    if (budy.includes("https://www.instagram.com/")) {
      if (!isBotAdmins) return;
      const msg = `\`\`\`「 Instagram Link Detected 」\`\`\`\n\n*Admin mah bebas ygy 🗿*`;
      if (isAdmins || m.key.fromMe || OwnerDimz) return reply(msg);

      const kice = m.sender;
      await DimzBot.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          fromMe: false,
          id: m.key.id,
          participant: m.key.participant,
        },
      });

      await DimzBot.groupParticipantsUpdate(m.chat, [m.sender], "remove");
      await DimzBot.sendMessage(
        from,
        {
          text: `\`\`\`「 Instagram Link Detected 」\`\`\`\n\n@${
            kice.split("@")[0]
          } telah dikick karena mengirim link Instagram.`,
          contextInfo: {
            mentionedJid: [kice],
          },
        },
        {
          quoted: fanti,
        }
      );
    }
  }

  if (botData.antilinkig2 && m.isGroup) {
    if (budy.includes("https://www.instagram.com/")) {
      if (!isBotAdmins) return;
      const msg = `\`\`\`「 Instagram Link Detected 」\`\`\`\n\n*Admin mah bebas ygy 🗿*`;
      if (isAdmins || m.key.fromMe || OwnerDimz) return reply(msg);

      const kice = m.sender;
      await DimzBot.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          fromMe: false,
          id: m.key.id,
          participant: m.key.participant,
        },
      });

      await DimzBot.sendMessage(
        from,
        {
          text: `\`\`\`「 Instagram Link Detected 」\`\`\`\n\nMode 2 aktif — @${
            kice.split("@")[0]
          } jangan diulang lagi.`,
          contextInfo: {
            mentionedJid: [kice],
          },
        },
        {
          quoted: fanti,
        }
      );
    }
  }

  // ===== Facebook =====
  if (botData.antilinkfb && m.isGroup) {
    if (budy.includes("https://facebook.com/")) {
      if (!isBotAdmins) return;
      const msg = `\`\`\`「 Facebook Link Detected 」\`\`\`\n\n*Admin mah bebas ygy 🗿*`;
      if (isAdmins || m.key.fromMe || OwnerDimz) return reply(msg);

      const kice = m.sender;
      await DimzBot.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          fromMe: false,
          id: m.key.id,
          participant: m.key.participant,
        },
      });

      await DimzBot.groupParticipantsUpdate(m.chat, [m.sender], "remove");
      await DimzBot.sendMessage(
        from,
        {
          text: `\`\`\`「 Facebook Link Detected 」\`\`\`\n\n@${
            kice.split("@")[0]
          } telah dikick karena mengirim link Facebook.`,
          contextInfo: {
            mentionedJid: [kice],
          },
        },
        {
          quoted: fanti,
        }
      );
    }
  }

  if (botData.antilinkfb2 && m.isGroup) {
    if (budy.includes("https://facebook.com/")) {
      if (!isBotAdmins) return;
      const msg = `\`\`\`「 Facebook Link Detected 」\`\`\`\n\n*Admin mah bebas ygy 🗿*`;
      if (isAdmins || m.key.fromMe || OwnerDimz) return reply(msg);

      const kice = m.sender;
      await DimzBot.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          fromMe: false,
          id: m.key.id,
          participant: m.key.participant,
        },
      });

      await DimzBot.sendMessage(
        from,
        {
          text: `\`\`\`「 Facebook Link Detected 」\`\`\`\n\nMode 2 aktif — @${
            kice.split("@")[0]
          } jangan diulang lagi.`,
          contextInfo: {
            mentionedJid: [kice],
          },
        },
        {
          quoted: fanti,
        }
      );
    }
  }

  // ===== Telegram =====
  if (botData.antilinktg && m.isGroup) {
    if (budy.includes("https://t.me/")) {
      if (!isBotAdmins) return;
      const msg = `\`\`\`「 Telegram Link Detected 」\`\`\`\n\n*Admin mah bebas ygy 🗿*`;
      if (isAdmins || m.key.fromMe || OwnerDimz) return reply(msg);

      const kice = m.sender;
      await DimzBot.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          fromMe: false,
          id: m.key.id,
          participant: m.key.participant,
        },
      });

      await DimzBot.groupParticipantsUpdate(m.chat, [m.sender], "remove");
      await DimzBot.sendMessage(
        from,
        {
          text: `\`\`\`「 Telegram Link Detected 」\`\`\`\n\n@${
            kice.split("@")[0]
          } telah dikick karena mengirim link Telegram.`,
          contextInfo: {
            mentionedJid: [kice],
          },
        },
        {
          quoted: fanti,
        }
      );
    }
  }

  if (botData.antilinktg2 && m.isGroup) {
    if (budy.includes("https://t.me/")) {
      if (!isBotAdmins) return;
      const msg = `\`\`\`「 Telegram Link Detected 」\`\`\`\n\n*Admin mah bebas ygy 🗿*`;
      if (isAdmins || m.key.fromMe || OwnerDimz) return reply(msg);

      const kice = m.sender;
      await DimzBot.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          fromMe: false,
          id: m.key.id,
          participant: m.key.participant,
        },
      });

      await DimzBot.sendMessage(
        from,
        {
          text: `\`\`\`「 Telegram Link Detected 」\`\`\`\n\nMode 2 aktif — @${
            kice.split("@")[0]
          } jangan diulang lagi.`,
          contextInfo: {
            mentionedJid: [kice],
          },
        },
        {
          quoted: fanti,
        }
      );
    }
  }

  // ===== TikTok =====
  if (botData.antilinktt && m.isGroup) {
    if (budy.includes("https://www.tiktok.com/")) {
      if (!isBotAdmins) return;
      const msg = `\`\`\`「 TikTok Link Detected 」\`\`\`\n\n*Admin mah bebas ygy 🗿*`;
      if (isAdmins || m.key.fromMe || OwnerDimz) return reply(msg);

      const kice = m.sender;
      await DimzBot.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          fromMe: false,
          id: m.key.id,
          participant: m.key.participant,
        },
      });

      await DimzBot.groupParticipantsUpdate(m.chat, [m.sender], "remove");
      await DimzBot.sendMessage(
        from,
        {
          text: `\`\`\`「 TikTok Link Detected 」\`\`\`\n\n@${
            kice.split("@")[0]
          } telah dikick karena mengirim link TikTok.`,
          contextInfo: {
            mentionedJid: [kice],
          },
        },
        {
          quoted: fanti,
        }
      );
    }
  }

  if (botData.antilinktt2 && m.isGroup) {
    if (budy.includes("https://www.tiktok.com/")) {
      if (!isBotAdmins) return;
      const msg = `\`\`\`「 TikTok Link Detected 」\`\`\`\n\n*Admin mah bebas ygy 🗿*`;
      if (isAdmins || m.key.fromMe || OwnerDimz) return reply(msg);

      const kice = m.sender;
      await DimzBot.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          fromMe: false,
          id: m.key.id,
          participant: m.key.participant,
        },
      });

      await DimzBot.sendMessage(
        from,
        {
          text: `\`\`\`「 TikTok Link Detected 」\`\`\`\n\nMode 2 aktif — @${
            kice.split("@")[0]
          } jangan diulang lagi.`,
          contextInfo: {
            mentionedJid: [kice],
          },
        },
        {
          quoted: fanti,
        }
      );
    }
  }

  // ===== Twitter / X =====
  if (botData.antilinktwt && m.isGroup) {
    if (
      budy.includes("https://twitter.com/") ||
      budy.includes("https://x.com/")
    ) {
      if (!isBotAdmins) return;
      const msg = `\`\`\`「 Twitter Link Detected 」\`\`\`\n\n*Admin mah bebas ygy 🗿*`;
      if (isAdmins || m.key.fromMe || OwnerDimz) return reply(msg);

      const kice = m.sender;
      await DimzBot.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          fromMe: false,
          id: m.key.id,
          participant: m.key.participant,
        },
      });

      await DimzBot.groupParticipantsUpdate(m.chat, [m.sender], "remove");
      await DimzBot.sendMessage(
        from,
        {
          text: `\`\`\`「 Twitter Link Detected 」\`\`\`\n\n@${
            kice.split("@")[0]
          } telah dikick karena mengirim link Twitter/X.`,
          contextInfo: {
            mentionedJid: [kice],
          },
        },
        {
          quoted: fanti,
        }
      );
    }
  }

  if (botData.antilinktwt2 && m.isGroup) {
    if (
      budy.includes("https://twitter.com/") ||
      budy.includes("https://x.com/")
    ) {
      if (!isBotAdmins) return;
      const msg = `\`\`\`「 Twitter Link Detected 」\`\`\`\n\n*Admin mah bebas ygy 🗿*`;
      if (isAdmins || m.key.fromMe || OwnerDimz) return reply(msg);

      const kice = m.sender;
      await DimzBot.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          fromMe: false,
          id: m.key.id,
          participant: m.key.participant,
        },
      });

      await DimzBot.sendMessage(
        from,
        {
          text: `\`\`\`「 Twitter Link Detected 」\`\`\`\n\nMode 2 aktif — @${
            kice.split("@")[0]
          } jangan diulang lagi.`,
          contextInfo: {
            mentionedJid: [kice],
          },
        },
        {
          quoted: fanti,
        }
      );
    }
  }

  // ===== Semua Link (Universal) =====
  if (botData.antilinkall && m.isGroup) {
    if (budy.includes("https://")) {
      if (!isBotAdmins) return;
      if (isAdmins || m.key.fromMe || OwnerDimz) return;

      const kice = m.sender;
      await DimzBot.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          fromMe: false,
          id: m.key.id,
          participant: m.key.participant,
        },
      });

      await DimzBot.groupParticipantsUpdate(m.chat, [m.sender], "remove");
      await DimzBot.sendMessage(
        from,
        {
          text: `\`\`\`「 Link Detected 」\`\`\`\n\n@${
            kice.split("@")[0]
          } telah dikick karena mengirim tautan.`,
          contextInfo: {
            mentionedJid: [kice],
          },
        },
        {
          quoted: fanti,
        }
      );
    }
  }

  if (botData.antilinkall2 && m.isGroup) {
    if (budy.includes("https://")) {
      if (!isBotAdmins) return;
      if (isAdmins || m.key.fromMe || OwnerDimz) return;

      const kice = m.sender;
      await DimzBot.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          fromMe: false,
          id: m.key.id,
          participant: m.key.participant,
        },
      });

      await DimzBot.sendMessage(
        from,
        {
          text: `\`\`\`「 Link Detected 」\`\`\`\n\nMode 2 aktif — @${
            kice.split("@")[0]
          } jangan diulang lagi.`,
          contextInfo: {
            mentionedJid: [kice],
          },
        },
        {
          quoted: fanti,
        }
      );
    }
  }

  if (
    botGlobal2.autoreadsw &&
    m.chat === "status@broadcast" &&
    !m.message.protocolMessage
  ) {
    await DimzBot.readMessages([m.key]);
  }
  if (
    botGlobal2.autoreactsw &&
    m.chat === "status@broadcast" &&
    !m.message.protocolMessage
  ) {
    const text =
      typeof botGlobal2.autoreactsw === "string"
        ? botGlobal2.autoreactsw
        : "👍";
    await DimzBot.sendMessage(
      m.chat,
      {
        react: {
          key: m.key,
          text,
        },
      },
      {
        statusJidList: [DimzBot.user.id, m.sender],
      }
    );
  }

  if (db.data.users[m.sender]?.afkTime > -1 && (budy || m.message)) {
    const user = db.data.users[m.sender];
    const afkMessage =
      `⛔ @${m.sender.split("@")[0]} berhenti dari AFK\n\n` +
      `💠 Alasan: ${user.afkReason || "Tidak ada alasan"}\n` +
      `💠 Durasi: ${clockString(Date.now() - user.afkTime)}`;

    await DimzBot.sendMessage(
      m.chat,
      {
        text: afkMessage,
        mentions: [m.sender],
        contextInfo: {
          forwardingScore: 9999,
          isForwarded: true,
          businessMessageForwardInfo: {
            businessOwnerJid: nobisnis,
          },
          mentionedJid: [m.sender],
          externalAdReply: {
            title: "AFK [ Away From Keyboard ]",
            thumbnailUrl:
              "https://www.shutterstock.com/image-illustration/afk-awat-keyboard-internet-acronym-600nw-1867588081.jpg",
            sourceUrl: wagc,
            mediaType: 1,
            renderLargerThumbnail: true,
            containsAutoReply: true,
          },
        },
      },
      {
        quoted: m,
      }
    );

    user.afkTime = -1;
    user.afkReason = "";
  }

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const pickRandom = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)];
  };

  // FITUR GAME
  const usergamebot = m.sender;

  const JwbTrue = (tebak, exp, coin) => {
    return DimzBot.sendMessage(
      m.chat,
      {
        text: `*🎮 ${tebak} 🎮*\n\nKiw Kiww Bener 🎉\n💫 +${exp} EXP!`,
        contextInfo: {
          mentionedJid: [m.sender],
          externalAdReply: {
            title: "Jawaban Benar 🥳",
            body: tebak,
            previewType: "PHOTO",
            thumbnailUrl: "https://telegra.ph/file/f8749fccf9b3320cd6307.png",
            sourceUrl: wagc,
          },
        },
      },
      {
        quoted: m,
      }
    );
  };

  const waktuHabis = (jawaban) => {
    return DimzBot.sendMessage(
      m.chat,
      {
        text: `Kroco, Waktu Abis🥳\n\n*Jawaban:*\n${jawaban}`,
        contextInfo: {
          mentionedJid: [m.sender],
          externalAdReply: {
            title: "Waktu Habis ⏰",
            body: "Dasar Kroco Antum 🤓",
            previewType: "PHOTO",
            thumbnailUrl: "https://telegra.ph/file/030ebfc99f9cb5be7e8cb.png",
            sourceUrl: wagc,
          },
        },
      },
      {
        quoted: m,
      }
    );
  };

  const wktuhbisfamily = () => {
    let jawabanList = family100[m.chat][1];
    let jawabanUser = family100[m.chat].jawabanUser || [];
    let jawabanBelum = jawabanList.filter(
      (jawaban) => !jawabanUser.includes(jawaban.toLowerCase().trim())
    );

    if (jawabanBelum.length === 0) {
      return DimzBot.sendMessage(
        m.chat,
        {
          text: `Waktu Abis! ⏰\n\nSemua jawaban sudah kamu jawab dengan benar! 🎉`,
          contextInfo: {
            mentionedJid: [m.sender],
            externalAdReply: {
              title: "Game Family100 Berakhir!",
              body: "Semua jawaban sudah dijawab dengan benar! 🎉",
              previewType: "PHOTO",
              thumbnailUrl: "https://telegra.ph/file/030ebfc99f9cb5be7e8cb.png",
              sourceUrl: wagc,
            },
          },
        },
        {
          quoted: m,
        }
      );
    }

    return DimzBot.sendMessage(
      m.chat,
      {
        text: `Waktu Abis! ⏰\n\n*Jawaban yang belum dijawab:*\n${jawabanBelum.join(", ")}`,
        contextInfo: {
          mentionedJid: [m.sender],
          externalAdReply: {
            title: "Game Family100 Berakhir!",
            body: `Jawaban yang belum kamu jawab: ${jawabanBelum.join(", ")}`,
            previewType: "PHOTO",
            thumbnailUrl: "https://telegra.ph/file/030ebfc99f9cb5be7e8cb.png",
            sourceUrl: wagc,
          },
        },
      },
      {
        quoted: m,
      }
    );
  };

  // FITUR GAME
  // ================== TEBAK GAME ==================
  if (tebakgame[m.chat] && !isCmd && m.quoted) {
    if (m.quoted.id == tebakgame[m.chat][0].key.id) {
      let json = JSON.parse(JSON.stringify(tebakgame[m.chat][1]));
      let jawaban = json.jawaban.toLowerCase().trim();
      let jawabanUser = budy.toLowerCase().trim();

      if (jawabanUser === jawaban) {
        let exp = getRandomInt(1, 10);
        let coin = getRandomInt(500, 2000);

        addExp(botId, m.sender, exp, true);
        addCoins(botId, m.sender, coin);

        JwbTrue(
          "Tebak Game",
          exp,
          `\n\nKamu mendapatkan *${exp} EXP* dan *${coin} Coin!* 💰\nKetik *.tebakgame* untuk bermain lagi 🎮`
        );

        clearTimeout(tebakgame[m.chat][3]);
        delete tebakgame[m.chat];
      } else if (similarity(jawabanUser, jawaban) >= threshold) {
        reply("_Ya, Dikit Lagi!_");
      } else {
        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "❌",
            key: m.key,
          },
        });
      }
    }
  }

  // ================== TEBAK HERO ==================
  if (tebakhero[m.chat] && !isCmd && m.quoted) {
    if (m.quoted.id == tebakhero[m.chat][0].key.id) {
      let json = tebakhero[m.chat][1];
      let jawaban = json.name.toLowerCase().trim();
      let jawabanUser = budy.toLowerCase().trim();

      if (jawabanUser === jawaban) {
        let exp = getRandomInt(1, 10);
        let coin = getRandomInt(500, 2000);

        addExp(botId, m.sender, exp, true);
        addCoins(botId, m.sender, coin);

        JwbTrue(
          "Tebak Hero",
          exp,
          `\n\nKamu mendapatkan *${exp} EXP* dan *${coin} Coin!* 💰\nKetik *.tebakhero* untuk bermain lagi 🎮`
        );

        clearTimeout(tebakhero[m.chat][3]);
        delete tebakhero[m.chat];

        DimzBot.sendMessage(
          m.chat,
          {
            text: `Benar! Itu adalah *${json.name}* 🎯`,
          },
          {
            quoted: m,
          }
        );
      } else if (similarity(jawabanUser, jawaban) >= threshold) {
        reply("_Ya, Dikit Lagi!_");
      } else {
        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "❌",
            key: m.key,
          },
        });
      }
    }
  }

  // ================== TEBAK FREE FIRE ==================
  if (tebakff[m.chat] && !isCmd && m.quoted) {
    if (m.quoted.id == tebakff[m.chat][0].key.id) {
      let json = tebakff[m.chat][1];
      let jawaban = json.name.toLowerCase().trim();
      let jawabanUser = budy.toLowerCase().trim();

      if (jawabanUser === jawaban) {
        let exp = getRandomInt(1, 10);
        let coin = getRandomInt(500, 2000);

        addExp(botId, m.sender, exp, true);
        addCoins(botId, m.sender, coin);

        JwbTrue(
          "Tebak Free Fire",
          exp,
          `\n\nKamu mendapatkan *${exp} EXP* dan *${coin} Coin!* 💰\nKetik *.tebakff* untuk bermain lagi 🎮`
        );

        clearTimeout(tebakff[m.chat][3]);
        delete tebakff[m.chat];

        DimzBot.sendMessage(
          m.chat,
          {
            image: {
              url: json.gambar,
            },
            caption: `Benar! Itu adalah *${json.name}* 🎯`,
          },
          {
            quoted: m,
          }
        );
      } else if (similarity(jawabanUser, jawaban) >= threshold) {
        reply("_Ya, Dikit Lagi!_");
      } else {
        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "❌",
            key: m.key,
          },
        });
      }
    }
  }

  // ================== TEBAK KABUPATEN ==================
  if (tebakkabupaten[m.chat] && !isCmd && m.quoted) {
    if (m.quoted.id == tebakkabupaten[m.chat][0].key.id) {
      let json = tebakkabupaten[m.chat][1];
      let jawaban = json.title.toLowerCase().trim();
      let userAnswer = budy.toLowerCase().trim();

      if (userAnswer === jawaban) {
        let exp = getRandomInt(1, 10);
        let coin = getRandomInt(500, 2000);

        addExp(botId, m.sender, exp, true);
        addCoins(botId, m.sender, coin);

        JwbTrue(
          "Tebak Kabupaten",
          exp,
          `\n\nKamu mendapatkan *${exp} EXP* dan *${coin} Coin!* 💰\nKetik *.tebakkabupaten* untuk bermain lagi 🎮`
        );

        clearTimeout(tebakkabupaten[m.chat][3]);
        delete tebakkabupaten[m.chat];
      } else if (similarity(userAnswer, jawaban) >= threshold) {
        reply("_Ya, Dikit Lagi!_");
      } else {
        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "❌",
            key: m.key,
          },
        });
      }
    }
  }

  // ================== TEBAK JKT48 ==================
  if (tebakjkt48[m.chat] && !isCmd && m.quoted) {
    if (m.quoted.id == tebakjkt48[m.chat][0].key.id) {
      let json = tebakjkt48[m.chat][1];
      let jawaban = json.jawaban.toLowerCase().trim();
      let userAnswer = budy.toLowerCase().trim();

      if (userAnswer === jawaban) {
        let exp = getRandomInt(1, 10);
        let coin = getRandomInt(500, 2000);

        addExp(botId, m.sender, exp, true);
        addCoins(botId, m.sender, coin);

        JwbTrue(
          "Tebak JKT48",
          exp,
          `\n\nKamu mendapatkan *${exp} EXP* dan *${coin} Coin!* 💰\nKetik *.tebakjkt48* untuk bermain lagi 🎮`
        );

        clearTimeout(tebakjkt48[m.chat][3]);
        delete tebakjkt48[m.chat];
      } else if (similarity(userAnswer, jawaban) >= threshold) {
        reply("_Ya, Dikit Lagi!_");
      } else {
        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "❌",
            key: m.key,
          },
        });
      }
    }
  }

  // ================== TEBAK SOUND ML ==================
  if (tebakml[m.chat] && !isCmd && m.quoted) {
    if (m.quoted.id == tebakml[m.chat][0].key.id) {
      let json = tebakml[m.chat][1];
      let jawaban = json.title.toLowerCase().trim();
      let userAnswer = budy.toLowerCase().trim();

      if (userAnswer === jawaban) {
        let exp = getRandomInt(1, 10);
        let coin = getRandomInt(500, 2000);
        addExp(botId, m.sender, exp, true);
        addCoins(botId, m.sender, coin);

        JwbTrue(
          "Tebak Sound ML",
          exp,
          `\n\nKamu mendapatkan *${exp} EXP* dan *${coin} Coin!* 🎮\nKetik *.tebakml* untuk bermain lagi 🔊`
        );

        clearTimeout(tebakml[m.chat][3]);
        delete tebakml[m.chat];
      } else if (similarity(userAnswer, jawaban) >= threshold) {
        reply("_Ya, Dikit Lagi!_");
      } else {
        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "❌",
            key: m.key,
          },
        });
      }
    }
  }

  // ======== FITUR TEBAK-TEBAKAN + COIN RANDOM ========

  if (tebakaplikasi[m.chat] && !isCmd && m.quoted) {
    if (m.quoted.id == tebakaplikasi[m.chat][0].key.id) {
      let json = tebakaplikasi[m.chat][1];
      let jawaban = json.jawaban.toLowerCase().trim();
      if (budy.toLowerCase() == jawaban) {
        let exp = getRandomInt(1, 10);
        let coin = getRandomInt(500, 2000);
        const usergamebot = addExp(botId, m.sender, exp, true);
        addCoins(botId, m.sender, coin);
        JwbTrue(
          "Tebak Aplikasi",
          exp,
          `\n\nKamu mendapatkan *${exp} EXP* dan *${coin} Coin!* 💰\nKetik *.tebakaplikasi* untuk main lagi 🎮`
        );
        clearTimeout(tebakaplikasi[m.chat][3]);
        delete tebakaplikasi[m.chat];
      } else if (similarity(budy.toLowerCase(), jawaban) >= threshold)
        reply("_Ya, Dikit Lagi!_");
      else
        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "❌",
            key: m.key,
          },
        });
    }
  }

  if (tebakgambar[m.chat] && !isCmd && m.quoted) {
    if (m.quoted.id == tebakgambar[m.chat][0].key.id) {
      let json = tebakgambar[m.chat][1];
      let jawaban = json.jawaban.toLowerCase().trim();
      if (budy.toLowerCase() == jawaban) {
        let exp = getRandomInt(1, 10);
        let coin = getRandomInt(500, 2000);
        const usergamebot = addExp(botId, m.sender, exp, true);
        addCoins(botId, m.sender, coin);
        JwbTrue(
          "Tebak Gambar",
          exp,
          `\n\nKamu mendapatkan *${exp} EXP* dan *${coin} Coin!* 💰\nKetik *.tebakgambar* untuk main lagi 🎮`
        );
        clearTimeout(tebakgambar[m.chat][3]);
        delete tebakgambar[m.chat];
      } else if (similarity(budy.toLowerCase(), jawaban) >= threshold)
        reply("_Ya, Dikit Lagi!_");
      else
        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "❌",
            key: m.key,
          },
        });
    }
  }

  if (tebakkata[m.chat] && !isCmd && m.quoted) {
    if (m.quoted.id == tebakkata[m.chat][0].key.id) {
      let json = tebakkata[m.chat][1];
      let jawaban = json.jawaban.toLowerCase().trim();
      if (budy.toLowerCase() == jawaban) {
        let exp = getRandomInt(1, 10);
        let coin = getRandomInt(500, 2000);
        const usergamebot = addExp(botId, m.sender, exp, true);
        addCoins(botId, m.sender, coin);
        JwbTrue(
          "Tebak Kata",
          exp,
          `\n\nKamu mendapatkan *${exp} EXP* dan *${coin} Coin!* 💰\nKetik *.tebakkata* untuk main lagi 🎮`
        );
        clearTimeout(tebakkata[m.chat][3]);
        delete tebakkata[m.chat];
      } else if (similarity(budy.toLowerCase(), jawaban) >= threshold)
        reply("_Ya, Dikit Lagi!_");
      else
        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "❌",
            key: m.key,
          },
        });
    }
  }

  if (asahotak[m.chat] && !isCmd && m.quoted) {
    if (m.quoted.id == asahotak[m.chat][0].key.id) {
      let json = asahotak[m.chat][1];
      let jawaban = json.jawaban.toLowerCase().trim();
      if (budy.toLowerCase() == jawaban) {
        let exp = getRandomInt(1, 10);
        let coin = getRandomInt(500, 2000);
        const usergamebot = addExp(botId, m.sender, exp, true);
        addCoins(botId, m.sender, coin);
        JwbTrue(
          "Asah Otak",
          exp,
          `\n\nKamu mendapatkan *${exp} EXP* dan *${coin} Coin!* 💰\nKetik *.asahotak* untuk main lagi 🎮`
        );
        clearTimeout(asahotak[m.chat][3]);
        delete asahotak[m.chat];
      } else if (similarity(budy.toLowerCase(), jawaban) >= threshold)
        reply("_Ya, Dikit Lagi!_");
      else
        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "❌",
            key: m.key,
          },
        });
    }
  }

  if (lengkapikalimat[m.chat] && !isCmd && m.quoted) {
    if (m.quoted.id == lengkapikalimat[m.chat][0].key.id) {
      let json = lengkapikalimat[m.chat][1];
      let jawaban = json.jawaban.toLowerCase().trim();
      if (budy.toLowerCase() == jawaban) {
        let exp = getRandomInt(1, 10);
        let coin = getRandomInt(500, 2000);
        const usergamebot = addExp(botId, m.sender, exp, true);
        addCoins(botId, m.sender, coin);
        JwbTrue(
          "Lengkapi Kalimat",
          exp,
          `\n\nKamu mendapatkan *${exp} EXP* dan *${coin} Coin!* 💰\nKetik *.lengkapikalimat* untuk main lagi 🎮`
        );
        clearTimeout(lengkapikalimat[m.chat][3]);
        delete lengkapikalimat[m.chat];
      } else if (similarity(budy.toLowerCase(), jawaban) >= threshold)
        reply("_Ya, Dikit Lagi!_");
      else
        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "❌",
            key: m.key,
          },
        });
    }
  }

  // ======== FITUR TEBAK GAME + COIN RANDOM ========

  if (tebakbendera[m.chat] && !isCmd && m.quoted) {
    if (m.quoted.id == tebakbendera[m.chat][0].key.id) {
      let json = tebakbendera[m.chat][1];
      let jawaban = json.name.toLowerCase().trim();
      if (budy.toLowerCase() == jawaban) {
        let exp = getRandomInt(1, 10);
        let coin = getRandomInt(500, 2000);
        addExp(botId, m.sender, exp, true);
        addCoins(botId, m.sender, coin);
        JwbTrue(
          "Tebak Bendera",
          exp,
          `\n\nKamu mendapatkan *${exp} EXP* dan *${coin} Coin!* 💰\nKetik *.tebakbendera* untuk main lagi 🎮`
        );
        clearTimeout(tebakbendera[m.chat][3]);
        delete tebakbendera[m.chat];
      } else if (similarity(budy.toLowerCase(), jawaban) >= threshold)
        reply("_Ya, Dikit Lagi!_");
      else
        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "❌",
            key: m.key,
          },
        });
    }
  }

  if (caklontong[m.chat] && !isCmd && m.quoted) {
    if (m.quoted.id == caklontong[m.chat][0].key.id) {
      let json = caklontong[m.chat][1];
      let jawaban = json.jawaban.toLowerCase().trim();
      if (budy.toLowerCase() == jawaban) {
        let exp = getRandomInt(1, 10);
        let coin = getRandomInt(500, 2000);
        addExp(botId, m.sender, exp, true);
        addCoins(botId, m.sender, coin);
        JwbTrue(
          "Cak Lontong",
          exp,
          `\n\nKamu mendapatkan *${exp} EXP* dan *${coin} Coin!* 💰\nKetik *.caklontong* untuk main lagi 🎮`
        );
        clearTimeout(caklontong[m.chat][3]);
        delete caklontong[m.chat];
      } else if (similarity(budy.toLowerCase(), jawaban) >= threshold)
        reply("_Ya, Dikit Lagi!_");
      else
        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "❌",
            key: m.key,
          },
        });
    }
  }

  if (susunkata[m.chat] && !isCmd && m.quoted) {
    if (m.quoted.id == susunkata[m.chat][0].key.id) {
      let json = susunkata[m.chat][1];
      let jawaban = json.jawaban.toLowerCase().trim();
      if (budy.toLowerCase() == jawaban) {
        let exp = getRandomInt(1, 10);
        let coin = getRandomInt(500, 2000);
        addExp(botId, m.sender, exp, true);
        addCoins(botId, m.sender, coin);
        JwbTrue(
          "Susun Kata",
          exp,
          `\n\nKamu mendapatkan *${exp} EXP* dan *${coin} Coin!* 💰\nKetik *.susunkata* untuk main lagi 🎮`
        );
        clearTimeout(susunkata[m.chat][3]);
        delete susunkata[m.chat];
      } else if (similarity(budy.toLowerCase(), jawaban) >= threshold)
        reply("_Ya, Dikit Lagi!_");
      else
        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "❌",
            key: m.key,
          },
        });
    }
  }

  if (tebakkalimat[m.chat] && !isCmd && m.quoted) {
    if (m.quoted.id == tebakkalimat[m.chat][0].key.id) {
      let json = tebakkalimat[m.chat][1];
      let jawaban = json.jawaban.toLowerCase().trim();
      if (budy.toLowerCase() == jawaban) {
        let exp = getRandomInt(1, 10);
        let coin = getRandomInt(500, 2000);
        addExp(botId, m.sender, exp, true);
        addCoins(botId, m.sender, coin);
        JwbTrue(
          "Tebak Kalimat",
          exp,
          `\n\nKamu mendapatkan *${exp} EXP* dan *${coin} Coin!* 💰\nKetik *.tebakkalimat* untuk main lagi 🎮`
        );
        clearTimeout(tebakkalimat[m.chat][3]);
        delete tebakkalimat[m.chat];
      } else if (similarity(budy.toLowerCase(), jawaban) >= threshold)
        reply("_Ya, Dikit Lagi!_");
      else
        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "❌",
            key: m.key,
          },
        });
    }
  }

  // ======== GAME SIAPAAKU ========
  if (siapaaku[m.chat] && !isCmd && m.quoted) {
    if (m.quoted.id == siapaaku[m.chat][0].key.id) {
      let json = siapaaku[m.chat][1];
      let jawaban = json.jawaban.toLowerCase().trim();
      if (budy.toLowerCase() == jawaban) {
        let exp = getRandomInt(1, 10);
        let coin = getRandomInt(500, 2000);
        addExp(botId, m.sender, exp, true);
        addCoins(botId, m.sender, coin);
        JwbTrue(
          "Tebak Siapa",
          exp,
          `\n\nKamu mendapatkan *${exp} EXP* dan *${coin} Coin!* 💰\nKetik *.tebaksiapa* untuk bermain lagi 🎮`
        );
        clearTimeout(siapaaku[m.chat][3]);
        delete siapaaku[m.chat];
      } else if (similarity(budy.toLowerCase(), jawaban) >= threshold)
        reply("_Ya, Dikit Lagi!_");
      else
        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "❌",
            key: m.key,
          },
        });
    }
  }

  // ======== GAME TEKA-TEKI ========
  if (tekateki[m.chat] && !isCmd && m.quoted) {
    if (m.quoted.id == tekateki[m.chat][0].key.id) {
      let json = tekateki[m.chat][1];
      let jawaban = json.jawaban.toLowerCase().trim();
      if (budy.toLowerCase() == jawaban) {
        let exp = getRandomInt(1, 10);
        let coin = getRandomInt(500, 2000);
        addExp(botId, m.sender, exp, true);
        addCoins(botId, m.sender, coin);
        JwbTrue(
          "Teka Teki",
          exp,
          `\n\nKamu mendapatkan *${exp} EXP* dan *${coin} Coin!* 💰\nKetik *.tekateki* untuk bermain lagi 🎮`
        );
        clearTimeout(tekateki[m.chat][3]);
        delete tekateki[m.chat];
      } else if (similarity(budy.toLowerCase(), jawaban) >= threshold)
        reply("_Ya, Dikit Lagi!_");
      else
        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "❌",
            key: m.key,
          },
        });
    }
  }

  // ======== GAME TEBAK KIMIA ========
  if (tebakkimia[m.chat] && !isCmd && m.quoted) {
    if (m.quoted.id == tebakkimia[m.chat][0].key.id) {
      let json = tebakkimia[m.chat][1];
      let jawaban = json.unsur.toLowerCase().trim();
      if (budy.toLowerCase() == jawaban) {
        let exp = getRandomInt(1, 10);
        let coin = getRandomInt(500, 2000);
        addExp(botId, m.sender, exp, true);
        addCoins(botId, m.sender, coin);
        JwbTrue(
          "Tebak Kimia",
          exp,
          `\n\nKamu mendapatkan *${exp} EXP* dan *${coin} Coin!* 💰\nKetik *.tebakkimia* untuk bermain lagi 🎮`
        );
        clearTimeout(tebakkimia[m.chat][3]);
        delete tebakkimia[m.chat];
      } else if (similarity(budy.toLowerCase(), jawaban) >= threshold)
        reply("_Ya, Dikit Lagi!_");
      else
        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "❌",
            key: m.key,
          },
        });
    }
  }

  // ======== GAME TEBAK LIRIK ========
  if (tebaklirik[m.chat] && !isCmd && m.quoted) {
    if (m.quoted.id == tebaklirik[m.chat][0].key.id) {
      let json = tebaklirik[m.chat][1];
      let jawaban = json.jawaban.toLowerCase().trim();
      if (budy.toLowerCase() == jawaban) {
        let exp = getRandomInt(1, 10);
        let coin = getRandomInt(500, 2000);
        addExp(botId, m.sender, exp, true);
        addCoins(botId, m.sender, coin);
        JwbTrue(
          "Tebak Lirik",
          exp,
          `\n\nKamu mendapatkan *${exp} EXP* dan *${coin} Coin!* 💰\nKetik *.tebaklirik* untuk bermain lagi 🎮`
        );
        clearTimeout(tebaklirik[m.chat][3]);
        delete tebaklirik[m.chat];
      } else if (similarity(budy.toLowerCase(), jawaban) >= threshold)
        reply("_Ya, Dikit Lagi!_");
      else
        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "❌",
            key: m.key,
          },
        });
    }
  }

  // ================== TEBAK TEBAKAN ==================
  if (tebaktebakan[m.chat] && !isCmd && m.quoted) {
    if (m.quoted.id == tebaktebakan[m.chat][0].key.id) {
      let json = tebaktebakan[m.chat][1];
      let jawaban = json.jawaban.toLowerCase().trim();
      let jawabanUser = budy.toLowerCase().trim();

      if (jawabanUser === jawaban) {
        let exp = getRandomInt(1, 10);
        let coin = getRandomInt(500, 2000);

        addExp(botId, m.sender, exp, true);
        addCoins(botId, m.sender, coin);

        JwbTrue(
          "Tebak Tebakan",
          exp,
          `\n\nKamu mendapatkan *${exp} EXP* dan *${coin} Coin!* 💰\nKetik *.tebaktebakan* untuk main lagi 🎮`
        );

        clearTimeout(tebaktebakan[m.chat][3]);
        delete tebaktebakan[m.chat];
      } else if (similarity(jawabanUser, jawaban) >= threshold) {
        reply("_Ya, Dikit Lagi!_");
      } else {
        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "❌",
            key: m.key,
          },
        });
      }
    }
  }

  // ================== FAMILY 100 ==================
  if (family100[m.chat] && !isCmd && m.quoted) {
    let data = family100[m.chat];
    if (!Array.isArray(data[1])) return;

    let jawabanList = data[1].map((j) => j.toLowerCase().trim());
    let jawabanUser = budy.toLowerCase().trim();

    if (!data.jawabanUser) data.jawabanUser = [];
    if (!data.jawabanUserTag) data.jawabanUserTag = {};

    if (
      jawabanList.includes(jawabanUser) &&
      !data.jawabanUser.includes(jawabanUser)
    ) {
      data.jawabanUser.push(jawabanUser);
      data.jawabanUserTag[jawabanUser] = m.sender;

      let exp = getRandomInt(1, 10);
      let coin = getRandomInt(500, 2000);
      addExp(botId, m.sender, exp, true);
      addCoins(botId, m.sender, coin);

      let totalJawaban = jawabanList.length;
      let sudahDijawab = data.jawabanUser.length;
      let sisaJawaban = totalJawaban - sudahDijawab;

      let jawabanDisplay = jawabanList
        .map((j, i) => {
          if (data.jawabanUser.includes(j)) {
            let tagUser = data.jawabanUserTag[j];
            return `${i + 1}. ${j} @${tagUser.split("@")[0]} +${exp} EXP +${coin}💰`;
          } else {
            return `${i + 1}. ❓`;
          }
        })
        .join("\n");

      let selesaiSemua = sudahDijawab === totalJawaban;
      if (selesaiSemua) {
        clearTimeout(data[3]);
        delete family100[m.chat];
      }

      await DimzBot.sendMessage(
        m.chat,
        {
          text:
            `✅ *Benar!*\n` +
            `📊 Jawaban terisi: ${sudahDijawab} / ${totalJawaban}\n` +
            `🕹️ Sisa jawaban: ${sisaJawaban}` +
            (selesaiSemua ? `\n🎉 Semua jawaban sudah terjawab!` : "") +
            `\n\n${jawabanDisplay}`,
          mentions: Object.values(data.jawabanUserTag),
        },
        {
          quoted: m,
        }
      );
    } else if (similarity(jawabanUser, jawabanList.join(" ")) >= threshold) {
      reply("_Ya, Dikit Lagi!_");
    } else {
      await DimzBot.sendMessage(m.chat, {
        react: {
          text: "❌",
          key: m.key,
        },
      });
    }
  }

  async function cekgame(gamejid) {
    const gameList = [
      tekateki,
      caklontong,
      susunkata,
      mathgame,
      tebaktebakan,
      tebaklirik,
      tebakkimia,
      siapaaku,
      tebakkalimat,
      tebakbendera,
      tebakkata,
      asahotak,
      lengkapikalimat,
      tebakgame,
      tebakhero,
      tebakff,
      tebakkabupaten,
      tebakjkt48,
      tebakml,
      tebakaplikasi,
      tebakgambar,
      family100,
    ];

    for (const game of gameList) {
      if (game[gamejid]) {
        await DimzBot.sendMessage(
          gamejid,
          {
            text: "Soal ini belum selesai, selesaikan dulu sebelum lanjut lagi ya kak~",
          },
          {
            quoted: game[gamejid][0],
          }
        );
        return true;
      }
    }

    return false;
  }

  // Mute
  if (m.isGroup && isMute) {
    if (!OwnerDimz && !isAdmins) return;
  }
  // Handler eval & exec
  if (/^(=>|#>|\/>)/.test(budy)) {
    if (!GlobalOwner) return;

    const prefixEval = budy.slice(0, 2); // =>, #>, $>
    const code = budy.slice(2).trim();

    if (!code) {
      if (prefixEval === "=>")
        return reply(
          "ℹ️ Contoh:\n```=> 2+2```\n```=> await fetch('https://api.github.com').then(r=>r.json())```"
        );
      if (prefixEval === "#>")
        return reply(
          "ℹ️ Contoh:\n```#> const fs = require('fs'); fs.readdirSync('.')```"
        );
      if (prefixEval === "/>")
        return reply(
          "ℹ️ Contoh:\n```$> ls -lah```\n```$> npm install axios```"
        );
    }

    try {
      if (prefixEval === "=>") {
        // Async eval
        let evaled = await eval(`(async () => { ${code} })()`);
        if (typeof evaled !== "string")
          evaled = util.inspect(evaled, { depth: 2 });
        if (evaled.length > 4000)
          evaled = evaled.slice(0, 4000) + "\n... (output terpotong)";
        return reply(evaled);
      } else if (prefixEval === "#>") {
        // Normal eval
        let evaled = await (async () => eval(code))();
        if (typeof evaled !== "string")
          evaled = util.inspect(evaled, { depth: 2 });
        if (evaled.length > 4000)
          evaled = evaled.slice(0, 4000) + "\n... (output terpotong)";
        return reply(evaled);
      } else if (prefixEval === "/>") {
        // Exec shell
        await reply("💻 Menjalankan exec:\n```" + code + "```");

        exec(code, (err, stdout, stderr) => {
          if (err) return reply("❌ Error:\n" + err.message);
          if (stderr) console.log("stderr:", stderr);

          let out = stdout || "(no output)";
          if (out.length > 3000)
            out = out.slice(0, 3000) + "\n... (output terpotong)";
          reply("✅ Hasil:\n```" + out + "```");
        });
      }
    } catch (e) {
      reply("❌ " + String(e));
    }
  }

  const _listsPath = `./database/lists_${botId}.json`;
  function getLists(id) {
    let raw;
    try {
      raw = fs.readFileSync(_listsPath, "utf8");
    } catch (e) {
      raw = "{}";
      if (e.code === "ENOENT") {
        fs.writeFileSync(_listsPath, raw);
      } else {
        console.error("getLists()", e);
      }
    }
    const data = JSON.parse(raw);
    if (id) {
      data[id] ||= {};
      return data[id];
    } else {
      return data;
    }
  }
  function saveLists(id, data) {
    const _data = getLists();
    _data[id] = data;
    const raw = JSON.stringify(_data);
    fs.writeFileSync(_listsPath, raw);
    return true;
  }

  // ===== AUTO TRIGGER DARI LIST =====
  if (m.isGroup) {
    const lowerBudy = budy?.toLowerCase().trim();
    const msgs = getLists(m.chat);

    if (lowerBudy && msgs[lowerBudy]) {
      return DimzBot.copyNForward(m.chat, msgs[lowerBudy], true, {
        quoted: m,
      });
    }
  }

  const antiswgcPath = "./database/antiswgc.json";
  let antiswgc = fs.existsSync(antiswgcPath)
    ? JSON.parse(fs.readFileSync(antiswgcPath))
    : {};

  function saveAntiswgc() {
    fs.writeFileSync(antiswgcPath, JSON.stringify(antiswgc, null, 2));
  }

  if (m.message?.groupStatusMessageV2) {
    const mode = antiswgc[m.chat];
    if (isAdmins) return;
    if (OwnerDimz) return;
    if (mode) {
      try {
        await DimzBot.sendMessage(m.chat, {
          delete: {
            remoteJid: m.chat,
            fromMe: false,
            id: m.key.id,
            participant: m.key.participant,
          },
        });

        const waktu = moment.tz("Asia/Jakarta").format("HH:mm:ss");
        const userTag = `@${m.sender.split("@")[0]}`;
        const content = m.message.groupStatusMessageV2.message || {};
        const type = Object.keys(content)[0] || "unknown";

        const jenis =
          {
            imageMessage: "📷 Gambar",
            videoMessage: "🎥 Video",
            audioMessage: "🎵 Audio",
            extendedTextMessage: "💬 Teks",
            documentMessage: "📄 Dokumen",
            stickerMessage: "🧩 Stiker",
            contactMessage: "👤 Kontak",
            unknown: "❓ Tidak diketahui",
          }[type] || "📦 Lainnya";

        let rawCaption =
          content?.[type]?.caption ||
          content?.[type]?.text ||
          content?.[type]?.message ||
          "-";

        const urlRegex = /(https?:\/\/[^\s]+)/gi;
        const containsURL = urlRegex.test(rawCaption);
        const caption = containsURL
          ? rawCaption.replace(urlRegex, (match) => "*".repeat(match.length))
          : rawCaption;

        const captionType = containsURL ? "\n📎 Type Caption: LINK" : "";

        let notifText = "";

        if (mode === "kick") {
          notifText = `🚫 *ANTI-SWGC AKTIF* 🚫

❌ ${userTag} mencoba membuat status grup
📌 Mode: *Hapus & Kick*
📂 Type: ${jenis}${captionType}
📝 Caption: ${caption}
⏰ Waktu: ${waktu}

> User akan dikick dari grup dalam 5 detik...`;
        } else if (mode === "delete") {
          notifText = `⚠️ *ANTI-SWGC AKTIF 2* ⚠️

❌ ${userTag} mencoba membuat status grup
📌 Mode: *Hapus*
📂 Type: ${jenis}${captionType}
📝 Caption: ${caption}
⏰ Waktu: ${waktu}

> Pesan status grup telah dihapus!`;
        }

        await DimzBot.sendMessage(
          m.chat,
          {
            text: notifText,
            mentions: [m.sender],
          },
          {
            quoted: fanti,
          }
        );

        if (mode === "kick") {
          await delay(5000);
          await DimzBot.groupParticipantsUpdate(m.chat, [m.sender], "remove");
        }
      } catch (err) {}
    }
  }

  if (isCmd) {
    const user = m.sender;
    let data = getUserExp(botId, user);
    if (!data.level) data.level = 1;
    if (!data.exp) data.exp = 0;
    if (!data.coins) data.coins = 0;
    if (!data.cmdCount) data.cmdCount = 0;
    data.cmdCount++;
    if (!data.nextRewardCmd)
      data.nextRewardCmd = Math.floor(Math.random() * (400 - 100 + 1)) + 100;
    if (data.cmdCount >= data.nextRewardCmd) {
      const rewardExp = Math.floor(Math.random() * (50 - 20 + 1)) + 20;
      const rewardCoins = Math.floor(Math.random() * (7000 - 2000 + 1)) + 2000;

      const before = {
        ...data,
      };
      data.exp += rewardExp;
      data.coins += rewardCoins;
      const levelUpThreshold = data.level * 500;
      let leveledUp = false;

      if (data.exp >= levelUpThreshold) {
        data.level += 1;
        data.exp = 0;
        leveledUp = true;
      }
      data.cmdCount = 0;
      data.nextRewardCmd = Math.floor(Math.random() * (400 - 100 + 1)) + 100;
      saveExpData(botId, {
        ...loadExpData(botId),
        [user]: data,
      });
      const progress = getProgressBar(data.exp, 500, 12, data.level);
      let text = `🎁 *Kamu mendapatkan EXP & Coin!*\n`;
      text += `💠 +${rewardExp} EXP\n💰 +${rewardCoins} Coin\n⭐ Level: *${data.level}*\n📊 Progress: ${progress}\n\n`;
      text += `⚡ Terus interaksi sama bot biar dapet *reward misterius* berikutnya! 🔥`;

      if (leveledUp) {
        text = `🎉 *LEVEL UP!*\n⭐ Dari Level *${before.level}* → *${data.level}*\n🏅 Rank Sekarang: ${getRank(data.level)}\n\n${text}`;
      }

      await DimzBot.sendMessage(
        m.chat,
        {
          text,
        },
        {
          quoted: m,
        }
      );
    } else {
      saveExpData(botId, {
        ...loadExpData(botId),
        [user]: data,
      });
    }
  }

  const datapub = getData(botId, "global");
  const isGconly = datapub.gconly ?? true;
  if (isGconly && !m.isGroup && !OwnerDimz) {
    debug("Group only, not group, not owner", {
      isGconly,
      isGroup: m.isGroup,
      isOwner: OwnerDimz,
      sender: m.sender,
    });
    return;
  }

  const _totalPesanPath = `./database/totalpesan_${botId}.json`;
  function loadTotalPesan(id) {
    let raw;
    try {
      raw = fs.readFileSync(_totalPesanPath, "utf8");
    } catch (e) {
      raw = "{}";
      if (e.code === "ENOENT") {
        fs.writeFileSync(_totalPesanPath, raw);
      } else {
        console.error("loadTotalPesan()", e);
      }
    }
    const data = JSON.parse(raw);
    if (id) {
      data[id] ||= {
        antitag: true,
        data: {},
      };
      return data[id];
    } else {
      return data;
    }
  }
  function saveTotalPesan(id, data) {
    const _data = loadTotalPesan();
    _data[id] = data;
    const raw = JSON.stringify(_data);
    fs.writeFileSync(_totalPesanPath, raw);
    return true;
  }
  function resetTotalPesan(id) {
    const data = loadTotalPesan(id);
    data.data = {};
    saveTotalPesan(id, data);
    return true;
  }
  function addTotalPesan() {
    const data = loadTotalPesan(m.chat);
    data.data[m.sender] ||= 0;
    data.data[m.sender]++;
    saveTotalPesan(m.chat, data);
    return data;
  }
  if (m.isGroup && baileys.isRealMessage(m)) {
    addTotalPesan();
  }
  const isPublic = datapub.public ?? true;
  if (!isPublic && !OwnerDimz) {
    debug("Owner only, not owner", {
      isGroup: m.isGroup,
      isOwner: OwnerDimz,
      sender: m.sender,
    });
    return;
  }
  if (!isCmd) return;

  /**
   * Mendapatkan informasi tentang saluran WhatsApp
   * @param {string} key - ID atau kode undangan saluran
   * @param {number} [timeout=5000] - Batas waktu permintaan
   * @param {"invite" | "jid"} [type="invite"] - Jenis key (invite atau jid)
   * @returns {Promise<{ id: string, active: boolean, createdAt: string, description: { text: string, lastModified: string }, inviteCode: string, name: { text: string, lastModified: string }, image: string, subscribers: number, verified: boolean }>}
   */
  async function getChannelInfo(DimzBot, key, timeout = 5000, type = "invite") {
    try {
      type = type.toUpperCase();
      timeout = parseInt(timeout) || 0;

      if (type !== "INVITE" && type !== "JID") {
        throw new Error("Jenis key tidak valid! Gunakan 'invite' atau 'jid'.");
      }

      const _query = await DimzBot.query(
        {
          tag: "iq",
          attrs: {
            to: "s.whatsapp.net",
            type: "get",
            xmlns: "w:mex",
          },
          content: [
            {
              tag: "query",
              attrs: {
                query_id: "6563316087068696",
              },
              content: new TextEncoder().encode(
                JSON.stringify({
                  variables: {
                    fetch_creation_time: true,
                    fetch_full_image: true,
                    fetch_viewer_metadata: false,
                    input: {
                      key,
                      type,
                    },
                  },
                })
              ),
            },
          ],
        },
        timeout
      );

      const _res = JSON.parse(_query.content[0].content);
      if (_res.errors) throw _res.errors[0];

      const res = _res.data.xwa2_newsletter;
      const {
        id,
        state: _stat,
        thread_metadata: {
          creation_time: _time,
          description: _desc,
          invite,
          name: _name,
          preview,
          subscribers_count: _subs,
          verification,
        },
      } = res;

      return {
        id,
        active: _stat.type === "ACTIVE",
        createdAt: new Date(_time * 1000).toUTCString(),
        description: {
          text: _desc.text,
          lastModified: new Date(_desc.update_time / 1000).toUTCString(),
        },
        inviteCode: invite,
        name: {
          text: _name.text,
          lastModified: new Date(_name.update_time / 1000).toUTCString(),
        },
        image: `https://mmg.whatsapp.net${preview.direct_path}`,
        subscribers: _subs * 1,
        verified: verification === "VERIFIED",
      };
    } catch (error) {
      throw new Error(`Gagal mengambil informasi saluran: ${error.message}`);
    }
  }

  /**
 * WhatsApp Status Mention Bot (Baileys)
 * Fungsi: Mengunggah status WhatsApp dengan mention ke grup atau pengguna tertentu.
 * Kode ini dapat menangani berbagai jenis konten seperti teks, gambar, video, dan audio.
 * Dibuat menggunakan Baileys untuk bot WhatsApp.
  Mengirim status WhatsApp dengan tag user/grup dengan bot
**/

  if (!baileys.proto.Message.ProtocolMessage.Type.STATUS_MENTION_MESSAGE)
    throw new Error(
      "no STATUS_MENTION_MESSAGE found in ProtocolMessage (is your WAProto up-to-date?)"
    );

  const fetchParticipants = async (...jids) => {
    let results = [];
    for (const jid of jids) {
      let { participants } = await DimzBot.groupMetadata(jid);
      participants = participants.map(({ id }) => id);
      results = results.concat(participants);
    }
    return results;
  };

  const backgroundColors = [
    /*
  "#7ACAA7",
  "#6E257E",
  "#5796FF",
  "#7E90A4",
  "#736769",
  "#57C9FF",
  "#25C3DC",
  "#FF7B6C",
  "#55C265",
  "#FF898B",
  "#8C6991",
  "#C69FCC",
  "#B8B226",
  "#EFB32F",
  "#AD8774",
  "#792139",
  "#C1A03F",
  "#8FA842",
  "#A52C71",
  "#8394CA",
  "#243640"
  */
    "#000000",
  ];

  async function mentionStatus(jids, content) {
    const msg = await baileys.generateWAMessage(baileys.STORIES_JID, content, {
      ...(content.text
        ? {
            backgroundColor:
              backgroundColors[
                Math.floor(Math.random() * backgroundColors.length)
              ],
            fonts: 0,
          }
        : {}),
      upload: DimzBot.waUploadToServer,
    });

    let statusJidList = [];
    for (const _jid of jids) {
      if (_jid.endsWith("@g.us")) {
        for (const jid of await fetchParticipants(_jid)) {
          statusJidList.push(jid);
        }
      } else {
        statusJidList.push(_jid);
      }
    }
    statusJidList = [...new Set(statusJidList)];

    await DimzBot.relayMessage(msg.key.remoteJid, msg.message, {
      messageId: msg.key.id,
      statusJidList,
      /*
      additionalNodes: [
        {
          tag: "meta",
          attrs: {},
          content: [
            {
              tag: "mentioned_users",
              attrs: {},
              content: jids.map((jid) => ({
                tag: "to",
                attrs: {
                  jid,
                },
                content: undefined,
              })),
            },
          ],
        },
      ],
      */
    });

    for (const jid of jids) {
      let type = jid.endsWith("@g.us")
        ? "groupStatusMentionMessage"
        : "statusMentionMessage";
      await DimzBot.relayMessage(
        jid,
        {
          [type]: {
            message: {
              protocolMessage: {
                key: msg.key,
                type: 25,
              },
            },
          },
        },
        {
          additionalNodes: [
            {
              tag: "meta",
              attrs: {
                is_status_mention: "true",
              },
              content: undefined,
            },
          ],
        }
      );
    }

    return msg;
  }

  async function groupSatus(jid, content) {
    const inside = await baileys.generateWAMessageContent(content, {
      upload: DimzBot.waUploadToServer,
    });
    const messageSecret = crypto.randomBytes(32);
    const m = baileys.generateWAMessageFromContent(
      jid,
      {
        messageContextInfo: {
          messageSecret,
        },
        groupStatusMessageV2: {
          message: {
            ...inside,
            messageContextInfo: {
              messageSecret,
            },
          },
        },
      },
      {}
    );
    await DimzBot.relayMessage(jid, m.message, {
      messageId: m.key.id,
    });
    return m;
  }

  /**
   * Send images and/or videos inside albumMessage
   *
   * @param {string} jid
   * @param {Array<{ type: "image"|"video", data: Buffer|{ url: string } }>} medias
   * @param {Object<string, any>} [options]
   * @returns {Promise<import("@whiskeysockets/baileys").WAMessage>}
   */

  async function sendAlbumMessage(jid, medias, options) {
    options = {
      ...options,
    };
    if (typeof jid !== "string")
      throw new TypeError(
        `jid must be string, received: ${jid} (${jid?.constructor?.name})`
      );
    for (const media of medias) {
      if (!media.type || (media.type !== "image" && media.type !== "video"))
        throw new TypeError(
          `medias[i].type must be "image" or "video", received: ${media.type} (${media.type?.constructor?.name})`
        );
      if (!media.data || (!media.data.url && !Buffer.isBuffer(media.data)))
        throw new TypeError(
          `medias[i].data must be object with url or buffer, received: ${media.data} (${media.data?.constructor?.name})`
        );
    }
    if (medias.length < 2) throw new RangeError("Minimum 2 media");

    const caption = options.text || options.caption || "";
    const delay = !isNaN(options.delay) ? options.delay : 3000;
    delete options.text;
    delete options.caption;
    delete options.delay;

    const album = baileys.generateWAMessageFromContent(
      jid,
      {
        messageContextInfo: {
          messageSecret: new Uint8Array(crypto.randomBytes(32)),
        },
        albumMessage: {
          expectedImageCount: medias.filter((media) => media.type === "image")
            .length,
          expectedVideoCount: medias.filter((media) => media.type === "video")
            .length,
          ...(options.quoted
            ? {
                contextInfo: {
                  remoteJid: options.quoted.key.remoteJid,
                  fromMe: options.quoted.key.fromMe,
                  stanzaId: options.quoted.key.id,
                  participant:
                    options.quoted.key.participant ||
                    options.quoted.key.remoteJid,
                  quotedMessage: options.quoted.message,
                },
              }
            : {}),
        },
      },
      {}
    );
    await DimzBot.relayMessage(album.key.remoteJid, album.message, {
      messageId: album.key.id,
    });

    for (const i in medias) {
      const { type, data } = medias[i];
      const img = await baileys.generateWAMessage(
        album.key.remoteJid,
        {
          [type]: data,
          ...(i === "0"
            ? {
                caption,
              }
            : {}),
        },
        {
          upload: DimzBot.waUploadToServer,
        }
      );
      img.message.messageContextInfo = {
        messageSecret: new Uint8Array(crypto.randomBytes(32)),
        messageAssociation: {
          associationType: 1,
          parentMessageKey: album.key,
        },
      };
      await DimzBot.relayMessage(img.key.remoteJid, img.message, {
        messageId: img.key.id,
      });
      await baileys.delay(delay);
    }

    return album;
  }

  async function replyAI(jid, teks, m) {
    const { generateMessageIDV2 } = require("@whiskeysockets/baileys");
    const { randomBytes } = require("crypto");

    // Struktur stanza
    const stanza = [
      {
        attrs: {
          biz_bot: "1",
        },
        tag: "bot",
      },
      {
        attrs: {},
        tag: "biz",
      },
    ];
    const gen = {
      conversation: teks,
      messageContextInfo: {
        messageSecret: randomBytes(32),
        supportPayload: JSON.stringify({
          version: 1,
          is_ai_message: true,
          should_show_system_message: true,
          ticket_id: "1669945700536053",
        }),
      },
    };
    await DimzBot.relayMessage(jid, gen, {
      messageId: generateMessageIDV2(DimzBot.user?.id),
      additionalNodes: stanza,
      quoted: m,
    });
  }

  const formatUptime = (seconds) => {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${d} Hari, ${h} Jam, ${m} Menit, ${s} Detik`;
  };

  async function getServerLocation() {
    try {
      const response = await axios.get("http://ip-api.com/json/");
      const { country, regionName, city, isp, query, timezone } = response.data;
      return {
        ip: query,
        country,
        region: regionName,
        city,
        isp,
        timezone,
      };
    } catch (error) {
      console.error("Error mendapatkan lokasi server:", error);
      return null;
    }
  }

  setInterval(
    async () => {
      const sewaData = loadSewaData();
      const now = Date.now();

      for (const groupId of Object.keys(sewaData.sewa || {})) {
        const sewa = sewaData.sewa[groupId];
        if (!sewa || !sewa.expiry) continue;

        if (now >= sewa.expiry) {
          try {
            if (!sewa.notified) {
              try {
                const metadata = await DimzBot.groupMetadata(groupId).catch(
                  () => null
                );
                await DimzBot.sendMessage(
                  groupId,
                  {
                    text: `*🌅 Perpisahan Bukanlah Akhir*
                
_Hari ini kita ucapkan Sayonara..._
_Bukan karena benci, tapi karena waktu kita telah habis⏳💔_

_Kita pernah tertawa bersama, bercanda tanpa henti, bahkan saling menghibur di kala sepi…_
_Namun seperti matahari yang terbenam, pertemuan indah pun harus berganti menjadi perpisahan. 🌇_

_Ingatlah, setiap akhir hanyalah awal dari kisah baru_
_Jika takdir mengizinkan, kita akan bertemu lagi di sini, di ruang yang sama, dengan cerita yang lebih indah.... ✨_

*📌 Rindu dan Ingin sewa Kembali?*
*Hubungi Owner 👉* @${creator.split("@")[0]}

*📩 Atau DM Instagram Owner:*
https://www.instagram.com/banh_dims0`,
                    contextInfo: {
                      mentionedJid: [creator],
                      externalAdReply: {
                        title: "🔔 Waktu Sewa Telah Habis!",
                        body: "Klik untuk menghubungi owner",
                        thumbnailUrl: global.imgurl,
                        mediaType: 1,
                        renderLargerThumbnail: true,
                        sourceUrl: wagc,
                      },
                    },
                  },
                  {
                    quoted: fverif,
                  }
                );
              } catch (e) {
                // kirim ke owner kalau notif gagal
                await DimzBot.sendMessage(
                  global.ownernomer + "@s.whatsapp.net",
                  {
                    text: `⚠️ *ERROR SEWA (notif)*\n[${new Date().toISOString()}] ${groupId}\n${e?.message || e}`,
                  }
                );
              }

              sewa.notified = true;
              saveSewaData(sewaData);
              await new Promise((r) => setTimeout(r, 3000));
            }

            try {
              await DimzBot.groupLeave(groupId);
              delete sewaData.sewa[groupId];
              saveSewaData(sewaData);
            } catch (e) {
              await DimzBot.sendMessage(global.ownernomer + "@s.whatsapp.net", {
                text: `⚠️ *ERROR SEWA (leave)*\n[${new Date().toISOString()}] ${groupId}\n${e?.message || e}`,
              });
            }
          } catch (err) {
            await DimzBot.sendMessage(global.ownernomer + "@s.whatsapp.net", {
              text: `⚠️ *ERROR SEWA (umum)*\n[${new Date().toISOString()}] ${groupId}\n${err?.message || err}`,
            });
          }

          await new Promise((r) => setTimeout(r, 3000));
        }
      }
    },
    10 * 60 * 1000
  );

  try {
    const isNumber = (x) => typeof x === "number" && !isNaN(x);

    // pastikan objek utama ada
    if (!db.data.users) db.data.users = {};
    if (!db.data.chats) db.data.chats = {};

    // cek user
    let user = db.data.users[m.sender];
    if (typeof user !== "object") {
      db.data.users[m.sender] = {
        afkTime: -1,
        afkReason: "",
        premium: false,
      };
    } else {
      if (!isNumber(user.afkTime)) user.afkTime = -1;
      if (!("afkReason" in user)) user.afkReason = "";
      if (!("premium" in user)) user.premium = false;
    }

    // cek chat
    let chat = db.data.chats[m.chat];
    if (typeof chat !== "object") {
      db.data.chats[m.chat] = {};
    }

    try {
      let isNumber = (x) => typeof x === "number" && !isNaN(x);
      let limitUser = global.limitawal.free;
      let user = global.db.data.users[m.sender];
      if (typeof user !== "object") global.db.data.users[m.sender] = {};
      if (user) {
        if (!isNumber(user.limit)) user.limit = limitUser;
      } else
        global.db.data.users[m.sender] = {
          limit: limitUser,
        };
      let chats = global.db.data.chats[m.chat];
      if (typeof chats !== "object") global.db.data.chats[m.chat] = {};
      if (chats) {
      }
    } catch (err) {
      console.error(err);
    }

    const setting = db.data.settings[botNumber];
    if (typeof setting !== "object") db.data.settings[botNumber] = {};
    if (setting) {
      if (!("anticall" in setting)) setting.anticall = false;
      if (!isNumber(setting.status)) setting.status = 0;
      if (!("autobio" in setting)) setting.autobio = false;
    } else
      db.data.settings[botNumber] = {
        anticall: true,
        status: 0,
        autobio: false,
      };
  } catch (err) {
    console.error(err);
  }

  if (m.key.fromMe) {
    return;
  }
  await DimzBot.readMessages([m.key]);

  let isiPesan = "Pesan Tidak Terdefinisi"; // 🟢 PERBAIKAN: Deklarasi di scope atas

  const currentTimestamp = moment()
    .tz("Asia/Jakarta")
    .format("DD/MM/YYYY HH:mm:ss");
  const padLabel = (label, length) => label.padEnd(length);
  const labelLength = 13;

  if (m.message) {
    if (m.message.protocolMessage && m.message.protocolMessage.type === 0) {
      isiPesan = "Delete Message";
    } else if (command) {
      isiPesan = prefix + command;
    } else {
      const msgType = Object.keys(m.message)[0];
      const msgContent = m.message[msgType];

      switch (msgType) {
        case "conversation":
          isiPesan = body;
          break;
        case "imageMessage":
          isiPesan = `📷 ${msgContent.caption ? ` (${msgContent.caption})` : ""}`;
          break;
        case "videoMessage":
          isiPesan = `🎥 ${msgContent.caption ? ` (${msgContent.caption})` : ""}`;
          break;
        case "stickerMessage":
          isiPesan = "🧩 Sticker Message";
          break;
        case "audioMessage":
          isiPesan = "🎵 Audio Message";
          break;
        case "documentMessage":
          isiPesan = `📄 ${msgContent.caption ? ` (${msgContent.caption})` : ""}`;
          break;
        case "locationMessage":
          isiPesan = "📍 Location Message";
          break;
        case "liveLocationMessage":
          isiPesan = "📡 Live Location Message";
          break;
        case "contactMessage":
          isiPesan = "👤 Contact Message";
          break;
        case "contactsArrayMessage":
          isiPesan = "👥 Contacts Group Message";
          break;
        case "extendedTextMessage":
          isiPesan = msgContent.text || "💬 Extended Text";
          break;
        default:
          isiPesan = "🔎 Unknown Message Type";
          break;
      }
    }
  }

  // 🟢 Perbaikan Logik: Menggunakan string yang sudah rapi sebelum pewarnaan
  const statusPesan =
    isiPesan === "Delete Message"
      ? chalk.bgRed.bold.hex("#FFA500")(isiPesan)
      : chalk.bgBlack.bold.cyan(isiPesan);

  const logHeader = chalk.bgCyan.bold("[ SOFT BOTZ 2026 ]");

  const logDateStr = `${padLabel("Tanggal", labelLength)}: ${currentTimestamp}`;
  const logPesanStr = `${padLabel("Pesan", labelLength)}: ${isiPesan}`;
  const logNomorStr = `${padLabel("Nomor", labelLength)}: ${m.sender.split("@")[0]}`;

  let logDetailStr;
  if (m.isGroup) {
    const logNamaStr = `${padLabel("Nama", labelLength)}: ${pushname}`;
    const logGroupStr = `${padLabel("Group", labelLength)}: ${groupName}`;
    const logIdStr = `${padLabel("ID Group", labelLength)}: ${m.chat}`;
    logDetailStr = `${logNamaStr}\n${logGroupStr}\n${logIdStr}`;
  } else {
    const logPrivateStr = `${padLabel("Private Chat", labelLength)}: ${pushname}`;
    logDetailStr = logPrivateStr;
  }

  // Fungsi helper untuk mewarnai bagian value dari string log yang sudah dipad
  function applyColors(logString, isGroup) {
    const lines = logString.split("\n");
    const coloredLines = lines.map((line) => {
      if (line.startsWith("Tanggal"))
        return line.replace(currentTimestamp, chalk.bgGrey(currentTimestamp));
      if (line.startsWith("Pesan")) return line.replace(isiPesan, statusPesan);
      if (line.startsWith("Nomor"))
        return line.replace(
          m.sender.split("@")[0],
          chalk.yellow.underline(m.sender.split("@")[0])
        );

      if (isGroup) {
        if (line.startsWith("Nama"))
          return line.replace(pushname, chalk.bgMagenta.bold(pushname));
        if (line.startsWith("Group"))
          return line.replace(groupName, chalk.red.bgWhite.bold(groupName));
        if (line.startsWith("ID Group"))
          return line.replace(m.chat, chalk.bgMagenta.bold(m.chat));
      } else {
        if (line.startsWith("Private Chat"))
          return line.replace(pushname, chalk.bgMagenta.bold(pushname));
      }
      return line;
    });
    return coloredLines.join("\n");
  }

  console.log(`
${logHeader}
${applyColors(`${logDateStr}\n${logPesanStr}\n${logNomorStr}`, m.isGroup)}
${applyColors(logDetailStr, m.isGroup)}
`);

  for (let jid of mentionUser) {
    let user = db.data.users[jid];
    if (m.key.fromMe) return;

    if (!user || typeof user !== "object") continue;
    let afkTime = user.afkTime || 0;
    if (afkTime <= 0) continue;

    let reason = user.afkReason || "Tidak Ada Alasan";
    fromMe: (false,
      reply(
        `⛔ JANGAN TAG DIA!\n\n💠 Dia AFK ${reason ? "Dengan Alasan: " + reason : "Tanpa Alasan"}\n💠 Selama: ${clockString(new Date() - afkTime)}`
      ));
  }

  if (global.autobio) {
    if (!db.data.settings) db.data.settings = {};
    if (!db.data.settings[botNumber]) db.data.settings[botNumber] = {};

    let setting = db.data.settings[botNumber];
    if (typeof setting.status !== "number") setting.status = 0;

    if (Date.now() - setting.status > 60000) {
      let uptime = await runtime(process.uptime());
      await DimzBot.updateProfileStatus(
        `Runtime: ${uptime} | 「💠Mode: ${DimzBot.public ? "Public" : "Self"} + Group Only ✅」 Bot Hanya Merespon Di Group Saja, Link Grup Bot Dan Beberapa Informasi Lainnya Ketik: #help Untuk Mendapatkan Informasi Penting! 🇮🇩, Follow Instagram Owner Yaaa: @banh_dims0`
      );
      setting.status = Date.now();
    }
  }

  if (global.autoblockmorroco) {
    if (m.sender.startsWith("212"))
      return DimzBot.updateBlockStatus(m.sender, "block");
  }

  if (global.antispam && isCmd) {
    const isExempted = isAdmins || OwnerDimz;

    if (!isExempted && m.message && msgFilter.isFiltered(m.sender)) {
      if (isBanned) return;

      const senderNumber = m.sender.split("@")[0];
      const senderName = m.pushName || m.sender;
      const chatType = m.isGroup ? "GROUP" : "PRIVATE";

      let denda = getRandomInt(5000000, 10000000);
      minSaldo(m.sender, denda, db_saldo);

      let muteDuration = getRandomInt(30, 120) * 60 * 1000;
      let muteEnd = Date.now() + muteDuration;
      let muteEndFormat = moment(muteEnd)
        .tz("Asia/Jakarta")
        .format("dddd, DD MMMM YYYY / hh:mm A");

      if (!global.muteusr) global.muteusr = [];
      if (!global.muteusr.includes(m.sender)) {
        global.muteusr.push(m.sender);
        setTimeout(() => {
          global.muteusr = global.muteusr.filter((user) => user !== m.sender);
        }, muteDuration);
      }

      console.log(
        `${global.themeemoji}[SPAM - ${chatType}]`,
        color(
          moment(m.messageTimestamp * 1000).format("DD/MM/YYYY HH:mm:ss"),
          "yellow"
        ),
        color(`${command} [${argss.length}]`),
        "from",
        color(senderName),
        chatType === "GROUP" ? `in ${m.chat}` : ""
      );

      let groupInfo = "";
      if (m.isGroup) {
        const metadata = await DimzBot.groupMetadata(m.chat);
        groupInfo = `> Dari Grup: ${metadata.subject}\n`;
      }

      const spamMessage =
        `*💠 Spam Terdeteksi & User di-Mute! 💠*\n\n` +
        `> Nama: ${senderName}\n` +
        `> Nomor: @${senderNumber}\n` +
        groupInfo +
        `> Type CMD: ${prefix + command}\n` +
        `> Mute: ⏳ ${muteDuration / 60000} menit\n` +
        `> Berakhir: 🕒 ${muteEndFormat}\n` +
        `> Denda: Rp${toRupiah(denda)}\n` +
        `> Link: wa.me/${senderNumber}`;

      DimzBot.sendMessage(`6289603732786@s.whatsapp.net`, {
        text: spamMessage,
        mentions: [m.sender],
      });

      let report = `━━━━━━ 🛰️ PUSAT INTEL ANTI-SPAM 🛰️ ━━━━━━
*👤 SUBJEK*      : @${senderNumber}
*💰 DENDA*       : Rp${toRupiah(denda)}
*⏳ STATUS*      : MUTE ${muteDuration / 60000} menit
*🕒 BERAKHIR* : ${muteEndFormat}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📡 TRANSMISI RAHASIA:
Sistem intelijen mendeteksi pelanggaran protokol
Subjek teridentifikasi sebagai ancaman tingkat rendah

🛡️ Tindakan:
- Saluran komunikasi: DI MUTE
- Durasi mute: ${muteDuration / 60000} menit
- Status pemantauan: BERJALAN

📖 Catatan Intel:
Log aktivitas telah masuk ke database pusat
Setiap percobaan komunikasi tambahan akan meningkatkan tingkat ancaman, lain kali berikan jeda 2 detik!
`;

      return DimzBot.sendMessage(
        from,
        {
          text: report,
          contextInfo: {
            forwardingScore: 9999,
            isForwarded: true,
            businessMessageForwardInfo: {
              businessOwnerJid: nobisnis,
            },
            mentionedJid: [m.sender, creator2, "0@s.whatsapp.net"],
            externalAdReply: {
              renderLargerThumbnail: false,
              title: `🗓 ${day(Date.now())} ${weton(Date.now())}, ${tanggal(Date.now())} ${bulan(Date.now())} ${tahun(Date.now())}`,
              body: `⏰ ${moment.tz("Asia/Jakarta").format("HH : mm : ss")}`,
              containsAutoReply: true,
              mediaType: 1,
              thumbnail: fs.readFileSync("./Media2/theme/thumb.jpg"),
              mediaUrl: wagc,
              sourceUrl: `${channel}?t=${Date.now()}`,
            },
          },
        },
        {
          quoted: m,
        }
      );
    }

    msgFilter.addFilter(m.sender);
  }

  if (!global.muteusr) global.muteusr = [];
  const isMuteUsr = m.isGroup ? global.muteusr.includes(m.sender) : false;

  if (isMuteUsr) {
    return;
  }

  async function sendDimzBotMessage(chatId, message, options = {}) {
    let generate = await generateWAMessage(chatId, message, options);
    let type2 = getContentType(generate.message);
    if ("contextInfo" in options)
      generate.message[type2].contextInfo = options?.contextInfo;
    if ("contextInfo" in message)
      generate.message[type2].contextInfo = message?.contextInfo;
    return await DimzBot.relayMessage(chatId, generate.message, {
      messageId: generate.key.id,
    });
  }

  const banRep = () => {};

  if (isCmd && isBanned) {
    return banRep();
  }

  if (!gd.online) {
    DimzBot.sendPresenceUpdate("available", m.chat);
  }

  if (!gd.autoTyping) {
    if (command) {
      DimzBot.sendPresenceUpdate("composing", from);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      DimzBot.sendPresenceUpdate("paused", from);
    }
  }

  if (!gd.autoRecord) {
    if (command) {
      DimzBot.sendPresenceUpdate("recording", from);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      DimzBot.sendPresenceUpdate("paused", from);
    }
  }

  function GetType(Data) {
    return new Promise((resolve, reject) => {
      let Result, Status;
      if (Buffer.isBuffer(Data)) {
        Result = new Buffer.from(Data).toString("base64");
        Status = 0;
      } else {
        Status = 1;
      }
      resolve({
        status: Status,
        result: Result,
      });
    });
  }

  async function replyprem(teks) {
    reply(mess.premmem);
  }

  const snakeGame = {
    boardSize: 10,
    snake: [
      {
        x: 5,
        y: 5,
      },
    ],
    food: {
      x: Math.floor(Math.random() * 10),
      y: Math.floor(Math.random() * 10),
    },
    obstacles: [],
    traffic: [],
    direction: {
      x: 0,
      y: 0,
    },
  };

  const timestamp = speed();
  const latensi = speed() - timestamp;
  let picaks = [flaming, fluming, flarun, flasmurf];
  let picak = picaks[Math.floor(Math.random() * picaks.length)];
  if (
    isMedia &&
    m.msg.fileSha256 &&
    m.msg.fileSha256.toString("base64") in global.db.sticker
  ) {
    let hash = global.db.sticker[m.msg.fileSha256.toString("base64")];
    let { text, mentionedJid } = hash;
    let messages = await generateWAMessage(
      m.chat,
      {
        text: text,
        mentions: mentionedJid,
      },
      {
        userJid: DimzBot.user.id,
        quoted: fverif.quoted && m.quoted.fakeObj,
      }
    );
    messages.key.fromMe = areJidsSameUser(m.sender, DimzBot.user.id);
    messages.key.id = m.key.id;
    messages.pushName = m.pushName;
    if (m.isGroup) messages.participant = m.sender;
    let msg = {
      ...chatUpdate,
      messages: [proto.WebMessageInfo.fromObject(messages)],
      type: "append",
    };
    DimzBot.ev.emit("messages.upsert", msg);
  }

  function getFolderSize(folderPath) {
    let totalSize = 0;

    function calculateSize(directory) {
      const files = fs.readdirSync(directory);
      files.forEach((file) => {
        const filePath = path.join(directory, file);
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
          calculateSize(filePath);
        } else {
          totalSize += stats.size;
        }
      });
    }
    calculateSize(folderPath);
    return totalSize;
  }

  function formatSize(size) {
    const units = ["B", "KB", "MB", "GB", "TB"];
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }

  // === Absen Helpers === //
  const ABSEN_PATH = "./database/absen.json";

  function loadAbsen() {
    try {
      if (!fs.existsSync(ABSEN_PATH)) fs.writeFileSync(ABSEN_PATH, "{}");
      const raw = fs.readFileSync(ABSEN_PATH, "utf8");
      return JSON.parse(raw || "{}");
    } catch (e) {
      return {};
    }
  }

  function saveAbsen(db) {
    fs.writeFileSync(ABSEN_PATH, JSON.stringify(db, null, 2));
  }

  function ensureGroup(db, gid) {
    if (!db[gid]) {
      db[gid] = {
        active: false,
        records: [],
        today: {},
      };
    }
    return db[gid];
  }

  function dateKey(ts = Date.now(), tz = "Asia/Jakarta") {
    return moment(ts).tz(tz).format("YYYY-MM-DD");
  }

  function formatJam(ts, tz = "Asia/Jakarta") {
    return moment(ts).tz(tz).format("HH:mm");
  }

  function formatTanggalIndo(ts, tz = "Asia/Jakarta") {
    const d = moment(ts).tz(tz);
    const bulanIndo = [
      "januari",
      "februari",
      "maret",
      "april",
      "mei",
      "juni",
      "juli",
      "agustus",
      "september",
      "oktober",
      "november",
      "desember",
    ];
    return `${d.format("DD")} - ${bulanIndo[+d.format("M") - 1]} - ${d.format("YYYY")}`;
  }

  function unique(arr) {
    return [...new Set(arr)];
  }

  async function sendChessBoard(m, player) {
    try {
      const game = games[player]?.game;
      if (!game) return reply("⚠️ Permainan tidak ditemukan!");

      // Ambil hanya posisi bidak dari FEN
      let fen = game.fen()?.split(" ")[0];
      if (!fen || fen.includes("undefined") || fen.length < 8) {
        fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
      }

      // Encode FEN hanya untuk karakter aman di URL
      const boardUrl = `https://chessboardimage.com/${fen}.png`;

      // Ambil gambar via axios
      const res = await axios.get(boardUrl, {
        responseType: "arraybuffer",
      });
      const buffer = Buffer.from(res.data);

      await DimzBot.sendMessage(
        m.chat,
        {
          image: buffer,
          caption: "♟️ *Papan Catur Saat Ini*",
          mimetype: "image/jpeg",
          contextInfo: {
            forwardingScore: 9999999,
            isForwarded: true,
          },
        },
        {
          quoted: m,
        }
      );
    } catch (err) {
      console.error("❌ ERROR BOARD:", err);
      reply("⚠️ Gagal memuat papan catur. Coba lagi!");
    }
  }

  function generateKodeTransaksi(length = 12) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let kode = "";
    for (let i = 0; i < length; i++) {
      kode += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return kode;
  }

  try {
    ppuser = await DimzBot.profilePictureUrl(m.sender, "image");
  } catch (err) {
    ppuser =
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60";
  }

  function extractMentions(text = "") {
    const matches = text.match(/@(\d{8,16})/g) || [];
    return matches.map((v) => v.replace("@", "") + "@s.whatsapp.net");
  }

  function formatTanggalID(date = new Date()) {
    const bulan = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];

    const d = date.getDate();
    const m = bulan[date.getMonth()];
    const y = date.getFullYear();
    const hh = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");

    return `${d} ${m} ${y} ${hh}:${mm}`;
  }

  switch (command) {
    case "owner":
      {
        await DimzBot.sendMessage(
          from,
          {
            contacts: {
              displayName: ownName,
              contacts: [
                {
                  displayName: ownName,
                  vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${ownName}\nTEL;type=CELL;type=VOICE;waid=${global.owner}:${global.owner}\nEND:VCARD`,
                },
              ],
            },
            mentions: [m.sender],
          },
          {
            quoted: m,
          }
        );
      }
      break;

    case "allmenu":
    case "menu":
    case "help":
      {
        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "👀",
            key: m.key,
          },
        });
        const used = process.memoryUsage();
        const cpus = os.cpus
          ? os.cpus().map((cpu) => {
              cpu.total = Object.keys(cpu.times).reduce(
                (last, type) => last + cpu.times[type],
                0
              );
              return cpu;
            })
          : null;
        const cpu = cpus.reduce(
          (last, cpu, _, { length }) => {
            last.total += cpu.total;
            last.speed += cpu.speed / length;
            last.times.user += cpu.times.user;
            last.times.nice += cpu.times.nice;
            last.times.sys += cpu.times.sys;
            last.times.idle += cpu.times.idle;
            last.times.irq += cpu.times.irq;
            return last;
          },
          {
            speed: 0,
            total: 0,
            times: {
              user: 0,
              nice: 0,
              sys: 0,
              idle: 0,
              irq: 0,
            },
          }
        );
        const modeBot = isPublic ? "Public 🔓" : "Self 🔒";
        const gconlyStatus = isGconly ? "Group Only 👥" : "All Chat 💬";
        const databaseFolder = "./database";
        const totalSizeBytes = getFolderSize(databaseFolder);
        const formattedSize = formatSize(totalSizeBytes);
        let allGroups = await DimzBot.groupFetchAllParticipating();
        let groupList = Object.values(allGroups);
        let timestamp = speed();
        let latensi = speed() - timestamp;
        neww = performance.now();
        oldd = performance.now();
        let me = m.sender;
        let timestampe = speed();
        let latensie = speed() - timestampe;
        let menulist = `
👤 User Info
• Nama : ${pushname}
• Tag : @${me.split("@")[0]}
• Limit : ${sisalimit}

🤖 ${botName} Info
• Prefix : ${prefix}
• Mode Bot : ${modeBot}
• Mode Chat : ${gconlyStatus}
• Database : ${formattedSize} / 15 GB
• Aktif : ${runtime(process.uptime())}
• Total Group : ${groupList.length}
• Free Ram : ${formatp(os.freemem())}
• Total Ram : ${formatp(os.totalmem())}
• Total Cpu : ${cpus ? cpus.length : "Undefined"} Core
• Os : ${os.platform()}
• Node.js Version : ${process.version}


──────────────✪
💠 ɪɴғᴏʀᴍᴀsɪ
──────────────✦
○ Informasi Bot
  ↳ ${prefix}jadibot
  ↳ ${prefix}gcbot  
  ↳ ${prefix}chbot
  ↳ ${prefix}ping
  ↳ ${prefix}owner
  ↳ ${prefix}limit

──────────────✦
🤖 ᴀɪ ᴍᴇɴᴜ
──────────────✦
○ ${prefix}ai
○ ${prefix}iqc
○ ${prefix}hd
○ ${prefix}hdvideo
○ ${prefix}tofigure2
○ ${prefix}tofigure3
○ ${prefix}hitamkan
○ ${prefix}unblur
○ ${prefix}toanime
○ ${prefix}tozombie
○ ${prefix}toghibli
○ ${prefix}tobotak
○ ${prefix}tochibi
○ ${prefix}tomirror
○ ${prefix}tomonyet
○ ${prefix}tojepang
○ ${prefix}toroblox
○ ${prefix}totua
○ ${prefix}toreal
○ ${prefix}blurface
○ ${prefix}text2img
○ ${prefix}nanoai
○ ${prefix}bing
○ ${prefix}animestyle
○ ${prefix}vintage
○ ${prefix}watercolor

──────────────✪
💌 ᴄᴏɴғᴇss / ᴍᴇɴғess
──────────────✦
○ ${prefix}menfess  
○ ${prefix}balasmenfess  
○ ${prefix}tolakmenfess  
○ ${prefix}stopmenfess  
○ ${prefix}confess  
○ ${prefix}leave  

──────────────✪
🎮 ɢᴀᴍᴇs ʀᴘɢ ᴍᴇɴᴜ
──────────────✦
○ ${prefix}profile
○ ${prefix}leaderboard
○ ${prefix}rankinfo
○ ${prefix}sell
○ ${prefix}catur

──────────────✪
🎯 ɢᴀᴍᴇs ᴛᴇʙᴀᴋ
──────────────✦
○ ${prefix}tebakgame  
○ ${prefix}tebakhero  
○ ${prefix}tebakff  
○ ${prefix}tebakkabupaten  
○ ${prefix}tebakjkt48  
○ ${prefix}tebakaplikasi  
○ ${prefix}tebakgambar  
○ ${prefix}tebakkata  
○ ${prefix}asahotak  
○ ${prefix}lengkapikalimat  
○ ${prefix}tebakbendera  
○ ${prefix}tebakkalimat  
○ ${prefix}tebaksiapa  
○ ${prefix}tebakkimia  
○ ${prefix}tebaklirik  
○ ${prefix}tebaktebakan  
○ ${prefix}susunkata  
○ ${prefix}caklontong  
○ ${prefix}tekateki  
○ ${prefix}family100  
○ ${prefix}nyerah  
○ ${prefix}bantuan

──────────────✦
💫 sᴛɪᴄᴋᴇʀ
──────────────✦
○ ${prefix}stiker
○ ${prefix}smeme
○ ${prefix}swm
○ ${prefix}brat
○ ${prefix}bratvid
○ ${prefix}qc
○ ${prefix}qcc
○ ${prefix}emojimix
○ ${prefix}emojimix2
○ ${prefix}tpp

──────────────✦
⬇ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ
──────────────✦
○ ${prefix}tiktok  
○ ${prefix}instagram  
○ ${prefix}facebook
○ ${prefix}ytsearch
○ ${prefix}play
○ ${prefix}ytmp3
○ ${prefix}ytmp4
○ ${prefix}douyin
○ ${prefix}sfile
○ ${prefix}mediafire
○ ${prefix}capcut

──────────────✦
🔊 ᴠᴏɪᴄᴇ ᴄʜᴀɴɢᴇʀ
──────────────✦
○ V1  
  ↳ ${prefix}kobo  
  ↳ ${prefix}zeta  
  ↳ ${prefix}gura  
  ↳ ${prefix}kaela  
  ↳ ${prefix}pekora  
  ↳ ${prefix}miko  
  ↳ ${prefix}subaru  
  ↳ ${prefix}korone  
  ↳ ${prefix}luna  
  ↳ ${prefix}anya  
  ↳ ${prefix}reine  
  ↳ ${prefix}calli  
  ↳ ${prefix}kroni  

○ V2
  ↳ ${prefix}voice-zeta  
  ↳ ${prefix}voice-moona  
  ↳ ${prefix}voice-iofi  
  ↳ ${prefix}voice-risu  
  ↳ ${prefix}voice-ollie  
  ↳ ${prefix}voice-reine  
  ↳ ${prefix}voice-anya  
  ↳ ${prefix}voice-kobo  
  ↳ ${prefix}voice-kaela  
  
──────────────✦
🛍️ sᴛᴏʀᴇ ᴍᴇɴᴜ
──────────────✦
○ ${prefix}proses  
○ ${prefix}done  
○ ${prefix}setproses  
○ ${prefix}setdone  
○ ${prefix}listproses  

○ ${prefix}list  
○ ${prefix}stock  
○ ${prefix}setstock  
○ ${prefix}addlist  
○ ${prefix}dellist  
○ ${prefix}udpatelist  
○ ${prefix}copylist  
○ ${prefix}pastelist  
○ ${prefix}dellistall  
○ ${prefix}backup list

──────────────✪
👥 ᴍᴇɴᴜ ɢʀᴜᴘ
──────────────✦
○ Pengaturan Grup 
  ↳ ${prefix}totalpesan
  ↳ ${prefix}opentime
  ↳ ${prefix}closetime
  ↳ ${prefix}getpp
  ↳ ${prefix}absen
  ↳ ${prefix}id
  ↳ ${prefix}idch
  ↳ ${prefix}afk
  ↳ ${prefix}toswgc
  ↳ ${prefix}statsgc  
  ↳ ${prefix}addlist  
  ↳ ${prefix}dellist  
  ↳ ${prefix}list  
  ↳ ${prefix}list2
  ↳ ${prefix}stock
  ↳ ${prefix}setstock
  ↳ ${prefix}updatelist  
  ↳ ${prefix}mutegc  
  ↳ ${prefix}tagmember  
  ↳ ${prefix}tag  
  ↳ ${prefix}linkgc  
  ↳ ${prefix}grup
  ↳ ${prefix}opengc
  ↳ ${prefix}closegc
  ↳ ${prefix}setppgc
  ↳ ${prefix}setppgc full  
  ↳ ${prefix}delppgc
  ↳ ${prefix}setname  
  ↳ ${prefix}setdesk
  ↳ ${prefix}kick  
  ↳ ${prefix}warn  
  ↳ ${prefix}delwarn  
  ↳ ${prefix}cekwarn  
  ↳ ${prefix}listwarn
  ↳ ${prefix}promote  
  ↳ ${prefix}demote  

○ Fitur Keamanan  
  ↳ ${prefix}totag 
  ↳ ${prefix}hidetag  
  ↳ ${prefix}welcome  
  ↳ ${prefix}left  
  ↳ ${prefix}setwelcome  
  ↳ ${prefix}delwelcome  
  ↳ ${prefix}setleft  
  ↳ ${prefix}delleft  
  ↳ ${prefix}setbutwel  
  ↳ ${prefix}intro
  ↳ ${prefix}setintro
  ↳ ${prefix}tagall  
  ↳ ${prefix}resetlinkgc

○ Anti Link (ʜᴀᴘᴜs + ᴋɪᴄᴋ)
  ↳ ${prefix}antilinkgc  
  ↳ ${prefix}antisaluran  
  ↳ ${prefix}antilinkwame  
  ↳ ${prefix}antilinkall  
  ↳ ${prefix}antilinktiktok  
  ↳ ${prefix}antilinkfb  
  ↳ ${prefix}antilinktwitter  
  ↳ ${prefix}antilinkig  
  ↳ ${prefix}antilinktg  
  ↳ ${prefix}antilinkytvid  
  ↳ ${prefix}antilinkytch  
  ↳ ${prefix}antitoxic  
  ↳ ${prefix}antilokasi  
  ↳ ${prefix}antimedia  
  ↳ ${prefix}antitagsw  
  ↳ ${prefix}antiswgc
  ↳ ${prefix}anticallgc

○ Anti Link 2 (ʜᴀɴʏᴀ ʜᴀᴘᴜs)
  ↳ ${prefix}antilinkgc2  
  ↳ ${prefix}antisaluran2  
  ↳ ${prefix}antilinkwame2  
  ↳ ${prefix}antilinkall2  
  ↳ ${prefix}antilinktiktok2  
  ↳ ${prefix}antilinkfb2  
  ↳ ${prefix}antilinktwitter2  
  ↳ ${prefix}antilinkig2  
  ↳ ${prefix}antilinktg2  
  ↳ ${prefix}antilinkytvid2  
  ↳ ${prefix}antilinkytch2  
  ↳ ${prefix}antitoxic2  
  ↳ ${prefix}antilokasi2  
  ↳ ${prefix}antimedia2  
  ↳ ${prefix}antiswgc2

──────────────✪
🧰 ᴛᴏᴏʟs ᴍᴇɴᴜ
──────────────✦
○ ${prefix}readvo
○ ${prefix}tourl
○ ${prefix}removebg
○ ${prefix}exiftool
○ ${prefix}lirik
○ ${prefix}tempmail
○ ${prefix}ssweb
○ ${prefix}pinterest
○ ${prefix}tovn
○ ${prefix}toaudio
○ ${prefix}tomp3
○ ${prefix}toimg
○ ${prefix}tovideo

──────────────✪
🖼 ᴄᴀɴᴠᴀs
──────────────✦
○ ${prefix}fake-xnxx
○ ${prefix}gay
○ ${prefix}sertifikat-tolol
○ ${prefix}ektp
○ ${prefix}ba-logo
○ ${prefix}gura-maker
○ ${prefix}fakewa
○ ${prefix}nulis

──────────────✪
📷 ʀᴀɴᴅᴏᴍ ɪᴍᴀɢᴇ
──────────────✦
○ ${prefix}bluearchive
○ ${prefix}cecan
○ ${prefix}cecan-china
○ ${prefix}cecan-japan
○ ${prefix}cecan-korea
○ ${prefix}cecan-thailand
○ ${prefix}cecan-vietnam
○ ${prefix}neko
○ ${prefix}waifu
○ ${prefix}yandere

──────────────✪
🖨 ᴇᴘʜᴏᴛᴏ ᴍᴀᴋᴇʀ
──────────────✦
○ ${prefix}glitchtext
○ ${prefix}writetext
○ ${prefix}advancedglow
○ ${prefix}typographytext
○ ${prefix}pixelglitch
○ ${prefix}neonglitch
○ ${prefix}flagtext
○ ${prefix}flag3dtext
○ ${prefix}deletingtext
○ ${prefix}blackpinkstyle
○ ${prefix}glowingtext
○ ${prefix}underwatertext
○ ${prefix}logomaker
○ ${prefix}cartoonstyle
○ ${prefix}papercutstyle
○ ${prefix}watercolortext
○ ${prefix}effectclouds
○ ${prefix}blackpinklogo
○ ${prefix}gradienttext
○ ${prefix}summerbeach
○ ${prefix}luxurygold
○ ${prefix}multicoloredneon
○ ${prefix}sandsummer
○ ${prefix}galaxywallpaper
○ ${prefix}1917style
○ ${prefix}makingneon
○ ${prefix}royaltext
○ ${prefix}freecreate
○ ${prefix}galaxystyle
○ ${prefix}lighteffects

──────────────✪
🗣️ ʀᴀɴᴅᴏᴍ ᴄᴇʀᴘᴇɴ
──────────────✦
○ ${prefix}dongeng

──────────────✪
🔊 ᴇғᴇᴋ sᴜᴀʀᴀ
──────────────✦
○ Sound Effects  
  ↳ ${prefix}bass  
  ↳ ${prefix}blown  
  ↳ ${prefix}deep  
  ↳ ${prefix}earrape  
  ↳ ${prefix}fast  
  ↳ ${prefix}fat  
  ↳ ${prefix}nightcore  
  ↳ ${prefix}reverse  
  ↳ ${prefix}slow  
  ↳ ${prefix}smooth  
  ↳ ${prefix}squirrel  

──────────────✪
🔍 sᴛᴀʟᴋ ᴍᴇɴᴜ
──────────────✦
○ ${prefix}igstalk
○ ${prefix}ttstalk

──────────────✪
⚠ ᴊᴘᴍ ᴏᴡɴᴇʀ 
──────────────✦
○ ${prefix}jpm
○ ${prefix}jpm-ht
○ ${prefix}jpm-swgc
> _ʀᴇsɪᴋᴏ ᴅɪ ᴛᴀɴɢɢᴜɴɢ ᴘᴇɴɢɢᴜɴᴀ!_
  
──────────────✪
🔑 ᴀᴅᴠᴀɴᴄᴇᴅ ғɪᴛᴜʀ ᴏᴡɴᴇʀ
──────────────✦
○ Owner
  ↳ ${prefix}setmode
  ↳ ${prefix}gconly
  ↳ ${prefix}join
  ↳ ${prefix}leavegc
  ↳ ${prefix}leavegcid
  ↳ ${prefix}toswgc id | caption
  ↳ ${prefix}resetlimit
  ↳ ${prefix}addlimit
  ↳ ${prefix}dellimit
  ↳ ${prefix}listgc
  ↳ ${prefix}creategc
  ↳ ${prefix}setppbot
  ↳ ${prefix}addowner
  ↳ ${prefix}delowner
  ↳ ${prefix}listowner
  ↳ ${prefix}autoreadsw
  ↳ ${prefix}autoreactsw

──────────────✪


╭──────────────────╮
│ ⌕ ❙❘❙❙❘❙❚❙❘❙❙❚❙❘❙❘❙❚❙❘❙❙❚❙❘❙❙❘❙❚❙❘ ⌕
│『 *© ${botName} ⚡* 』
│
│ ☍𝗣𝗼𝘄𝗲𝗿𝗲𝗱 𝗯𝘆 : ${global.wmbotzz}
│ ☍𝗦𝘂𝗽𝗽𝗼𝗿𝘁 𝗯𝘆  : @${creator2.split("@")[0]}
╰──────────────────╯
   `;
        const ments = [m.sender, creator2, "0@s.whatsapp.net"];

        await DimzBot.sendMessage(
          from,
          {
            text: menulist,
            contextInfo: {
              forwardingScore: 1,
              isForwarded: true,
              forwardedNewsletterMessageInfo: {
                newsletterJid: "120363179857645465@newsletter",
                newsletterName: "☰『✦ Powered by softbotz.my.id ✦』",
              },
              mentionedJid: [m.sender, creator2, ownNumber],
              externalAdReply: {
                renderLargerThumbnail: true,
                title: botName,
                body: `⏰ Time Now ${moment.tz("Asia/Jakarta").format("HH : mm : ss")}`,
                containsAutoReply: true,
                mediaType: 1,
                thumbnail: fs.readFileSync(global.thumbnail),
                mediaUrl: wagc,
                sourceUrl: `${channel}?t=${Date.now()}`,
              },
            },
          },
          {
            quoted: m,
          }
        );
      }
      break;

    case "gcbot":
    case "grupbot":
      {
        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "😘",
            key: m.key,
          },
        });
        let teks = `_Hay_ ${pushname}👋


Gass Cuy Join Ya😄


*_KLIK HERE👇_*
${wagc}
`;
        ppnya = await getBuffer(ppuser);
        const xeonbuffer = await getBuffer(ppuser);
        await DimzBot.sendMessage(
          m.chat,
          {
            text: teks,
            contextInfo: {
              externalAdReply: {
                containsAutoReply: true,
                title: botName,
                body: `𝐉𝐨𝐢𝐧 𝐘𝐚 𝐂𝐮𝐲`,
                previewType: "PHOTO",
                thumbnailUrl: ``,
                thumbnail: ppnya,
                sourceUrl: `${channel}?t=${Date.now()}`,
              },
            },
          },
          {
            quoted: m,
          }
        );
      }
      break;

    case "chbot":
      {
        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "😘",
            key: m.key,
          },
        });
        let teks = `_Hay_ ${pushname}👋

*KLIK HERE 👇:*
${channel}




`;
        const btn = baileys.proto.Message.ButtonsMessage;
        const buttonsMessage = btn.fromObject({
          contentText: teks,
          footerText: botName,
          headerType: btn.HeaderType.EMPTY,
          buttons: [
            btn.Button.fromObject({
              buttonId: ".allmenu",
              buttonText: btn.Button.ButtonText.fromObject({
                displayText: "LIST MENU📍",
              }),
              type: btn.Button.Type.RESPONSE,
            }),
            btn.Button.fromObject({
              buttonId: ".gcbot",
              buttonText: btn.Button.ButtonText.fromObject({
                displayText: "GRUP BOT ⚡",
              }),
              type: btn.Button.Type.RESPONSE,
            }),
          ],
        });

        const msg = baileys.generateWAMessageFromContent(
          m.chat,
          {
            viewOnceMessage: {
              message: {
                buttonsMessage,
              },
            },
          },
          {
            quoted: m,
          }
        );

        await DimzBot.relayMessage(m.chat, msg.message, {});
      }
      break;

    // fitur grup store
    case "getpp":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);
        const mentionedJid = m.mentionedJid;
        const quotedMessage = m.quoted;

        if (mentionedJid && mentionedJid.length > 0) {
          const target = mentionedJid[0];
          try {
            pporg = await DimzBot.profilePictureUrl(target, "image");
          } catch {
            pporg =
              "https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg";
          }

          await DimzBot.sendMessage(
            from,
            {
              image: {
                url: pporg,
              },
              caption: "Foto Profil @" + target.split("@")[0],
              contextInfo: {
                mentionedJid: [target],
              },
            },
            {
              quoted: m,
            }
          );
        } else if (quotedMessage) {
          try {
            pporg = await DimzBot.profilePictureUrl(m.quoted.sender, "image");
          } catch {
            pporg =
              "https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg";
          }

          await DimzBot.sendMessage(
            from,
            {
              image: {
                url: pporg,
              },
              caption: "Done",
            },
            {
              quoted: m,
            }
          );
        } else {
          try {
            pporgs = await DimzBot.profilePictureUrl(from, "image");
          } catch {
            pporgs =
              "https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg";
          }

          await DimzBot.sendMessage(
            from,
            {
              image: {
                url: pporgs,
              },
              caption: "Done",
            },
            {
              quoted: m,
            }
          );
        }
        reduceLimit(botId, m.sender);
      }
      break;

    case "absen":
      {
        if (!m.isGroup) return StickGroup();
        const sub = (argss[0] || "").toLowerCase();
        const abdb = loadAbsen();
        const g = ensureGroup(abdb, m.chat);
        const now = Date.now();
        const keyHari = dateKey(now);

        if (!g.headerText) g.headerText = "Absen ya untuk hari ini yg hadir";

        if (!g._todayKey || g._todayKey !== keyHari) {
          g._todayKey = keyHari;
          g.today = {};
        }

        const buildMentions = (jids) => ({
          mentions: unique(jids.filter(Boolean)),
        });

        if (sub === "help") {
          if (!isBotAdmins) return StickBotAdmin();
          if (!isAdmins && !OwnerDimz) return StickAdmin();
          let teks = "*📋 Menu Absen:*\n\n";

          if (isAdmins || OwnerDimz) {
            teks += `
• *${prefix}absen start* → Mulai absen di grup
• *${prefix}absen stop* → Hentikan absen
• *${prefix}absen set <teks>* → Set teks absen hari ini
• *${prefix}absen cek* → Tampilkan rekap absen hari ini
• *${prefix}absen history* → Lihat history absen grup
• *${prefix}absen delete* → Hapus semua data/history absen
• *${prefix}absen help* → Lihat daftar command absen
• *${prefix}absen* → Catat absen
      `.trim();
          } else {
            teks += `
• *${prefix}absen* → Catat kehadiran kamu (sekali sehari)
• *${prefix}absen help* → Lihat daftar command absen
      `.trim();
          }

          return reply(teks);
        }

        if (sub === "start") {
          if (!isBotAdmins) return StickBotAdmin();
          if (!isAdmins && !OwnerDimz) return StickAdmin();
          if (g.active) return reply("Absen sudah aktif di grup ini.");
          g.active = true;
          saveAbsen(abdb);
          return reply(`✅ Absen dimulai. Ketik *${prefix}absen*`);
        }

        if (sub === "stop") {
          if (!isBotAdmins) return StickBotAdmin();
          if (!isAdmins && !OwnerDimz) return StickAdmin();
          if (!g.active) return reply("Absen belum aktif.");
          g.active = false;
          saveAbsen(abdb);
          return reply("⏹️ Absen dihentikan.");
        }

        if (sub === "delete") {
          if (!isBotAdmins) return StickBotAdmin();
          if (!isAdmins && !OwnerDimz) return StickAdmin();
          abdb[m.chat] = {
            active: false,
            records: [],
            today: {},
            _todayKey: keyHari,
            headerText: g.headerText || "Absen ya untuk hari ini yg hadir",
          };
          saveAbsen(abdb);
          return reply("🗑️ Semua history & data absen grup ini sudah dihapus.");
        }

        if (sub === "history") {
          if (!isBotAdmins) return StickBotAdmin();
          if (!isAdmins && !OwnerDimz) return StickAdmin();
          if (!g.records.length)
            return reply("Belum ada history absen di grup ini.");
          const last = g.records.slice(-200);
          const byDay = {};
          for (const r of last) {
            const dk = dateKey(r.ts);
            byDay[dk] = byDay[dk] || [];
            byDay[dk].push(r);
          }

          const days = Object.keys(byDay).sort().reverse().slice(0, 7);
          let txt = `*History absen di grup ini*\n\n`;
          for (const d of days) {
            const niceDate = formatTanggalIndo(byDay[d][0].ts);
            txt += `• *${niceDate}* (${byDay[d].length} kehadiran)\n`;
          }
          return reply(txt);
        }

        if (sub === "set") {
          if (!isBotAdmins) return StickBotAdmin();
          if (!isAdmins && !OwnerDimz) return StickAdmin();

          const newText = argss.slice(1).join(" ").trim();

          if (!newText) {
            return reply(
              `Contoh: *${prefix}absen set Hay guys, absen dulu ya*`
            );
          }

          g.headerText = newText;
          saveAbsen(abdb);
          return reply(`✅ Teks absen diset:\n"${g.headerText}"`);
        }

        if (sub === "cek") {
          if (!isBotAdmins) return StickBotAdmin();
          if (!isAdmins && !OwnerDimz) return StickAdmin();

          const todays = g.records.filter((r) => dateKey(r.ts) === keyHari);
          if (!todays.length) {
            return reply("Belum ada absen hari ini.");
          }

          todays.sort((a, b) => a.ts - b.ts);

          const mentions = [];
          let idx = 1;
          let lines = [g.headerText + "\n"];
          for (const r of todays) {
            mentions.push(r.jid);
            lines.push(
              `${idx}. @${(r.jid || "").split("@")[0]}\n   Absen pada: ${formatTanggalIndo(r.ts)} / ${formatJam(r.ts)}\n`
            );
            idx++;
          }

          const textOut = lines.join("\n");

          await DimzBot.sendMessage(
            m.chat,
            {
              text: textOut,
              ...buildMentions(mentions),
              contextInfo: {
                externalAdReply: {
                  title: "📋 Rekap Absen Hari Ini",
                  body: "Cek siapa aja yang udah hadir ✅",
                  thumbnailUrl:
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVltzqLYxKpLtoC8UN-2coFJKunC1z9nV3E-BtT_Q6gSlri4-A47b8DYk&s=10",
                  sourceUrl: `${channel}?t=${Date.now()}`,
                  mediaType: 1,
                  renderLargerThumbnail: true,
                },
              },
            },
            {
              quoted: m,
            }
          );
          return;
        }
        if (!g.active) {
          return reply(
            `Absen belum aktif. Admin bisa jalankan *${prefix}absen start* atau *${prefix}absen help*`
          );
        }

        let targets =
          m.mentionedJid && m.mentionedJid.length ? m.mentionedJid : [m.sender];
        targets = unique(targets);

        const mentions = [];
        const already = [];
        const newly = [];

        for (const jid of targets) {
          if (g.today[jid]) {
            already.push(jid);
            continue;
          }
          g.today[jid] = now;
          g.records.push({
            jid,
            name:
              participants?.find((p) => p.id === jid || p.jid === jid)?.name ||
              "",
            ts: now,
          });
          newly.push(jid);
        }

        saveAbsen(abdb);

        if (!newly.length) {
          const teks = "ℹ️ Kamu udah absen";
          return reply(teks);
        } else {
          const teks =
            (newly.length
              ? `✅ Tercatat hadir: ${newly.map((j) => `@${j.split("@")[0]}`).join(", ")}\n`
              : "") +
            (already.length
              ? `ℹ️ Sudah absen: ${already.map((j) => `@${j.split("@")[0]}`).join(", ")}`
              : "");
          return DimzBot.sendMessage(
            m.chat,
            {
              text: teks,
              ...buildMentions([...newly, ...already]),
            },
            {
              quoted: m,
            }
          );
        }
      }
      break;

    case "addowner":
    case "delowner":
    case "listowner":
      {
        if (!OwnerDimz) return reply(mess.mowner);
        if (
          ((global.ownernomer || "") + "").replace(/[^0-9]/g, "") !==
          m.sender.split("@")[0]
        )
          return reply(
            "⛔ Fitur ini hanya bisa di akses oleh owner utama (bukan sub-owner)"
          );
        const owners = getData(botId, "global").owners || [];
        const currently = owners.length;
        const mentions = m.mentionedJid.map((v) => v.replace(/:[0-9]+/, ""));
        if (!mentions.length && !command.startsWith("list")) {
          return reply(
            "Kamu harus men-tag seseorang untuk menggunakan fitur ini."
          );
        }
        if (command.startsWith("add")) {
          const tba = mentions.filter((v) =>
            v.endsWith("@s.whatsapp.net")
          ).length;
          if (currently + tba > 5) {
            return reply("Maksimal 5 sub-owner!");
          }
          let failed = "";
          for (const id of mentions) {
            if (!id.endsWith("@s.whatsapp.net")) {
              failed += `* @${id.split("@")[0]} (LID, coba lagi nanti)\n`;
            } else if (owners.includes(id)) {
              failed += `* @${id.split("@")[0]} (Sudah sub-owner)\n`;
            } else {
              owners.push(id);
            }
          }
          let txt = `Berhasil menambahkan ${owners.length - currently} sub-owner baru!`;
          if (failed.length) {
            txt += `\n\nError:\n${failed}`;
          }
          await reply(txt);
        } else if (command.startsWith("del")) {
          if (!owners.length) return reply("Belum ada sub-owner nih.");
          let failed = "";
          for (const id of mentions) {
            if (!owners.includes(id)) {
              failed += `* @${id.split("@")[0]} (Bukan sub-owner)\n`;
            } else {
              const index = owners.indexOf(id);
              owners.splice(index, 1);
            }
          }
          let txt = `Berhasil menghapus ${currently - owners.length} sub-owner!`;
          if (failed.length) {
            txt += `\n\nError:\n${failed}`;
          }
          await reply(txt);
        } else if (command.startsWith("list")) {
          if (!owners.length) return reply("Belum ada sub-owner nih.");
          const lists = owners
            .map((v, i) => `${i + 1}. @${v.split("@")[0]}`)
            .join("\n");
          await reply(`Daftar sub-owner:\n${lists}`);
        }

        if (currently !== owners.length) {
          setData(botId, "global", "owners", owners);
        }
      }
      break;

    case "totalpesan":
    case "totalchat":
      {
        if (!m.isGroup) return StickGroup();
        try {
          const data = loadTotalPesan(m.chat);
          if (argss[0] === "antitag") {
            if (!isAdmins && !OwnerDimz) return StickAdmin();
            const state = argss[1].toLowerCase();
            if (state !== "on" && state !== "off") {
              await reply("Status hanya bisa on/off");
              return;
            }
            data.antitag = state === "on";
            saveTotalPesan(m.chat, data);
            await reply(
              `AntiTag pada TotalPesan telah di${data.antitag ? "aktifkan" : "nonaktifkan"}.`
            );
          } else if (argss[0] === "reset") {
            if (!isAdmins && !OwnerDimz) return StickAdmin();
            resetTotalPesan(m.chat);
            await reply(`${prefix + command} berhasil di-reset!`);
            return;
          } else if (!argss[0] || /^[0-9]+$/.test(argss[0])) {
            if (!Object.keys(data.data).length) {
              await reply(`${prefix + command} masih kosong nih.`);
              return;
            }
            const messages = data.data;
            const perPage = 10;
            const maxPage =
              Math.ceil(Object.keys(messages).length / perPage) || 1;
            const page = Math.max(
              1,
              Math.min(parseInt(argss[0]) || 1, maxPage)
            );
            const total = Object.values(messages).reduce((a, b) => a + b, 0);

            const start = perPage * (page - 1);
            const end = perPage * page;
            const counter = Object.entries(messages)
              .sort((a, b) => b[1] - a[1])
              .slice(start, end)
              .map(([id, count], index) => {
                return `${index + 1 + start}. ${data.antitag ? (id.endsWith("@lid") ? "" : "wa.me/") : "@"}${id.split("@")[0]} : *${count}* pesan`;
              })
              .join("\n");

            const text = `
📊 Total Pesan: *${total}* pesan dari *${Object.keys(messages).length}* orang
#️⃣ Menampilkan top ${perPage} (halaman *${page}* dari *${maxPage}*)
> Gunakan *${prefix}${command} nomor halaman*

${counter}




${readmore}
⚙️ Antitag: *${data.antitag ? "✅ Aktif" : "❌ Nonaktif"}*
💡 Cara penggunaan:
• *${prefix}${command}* → Lihat total pesan grup
• *${prefix}${command} X* → Lihat total pesan grup pada halaman *X*
• *${prefix}${command} reset* → Reset data pesan grup
• *${prefix}${command} antitag on/off* → Anti tag agar tidak ke tag
`.trim();
            await DimzBot.sendMessage(
              m.chat,
              {
                text,
                mentions: data.antitag ? [] : Object.keys(messages),
              },
              {
                quoted: m,
              }
            );
          }
        } catch (e) {
          await m.reply("Maaf, telah terjadi kesalahan.");
          console.error("`totalpesan` error:", e);
        }
      }
      break;

    case "idch":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);
        try {
          if (!text || !text.startsWith("https://whatsapp.com/channel/")) {
            return reply(
              `Format salah!\nContoh: ${prefix + command} https://whatsapp.com/channel/0029VaFJJHh6hENqH3EYO33m`
            );
          }

          const channelId = text.split("/").pop().trim();
          const info = await getChannelInfo(DimzBot, channelId);

          if (!info) return reply("Gagal mengambil informasi saluran.");

          const teks =
            `📢 *Informasi Channel WhatsApp*\n\n` +
            `👤 *Nama:* ${info.name?.text || "Tidak diketahui"}\n` +
            `🆔 *ID:* ${info.id || "Tidak diketahui"}\n` +
            `🟢 *Aktif:* ${info.active ? "Ya" : "Tidak"}\n` +
            `📅 *Dibuat pada:* ${info.createdAt || "Tidak diketahui"}\n` +
            `📝 *Deskripsi:* ${info.description?.text || "Tidak ada"}\n` +
            `👥 *Pengikut:* ${info.subscribers || 0}\n` +
            `✅ *Terverifikasi:* ${info.verified ? "Ya" : "Tidak"}\n` +
            `💬 *Kode Undangan:* ${info.inviteCode || "Tidak ada"}`;

          await DimzBot.sendMessage(
            m.chat,
            {
              image: {
                url:
                  info.image ||
                  "https://lunara.drizznesiasite.biz.id/f/g0TJ6t.png",
              },
              caption: teks,
            },
            {
              quoted: m,
            }
          );
          reduceLimit(botId, m.sender);
        } catch (e) {
          reply(`Error`);
        }
      }
      break;

    case "id":
      {
        reply(from);
      }
      break;

    case "setproses":
      {
        if (!m.isGroup) return StickGroup();
        if (!isBotAdmins) return StickBotAdmin();
        if (!isAdmins && !OwnerDimz) return StickAdmin();

        const groupId = m.chat;
        const customText = text.trim();
        if (!customText)
          return reply(
            `❌ *Format salah!*

📌 *Contoh penggunaan:*
${prefix + command} Pesanan dari @user sedang diproses!
Nomor: @nomor
Tanggal: @date
Pesanan: @pesanan


📝 *Catatan:*
• @user   = mention WhatsApp
• @nomor  = angka saja (628xxx)
• @date   = tanggal otomatis hari ini
• @pesanan = isi pesanan (dari reply)

`
          );

        if (!fs.existsSync("./database/testi.json")) {
          fs.writeFileSync(
            "./database/testi.json",
            JSON.stringify({}, null, 2)
          );
        }

        const dbTesti = JSON.parse(fs.readFileSync("./database/testi.json"));

        if (!dbTesti[groupId]) {
          dbTesti[groupId] = {
            caption: "",
            images: [],
            orders: {},
            setproses: "",
            setdone: "",
          };
        }

        dbTesti[groupId].setproses = customText;

        fs.writeFileSync(
          "./database/testi.json",
          JSON.stringify(dbTesti, null, 2)
        );

        reply(
          `✅ *Template ${command} berhasil disimpan!*\n\n` +
            `📌 Placeholder tersedia:\n` +
            `• @user\n• @nomor\n• @date\n• @pesanan`
        );
      }
      break;

    case "setdone":
      {
        if (!m.isGroup) return StickGroup();
        if (!isBotAdmins) return StickBotAdmin();
        if (!isAdmins && !OwnerDimz) return StickAdmin();

        let groupId = m.chat;
        let customText = text.trim();
        if (!customText)
          return reply(`
❌ *Format salah!*

📌 *Contoh penggunaan:*
${prefix + command} Pesanan dari @user sudah selesai ✅

Nomor: @nomor
Tanggal: @date
Pesanan: @pesanan

📝 *Catatan:*
• @user   = mention WhatsApp
• @nomor  = angka saja (628xxx)
• @date   = tanggal otomatis hari ini
• @pesanan = isi pesanan (dari reply)

`);

        if (!fs.existsSync("./database/testi.json")) {
          fs.writeFileSync(
            "./database/testi.json",
            JSON.stringify({}, null, 2)
          );
        }

        let dbTesti = JSON.parse(fs.readFileSync("./database/testi.json"));

        if (!dbTesti[groupId]) {
          dbTesti[groupId] = {
            caption: "",
            images: [],
            orders: {},
            setproses: "",
            setdone: "",
          };
        }

        dbTesti[groupId].setdone = customText;

        fs.writeFileSync(
          "./database/testi.json",
          JSON.stringify(dbTesti, null, 2)
        );

        reply(`✅ Teks *${command}* berhasil disimpan!`);
      }
      break;

    case "proses":
      {
        if (!m.isGroup) return StickGroup();
        if (!isBotAdmins) return StickBotAdmin();
        if (!isAdmins && !OwnerDimz) return StickAdmin();

        const groupId = m.chat;
        const target =
          m.mentionedJid?.[0] || (m.quoted ? m.quoted.sender : null);

        if (!target)
          return reply("❌ Tag user atau reply pesan untuk memproses pesanan!");

        const userNumber = target.split("@")[0];
        const timestamp = formatTanggalID(
          new Date(
            new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" })
          )
        );

        if (!fs.existsSync("./database/testi.json")) {
          fs.writeFileSync(
            "./database/testi.json",
            JSON.stringify({}, null, 2)
          );
        }

        const dbTesti = JSON.parse(fs.readFileSync("./database/testi.json"));

        if (!dbTesti[groupId]) {
          dbTesti[groupId] = {
            caption: "",
            images: [],
            orders: {},
            setproses: "",
            setdone: "",
          };
        }

        const pesananText = m.quoted?.text || m.quoted?.caption || "-";

        dbTesti[groupId].orders[target] = {
          user: userNumber,
          status: "Dalam Proses",
          waktu: timestamp,
          keterangan: pesananText,
        };

        fs.writeFileSync(
          "./database/testi.json",
          JSON.stringify(dbTesti, null, 2)
        );

        // ===== TEMPLATE RENDER =====
        let template =
          dbTesti[groupId].setproses ||
          `⏳ Pesanan dari @user sedang diproses\n📅 @date\n📝 @pesanan`;

        const finalText = template
          .replace(/@user/g, `@${userNumber}`)
          .replace(/@nomor/g, userNumber)
          .replace(/@date/g, timestamp)
          .replace(/@pesanan/g, pesananText || "-");

        await DimzBot.sendMessage(
          m.chat,
          {
            text: finalText,
            mentions: [target],
          },
          { quoted: m }
        );
      }
      break;

    case "done":
      {
        if (!m.isGroup) return StickGroup();
        if (!isBotAdmins) return StickBotAdmin();
        if (!isAdmins && !OwnerDimz) return StickAdmin();

        let groupId = m.chat;
        let target = m.mentionedJid?.[0] || (m.quoted ? m.quoted.sender : null);
        if (!target)
          return reply(
            "❌ Tag pengguna atau reply pesan untuk menyelesaikan pesanan!"
          );

        let dbTesti = JSON.parse(fs.readFileSync("./database/testi.json"));

        if (!dbTesti[groupId] || !dbTesti[groupId].orders?.[target]) {
          return reply(
            "⚠️ Tidak ada pesanan yang sedang diproses untuk user ini!"
          );
        }

        let selesaiWaktu = formatTanggalID(
          new Date(
            new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" })
          )
        );

        const orderData = dbTesti[groupId].orders[target];
        orderData.status = "Selesai";
        orderData.waktuSelesai = selesaiWaktu;

        fs.writeFileSync(
          "./database/testi.json",
          JSON.stringify(dbTesti, null, 2)
        );

        let template = dbTesti[groupId].setdone || "";
        let nomor = target.split("@")[0];

        let finalText = template
          .replace(/@user/gi, `@${nomor}`) // mention
          .replace(/@nomor/gi, nomor) // angka saja
          .replace(/@date/gi, selesaiWaktu)
          .replace(/@pesanan/gi, orderData.keterangan || "-");

        if (!finalText)
          finalText = `✅ Pesanan dari *@${nomor}* telah selesai.`;

        DimzBot.sendMessage(
          m.chat,
          {
            text: finalText,
            mentions: template.includes("@user") ? [target] : [],
          },
          { quoted: m }
        );
      }
      break;

    case "listproses":
      {
        if (!m.isGroup) return StickGroup();
        if (!isBotAdmins) return StickBotAdmin();
        if (!isAdmins && !OwnerDimz) return StickAdmin();

        let groupId = m.chat;
        let dbTesti = JSON.parse(fs.readFileSync("./database/testi.json"));

        if (!dbTesti[groupId]) {
          dbTesti[groupId] = {
            caption: "",
            images: [],
            orders: {},
            setproses: "",
            setdone: "",
          };
        }

        const prosesList = Object.entries(dbTesti[groupId].orders || {}).filter(
          ([_, order]) => order.status === "Dalam Proses"
        );

        if (!prosesList.length)
          return reply("❌ Tidak ada pesanan yang sedang diproses.");

        const listText = prosesList
          .map(([id, order], i) => {
            return (
              `${i + 1}. *@${id.split("@")[0]}*\n` +
              `📅 ${order.waktu}` +
              (order.keterangan ? `\n📝 ${order.keterangan}` : "")
            );
          })
          .join("\n\n");

        DimzBot.sendMessage(
          m.chat,
          {
            text: `📜 *Daftar Pesanan Dalam Proses:*\n\n${listText}`,
            mentions: prosesList.map(([id]) => id),
          },
          { quoted: m }
        );
      }
      break;

    case "closetime":
      {
        if (!m.isGroup) return StickGroup();
        if (!isAdmins && !OwnerDimz) return StickAdmin();
        if (!isBotAdmins) return StickBotAdmin();

        let [waktu, satuan] = argss;
        if (!waktu || isNaN(waktu))
          return reply(`Gunakan: ${prefix + command} <angka> <detik/menit/jam/hari>

Contohnya: 
${prefix + command} 5 detik
${prefix + command} 5 menit
${prefix + command} 5 jam
${prefix + command} 5 hari`);

        let durasi = {
          detik: 1000,
          menit: 60000,
          jam: 3600000,
          hari: 86400000,
        }[satuan];

        if (!durasi)
          return reply(
            "Satuan waktu tidak valid! Gunakan: detik, menit, jam, hari."
          );

        let groupId = m.chat;
        let expireTime = Date.now() + waktu * durasi;

        /*let timeGc = loadTimeGc();
        if (!timeGc[groupId]) timeGc[groupId] = {};
        timeGc[groupId].closetime = expireTime;
        saveTimeGc(timeGc);*/

        await reply(`✅ Grup akan dikunci dalam waktu ${waktu} ${satuan}.`);

        setTimeout(async () => {
          //let updatedTimeGc = loadTimeGc();
          //if (updatedTimeGc[groupId]?.closetime <= Date.now()) {
          await DimzBot.groupSettingUpdate(groupId, "announcement");
          //delete updatedTimeGc[groupId].closetime;
          //saveTimeGc(updatedTimeGc);

          await DimzBot.sendMessage(groupId, {
            text: "🔒 *Grup telah dikunci sesuai waktu yang ditentukan!*",
          });
          //}
        }, waktu * durasi);
      }
      break;
    case "opentime":
      {
        if (!m.isGroup) return StickGroup();
        if (!isAdmins && !OwnerDimz) return StickAdmin();
        if (!isBotAdmins) return StickBotAdmin();

        let [waktu, satuan] = argss;
        if (!waktu || isNaN(waktu))
          return reply(`Gunakan: ${prefix + command} <angka> <detik/menit/jam/hari>

Contohnya: 
${prefix + command} 5 detik
${prefix + command} 5 menit
${prefix + command} 5 jam
${prefix + command} 5 hari`);

        let durasi = {
          detik: 1000,
          menit: 60000,
          jam: 3600000,
          hari: 86400000,
        }[satuan];

        if (!durasi)
          return reply(
            "Satuan waktu tidak valid! Gunakan: detik, menit, jam, hari."
          );

        let groupId = m.chat;
        let expireTime = Date.now() + waktu * durasi;

        /*let timeGc = loadTimeGc();
        if (!timeGc[groupId]) timeGc[groupId] = {};
        timeGc[groupId].opentime = expireTime;
        saveTimeGc(timeGc);*/

        await reply(`✅ Grup akan dibuka dalam waktu ${waktu} ${satuan}.`);

        setTimeout(async () => {
          //let updatedTimeGc = loadTimeGc();
          //if (updatedTimeGc[groupId]?.opentime <= Date.now()) {
          await DimzBot.groupSettingUpdate(groupId, "not_announcement");
          //delete updatedTimeGc[groupId].opentime;
          //saveTimeGc(updatedTimeGc);

          await DimzBot.sendMessage(groupId, {
            text: "🔓 *Grup telah dibuka sesuai waktu yang ditentukan!*",
          });
          //}
        }, waktu * durasi);
      }
      break;

    case "resetlinkgc":
      {
        if (!m.isGroup) return StickGroup();
        if (!isBotAdmins) return StickBotAdmin();
        if (!isAdmins && !OwnerDimz) return StickAdmin();
        DimzBot.groupRevokeInvite(m.chat);
        reply("Done");
      }
      break;

    case "welcome":
      {
        if (!m.isGroup) return StickGroup();
        if (!isAdmins && !OwnerDimz) return StickAdmin();
        if (!text)
          return reply(
            `Pilih on atau off\n\n_Contoh:_ ${prefix + command} off`
          );

        const botData = getData(botId, groupId);

        if (argss[0] === "on") {
          if (botData.welcome) return reply("Sudah diaktifkan sebelumnya");

          setData(botId, groupId, "welcome", true);
          reply("Sukses mengaktifkan welcome di grup ini");
        } else if (argss[0] === "off") {
          if (!botData.welcome) return reply("Sudah dinonaktifkan sebelumnya");

          setData(botId, groupId, "welcome", false);
          reply("Sukses menonaktifkan welcome di grup ini");
        } else {
          reply(
            `Gunakan format:\n\n${prefix + command} on — aktifkan\n${prefix + command} off — nonaktifkan`
          );
        }
      }
      break;

    case "left":
      {
        if (!m.isGroup) return StickGroup();
        if (!isAdmins && !OwnerDimz) return StickAdmin();
        if (!text)
          return reply(
            `Pilih on atau off\n\n_Contoh:_ ${prefix + command} off`
          );

        const botData = getData(botId, groupId);

        if (argss[0] === "on") {
          if (botData.left) return reply("Sudah diaktifkan sebelumnya");

          setData(botId, groupId, "left", true);
          reply("Sukses mengaktifkan fitur left di grup ini");
        } else if (argss[0] === "off") {
          if (!botData.left) return reply("Sudah dinonaktifkan sebelumnya");

          setData(botId, groupId, "left", false);
          reply("Sukses menonaktifkan fitur left di grup ini");
        } else {
          reply(
            `Gunakan format:\n\n${prefix + command} on — aktifkan\n${prefix + command} off — nonaktifkan`
          );
        }
      }
      break;

    case "setwelcome":
      {
        if (!m.isGroup) return StickGroup();
        if (!isBotAdmins) return StickBotAdmin();
        if (!isAdmins && !OwnerDimz) return StickAdmin();
        const allText = m.message?.extendedTextMessage?.text || m.body || "";
        let input = allText.slice((prefix + command).length).trim();
        if (!input) {
          return reply(`Contoh penggunaan:\n${prefix + command} style2 Halo @user di grup @grup


Atau cukup:
${prefix + command} Halo @user... (otomatis style1)


> ${prefix + command} style1
_welcome menggunakan button (welcome default)_

> ${prefix + command} style2
_welcome non-button (tidak menggunakan button/tombol)_
`);
        }

        let style = "style1";
        let message = input;

        if (/^style(1|2)\s+/i.test(input)) {
          const match = input.match(/^(style1|style2)\s+/i);
          style = match[1].toLowerCase();
          message = input.replace(match[0], "").trim();
        }

        db.setwel[m.chat] = {
          text: message,
          style: style,
          setBy: m.sender,
        };
        markChanged("setwel");

        return reply(`✅ Welcome disimpan!\n\n• Style: *${style.toUpperCase()}*\n• Teks: ${message}

${readmore}
_Mau ubah tombol dan respon?_
_${prefix}setbutwel_`);
      }
      break;

    case "setbutwel":
      {
        if (!m.isGroup) return StickGroup();
        if (!isBotAdmins) return StickBotAdmin();
        if (!isAdmins && !OwnerDimz) return StickAdmin();

        const fullText = m.message?.extendedTextMessage?.text || m.body || "";
        const input = fullText.slice((prefix + command).length).trim();

        if (!input)
          return reply(`Contoh:\n${prefix + command} Ayo Intro\n${prefix + command} respon woy @user Ini yah intro nya

> ${prefix + command}
_ini untuk custom nama/teks pada button welcome_

> ${prefix + command} respon
_ini untuk custom respon pada tombol welcome saat di klik_


fitur ini tidak berlaku untuk style2 (welcome yg menggunakan button)`);

        let data = db.setwel[m.chat] || {
          style: "style1",
        };
        if (input.toLowerCase().startsWith("respon")) {
          const replyMsg = input.slice(6).trim();
          if (!replyMsg) return reply("❌ Masukkan teks responnya.");
          data.buttonReply = replyMsg;
          db.setwel[m.chat] = data;
          markChanged("setwel");
          return reply(`✅ Respon tombol disimpan:\n\n${replyMsg}`);
        }

        if (input.length > 25)
          return reply("❌ Maksimum 25 karakter untuk teks button");
        data.buttonText = input;
        db.setwel[m.chat] = data;
        markChanged("setwel");
        return reply(`✅ Teks tombol welcome disimpan:\n\n"${input}"`);
      }
      break;

    case "delbutwel":
      {
        if (!m.isGroup) return StickGroup();
        if (!isBotAdmins) return StickBotAdmin();
        if (!isAdmins && !OwnerDimz) return StickAdmin();

        if (!db.setwel[m.chat])
          return reply("❌ Tidak ada tombol welcome yang disimpan sebelumnya");

        delete db.setwel[m.chat];
        markChanged("setwel");

        return reply("✅ Tombol welcome berhasil dihapus");
      }
      break;

    case "butwelreply":
      {
        let data = db.setwel[m.chat];
        if (!data || !data.buttonReply) return;

        let replyText = data.buttonReply.replace(
          /@user/gi,
          `@${m.sender.split("@")[0]}`
        );
        return DimzBot.sendMessage(
          m.chat,
          {
            text: replyText,
            mentions: [m.sender],
          },
          {
            quoted: m,
          }
        );
      }
      break;

    case "delwelcome":
      {
        if (!m.isGroup) return StickGroup();
        if (!isAdmins && !OwnerDimz) return StickAdmin();

        if (!db.setwel[m.chat])
          return reply("❌ Belum ada teks welcome yang diatur di grup ini!");

        delete db.setwel[m.chat];
        markChanged("setwel");

        return reply(
          "✅ Teks welcome dan tombol berhasil dihapus dari grup ini"
        );
      }
      break;

    case "setleft":
      {
        if (!m.isGroup) return StickGroup();
        if (!isAdmins && !OwnerDimz) return StickAdmin();
        if (!isBotAdmins) return StickBotAdmin();

        const teksLef = text;
        if (!teksLef)
          return reply(
            `Contoh penggunaan: ${prefix + command} Hallo @user Selamat tinggal!`
          );

        db.setleft[m.chat] = {
          text: teksLef,
          setBy: m.sender,
        };
        markChanged("setleft");

        return reply(
          `Teks left berhasil diset untuk grup ini:\n\n"${teksLef}"`
        );
      }
      break;

    case "delleft":
      {
        if (!m.isGroup) return StickGroup();
        if (!isAdmins && !OwnerDimz) return StickAdmin();
        if (!isBotAdmins) return StickBotAdmin();

        if (!db.setleft[m.chat])
          return reply("Belum ada teks left yang diatur untuk grup ini!");

        delete db.setleft[m.chat];
        markChanged("setleft");

        return reply("Teks left berhasil dihapus untuk grup ini!");
      }
      break;
    case "setintro":
      {
        if (!m.isGroup) return StickGroup();
        if (!isAdmins && !OwnerDimz) return StickAdmin();
        if (!isBotAdmins) return StickBotAdmin();

        const teksIntro = m.text.split(" ").slice(1).join(" ").trim();
        if (!teksIntro)
          return reply(
            `Contoh penggunaan: ${prefix + command} Selamat datang di grup kami!`
          );

        db.setintro ??= {};
        db.setintro[m.chat] = {
          text: teksIntro,
          setBy: m.sender,
        };
        markChanged("setintro");

        return reply(`Intro berhasil diset untuk grup ini:\n\n${teksIntro}`);
      }
      break;

    case "promote":
      {
        if (!m.isGroup) return StickGroup();
        if (!isAdmins && !OwnerDimz) return StickAdmin();
        if (!isBotAdmins) return StickBotAdmin();
        let users = m.mentionedJid[0]
          ? m.mentionedJid[0]
          : m.quoted
            ? m.quoted.sender
            : text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
        await DimzBot.groupParticipantsUpdate(m.chat, [users], "promote");
        await reply(`Done`);
      }
      break;
    case "demote":
      {
        if (!m.isGroup) return StickGroup();
        if (!isAdmins && !OwnerDimz) return StickAdmin();
        if (!isBotAdmins) return StickBotAdmin();
        let users = m.mentionedJid[0]
          ? m.mentionedJid[0]
          : m.quoted
            ? m.quoted.sender
            : text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
        await DimzBot.groupParticipantsUpdate(m.chat, [users], "demote");
        await reply(`Done`);
      }
      break;
    case "totag":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);
        if (!m.isGroup) return StickGroup();
        if (!isAdmins && !OwnerDimz) return StickAdmin();
        if (!isBotAdmins) return StickBotAdmin();
        if (!m.quoted)
          return reply(`Reply message with caption ${prefix + command}`);
        await DimzBot.sendMessage(
          m.chat,
          {
            forward: m.quoted.fakeObj,
            mentions: participants.map((a) => a.id),
            contextInfo: {
              forwardingScore: 9999999,
              isForwarded: true,
              forwardedNewsletterMessageInfo: {
                newsletterJid: "120363179857645465@newsletter",
                serverMessageId: 167,
                newsletterName: "☰『✦ Powered by softbotz.my.id ✦』",
              },
            },
          },
          {
            quoted: m,
          }
        );
        reduceLimit(botId, m.sender);
      }
      break;
    case "hidetag":
    case "ht":
    case "h":
      {
        if (!m.isGroup) return StickGroup();
        if (!isAdmins) return StickAdmin();
        if (!isBotAdmins) return StickBotAdmin();

        const all = participants.map((p) => p.id);
        const hasExtraText = !!(text && text.trim());
        if (m.quoted && hasExtraText) {
          return await DimzBot.sendMessage(
            m.chat,
            {
              text: text.trim(),
              mentions: all,
            },
            {
              quoted: m,
            }
          );
        }

        if (m.quoted && !hasExtraText) {
          const q = m.quoted;

          if (q.mtype === "conversation" || q.mtype === "extendedTextMessage") {
            return await DimzBot.sendMessage(
              m.chat,
              {
                text: q.text || q.body || "(pesan)",
                mentions: all,
              },
              {
                quoted: m,
              }
            );
          }

          try {
            await DimzBot.copyNForward(m.chat, q.fakeObj || q, true, {
              readViewOnce: true,
              contextInfo: {
                mentionedJid: all,
              },
            });
            return;
          } catch (e) {
            console.error("[Hidetag forward error]", e);

            try {
              const mime = q.mimetype || q.msg?.mimetype || "";
              const buff = await q.download?.();
              if (!buff) throw new Error("Buffer kosong");

              let content = {
                contextInfo: {
                  mentionedJid: all,
                },
              };

              if (
                /image|webp/.test(mime) ||
                /imageMessage|stickerMessage/i.test(q.mtype)
              ) {
                if (
                  /webp|sticker/i.test(mime) ||
                  /stickerMessage/i.test(q.mtype)
                ) {
                  content.sticker = buff;
                } else {
                  content.image = buff;
                  if (q.text) content.caption = q.text;
                }
              } else if (/video/i.test(mime) || /videoMessage/i.test(q.mtype)) {
                content.video = buff;
                if (q.text) content.caption = q.text;
              } else if (/audio/i.test(mime) || /audioMessage/i.test(q.mtype)) {
                content.audio = buff;
                content.mimetype = q.mimetype || "audio/mpeg";
                content.ptt = !!q.ptt;
              } else if (
                /document/i.test(mime) ||
                /documentMessage/i.test(q.mtype)
              ) {
                content.document = buff;
                content.fileName = q.fileName || "file";
                content.mimetype = q.mimetype || "application/octet-stream";
              } else {
                content.text = q.text || q.body || "(pesan)";
              }

              await DimzBot.sendMessage(m.chat, content, {
                quoted: m,
              });
              return;
            } catch (err) {
              console.error("[Hidetag fallback error]", err);
              return reply("❌ Gagal mengirim hidetag media.");
            }
          }
        }
        if (!hasExtraText) {
          return reply(
            `❌ Contoh penggunaan:\n${prefix + command} Halo semua!\n` +
              `Atau reply pesan apapun dengan ${prefix + command}`
          );
        }

        await DimzBot.sendMessage(
          m.chat,
          {
            text: text.trim(),
            mentions: all,
          },
          {
            quoted: m,
          }
        );
      }
      break;
    case "tagall":
      {
        if (!m.isGroup) return StickGroup();
        if (!isAdmins && !OwnerDimz) return StickAdmin();
        if (!isBotAdmins) return StickBotAdmin();

        me = m.sender;
        let teks = `╚»˙·٠${themeemoji}● TAGALL ●${themeemoji}٠·˙«╝

 😶 *Yg Nyuruh Tag :*  @${me.split("@")[0]}
 📩 *Pesan :* ${text ? text : "tidak ada pesan"}\n\n`;

        for (let mem of participants) {
          teks += `${themeemoji} @${mem.id.split("@")[0]}\n`;
        }

        await DimzBot.sendMessage(
          m.chat,
          {
            text: teks,
            mentions: participants.map((a) => a.id),
          },
          {
            quoted: fverif,
          }
        );
      }
      break;

    case "warn":
      {
        if (!m.isGroup) return StickGroup();
        if (!isAdmins && !OwnerDimz) return StickAdmin();
        if (!isBotAdmins) return StickBotAdmin();

        if (!m.mentionedJid.length) {
          return DimzBot.sendMessage(
            m.chat,
            {
              text: `Silakan tag anggota yang ingin diwarn.\n*Contoh: ${prefix + command} @tag alasan warn*`,
            },
            {
              quoted: m,
            }
          );
        }

        const warnedNumber = m.mentionedJid[0];
        const groupId = m.chat;

        const groupMetadata = await DimzBot.groupMetadata(groupId);
        const groupAdmins = groupMetadata.participants
          .filter((p) => p.admin)
          .map((p) => p.id);

        if (groupAdmins.includes(warnedNumber)) {
          return DimzBot.sendMessage(
            m.chat,
            {
              text: `❗ Tidak dapat memberikan warning kepada admin grup.`,
              mentions: [warnedNumber],
            },
            {
              quoted: m,
            }
          );
        }

        const argss = text.trim().split(" ");
        const reason = argss.slice(1).join(" ").trim() || "Tanpa Alasan!";

        let warnings = loadWarnings();

        if (!warnings[groupId]) {
          warnings[groupId] = [];
        }

        let userWarning = warnings[groupId].find(
          (w) => w.warn === warnedNumber
        );

        if (!userWarning) {
          userWarning = {
            warn: warnedNumber,
            total: 0,
            idgc: [],
            history: [],
          };
          warnings[groupId].push(userWarning);
        }

        userWarning.total += 1;
        userWarning.history.push(reason);
        if (!userWarning.idgc.includes(groupId)) {
          userWarning.idgc.push(groupId);
        }

        saveWarnings(warnings);
        if (userWarning.total >= 3) {
          await DimzBot.groupParticipantsUpdate(
            m.chat,
            [warnedNumber],
            "remove"
          );

          warnings[groupId] = warnings[groupId].filter(
            (w) => w.warn !== warnedNumber
          );
          saveWarnings(warnings);
          await DimzBot.sendMessage(
            m.chat,
            {
              text: `❗ Anggota @${warnedNumber.split("@")[0]} telah di-kick dari grup karena telah menerima 3 warning.`,
              mentions: [warnedNumber],
            },
            {
              quoted: m,
            }
          );
        } else {
          let historyText = userWarning.history
            .map((item, index) => `${index + 1}. ${item}`)
            .join("\n");
          await DimzBot.sendMessage(
            m.chat,
            {
              text: `
📋 *Warning untuk* @${warnedNumber.split("@")[0]}\n
- *Total warning: ${userWarning.total}*\n
- *_Alasan: ${reason}_*\n
\n> *Riwayat warning:*\n${historyText}
\n⚠️ _Jika warning mencapai 3, user akan otomatis di-kick._`,
              mentions: [warnedNumber],
            },
            {
              quoted: m,
            }
          );
        }
      }
      break;

    case "listwarn":
      {
        if (!m.isGroup) return StickGroup();
        if (!isBotAdmins) return StickBotAdmin();
        if (!isAdmins && !OwnerDimz) return StickAdmin();

        let warnings = loadWarnings();
        const groupId = m.chat;

        if (!warnings[groupId] || warnings[groupId].length === 0) {
          return reply(
            `✅ Tidak ada pengguna yang memiliki warning di grup ini.`
          );
        }

        let warningList = warnings[groupId]
          .map((user, index) => {
            let historyText =
              user.history && user.history.length > 0
                ? user.history
                    .map((item, idx) => `     ${idx + 1}. ${item}`)
                    .join("\n")
                : "     Tidak ada riwayat alasan.";

            return `🚨 *${index + 1}. @${user.warn.split("@")[0]}* - *${user.total} Warning*\n📌 *Alasan:*\n${historyText}`;
          })
          .join("\n\n──────────────────\n\n");

        let teks = `📢 *Daftar Pengguna dengan Warning di Grup Ini:*\n\n${warningList}`;

        DimzBot.sendMessage(
          m.chat,
          {
            text: teks.trim(),
            mentions: warnings[groupId].map((user) => user.warn),
          },
          {
            quoted: m,
          }
        );
      }
      break;

    case "cekwarn":
      {
        let targetNumber;

        if (m.mentionedJid.length > 0) {
          targetNumber = m.mentionedJid[0];
        } else {
          return reply(`Silakan tag anggota grup`);
        }

        // Memuat data warning
        let warnings = loadWarnings();
        const groupId = m.chat;
        if (!warnings[groupId]) {
          return reply(`Tidak ada warning yang tercatat untuk grup ini.`);
        }

        let userWarning = warnings[groupId].find(
          (w) => w.warn === targetNumber
        );

        if (userWarning) {
          let historyText =
            userWarning.history && userWarning.history.length > 0
              ? userWarning.history
                  .map((item, index) => `${index + 1}. ${item}`)
                  .join("\n")
              : "Tidak ada riwayat warning.";
          reply(`Jumlah Warn: ${userWarning.total}\nAlasan:\n${historyText}`);
        } else {
          reply(`Tidak Ada Warn untuk ${targetNumber}.`);
        }
      }
      break;

    case "delwarn":
      {
        if (!m.isGroup) return StickGroup();
        if (!isAdmins && !OwnerDimz) return StickAdmin();
        if (!isBotAdmins) return StickBotAdmin();

        const target = m.mentionedJid[0];
        const reasonInput = argss.slice(1).join(" ").trim();

        if (!target || !reasonInput) {
          return reply(`Contoh: ${prefix + command} @tag 18+`);
        }

        const groupId = m.chat;
        let warnings = loadWarnings();

        if (!warnings[groupId]) {
          return reply(`❌ Tidak ada data warning di grup ini.`);
        }

        let userWarning = warnings[groupId].find((w) => w.warn === target);

        if (!userWarning) {
          return DimzBot.sendMessage(
            m.chat,
            {
              text: `❌ Tidak ada warning untuk @${target.split("@")[0]}.`,
              mentions: [target],
            },
            {
              quoted: m,
            }
          );
        }

        const matchIndex = userWarning.history.findIndex((r) =>
          r.toLowerCase().includes(reasonInput.toLowerCase())
        );

        if (matchIndex === -1) {
          return DimzBot.sendMessage(
            m.chat,
            {
              text: `❌ Tidak ditemukan warning dengan alasan "${reasonInput}" untuk @${target.split("@")[0]}.`,
              mentions: [target],
            },
            {
              quoted: m,
            }
          );
        }

        const removed = userWarning.history.splice(matchIndex, 1)[0];
        userWarning.total = Math.max(0, userWarning.total - 1);

        saveWarnings(warnings);

        await DimzBot.sendMessage(
          m.chat,
          {
            text: `✅ 1 warning dengan alasan "${removed}" berhasil dihapus dari @${target.split("@")[0]}.\n\n📋 *Sisa Warning:* ${userWarning.total}\n${userWarning.history.length ? userWarning.history.map((r, i) => `${i + 1}. ${r}`).join("\n") : "_(kosong)_"} `,
            mentions: [target],
          },
          {
            quoted: m,
          }
        );
      }
      break;

    case "setname":
    case "setnamegc":
      {
        if (!m.isGroup) return StickGroup();
        if (!isBotAdmins) return StickBotAdmin();
        if (!isAdmins) return StickAdmin();
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);
        reduceLimit(botId, m.sender);
        if (!text) return reply("Text ?");
        await DimzBot.groupUpdateSubject(m.chat, text);
        await reply(`Done`);
      }
      break;

    case "setdesc":
    case "setdesk":
      {
        if (!m.isGroup) return StickGroup();
        if (!isBotAdmins) return StickBotAdmin();
        if (!isAdmins) return StickAdmin();
        if (!text) return reply("Text ?");
        await DimzBot.groupUpdateDescription(m.chat, text);
        await reply(`Done`);
      }
      break;

    case "setppgc":
      {
        if (!m.isGroup) return StickGroup();
        if (!isAdmins && !OwnerDimz) return StickAdmin();
        if (!isBotAdmins) return StickBotAdmin();
        if (!quoted) return reply(`Where is the picture?`);
        if (!/image/.test(mime) || /webp/.test(mime)) {
          return reply(
            `Send/Reply Gambar Dengan Caption ${prefix + command}, Atau Kalau Mau Full Size Bisa Gunakan  ${prefix + command} full`
          );
        }

        let mediaz = await quoted.download();
        if (!mediaz) {
          return reply("Failed to download image.");
        }

        const updateProfilePicture = async () => {
          try {
            if (argss[0] === `full`) {
              const buffer = await DimzBot.downloadAndSaveMediaMessage(quoted);
              var { img } = await generateProfilePicture(buffer);
              await DimzBot.query({
                tag: "iq",
                attrs: {
                  target: from,
                  to: "@s.whatsapp.net",
                  type: "set",
                  xmlns: "w:profile:picture",
                },
                content: [
                  {
                    tag: "picture",
                    attrs: {
                      type: "image",
                    },
                    content: img,
                  },
                ],
              });
              fs.unlinkSync(buffer);
              reply(`Sukses`);
            } else {
              await DimzBot.updateProfilePicture(m.chat, {
                url: mediaz,
              });
              reply(`Profile picture has been updated.`);
            }
          } catch (error) {
            reply(`Failed to update profile picture. Error: ${error.message}`);
          }
        };
        for (let attempt = 0; attempt < 3; attempt++) {
          try {
            await updateProfilePicture();
            break;
          } catch (error) {
            if (error.output && error.output.statusCode === 408) {
              reply("Request timed out. Retrying...");
              await new Promise((resolve) => setTimeout(resolve, 5000));
            } else {
              reply(
                `Failed to update profile picture. Error: ${error.message}`
              );
              break;
            }
          }
        }
      }
      break;

    case "delppgc":
      {
        if (!m.isGroup) return StickGroup();
        if (!isAdmins && !OwnerDimz) return StickAdmin();
        if (!isBotAdmins) return StickBotAdmin();
        await DimzBot.removeProfilePicture(from);
      }
      break;

    case "gc":
    case "grup":
    case "closegc":
    case "opengc":
      {
        if (!m.isGroup) return StickGroup();
        if (!isAdmins && !OwnerDimz && !isModerator) return StickAdmin();
        if (!isBotAdmins) return StickBotAdmin();

        const cmd = command.toLowerCase();
        const option = text?.trim()?.toLowerCase(); // ✅ FIX UTAMA

        // ===== MODE LANGSUNG =====
        if (cmd === "closegc") {
          await DimzBot.groupSettingUpdate(m.chat, "announcement");
          return reply(
            "🔒 Grup berhasil *DITUTUP*\nHanya admin yang bisa mengirim pesan."
          );
        }

        if (cmd === "opengc") {
          await DimzBot.groupSettingUpdate(m.chat, "not_announcement");
          return reply(
            "🔓 Grup berhasil *DIBUKA*\nSemua peserta bisa mengirim pesan."
          );
        }

        // ===== MODE ARGUMENT =====
        if (!option) {
          return reply(
            `❌ *Format salah!*\n\n` +
              `📌 *Cara Pakai:*\n` +
              `• ${prefix}gc open\n` +
              `• ${prefix}gc close\n` +
              `• ${prefix}grup open\n` +
              `• ${prefix}grup close\n\n` +
              `⚡ *Shortcut:*\n` +
              `• ${prefix}opengc\n` +
              `• ${prefix}closegc`
          );
        }

        if (option === "close") {
          await DimzBot.groupSettingUpdate(m.chat, "announcement");
          return reply(
            "🔒 Grup berhasil *DITUTUP*\nHanya admin yang bisa mengirim pesan."
          );
        }

        if (option === "open") {
          await DimzBot.groupSettingUpdate(m.chat, "not_announcement");
          return reply(
            "🔓 Grup berhasil *DIBUKA*\nSemua peserta bisa mengirim pesan."
          );
        }

        // ===== FALLBACK =====
        reply(
          `❌ *Opsi tidak valid!*\n\n` + `Gunakan:\n` + `• open\n` + `• close`
        );
      }
      break;

    case "linkgc":
      {
        if (!m.isGroup) return StickGroup();
        if (!isBotAdmins) return StickBotAdmin();

        const response = await DimzBot.groupInviteCode(m.chat);
        const msg = generateWAMessageFromContent(
          m.chat,
          {
            viewOnceMessage: {
              message: {
                messageContextInfo: {
                  deviceListMetadata: {},
                  deviceListMetadataVersion: 2,
                },
                interactiveMessage: proto.Message.InteractiveMessage.create({
                  body: proto.Message.InteractiveMessage.Body.create({
                    text: `> \`Berikut Link Grup:\`\n${groupMetadata.subject}`,
                  }),
                  footer: proto.Message.InteractiveMessage.Footer.create({
                    text: botName,
                  }),
                  header: proto.Message.InteractiveMessage.Header.create({
                    title: "",
                    subtitle: botName,
                    hasMediaAttachment: false,
                  }),
                  nativeFlowMessage:
                    proto.Message.InteractiveMessage.NativeFlowMessage.create({
                      buttons: [
                        {
                          name: "cta_copy",
                          buttonParamsJson: JSON.stringify({
                            display_text: "Copy Link Grup",
                            id: "123456789",
                            copy_code: `https://chat.whatsapp.com/${response}`,
                          }),
                        },
                      ],
                    }),
                  contextInfo: {
                    forwardingScore: 9999999,
                    isForwarded: false,
                    mentionedJid: [m.sender, "0@s.whatsapp.net"],
                    externalAdReply: {
                      renderLargerThumbnail: true,
                      title: botName,
                      containsAutoReply: false,
                      mediaType: 1,
                      thumbnail: fs.readFileSync("./Media2/theme/thumb.jpg"),
                      mediaUrl: channel,
                      sourceUrl: wagc,
                    },
                    stanzaId: m.key.id,
                    remoteJid: m.key.remoteJid,
                    participant: m.key.participant || m.key.remoteJid,
                    fromMe: m.key.fromMe,
                    quotedMessage: m.message,
                  },
                }),
              },
            },
          },
          {
            quoted: m,
          }
        );

        await DimzBot.relayMessage(m.chat, msg.message, {});
      }
      break;

    case "tagmember":
      {
        if (!m.isGroup) return StickGroup();
        if (!isAdmins && !OwnerDimz) return StickAdmin();
        if (!isBotAdmins) return StickBotAdmin();
        await DimzBot.sendMessage(
          m.chat,
          {
            text: "@" + m.chat,
            contextInfo: {
              mentionedJid: participants.map((i) => i.id),
              groupMentions: [
                {
                  groupSubject: `Everyone`,
                  groupJid: m.chat,
                },
              ],
            },
          },
          {
            quoted: fquoted,
          }
        );
      }
      break;

    case "tag":
      {
        if (!m.isGroup) return StickGroup();
        if (!isAdmins && !OwnerDimz) return StickAdmin();
        if (!isBotAdmins) return StickBotAdmin();
        if (!text) return reply(`Text Nya Mana Kak?`);
        await DimzBot.sendMessage(
          m.chat,
          {
            text: "@" + m.chat,
            contextInfo: {
              mentionedJid: participants.map((i) => i.id),
              groupMentions: [
                {
                  groupSubject: `${text}`,
                  groupJid: m.chat,
                },
              ],
            },
          },
          {
            quoted: fquoted,
          }
        );
      }
      break;

    case "mutegc":
    case "mute":
      {
        if (!m.isGroup) return StickGroup();
        if (!isAdmins && !OwnerDimz) return StickAdmin();

        const botData = getData(botId, groupId);

        const args = text.trim().split(/\s+/);
        const botGlobal = getData(botId, "global") || {};
        const botGroup = getData(botId, groupId) || {};

        if (args[0] === "allgc") {
          if (!OwnerDimz)
            return reply("⚠️ Hanya owner yang bisa mute semua grup");

          if (args[1] === "on") {
            setData(botId, "global", "muteAll", true);
            reply("🔇 *Mute ALL GROUP aktif*\nSemua grup akan dimute");
            return;
          }

          if (args[1] === "off") {
            setData(botId, "global", "muteAll", false);
            reply("🔊 *Mute ALL GROUP dimatikan*");
            return;
          }

          return reply(
            `⚙️ Format salah\n\n${prefix}mute allgc on\n${prefix}mute allgc off`
          );
        }

        if (args[0] === "on") {
          if (botData.mute) return reply("❌ Grup ini sudah dimute");
          setData(botId, groupId, "mute", true);
          reply("🔇 Grup ini sekarang dimute");
          return;
        }

        if (args[0] === "off") {
          if (!botData.mute) return reply("❌ Grup ini tidak sedang dimute");
          setData(botId, groupId, "mute", false);
          reply("🔊 Grup ini sekarang tidak dimute");
          return;
        }

        reply(
          `⚙️ *Penggunaan Mute*\n
${prefix + command} on
${prefix + command} off
${prefix + command} allgc on
${prefix + command} allgc off`
        );
      }
      break;

    case "statsgc":
      {
        if (!m.isGroup) return StickGroup();
        if (!isBotAdmins) return StickBotAdmin();

        const groupId = m.chat;
        const botData = getData(botId, groupId);
        const status = (key) => (botData[key] ? "✅" : "❌");
        const status2 = (arr) =>
          Array.isArray(arr) && arr.includes(groupId) ? "✅" : "❌";

        const statuses = {
          antilinkGc: status("antilinkgc"),
          antilinkGc2: status("antilinkgc2"),
          antilinkWame: status("antilinkgcwa"),
          antilinkWame2: status("antilinkgcwa2"),
          antilinkAll: status("antilinkall"),
          antilinkAll2: status("antilinkall2"),
          antisaluran: status("antilinkgcsalur"),
          antisaluran2: status("antilinkgcsalur2"),
          antilinkTwitter: status("antilinktwt"),
          antilinkTwitter2: status("antilinktwt2"),
          antilinkTiktok: status("antilinktt"),
          antilinkTiktok2: status("antilinktt2"),
          antilinkTelegram: status("antilinktg"),
          antilinkTelegram2: status("antilinktg2"),
          antilinkFacebook: status("antilinkfb"),
          antilinkFacebook2: status("antilinkfb2"),
          antilinkInstagram: status("antilinkig"),
          antilinkInstagram2: status("antilinkig2"),
          antilinkYtCh: status("antilinkytch"),
          antilinkYtCh2: status("antilinkytch2"),
          antilinkYtVid: status("antilinkytvid"),
          antilinkYtVid2: status("antilinkytvid2"),
          mute: status("mute"),
          antimedia: status("antimedia"),
          antimedia2: status("antimedia2"),
          antitoxic: status("antitoxic"),
          antitoxic2: status("antitoxic2"),
          antipromosi: status("antipromosi"),
          antilokasi: status("antilokasi"),
          antilokasi2: status("antilokasi2"),
          antiswgc: antiswgc?.[groupId] ? `✅ (${antiswgc[groupId]})` : "❌",
          antitagsw: status(antitagsw),
        };

        const meta = await DimzBot.groupMetadata(groupId);
        const groupName = meta.subject;
        const memberCount = meta.participants.length;

        const sewa = loadSewaData();
        const sisaWaktu = (() => {
          const data = sewa?.sewa?.[groupId];
          if (!data) return "❌ *Tidak terdaftar untuk sewa*";
          const now = moment();
          const exp = moment(data.expiry);
          const sisa = exp.diff(now, "seconds");
          if (sisa <= 0) return "❌ *Masa sewa sudah habis*";
          const dur = moment.duration(sisa, "seconds");
          return `⏳ *Sisa waktu sewa*: ${Math.floor(dur.asDays())} hari, ${dur.hours()} jam, ${dur.minutes()} menit`;
        })();

        const out = `
━━━━━━━━━━━━━━━━━━━━━
📊 *STATUS FITUR GRUP*
━━━━━━━━━━━━━━━━━━━━━
📛 *Nama Grup:* ${groupName}
👥 *Jumlah Anggota:* ${memberCount}
━━━━━━━━━━━━━━━━━━━━━

🔒 *Fitur Grup:*
- 🪀 Anti-Link Group: ${statuses.antilinkGc}
- 🪀 Anti-Link Group2: ${statuses.antilinkGc2}
- 📍 Anti-Link Wa.me: ${statuses.antilinkWame}
- 📍 Anti-Link Wa.me2: ${statuses.antilinkWame2}
- 🌐 Anti-Link Semua: ${statuses.antilinkAll}
- 🌐 Anti-Link Semua2: ${statuses.antilinkAll2}
- 🔗 Anti-Link Saluran: ${statuses.antisaluran}
- 🔗 Anti-Link Saluran2: ${statuses.antisaluran2}
- 🐦 Anti-Link Twitter: ${statuses.antilinkTwitter}
- 🐦 Anti-Link Twitter2: ${statuses.antilinkTwitter2}
- 🎵 Anti-Link TikTok: ${statuses.antilinkTiktok}
- 🎵 Anti-Link TikTok2: ${statuses.antilinkTiktok2}
- 💬 Anti-Link Telegram: ${statuses.antilinkTelegram}
- 💬 Anti-Link Telegram2: ${statuses.antilinkTelegram2}
- 📘 Anti-Link Facebook: ${statuses.antilinkFacebook}
- 📘 Anti-Link Facebook2: ${statuses.antilinkFacebook2}
- 📸 Anti-Link Instagram: ${statuses.antilinkInstagram}
- 📸 Anti-Link Instagram2: ${statuses.antilinkInstagram2}
- 🎥 Anti-Link YouTube Ch: ${statuses.antilinkYtCh}
- 🎥 Anti-Link YouTube Ch2: ${statuses.antilinkYtCh2}
- 📺 Anti-Link YouTube Vid: ${statuses.antilinkYtVid}
- 📺 Anti-Link YouTube Vid2: ${statuses.antilinkYtVid2}
- 📍 Anti Lokasi: ${statuses.antilokasi}
- 📍 Anti Lokasi2: ${statuses.antilokasi2}
- 🖼️ Anti Media: ${statuses.antimedia}
- 🖼️ Anti Media2: ${statuses.antimedia2}
- 🧨 Anti Toxic: ${statuses.antitoxic}
- 🧨 Anti Toxic2: ${statuses.antitoxic2}
- 💬 Anti Promosi: ${statuses.antipromosi}
- 🔇 Mute Group: ${statuses.mute}
- 🚷 Anti SWGC (status grup whatsapp): ${statuses.antiswgc}
- 🏷️ Anti Tag Status: ${statuses.antitagsw}

━━━━━━━━━━━━━━━━━━━━━
${sisaWaktu}
━━━━━━━━━━━━━━━━━━━━━
`.trim();

        reply(out);
      }
      break;

    case "toswgc":
      {
        if (!m.isGroup) return StickGroup();
        if (!isAdmins && !OwnerDimz) return StickAdmin();
        const isQuoted = !!m.quoted;
        const mimeType = isQuoted ? m.quoted.mimetype || m.quoted.mtype : null;
        const teks = text ? text.trim() : "";
        let media;

        if (isQuoted) media = await m.quoted.download();

        let targetGc = m.chat;
        let caption = teks;

        if (OwnerDimz && teks.includes("|")) {
          const [idgc, ...rest] = teks.split("|");
          targetGc = idgc.trim();
          caption = rest.join("|").trim();
        }

        let options = {};
        if (isQuoted) {
          if (/image/.test(mimeType)) {
            options = {
              image: media,
              caption: caption,
            };
          } else if (/video/.test(mimeType)) {
            options = {
              video: media,
              caption: caption,
            };
          } else if (/audio/.test(mimeType)) {
            options = {
              audio: media,
              mimetype: "audio/mpeg",
              ptt: false,
            };
          } else {
            return reply(
              "❌ Hanya bisa gambar, video, audio atau teks untuk status grup!"
            );
          }
        } else if (caption) {
          options = {
            text: caption,
          };
        } else {
          return reply(
            `Balas gambar/video/audio atau kasih teks!\nContoh: ${prefix + command} hallo

atau gunakan ${prefix + command} id grup | hallo`
          );
        }

        if (!OwnerDimz && m.chat !== targetGc) {
          return reply("⚠️ Hanya owner yang bisa kirim status ke grup lain!");
        }

        await groupSatus(targetGc, options);

        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "✅",
            key: m.key,
          },
        });
      }
      break;

    case "copylist":
      {
        if (!m.isGroup) return StickGroup();
        if (!isAdmins && !OwnerDimz) return StickAdmin();
        if (!isBotAdmins) return StickBotAdmin();

        const dbGroup = getLists(m.chat);
        if (!dbGroup || Object.keys(dbGroup).length === 0)
          return reply("❌ Tidak ada list di grup ini untuk disalin");

        const metadata = await DimzBot.groupMetadata(m.chat);

        global.datacopy ??= {};
        global.datacopy[m.sender] = {
          from: m.chat,
          groupName: metadata.subject,
          data: {
            ...dbGroup,
          }, // Deep copy
        };

        reply(
          `✅ *Berhasil menyalin list dari grup:* *${metadata.subject}*\n` +
            `📦 *Total:* ${Object.keys(dbGroup).length} list\n\n` +
            `🔁 Sekarang ketik *${prefix}pastelist* di grup lain untuk menempelkannya.\n` +
            `⚠️ Pastikan kamu & bot adalah admin di grup tujuan`
        );
      }
      break;

    case "pastelist":
      {
        if (!m.isGroup) return StickGroup();
        if (!isAdmins && !OwnerDimz) return StickAdmin();
        if (!isBotAdmins) return StickBotAdmin();

        const copied = global.datacopy?.[m.sender];
        if (!copied || !copied.data)
          return reply(
            `❌ Belum ada list yang disalin\nSalin dulu dengan *${prefix}copylist* di grup asal`
          );

        if (m.chat === copied.from)
          return reply("⚠️ Grup tujuan tidak boleh sama dengan grup asal");

        const targetDB = getLists(m.chat);

        let total = 0;
        for (const [nama, val] of Object.entries(copied.data)) {
          targetDB[nama] = val;
          total++;
        }
        saveLists(m.chat, targetDB);

        delete global.datacopy[m.sender];

        reply(
          `✅ *Berhasil pastelist: ${total} list* ke grup ini\n` +
            `📤 Disalin dari grup: *${copied.groupName || "Tidak diketahui"}*`
        );
      }
      break;

    case "dellistall":
      {
        if (!m.isGroup) return StickGroup();
        if (!isAdmins && !OwnerDimz) return StickAdmin();

        const dbGroup = getLists(m.chat);
        if (!dbGroup || Object.keys(dbGroup).length === 0)
          return reply("❌ Tidak ada list yang bisa dihapus di grup ini");

        const jumlah = Object.keys(dbGroup).length;
        saveLists(m.chat, {});

        return reply(`🗑️ *Berhasil menghapus ${jumlah} list* dari grup ini`);
      }
      break;

    case "addlist":
      {
        let metadata = await DimzBot.groupMetadata(m.chat);
        if (!m.isGroup) return StickGroup();
        if (!isAdmins && !OwnerDimz) return StickAdmin();
        if (!m.quoted)
          return reply("Balas Pesan yang Ingin Anda Simpan di Database");
        if (!text) return reply(`Contoh : ${prefix + command} Tes`);

        const msgs = getLists(m.chat);
        if (text.toLowerCase() in msgs)
          return reply(`*${text}* terdaftar dalam daftar pesan`);

        msgs[text.toLowerCase()] = quoted.fakeObj;
        saveLists(m.chat, msgs);
        (await reply(`Berhasil menambahkan pesan dalam daftar pesan sebagai '${text}' di grup ${metadata.subject}



> Untuk Melihat Daftar List Silahkan Ketik ${prefix}list atau ${prefix}stock
> ⚠ button list tidak muncul? ketik ${prefix}list2

> _mau set stock? ketik ${prefix}setstock_`),
          {
            quoted: m,
          });
      }
      break;
    case "editlist":
    case "updatelist":
      {
        if (!m.isGroup) return StickGroup();
        if (!isAdmins && !OwnerDimz) return StickAdmin();
        if (!m.quoted)
          return reply("Balas Pesan yang Ingin Anda Simpan di Database");
        if (!text) return reply(`Contoh : ${prefix + command} filename`);

        const msgs = getLists(m.chat);
        if (!(text.toLowerCase() in msgs))
          return reply(`'${text}' tidak terdaftar dalam daftar pesan`);

        msgs[text.toLowerCase()] = quoted.fakeObj;
        saveLists(m.chat, msgs);
        (await reply(`Berhasil mengedit pesan list '${text}'


> Untuk Melihat Daftar List Silahkan Ketik ${prefix}list atau ${prefix}stock
> ⚠ button list tidak muncul? ketik ${prefix}list2

> _mau set stock? ketik ${prefix}setstock_`),
          {
            quoted: m,
          });
      }
      break;
    case "getmsg":
    case "getlist":
      {
        if (!text)
          return reply(
            `Contoh : ${prefix + command} file name\n\nView list of messages with ${prefix}listmsg`
          );

        const msgs = getLists(m.chat);
        if (!(text.toLowerCase() in msgs))
          return reply(`'${text}' not listed in the message list`);

        DimzBot.copyNForward(m.chat, msgs[text.toLowerCase()], true, {
          quoted: m,
        });
      }
      break;
    case "list":
      {
        if (!m.isGroup) return StickGroup();
        let metadata = await DimzBot.groupMetadata(m.chat);
        const seplit = Object.entries(getLists(m.chat)).map(([nama, isi]) => ({
          nama,
          ...isi,
        }));
        if (!seplit.length) return await reply("Belum ada list di grup ini.");

        const initext = `
           *\`「DATABASE LIST 」\`*
           
*_Berikut List Di Group:_* ${metadata.subject}


> _Silahkan Pilih List Database Di Bawah Ini!_
`;
        const rows = seplit.map((i) => ({
          header: "",
          title: i.nama,
          description: `Type: ${getContentType(i.message).replace(/Message/i, "")}`,
          id: `.getmsg ${i.nama}`,
        }));

        let sections = [
          {
            title: `「 LIST DI GRUP ${metadata.subject} 」`,
            highlight_label: "",
            rows,
          },
        ];

        let listMessage = {
          title: "⎙ List Message Database",
          sections,
        };

        await DimzBot.sendInteractiveMessage(
          m.chat,
          "",
          `🗓 ${day(Date.now())} ${weton(Date.now())}, ${tanggal(Date.now())} ${bulan(Date.now())} ${tahun(Date.now())}\n⏰ ${moment.tz("Asia/Jakarta").format("HH : mm : ss")}`,
          initext,
          "😹",
          null,
          [
            {
              type: "single_select",
              ...listMessage,
            },
          ],
          m,
          {
            contextInfo: {
              forwardingScore: 1,
              isForwarded: false,
              businessMessageForwardInfo: {
                businessOwnerJid: nobisnis,
              },
              forwardedNewsletterMessageInfo: {
                newsletterJid: "120363179857645465@newsletter",
                serverMessageId: 167,
                newsletterName: `☰🔰 Nama: ${pushname}`,
              },
              mentionedJid: [m.sender, creator2, "0@s.whatsapp.net"],
              externalAdReply: {
                containsAutoReply: true,
              },
            },
          }
        );
      }
      break;
    case "stock":
    case "stok":
    case "list2":
      {
        if (!m.isGroup) return StickGroup();

        const metadata = await DimzBot.groupMetadata(m.chat);
        const dbGroup = getLists(m.chat);
        const listArray = Object.entries(dbGroup);
        const showStock = db.data.stockmode?.[m.chat];

        if (!listArray.length) return reply("Belum ada list di grup ini");

        let listText = `📌 *BERIKUT LIST NYA*\n\n`;

        for (const [nama, isi] of listArray) {
          if (showStock) {
            const stok = isi.stock ?? 0;
            const status = stok > 0 ? "✅" : "❌";
            listText += `- ${nama} (${stok}) ${status}\n`;
          } else {
            listText += `- ${nama}\n`;
          }
        }

        listText += `\n📦 *Total:* ${listArray.length} list`;
        listText += `\n✏️ *Cara pakai:* ketik langsung nama list-nya`;
        listText += `\n📍 *Contoh:* *_${listArray[0][0]}_*`;

        await DimzBot.sendMessage(
          m.chat,
          {
            text: listText.trim(),
            mentions: [m.sender],
          },
          {
            quoted: m,
          }
        );
      }
      break;
    case "setstock":
      {
        if (!m.isGroup) return StickGroup();
        if (!isAdmins && !OwnerDimz) return StickAdmin();

        const argssRaw = text.trim().toLowerCase();

        db.data.stockmode ??= {};
        const groupDB = getLists(m.chat);

        if (argssRaw === "on") {
          db.data.stockmode[m.chat] = true;
          return reply("✅ Mode tampilan stok diaktifkan!");
        }

        if (argssRaw === "off") {
          db.data.stockmode[m.chat] = false;
          return reply("✅ Mode tampilan stok dimatikan!");
        }

        const [nama, jumlah] = text.split("|").map((s) => s.trim());
        if (!nama || isNaN(jumlah)) {
          return reply(
            `Format salah!\n\nContoh:\n${prefix + command} sewa bot | 5\n${prefix + command} on/off`
          );
        }

        const key = nama.toLowerCase();
        if (!(key in groupDB))
          return reply(`❌ List *${nama}* tidak ditemukan`);

        groupDB[key].stock = parseInt(jumlah);
        saveLists(m.chat, groupDB);
        reply(
          `✅ Stock untuk *${nama}* diatur menjadi *${jumlah}*\n\n${prefix + command} on/off`
        );
      }
      break;
    case "dellist":
      {
        if (!m.isGroup) return StickGroup();
        if (!isAdmins && !OwnerDimz) return StickAdmin();
        const msgs = getLists(m.chat);
        if (!(text.toLowerCase() in msgs))
          return reply(`'${text}' not listed in the message list`);
        delete msgs[text.toLowerCase()];
        saveLists(m.chat, msgs);
        reply(`Successfully deleted '${text}' from the message list`);
      }
      break;

    case "backup":
      {
        if (!m.isGroup) return StickGroup();
        if (!isAdmins && !OwnerDimz) return StickAdmin();
        if (!text || text.toLowerCase() !== "list")
          return reply(`Contoh:\n${prefix + command} list`);

        const metadata = await DimzBot.groupMetadata(m.chat);
        const lists = getLists(m.chat);
        const listArray = Object.entries(lists);

        if (!listArray.length)
          return reply("❌ Tidak ada list yang bisa dibackup di grup ini.");

        const tanggal = new Date().toLocaleString("id-ID", {
          timeZone: "Asia/Jakarta",
          day: "2-digit",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

        let content = `📦 BACKUP LIST GRUP

Nama Grup : ${metadata.subject}
ID Grup   : ${m.chat}
Tanggal   : ${tanggal} WIB

━━━━━━━━━━━━━━━━━━━━
`;

        listArray.forEach(([nama, msg], i) => {
          let isi = "-";

          try {
            if (msg?.message?.conversation) {
              isi = msg.message.conversation;
            } else if (msg?.message?.extendedTextMessage?.text) {
              isi = msg.message.extendedTextMessage.text;
            } else if (msg?.message?.imageMessage?.caption) {
              isi = msg.message.imageMessage.caption;
            } else if (msg?.message?.videoMessage?.caption) {
              isi = msg.message.videoMessage.caption;
            } else if (msg?.message?.documentMessage?.caption) {
              isi = msg.message.documentMessage.caption;
            }
          } catch {}

          content += `📌 ${i + 1}. ${nama}
${isi}

`;
        });

        content += `━━━━━━━━━━━━━━━━━━━━
Total List : ${listArray.length}

Generated by softbotz.my.id
`;

        const fileName = `data-list-${m.chat.replace(/[^0-9]/g, "")}.txt`;

        await DimzBot.sendMessage(
          m.chat,
          {
            document: Buffer.from(content),
            mimetype: "text/plain",
            fileName,
          },
          { quoted: m }
        );
      }
      break;

    case "grup":
    case "group":
    case "gc":
      {
        if (!m.isGroup) return StickGroup();
        if (!isAdmins && !OwnerDimz) return StickAdmin();
        if (!isBotAdmins) return StickBotAdmin();

        if (!argss[0]) {
          return reply(
            `Send orders ${prefix + command} _options_\nOptions : close & open\nContoh : ${prefix + command} close`
          );
        }

        if (argss[0].toLowerCase() === "close") {
          await DimzBot.groupSettingUpdate(from, "announcement");
          reply("_*Group Berhasil Ditutup*_ 「 🔒 」");
        } else if (argss[0].toLowerCase() === "open") {
          await DimzBot.groupSettingUpdate(from, "not_announcement");
          reply("_*Group Berhasil Dibuka*_ 「 🔓 」");
        } else {
          reply(
            `Type Command ${prefix + command} _options_\nOptions : close & open\nContoh : ${prefix + command} close`
          );
        }
      }
      break;

    case "afk":
      {
        if (!m.isGroup) return StickGroup();
        let user = db.data.users[m.sender];
        user.afkTime = +new Date();
        user.afkReason = argss.join(" ") || "Tidak Ada Alasan";
        DimzBot.sendMessage(
          m.chat,
          {
            text: `
*🗣️ 「 ${m.pushName} Telah AFK 」*
*💠 Dengan Alasan:* ${user.afkReason}`,
            contextInfo: {
              mentionedJid: [m.sender],
              externalAdReply: {
                title: `AFK [ Away From Keyboard ]`,
                thumbnailUrl:
                  "https://www.shutterstock.com/image-illustration/afk-awat-keyboard-internet-acronym-600nw-1867588081.jpg",
                containsAutoReply: true,
                sourceUrl: `${wagc}`,
                mediaType: 1,
                renderLargerThumbnail: true,
              },
            },
          },
          {
            quoted: m,
          }
        );
      }
      break;

    // fitur antilink
    case "antilokasi":
      {
        if (!m.isGroup) return StickGroup();
        if (!isBotAdmins) return StickBotAdmin();
        if (!isAdmins && !OwnerDimz) return StickAdmin();

        const botData = getData(botId, groupId);

        if (argss[0] === "on") {
          if (botData.antilokasi) return reply("Sudah diaktifkan sebelumnya");

          setData(botId, groupId, "antilokasi", true);
          reply("✅ Berhasil mengaktifkan *Anti Lokasi* di grup ini");

          await DimzBot.sendMessage(
            from,
            {
              text: `\`\`\`「 ⚠️ Peringatan ⚠️ 」\`\`\`\n\nAdmin tidak memperbolehkan member mengirimkan lokasi!\n\nJika kamu mengirim lokasi, pesan akan dihapus dan kamu akan otomatis dikick.`,
            },
            {
              quoted: fverif,
            }
          );
        } else if (argss[0] === "off") {
          if (!botData.antilokasi)
            return reply("Sudah dinonaktifkan sebelumnya");

          setData(botId, groupId, "antilokasi", false);
          reply("❌ Berhasil menonaktifkan *Anti Lokasi* di grup ini");
        } else {
          await reply(
            `Gunakan perintah dengan benar:\n\n` +
              `Contoh: ${prefix + command} on\n` +
              `Contoh: ${prefix + command} off`
          );
        }
      }
      break;

    case "antilokasi2":
      {
        if (!m.isGroup) return StickGroup();
        if (!isBotAdmins) return StickBotAdmin();
        if (!isAdmins && !OwnerDimz) return StickAdmin();

        const botData = getData(botId, groupId);

        if (argss[0] === "on") {
          if (botData.antilokasi2) return reply("Sudah diaktifkan sebelumnya");

          setData(botId, groupId, "antilokasi2", true);
          reply("✅ Berhasil mengaktifkan *Anti Lokasi 2* di grup ini");

          await DimzBot.sendMessage(
            from,
            {
              text: `\`\`\`「 ⚠️ Peringatan ⚠️ 」\`\`\`\n\nAdmin tidak memperbolehkan member mengirimkan lokasi!\n\nJika kamu mengirim lokasi, pesan akan dihapus.`,
            },
            {
              quoted: fverif,
            }
          );
        } else if (argss[0] === "off") {
          if (!botData.antilokasi2)
            return reply("Sudah dinonaktifkan sebelumnya");

          setData(botId, groupId, "antilokasi2", false);
          reply("❌ Berhasil menonaktifkan *Anti Lokasi 2* di grup ini");
        } else {
          await reply(
            `Gunakan perintah dengan benar:\n\n` +
              `Contoh: ${prefix + command} on\n` +
              `Contoh: ${prefix + command} off`
          );
        }
      }
      break;

    case "antilinkyoutubevideo":
    case "antilinkyoutubevid":
    case "antilinkytvid":
      {
        if (!m.isGroup) return StickGroup();
        if (!isBotAdmins) return StickBotAdmin();
        if (!isAdmins && !OwnerDimz) return StickAdmin();

        const botData = getData(botId, groupId);

        if (argss[0] === "on") {
          if (botData.antilinkytvid)
            return reply("Sudah diaktifkan sebelumnya");

          setData(botId, groupId, "antilinkytvid", true);
          reply(
            "✅ Berhasil mengaktifkan *Anti-Link YouTube Video* di grup ini"
          );

          await DimzBot.sendMessage(
            from,
            {
              text: `\`\`\`「 ⚠️ Peringatan ⚠️ 」\`\`\`\n\nJangan kirim link video YouTube di grup ini, kamu bisa langsung dikick.`,
            },
            {
              quoted: fverif,
            }
          );
        } else if (argss[0] === "off") {
          if (!botData.antilinkytvid)
            return reply("Sudah dinonaktifkan sebelumnya");

          setData(botId, groupId, "antilinkytvid", false);
          reply(
            "❌ Berhasil menonaktifkan *Anti-Link YouTube Video* di grup ini"
          );
        } else {
          await reply(
            `Gunakan format perintah yang benar:\n\n` +
              `Contoh: ${prefix + command} on\n` +
              `Contoh: ${prefix + command} off`
          );
        }
      }
      break;

    case "antilinkyoutubech":
    case "antilinkyoutubechannel":
    case "antilinkytch":
      {
        if (!m.isGroup) return StickGroup();
        if (!isBotAdmins) return StickBotAdmin();
        if (!isAdmins && !OwnerDimz) return StickAdmin();

        const botData = getData(botId, groupId);

        if (argss[0] === "on") {
          if (botData.antilinkytch) return reply("Sudah diaktifkan sebelumnya");

          setData(botId, groupId, "antilinkytch", true);
          reply(
            "✅ Berhasil mengaktifkan *Anti-Link YouTube Channel* di grup ini"
          );

          await DimzBot.sendMessage(
            from,
            {
              text: `\`\`\`「 ⚠️ Peringatan ⚠️ 」\`\`\`\n\nDilarang mengirim link channel YouTube di grup ini!`,
            },
            {
              quoted: fverif,
            }
          );
        } else if (argss[0] === "off") {
          if (!botData.antilinkytch)
            return reply("Sudah dinonaktifkan sebelumnya");

          setData(botId, groupId, "antilinkytch", false);
          reply(
            "❌ Berhasil menonaktifkan *Anti-Link YouTube Channel* di grup ini"
          );
        } else {
          await reply(
            `Gunakan format perintah yang benar:\n\n` +
              `Contoh: ${prefix + command} on\n` +
              `Contoh: ${prefix + command} off`
          );
        }
      }
      break;

    case "antilinkyoutubech2":
    case "antilinkyoutubechannel2":
    case "antilinkytch2":
      {
        if (!m.isGroup) return StickGroup();
        if (!isBotAdmins) return StickBotAdmin();
        if (!isAdmins && !OwnerDimz) return StickAdmin();

        const botData = getData(botId, groupId);

        if (argss[0] === "on") {
          if (botData.antilinkytch2)
            return reply("Sudah diaktifkan sebelumnya");

          setData(botId, groupId, "antilinkytch2", true);
          reply(
            "✅ Berhasil mengaktifkan *Anti-Link YouTube Channel 2* di grup ini"
          );
        } else if (argss[0] === "off") {
          if (!botData.antilinkytch2)
            return reply("Sudah dinonaktifkan sebelumnya");

          setData(botId, groupId, "antilinkytch2", false);
          reply(
            "❌ Berhasil menonaktifkan *Anti-Link YouTube Channel 2* di grup ini"
          );
        } else {
          await reply(
            `Gunakan format perintah yang benar:\n\n` +
              `Contoh: ${prefix + command} on\n` +
              `Contoh: ${prefix + command} off`
          );
        }
      }
      break;

    case "antilinkinstagram":
    case "antilinkig":
    case "antilinkinsta":
      {
        if (!m.isGroup) return StickGroup();
        if (!isBotAdmins) return StickBotAdmin();
        if (!isAdmins && !OwnerDimz) return StickAdmin();

        const botData = getData(botId, groupId);

        if (argss[0] === "on") {
          if (botData.antilinkig) return reply("Sudah diaktifkan sebelumnya");

          setData(botId, groupId, "antilinkig", true);
          reply("✅ Berhasil mengaktifkan *Anti-Link Instagram* di grup ini");

          await DimzBot.sendMessage(
            from,
            {
              text: `\`\`\`「 ⚠️ Peringatan ⚠️ 」\`\`\`\n\nDilarang mengirim link Instagram di grup ini!`,
            },
            {
              quoted: fverif,
            }
          );
        } else if (argss[0] === "off") {
          if (!botData.antilinkig)
            return reply("Sudah dinonaktifkan sebelumnya");

          setData(botId, groupId, "antilinkig", false);
          reply("❌ Berhasil menonaktifkan *Anti-Link Instagram* di grup ini");
        } else {
          await reply(
            `Gunakan format perintah yang benar:\n\n` +
              `Contoh: ${prefix + command} on\n` +
              `Contoh: ${prefix + command} off`
          );
        }
      }
      break;

    case "antilinkinstagram2":
    case "antilinkig2":
    case "antilinkinsta2":
      {
        if (!m.isGroup) return StickGroup();
        if (!isBotAdmins) return StickBotAdmin();
        if (!isAdmins && !OwnerDimz) return StickAdmin();

        const botData = getData(botId, groupId);

        if (argss[0] === "on") {
          if (botData.antilinkig2) return reply("Sudah diaktifkan sebelumnya");

          setData(botId, groupId, "antilinkig2", true);
          reply("✅ Berhasil mengaktifkan *Anti-Link Instagram 2* di grup ini");
        } else if (argss[0] === "off") {
          if (!botData.antilinkig2)
            return reply("Sudah dinonaktifkan sebelumnya");

          setData(botId, groupId, "antilinkig2", false);
          reply(
            "❌ Berhasil menonaktifkan *Anti-Link Instagram 2* di grup ini"
          );
        } else {
          await reply(
            `Gunakan format perintah yang benar:\n\n` +
              `Contoh: ${prefix + command} on\n` +
              `Contoh: ${prefix + command} off`
          );
        }
      }
      break;

    case "antilinkfacebook":
    case "antilinkfb":
      {
        if (!m.isGroup) return StickGroup();
        if (!isBotAdmins) return StickBotAdmin();
        if (!isAdmins && !OwnerDimz) return StickAdmin();

        const botData = getData(botId, groupId);

        if (argss[0] === "on") {
          if (botData.antilinkfb) return reply("Sudah diaktifkan sebelumnya");

          setData(botId, groupId, "antilinkfb", true);
          reply("✅ Berhasil mengaktifkan *Anti-Link Facebook* di grup ini");

          await DimzBot.sendMessage(
            from,
            {
              text: `\`\`\`「 ⚠️ Peringatan ⚠️ 」\`\`\`\n\nDilarang mengirim link Facebook di grup ini!`,
            },
            {
              quoted: fverif,
            }
          );
        } else if (argss[0] === "off") {
          if (!botData.antilinkfb)
            return reply("Sudah dinonaktifkan sebelumnya");

          setData(botId, groupId, "antilinkfb", false);
          reply("❌ Berhasil menonaktifkan *Anti-Link Facebook* di grup ini");
        } else {
          await reply(
            `Gunakan format perintah yang benar:\n\n` +
              `Contoh: ${prefix + command} on\n` +
              `Contoh: ${prefix + command} off`
          );
        }
      }
      break;

    case "antilinkfacebook2":
    case "antilinkfb2":
      {
        if (!m.isGroup) return StickGroup();
        if (!isBotAdmins) return StickBotAdmin();
        if (!isAdmins && !OwnerDimz) return StickAdmin();

        const botData = getData(botId, groupId);

        if (argss[0] === "on") {
          if (botData.antilinkfb2) return reply("Sudah diaktifkan sebelumnya");

          setData(botId, groupId, "antilinkfb2", true);
          reply("✅ Berhasil mengaktifkan *Anti-Link Facebook 2* di grup ini");
        } else if (argss[0] === "off") {
          if (!botData.antilinkfb2)
            return reply("Sudah dinonaktifkan sebelumnya");

          setData(botId, groupId, "antilinkfb2", false);
          reply("❌ Berhasil menonaktifkan *Anti-Link Facebook 2* di grup ini");
        } else {
          await reply(
            `Gunakan format perintah yang benar:\n\n` +
              `Contoh: ${prefix + command} on\n` +
              `Contoh: ${prefix + command} off`
          );
        }
      }
      break;

    case "antilinktelegram":
    case "antilinktg":
      {
        if (!m.isGroup) return StickGroup();
        if (!isBotAdmins) return StickBotAdmin();
        if (!isAdmins && !OwnerDimz) return StickAdmin();

        const botData = getData(botId, groupId);

        if (argss[0] === "on") {
          if (botData.antilinktg) return reply("Sudah diaktifkan sebelumnya");

          setData(botId, groupId, "antilinktg", true);
          reply("✅ Berhasil mengaktifkan *Anti-Link Telegram* di grup ini");

          await DimzBot.sendMessage(
            from,
            {
              text: `\`\`\`「 ⚠️ Peringatan ⚠️ 」\`\`\`\n\nDilarang mengirim link Telegram di grup ini!`,
            },
            {
              quoted: fverif,
            }
          );
        } else if (argss[0] === "off") {
          if (!botData.antilinktg)
            return reply("Sudah dinonaktifkan sebelumnya");

          setData(botId, groupId, "antilinktg", false);
          reply("❌ Berhasil menonaktifkan *Anti-Link Telegram* di grup ini");
        } else {
          await reply(
            `Gunakan format perintah yang benar:\n\n` +
              `Contoh: ${prefix + command} on\n` +
              `Contoh: ${prefix + command} off`
          );
        }
      }
      break;

    case "antilinktelegram2":
    case "antilinktg2":
      {
        if (!m.isGroup) return StickGroup();
        if (!isBotAdmins) return StickBotAdmin();
        if (!isAdmins && !OwnerDimz) return StickAdmin();

        const botData = getData(botId, groupId);

        if (argss[0] === "on") {
          if (botData.antilinktg2) return reply("Sudah diaktifkan sebelumnya");

          setData(botId, groupId, "antilinktg2", true);
          reply("✅ Berhasil mengaktifkan *Anti-Link Telegram 2* di grup ini");
        } else if (argss[0] === "off") {
          if (!botData.antilinktg2)
            return reply("Sudah dinonaktifkan sebelumnya");

          setData(botId, groupId, "antilinktg2", false);
          reply("❌ Berhasil menonaktifkan *Anti-Link Telegram 2* di grup ini");
        } else {
          await reply(
            `Gunakan format perintah yang benar:\n\n` +
              `Contoh: ${prefix + command} on\n` +
              `Contoh: ${prefix + command} off`
          );
        }
      }
      break;

    case "antilinktiktok":
    case "antilinktt":
      {
        if (!m.isGroup) return StickGroup();
        if (!isBotAdmins) return StickBotAdmin();
        if (!isAdmins && !OwnerDimz) return StickAdmin();

        const botData = getData(botId, groupId);

        if (argss[0] === "on") {
          if (botData.antilinktiktok)
            return reply("Sudah diaktifkan sebelumnya");

          setData(botId, groupId, "antilinktiktok", true);
          reply("✅ Berhasil mengaktifkan *Anti-Link TikTok* di grup ini");

          await DimzBot.sendMessage(
            from,
            {
              text: `\`\`\`「 ⚠️ Peringatan ⚠️ 」\`\`\`\n\nDilarang mengirim link TikTok di grup ini, yang bandel bakal langsung di-kick.`,
            },
            {
              quoted: fverif,
            }
          );
        } else if (argss[0] === "off") {
          if (!botData.antilinktiktok)
            return reply("Sudah dinonaktifkan sebelumnya");

          setData(botId, groupId, "antilinktiktok", false);
          reply("❌ Berhasil menonaktifkan *Anti-Link TikTok* di grup ini");
        } else {
          await reply(
            `Gunakan format:\n\n` +
              `${prefix + command} on — aktifkan\n` +
              `${prefix + command} off — nonaktifkan`
          );
        }
      }
      break;

    case "antilinktiktok2":
    case "antilinktt2":
      {
        if (!m.isGroup) return StickGroup();
        if (!isBotAdmins) return StickBotAdmin();
        if (!isAdmins && !OwnerDimz) return StickAdmin();

        const botData = getData(botId, groupId);

        if (argss[0] === "on") {
          if (botData.antilinktiktok2)
            return reply("Sudah diaktifkan sebelumnya");

          setData(botId, groupId, "antilinktiktok2", true);
          reply("✅ Berhasil mengaktifkan *Anti-Link TikTok 2* di grup ini");
        } else if (argss[0] === "off") {
          if (!botData.antilinktiktok2)
            return reply("Sudah dinonaktifkan sebelumnya");

          setData(botId, groupId, "antilinktiktok2", false);
          reply("❌ Berhasil menonaktifkan *Anti-Link TikTok 2* di grup ini");
        } else {
          await reply(
            `Gunakan format:\n\n` +
              `${prefix + command} on — aktifkan\n` +
              `${prefix + command} off — nonaktifkan`
          );
        }
      }
      break;

    case "antilinktwitter":
    case "antilinktwt":
    case "antilinktwit":
      {
        if (!m.isGroup) return StickGroup();
        if (!isBotAdmins) return StickBotAdmin();
        if (!isAdmins && !OwnerDimz) return StickAdmin();

        const botData = getData(botId, groupId);

        if (argss[0] === "on") {
          if (botData.antilinktwitter)
            return reply("Sudah diaktifkan sebelumnya");

          setData(botId, groupId, "antilinktwitter", true);
          reply("✅ Berhasil mengaktifkan *Anti-Link Twitter* di grup ini");

          await DimzBot.sendMessage(
            from,
            {
              text: `\`\`\`「 ⚠️ Peringatan ⚠️ 」\`\`\`\n\nLink Twitter/X dilarang dikirim di grup ini.`,
            },
            {
              quoted: fverif,
            }
          );
        } else if (argss[0] === "off") {
          if (!botData.antilinktwitter)
            return reply("Sudah dinonaktifkan sebelumnya");

          setData(botId, groupId, "antilinktwitter", false);
          reply("❌ Berhasil menonaktifkan *Anti-Link Twitter* di grup ini");
        } else {
          await reply(
            `Gunakan format:\n\n` +
              `${prefix + command} on — aktifkan\n` +
              `${prefix + command} off — nonaktifkan`
          );
        }
      }
      break;

    case "antilinktwitter2":
    case "antilinktwt2":
    case "antilinktwit2":
      {
        if (!m.isGroup) return StickGroup();
        if (!isBotAdmins) return StickBotAdmin();
        if (!isAdmins && !OwnerDimz) return StickAdmin();

        const botData = getData(botId, groupId);

        if (argss[0] === "on") {
          if (botData.antilinktwitter2)
            return reply("Sudah diaktifkan sebelumnya");

          setData(botId, groupId, "antilinktwitter2", true);
          reply("✅ Berhasil mengaktifkan *Anti-Link Twitter 2* di grup ini");
        } else if (argss[0] === "off") {
          if (!botData.antilinktwitter2)
            return reply("Sudah dinonaktifkan sebelumnya");

          setData(botId, groupId, "antilinktwitter2", false);
          reply("❌ Berhasil menonaktifkan *Anti-Link Twitter 2* di grup ini");
        } else {
          await reply(
            `Gunakan format:\n\n` +
              `${prefix + command} on — aktifkan\n` +
              `${prefix + command} off — nonaktifkan`
          );
        }
      }
      break;

    case "antilinkall":
      {
        if (!m.isGroup) return StickGroup();
        if (!isBotAdmins) return StickBotAdmin();
        if (!isAdmins && !OwnerDimz) return StickAdmin();

        const botData = getData(botId, groupId);

        if (argss[0] === "on") {
          if (botData.antilinkall) return reply("Sudah diaktifkan sebelumnya");

          setData(botId, groupId, "antilinkall", true);
          reply("✅ Anti-Link All telah diaktifkan di grup ini");
        } else if (argss[0] === "off") {
          if (!botData.antilinkall)
            return reply("Sudah dinonaktifkan sebelumnya");

          setData(botId, groupId, "antilinkall", false);
          reply("❌ Anti-Link All telah dinonaktifkan di grup ini");
        } else {
          await reply(
            `Gunakan format:\n\n${prefix + command} on — aktifkan\n${prefix + command} off — nonaktifkan`
          );
        }
      }
      break;

    case "antilinkall2":
      {
        if (!m.isGroup) return StickGroup();
        if (!isBotAdmins) return StickBotAdmin();
        if (!isAdmins && !OwnerDimz) return StickAdmin();

        const botData = getData(botId, groupId);

        if (argss[0] === "on") {
          if (botData.antilinkall2) return reply("Sudah diaktifkan sebelumnya");

          setData(botId, groupId, "antilinkall2", true);
          reply("✅ Anti-Link All 2 telah diaktifkan di grup ini");
        } else if (argss[0] === "off") {
          if (!botData.antilinkall2)
            return reply("Sudah dinonaktifkan sebelumnya");

          setData(botId, groupId, "antilinkall2", false);
          reply("❌ Anti-Link All 2 telah dinonaktifkan di grup ini");
        } else {
          await reply(
            `Gunakan format:\n\n${prefix + command} on — aktifkan\n${prefix + command} off — nonaktifkan`
          );
        }
      }
      break;
    /*
    case "antipolling":
      {
        if (!m.isGroup) return StickGroup();
        if (!isBotAdmins) return StickBotAdmin();
        if (!isAdmins && !OwnerDimz) return StickAdmin();

        const botData = getData(botId, groupId);

        if (argss[0] === "on") {
          if (botData.antipolling) return reply("Sudah diaktifkan sebelumnya");

          setData(botId, groupId, "antipolling", true);
          reply("✅ Anti-Polling telah diaktifkan di grup ini");

          await DimzBot.sendMessage(
            from,
            {
              text: `\`\`\`「 ⚠️ ANTI POLLING ⚠️ 」\`\`\`\n\nTidak ada yang diperbolehkan membuat polling di grup ini. Pelanggar akan dihapus pesannya 📩`,
            },
            {
              quoted: fverif,
            }
          );
        } else if (argss[0] === "off") {
          if (!botData.antipolling)
            return reply("Sudah dinonaktifkan sebelumnya");

          setData(botId, groupId, "antipolling", false);
          reply("❌ Anti-Polling telah dinonaktifkan di grup ini");
        } else {
          await reply(
            `Gunakan format:\n\n${prefix + command} on — aktifkan\n${prefix + command} off — nonaktifkan`
          );
        }
      }
      break;

    case "antipolling2":
      {
        if (!m.isGroup) return StickGroup();
        if (!isBotAdmins) return StickBotAdmin();
        if (!isAdmins && !OwnerDimz) return StickAdmin();

        const botData = getData(botId, groupId);

        if (argss[0] === "on") {
          if (botData.antipolling2) return reply("Sudah diaktifkan sebelumnya");

          setData(botId, groupId, "antipolling2", true);
          reply("✅ Anti-Polling2 telah diaktifkan di grup ini");

          await DimzBot.sendMessage(
            from,
            {
              text: `\`\`\`「 ⚠️ ANTI POLLING 2 ⚠️ 」\`\`\`\n\nTidak ada yang diperbolehkan membuat polling di grup ini. Pelanggar akan dihapus pesannya 📩`,
            },
            {
              quoted: fverif,
            }
          );
        } else if (argss[0] === "off") {
          if (!botData.antipolling2)
            return reply("Sudah dinonaktifkan sebelumnya");

          setData(botId, groupId, "antipolling2", false);
          reply("❌ Anti-Polling2 telah dinonaktifkan di grup ini");
        } else {
          await reply(
            `Gunakan format:\n\n${prefix + command} on — aktifkan\n${prefix + command} off — nonaktifkan`
          );
        }
      }
      break;
*/
    case "antimedia":
      {
        if (!m.isGroup) return StickGroup();
        if (!isBotAdmins) return StickBotAdmin();
        if (!isAdmins && !OwnerDimz) return StickAdmin();

        const botData = getData(botId, groupId);

        if (argss[0] === "on") {
          if (botData.antimedia) return reply("Sudah diaktifkan sebelumnya");

          setData(botId, groupId, "antimedia", true);
          reply("✅ Anti-Media telah diaktifkan di grup ini");

          await DimzBot.sendMessage(
            from,
            {
              text: `\`\`\`「 ⚠️ ANTI MEDIA ⚠️ 」\`\`\`\n\nTidak ada yang diperbolehkan mengirim media di grup ini. Pelanggar akan dihapus pesannya 📩`,
            },
            {
              quoted: fverif,
            }
          );
        } else if (argss[0] === "off") {
          if (!botData.antimedia)
            return reply("Sudah dinonaktifkan sebelumnya");

          setData(botId, groupId, "antimedia", false);
          reply("❌ Anti-Media telah dinonaktifkan di grup ini");
        } else {
          await reply(
            `Gunakan format:\n\n${prefix + command} on — aktifkan\n${prefix + command} off — nonaktifkan`
          );
        }
      }
      break;

    case "antimedia2":
      {
        if (!m.isGroup) return StickGroup();
        if (!isBotAdmins) return StickBotAdmin();
        if (!isAdmins && !OwnerDimz) return StickAdmin();

        const botData = getData(botId, groupId);

        if (argss[0] === "on") {
          if (botData.antimedia2) return reply("Sudah diaktifkan sebelumnya");

          setData(botId, groupId, "antimedia2", true);
          reply("✅ Anti-Media 2 telah diaktifkan di grup ini");

          await DimzBot.sendMessage(
            from,
            {
              text: `\`\`\`「 ⚠️ ANTI MEDIA 2 ⚠️ 」\`\`\`\n\nTidak ada yang diperbolehkan mengirim media di grup ini. Pelanggar akan dihapus pesannya 📩`,
            },
            {
              quoted: fverif,
            }
          );
        } else if (argss[0] === "off") {
          if (!botData.antimedia2)
            return reply("Sudah dinonaktifkan sebelumnya");

          setData(botId, groupId, "antimedia2", false);
          reply("❌ Anti-Media 2 telah dinonaktifkan di grup ini");
        } else {
          await reply(
            `Gunakan format:\n\n${prefix + command} on — aktifkan\n${prefix + command} off — nonaktifkan`
          );
        }
      }
      break;

    case "antipromosi":
      {
        if (!m.isGroup) return StickGroup();
        if (!isBotAdmins) return StickBotAdmin();
        if (!isAdmins && !OwnerDimz) return StickAdmin();

        const botData = getData(botId, groupId);

        if (argss[0] === "on") {
          if (botData.antipromosi) return reply("Sudah diaktifkan sebelumnya");

          setData(botId, groupId, "antipromosi", true);
          reply("✅ Anti-Promosi telah diaktifkan di grup ini");

          await DimzBot.sendMessage(
            from,
            {
              text: `\`\`\`「 ⚠️ ANTI PROMOSI ⚠️ 」\`\`\`\n\nTidak ada yang diperbolehkan promosi di grup ini. Pelanggar akan pesannya dihapus 📩`,
            },
            {
              quoted: fverif,
            }
          );
        } else if (argss[0] === "off") {
          if (!botData.antipromosi)
            return reply("Sudah dinonaktifkan sebelumnya");

          setData(botId, groupId, "antipromosi", false);
          reply("❌ Anti-Promosi telah dinonaktifkan di grup ini");
        } else {
          await reply(
            `Gunakan format:\n\n${prefix + command} on — aktifkan\n${prefix + command} off — nonaktifkan`
          );
        }
      }
      break;

    case "antitoxic":
    case "antibadword":
      {
        if (!m.isGroup) return StickGroup();
        if (!isBotAdmins) return StickBotAdmin();
        if (!isAdmins && !OwnerDimz) return StickAdmin();

        const botData = getData(botId, groupId);

        if (argss[0] === "on") {
          if (botData.antitoxic) return reply("Sudah diaktifkan sebelumnya");

          setData(botId, groupId, "antitoxic", true);
          reply("✅ Anti-Toxic telah diaktifkan di grup ini");
        } else if (argss[0] === "off") {
          if (!botData.antitoxic)
            return reply("Sudah dinonaktifkan sebelumnya");

          setData(botId, groupId, "antitoxic", false);
          reply("❌ Anti-Toxic telah dinonaktifkan di grup ini");
        } else {
          await reply(
            `Gunakan format:\n\n${prefix + command} on — aktifkan\n${prefix + command} off — nonaktifkan`
          );
        }
      }
      break;

    case "antitoxic2":
    case "antibadword2":
      {
        if (!m.isGroup) return StickGroup();
        if (!isBotAdmins) return StickBotAdmin();
        if (!isAdmins && !OwnerDimz) return StickAdmin();

        const botData = getData(botId, groupId);

        if (argss[0] === "on") {
          if (botData.antitoxic2) return reply("Sudah diaktifkan sebelumnya");

          setData(botId, groupId, "antitoxic2", true);
          reply("✅ Anti-Toxic 2 telah diaktifkan di grup ini");
        } else if (argss[0] === "off") {
          if (!botData.antitoxic2)
            return reply("Sudah dinonaktifkan sebelumnya");

          setData(botId, groupId, "antitoxic2", false);
          reply("❌ Anti-Toxic 2 telah dinonaktifkan di grup ini");
        } else {
          await reply(
            `Gunakan format:\n\n${prefix + command} on — aktifkan\n${prefix + command} off — nonaktifkan`
          );
        }
      }
      break;

    case "antilinkgc":
      {
        if (!m.isGroup) return StickGroup();
        if (!isBotAdmins) return StickBotAdmin();
        if (!isAdmins && !OwnerDimz) return StickAdmin();

        const botData = getData(botId, groupId);

        if (argss[0] === "on") {
          if (botData.antilinkgc)
            return reply("⚠️ AntilinkGC sudah aktif sebelumnya.");

          setData(botId, groupId, "antilinkgc", true);
          reply("✅ AntilinkGC berhasil diaktifkan di grup ini.");
        } else if (argss[0] === "off") {
          if (!botData.antilinkgc)
            return reply("⚠️ AntilinkGC sudah nonaktif sebelumnya.");

          setData(botId, groupId, "antilinkgc", false);
          reply("❎ AntilinkGC berhasil dimatikan di grup ini.");
        } else {
          await reply(
            `Gunakan format:\n\n${prefix + command} on → aktifkan\n${prefix + command} off → nonaktifkan`
          );
        }
      }
      break;

    case "antilinkgc2":
      {
        if (!m.isGroup) return StickGroup();
        if (!isBotAdmins) return StickBotAdmin();
        if (!isAdmins && !OwnerDimz) return StickAdmin();

        const botData = getData(botId, groupId);

        if (argss[0] === "on") {
          if (botData.antilinkgc2)
            return reply("⚠️ AntilinkGC2 sudah aktif sebelumnya.");

          setData(botId, groupId, "antilinkgc2", true);
          reply("✅ AntilinkGC2 berhasil diaktifkan di grup ini.");
        } else if (argss[0] === "off") {
          if (!botData.antilinkgc2)
            return reply("⚠️ AntilinkGC2 sudah nonaktif sebelumnya.");

          setData(botId, groupId, "antilinkgc2", false);
          reply("❎ AntilinkGC2 berhasil dimatikan di grup ini.");
        } else {
          await reply(
            `Gunakan format:\n\n${prefix + command} on → aktifkan\n${prefix + command} off → nonaktifkan`
          );
        }
      }
      break;

    case "antitagsw":
      {
        if (!m.isGroup) return StickGroup();
        if (!isBotAdmins) return StickBotAdmin();
        if (!isAdmins && !OwnerDimz) return StickAdmin();
        if (argss[0] === "on" || argss[0] === "kick") {
          if (argss[0] === "kick" ? antitagsw[from] === "kick" : Antitagsw)
            return reply("Sudah aktif");

          antitagsw[from] = argss[0] === "kick" ? "kick" : true;
          fs.writeFileSync(
            "./database/antitagsw.json",
            JSON.stringify(antitagsw)
          );
          await reply("Berhasil mengaktifkan antitagsw");

          //          await DimzBot.sendMessage(
          //            from,
          //            {
          //              text: `\`\`\`「 ⚠️Warning⚠️ 」\`\`\`\n\nNobody is allowed to send group link in this group, one who sends will be kicked immediately!`,
          //            },
          //            {
          //              quoted: fverif,
          //            },
          //          );
        } else if (argss[0] === "off") {
          if (!Antitagsw) return reply("Sudah dinonaktifkan");

          delete antitagsw[from];
          fs.writeFileSync(
            "./database/antitagsw.json",
            JSON.stringify(antitagsw)
          );
          await reply("Berhasil menonaktifkan antitagsw.");
        } else {
          await reply(`
Masukkan opsi!

*${prefix}${command} opsi*
* on — Mengaktifkan antitagsw.
* off — Menonaktifkan antitagsw.
* kick — Mengaktifkan antitagsw (otomatis kick)

*${prefix}${command} on*
> _default tidak di kick, hanya delete pesan_

*${prefix}${command} off*
> _untuk menonaktifkan_

*${prefix}${command} kick*
> _otomatis delete + kick_
`);
        }
      }
      break;

    case "antisaluran":
      {
        if (!m.isGroup) return StickGroup();
        if (!isBotAdmins) return StickBotAdmin();
        if (!isAdmins && !OwnerDimz) return StickAdmin();

        const botData = getData(botId, groupId);

        if (argss[0] === "on") {
          if (botData.antisaluran)
            return reply("⚠️ Antisaluran sudah aktif sebelumnya.");

          setData(botId, groupId, "antisaluran", true);
          reply("✅ Antisaluran berhasil diaktifkan di grup ini.");
        } else if (argss[0] === "off") {
          if (!botData.antisaluran)
            return reply("⚠️ Antisaluran sudah nonaktif sebelumnya.");

          setData(botId, groupId, "antisaluran", false);
          reply("❎ Antisaluran berhasil dimatikan di grup ini.");
        } else {
          await reply(
            `Gunakan format:\n\n${prefix + command} on → aktifkan\n${prefix + command} off → nonaktifkan`
          );
        }
      }
      break;

    case "antisaluran2":
      {
        if (!m.isGroup) return StickGroup();
        if (!isBotAdmins) return StickBotAdmin();
        if (!isAdmins && !OwnerDimz) return StickAdmin();

        const botData = getData(botId, groupId);

        if (argss[0] === "on") {
          if (botData.antisaluran2)
            return reply("⚠️ Antisaluran2 sudah aktif sebelumnya.");

          setData(botId, groupId, "antisaluran2", true);
          reply("✅ Antisaluran2 berhasil diaktifkan di grup ini.");
        } else if (argss[0] === "off") {
          if (!botData.antisaluran2)
            return reply("⚠️ Antisaluran2 sudah nonaktif sebelumnya.");

          setData(botId, groupId, "antisaluran2", false);
          reply("❎ Antisaluran2 berhasil dimatikan di grup ini.");
        } else {
          await reply(
            `Gunakan format:\n\n${prefix + command} on → aktifkan\n${prefix + command} off → nonaktifkan`
          );
        }
      }
      break;

    case "antilinkwame":
      {
        if (!m.isGroup) return StickGroup();
        if (!isBotAdmins) return StickBotAdmin();
        if (!isAdmins && !OwnerDimz) return StickAdmin();

        const botData = getData(botId, groupId);

        if (argss[0] === "on") {
          if (botData.antilinkwame)
            return reply("⚠️ Antilink wa.me sudah aktif sebelumnya.");

          setData(botId, groupId, "antilinkwame", true);
          reply("✅ Antilink wa.me berhasil diaktifkan di grup ini.");
        } else if (argss[0] === "off") {
          if (!botData.antilinkwame)
            return reply("⚠️ Antilink wa.me sudah nonaktif sebelumnya.");

          setData(botId, groupId, "antilinkwame", false);
          reply("❎ Antilink wa.me berhasil dimatikan di grup ini.");
        } else {
          await reply(
            `Gunakan format:\n\n${prefix + command} on → aktifkan\n${prefix + command} off → nonaktifkan`
          );
        }
      }
      break;

    case "antilinkwame2":
      {
        if (!m.isGroup) return StickGroup();
        if (!isBotAdmins) return StickBotAdmin();
        if (!isAdmins && !OwnerDimz) return StickAdmin();

        const botData = getData(botId, groupId);

        if (argss[0] === "on") {
          if (botData.antilinkwame2)
            return reply("⚠️ Antilink wa.me2 sudah aktif sebelumnya.");

          setData(botId, groupId, "antilinkwame2", true);
          reply("✅ Antilink wa.me2 berhasil diaktifkan di grup ini.");
        } else if (argss[0] === "off") {
          if (!botData.antilinkwame2)
            return reply("⚠️ Antilink wa.me2 sudah nonaktif sebelumnya.");

          setData(botId, groupId, "antilinkwame2", false);
          reply("❎ Antilink wa.me2 berhasil dimatikan di grup ini.");
        } else {
          await reply(
            `Gunakan format:\n\n${prefix + command} on → aktifkan\n${prefix + command} off → nonaktifkan`
          );
        }
      }
      break;

    case "kick":
    case "🚯":
    case "dor":
      {
        if (!m.isGroup) return StickGroup();
        if (!isAdmins && !OwnerDimz) return StickAdmin();
        if (!isBotAdmins) return StickBotAdmin();

        let users =
          m.mentionedJid && m.mentionedJid[0]
            ? m.mentionedJid[0]
            : m.quoted
              ? m.quoted.sender
              : text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

        const ownerNumber = ["6289603732786@s.whatsapp.net"];
        if (ownerNumber.includes(users)) {
          return reply(`⚠️ Ngapain Mau Kick Owner?`);
        }

        await DimzBot.groupParticipantsUpdate(m.chat, [users], "remove");
        await reply(`Sukses Kick Member Tolol Dan Beban`);
      }
      break;

    case "antiswgc":
    case "antiswgc2":
      {
        if (!m.isGroup) return StickGroup();
        if (!isAdmins && !OwnerDimz) return StickAdmin();

        const opt = (argss[0] || "").toLowerCase();
        if (!["on", "off"].includes(opt)) {
          return reply(
            `❌ Gunakan dengan benar:\n\n${prefix + command} on/off\n${prefix}antiswgc2 on/off`
          );
        }

        const prevMode = antiswgc[m.chat] || "off";

        if (opt === "off") {
          if (prevMode === "off") {
            return reply(`ℹ️ Antiswgc sudah nonaktif sebelumnya di grup ini.`);
          }
          delete antiswgc[m.chat];
          saveAntiswgc();
          return reply(`🚫 Antiswgc dimatikan di grup ini.`);
        }

        if (command === "antiswgc") {
          if (prevMode === "kick") {
            return reply(
              `ℹ️ Antiswgc sudah aktif sebelumnya dengan mode: *hapus + kick* 🚫`
            );
          }
          antiswgc[m.chat] = "kick";
          saveAntiswgc();
          return reply(`✅ Antiswgc diaktifkan dengan mode: *hapus + kick* 🚫`);
        } else if (command === "antiswgc2") {
          if (prevMode === "delete") {
            return reply(
              `ℹ️ Antiswgc sudah aktif sebelumnya dengan mode: *hapus saja* ⚠️`
            );
          }
          antiswgc[m.chat] = "delete";
          saveAntiswgc();
          return reply(`✅ Antiswgc diaktifkan dengan mode: *hapus saja* ⚠️`);
        }
      }
      break;

    case "anticallgc":
      {
        if (!m.isGroup) return StickGroup();
        if (!isAdmins && !OwnerDimz) return StickAdmin();
        if (!isBotAdmins) return StickBotAdmin();

        const group = getData(botId, m.chat);
        const opt = (argss[0] || "").toLowerCase();
        if (!["on", "off"].includes(opt)) {
          return reply(`❌ Gunakan dengan cara:\n\n${prefix + command} on/off`);
        }

        const prevMode = !!group.anticallgc;
        if (opt === "off") {
          if (prevMode === false) {
            return reply(
              `ℹ️ Anticallgc sudah nonaktif sebelumnya di grup ini.`
            );
          }
          setData(botId, m.chat, "anticallgc", false);
          return reply(`🚫 Anticallgc di-matikan di grup ini.`);
        }

        if (prevMode === true) {
          return reply(`ℹ️ Anticallgc sudah aktif sebelumnya 🚫`);
        }
        setData(botId, m.chat, "anticallgc", true);
        return reply(`✅ Anticallgc di-aktifkan`);
      }
      break;

    case "intro":
      {
        if (!m.isGroup) return StickGroup();

        let db_intro = JSON.parse(fs.readFileSync("./database/setintro.json"));

        if (!db_intro[m.chat] || !db_intro[m.chat].text) {
          return await DimzBot.sendMessage(
            m.chat,
            {
              text: "0ཻུ۪۪ꦽꦼ̷⸙‹•══════════════♡᭄\n│       *「 Kartu Intro 」*\n│ *Nama     :* \n│ *Gender   :* \n│ *Umur      :* \n│ *Hobby    :* \n│ *Kelas      :* \n│ *Asal         :* \n |  *Status     :* \n╰═════ꪶ ཻུ۪۪ꦽꦼ̷⸙ ━ ━ ━ ━ ꪶ ཻུ۪۪ꦽꦼ̷⸙",
            },
            {
              quoted: fakeintro,
            }
          );
        }

        return await DimzBot.sendMessage(
          m.chat,
          {
            text: `${db_intro[m.chat].text}`,
          },
          {
            quoted: m,
          }
        );
      }
      break;

    case "ping":
      {
        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "⏳",
            key: m.key,
          },
        });

        function getCpuModel() {
          try {
            const cpus = os.cpus();
            if (
              cpus &&
              cpus[0] &&
              cpus[0].model &&
              cpus[0].model.trim() !== "" &&
              cpus[0].model !== "unknown"
            ) {
              return cpus[0].model.trim();
            }
            const cpuinfo = fs.readFileSync("/proc/cpuinfo", "utf8");
            const match = cpuinfo.match(/model name\s+:\s+(.+)/);
            if (match && match[1] && match[1].trim() !== "") {
              return match[1].trim();
            }
            const { execSync } = require("child_process");
            const lscpu = execSync(
              "lscpu | grep 'Model name' | awk -F ':' '{print $2}'",
              {
                encoding: "utf8",
              }
            );
            return lscpu.trim() || "Undefined";
          } catch {
            return "Undefined";
          }
        }

        const used = process.memoryUsage();
        const cpus = os.cpus
          ? os.cpus().map((cpu) => {
              cpu.total = Object.keys(cpu.times).reduce(
                (last, type) => last + cpu.times[type],
                0
              );
              return cpu;
            })
          : null;

        const cpu = cpus
          ? cpus.reduce(
              (last, cpu, _, { length }) => {
                last.total += cpu.total;
                last.speed += cpu.speed / length;
                last.times.user += cpu.times.user;
                last.times.nice += cpu.times.nice;
                last.times.sys += cpu.times.sys;
                last.times.idle += cpu.times.idle;
                last.times.irq += cpu.times.irq;
                return last;
              },
              {
                speed: 0,
                total: 0,
                times: {
                  user: 0,
                  nice: 0,
                  sys: 0,
                  idle: 0,
                  irq: 0,
                },
              }
            )
          : null;

        const suhu = await si.cpuTemperature();
        const suhuCPU =
          suhu.main !== -1 ? `${suhu.main}°C` : "Sensor tidak tersedia";
        const net = await si.networkStats();
        const upload = (net[0].tx_bytes / 1024 / 1024).toFixed(2);
        const download = (net[0].rx_bytes / 1024 / 1024).toFixed(2);

        let timestamp = speed();
        let latensi = speed() - timestamp;
        neww = performance.now();
        oldd = performance.now();

        const serverUptime = formatUptime(os.uptime());
        const botUptime = formatUptime(process.uptime());
        const serverInfo = await getServerLocation();

        const respon = `*Respon dari* @${m.sender.split("@")[0]}

*_⏳ Response Speed:_* ${latensi.toFixed(4)} seconds
${(oldd - neww).toFixed(4)} milliseconds

> *🔄 Bot Uptime:* ${botUptime}
> *🖥️ Server Uptime:* ${serverUptime}

\`💻 Info Server\`
- *OS Type:* ${os.type() || "Undefined"}
- *OS Platform:* ${os.platform() || "Undefined"}
- *OS Release:* ${os.release() || "Undefined"}
- *Architecture:* ${os.arch() || "Undefined"}
- *Hostname:* ${os.hostname() || "Undefined"}
- *Ram:* ${formatp(os.totalmem() - os.freemem())} / ${formatp(os.totalmem())}
- *Total RAM:* ${formatp(os.totalmem())}
- *Free RAM:* ${formatp(os.freemem())}
- *CPU Model:* ${getCpuModel()}
- *CPU Speed:* ${cpu ? cpu.speed : "Undefined"} MHz
- *CPU Core:* ${cpus ? cpus.length : "Undefined"}
- *Suhu CPU:* ${suhuCPU}
- *Upload:* ${upload} MB
- *Download:* ${download} MB
- *Node Version:* ${process.version}

\`🌐 Lokasi Server:\`
${
  serverInfo
    ? `
> _Negara:_ ${serverInfo.country}
> _Kota:_ ${serverInfo.city}
> _ISP:_ ${serverInfo.isp}
> _Zona Waktu:_ ${serverInfo.timezone}
`
    : "Unknown"
}

\`NodeJS Memory Usage\`
${Object.keys(used)
  .map(
    (key, _, arr) =>
      `${key.padEnd(Math.max(...arr.map((v) => v.length)), " ")}: ${formatp(used[key])}`
  )
  .join("\n")}

${
  cpus && cpus[0]
    ? `_Total Penggunaan CPU_
${getCpuModel()} (${cpu.speed} MHZ)\n${Object.keys(cpu.times)
        .map(
          (type) =>
            `- ${(type + "").padEnd(6)}: ${(
              (100 * cpu.times[type]) /
              cpu.total
            ).toFixed(2)}%`
        )
        .join("\n")}
_CPU Core(s) Usage (${cpus.length} Core CPU)_
${cpus
  .map(
    (cpu, i) =>
      `${i + 1}. ${getCpuModel()} (${cpu.speed} MHZ)\n${Object.keys(cpu.times)
        .map(
          (type) =>
            `- ${(type + "").padEnd(6)}: ${(
              (100 * cpu.times[type]) /
              cpu.total
            ).toFixed(2)}%`
        )
        .join("\n")}`
  )
  .join("\n\n")}`
    : ""
}
`.trim();

        await DimzBot.sendMessage(
          m.chat,
          {
            text: respon,
            contextInfo: {
              forwardingScore: 9999,
              isForwarded: false,
              mentionedJid: [m.sender, creator2, "0@s.whatsapp.net"],
              externalAdReply: {
                renderLargerThumbnail: true,
                title: botName,
                body: `⏰ Time Now ${moment.tz("Asia/Jakarta").format("HH : mm : ss")}`,
                containsAutoReply: true,
                mediaType: 1,
                thumbnail: fs.readFileSync(global.thumbnail),
                mediaUrl: wagc,
                sourceUrl: `${channel}?t=${Date.now()}`,
              },
            },
          },
          {
            quoted: m,
          }
        );

        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "",
            key: m.key,
          },
        });
      }
      break;

    // fitur stiker
    case "tpp": {
  if (!hasLimit(botId, m.sender)) return reply(mess.limit0)
  if (!text) return reply(`❌ Contoh:\n${prefix + command} Woy Yanto`)

  await DimzBot.sendMessage(m.chat, {
    react: { text: "🎨", key: m.key }
  })

  try {
    const { agent } = getRandomProxyAgent()

    const url =
      "https://anabot.my.id/api/maker/ttp" +
      `?text=${encodeURIComponent(text)}` +
      `&apikey=freeApikey`

    const res = await axios.get(url, {
      httpsAgent: agent, proxy: false,
      responseType: "arraybuffer",
      timeout: 30000
    })

    await DimzBot.sendImageAsSticker(
      m.chat,
      Buffer.from(res.data),
      m,
      {
        packname: stikerpack,
        author: stikerauth
      }
    )

    await DimzBot.sendMessage(m.chat, {
      react: { text: "✅", key: m.key }
    })

    reduceLimit(botId, m.sender)

  } catch (e) {
    console.error("TPP ERROR:", e)
    reply("❌ Gagal membuat stiker TTP")
  }
}
break;

    case "emojimix":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);
        let [emoji1, emoji2] = text.split`+`;
        if (!emoji1) return reply(`Contoh : ${prefix + command} 😅+🤔`);
        if (!emoji2) return reply(`Contoh : ${prefix + command} 😅+🤔`);
        let anumojimix = await fetchJson(
          `https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(
            emoji1
          )}_${encodeURIComponent(emoji2)}`
        );
        for (let res of anumojimix.results) {
          let encmedia = await DimzBot.sendImageAsSticker(m.chat, res.url, m, {
            packname: stikerpack,
            author: stikerauth,
            categories: res.tags,
          });
        }
        reduceLimit(botId, m.sender);
      }
      break;

    case "emojimix2":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);
        if (!text) return fakestatus(`Contoh : ${prefix + command} 😅`);
        let anu = await fetchJson(
          `https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(text)}`
        );
        for (let res of anu.results) {
          let encmedia = await DimzBot.sendImageAsSticker(from, res.url, m, {
            packname: global.packname,
            author: global.author,
            categories: res.tags,
          });
          await fs.unlinkSync(encmedia);
        }
        reduceLimit(botId, m.sender);
      }
      break;

    case "smeme":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);
        {
          if (!/image/.test(quoted.mtype))
            return reply(
              `Send/Reply Foto Dengan Caption ${prefix + command} *text1|text2*`
            );
          if (!/image/.test(quoted.mtype))
            return reply(
              `Send/Reply Foto Dengan Caption ${prefix + command} *text1|text2*`
            );
          await DimzBot.sendMessage(m.chat, {
            react: {
              text: "👁‍🗨",
              key: m.key,
            },
          });
          atas = text.split("|")[0] ? text.split("|")[0] : "-";
          bawah = text.split("|")[1] ? text.split("|")[1] : "-";
          mee = await DimzBot.downloadAndSaveMediaMessage(quoted);
          mem = await drizzup(mee);
          let { data } = await require("axios").get(
            `https://api.memegen.link/images/custom/${encodeURIComponent(atas)}/${encodeURIComponent(bawah)}.png?background=${mem}`,
            {
              responseType: "arraybuffer",
            }
          );

          stiker = await sticker(
            Buffer.from(data),
            false,
            stikerpack,
            stikerauth
          );

          await DimzBot.sendMessage(
            m.chat,
            {
              sticker: stiker,
            },
            {
              quoted: m,
            }
          );
        }
        reduceLimit(botId, m.sender);
      }
      break;

    case "s":
    case "sticker":
    case "stiker":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);
        if (!quoted)
          return reply(
            `Send/Reply Foto/Video/Gif Dengan Caption ${
              prefix + command
            }\nDurasi Video Maksimal 1-9 Detik`
          );

        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "👁‍🗨",
            key: m.key,
          },
        });

        if (/image/.test(mime)) {
          let media = await quoted.download();
          await DimzBot.sendImageAsSticker(m.chat, media, m, {
            packname: stikerpack,
            author: stikerauth,
          });
        } else if (mime === "image/webp") {
          let media = await quoted.download();
          await DimzBot.sendImageAsSticker(m.chat, media, m, {
            packname: stikerpack,
            author: stikerauth,
          });
        } else if (/video/.test(mime)) {
          if ((quoted.msg || quoted).seconds > 11)
            return reply(
              `Send/Reply Foto/Video/Gif Dengan Caption ${prefix + command}\nDurasi Video Maksimal 1-9 Detik`
            );

          let media = await quoted.download();
          await DimzBot.sendVideoAsSticker(m.chat, media, m, {
            packname: stikerpack,
            author: stikerauth,
            contextInfo: {
              forwardingScore: 1,
              isForwarded: true,
              businessMessageForwardInfo: {
                businessOwnerJid: nobisnis,
              },
              mentionedJid: [m.sender, creator2, "0@s.whatsapp.net"],
              externalAdReply: {
                renderLargerThumbnail: false,
                title: botName,
                body: `Jangan Lupa Jadibot Gratis🗿`,
                mediaType: 1,
                thumbnail: fs.readFileSync("./Media2/theme/thumb.jpg"),
                sourceUrl: wagc,
              },
            },
          });
        } else {
          return reply(
            `Send/Reply Foto/Video/Gif Dengan Caption ${
              prefix + command
            }\nDurasi Video Maksimal 1-9 Detik`
          );
        }

        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "",
            key: m.key,
          },
        });
        reduceLimit(botId, m.sender);
      }
      break;

    case "swm":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);
        if (!text)
          return reply(
            `Send/Reply/Stiker Atau Foto Dengan Caption\n${
              prefix + command
            } Bot By|${botName}`
          );
        let stiker = false;
        const wm = argss
          .join(" ")
          .split("|")
          .map((v) => v.trim());
        if (!argss.join(" ")) return reply(`Text Nya Mana?`);
        const swn = argss.join(" ");
        const pcknm = swn.split("|")[0];
        const atnm = swn.split("|")[1];
        const q = m.quoted ? m.quoted : m;
        const mime =
          (
            q.msg ||
            (q.vM || q)?.message?.documentWithCaptionMessage?.message?.[
              Object.keys(
                (q.vM || q)?.message?.documentWithCaptionMessage?.message || {}
              )[0]
            ] ||
            q
          ).mimetype ||
          q.mediaType ||
          "";
        if (q.sender !== m.sender && /^viewOnce/.test(q.mtype))
          return await reply(
            "Karena masalah privasi, hanya pengirim pesan itu yg dapat menjadikannya stiker!"
          );
        if (/video/g.test(mime) && (q.msg || q).seconds > 11)
          return reply("Maksimal 10 detik!");
        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "👁‍🗨",
            key: m.key,
          },
        });
        try {
          if (/webp|image|video/g.test(mime)) {
            const img = await q.download?.();
            try {
              if (/webp/g.test(mime))
                stiker = await addExif(img, wm[0] || pcknm, wm[1] || atnm);
              if (!stiker)
                stiker = await sticker(
                  img,
                  false,
                  wm[0] || pcknm,
                  wm[1] || atnm
                );
            } catch (e) {
            } finally {
              if (!stiker)
                stiker = await sticker(
                  img,
                  false,
                  wm[0] || pcknm,
                  wm[1] || atnm
                );
            }
          } else if (argss[0]) {
            if (isUrl(argss[0]))
              stiker = await sticker(false, argss[0], pcknm, atnm);
            else return reply("URL tidak valid!");
          }
        } catch (e) {
          if (!stiker) stiker = e;
        } finally {
          if (!Buffer.isBuffer(stiker)) {
            await reply("Error!");
          } else {
            await DimzBot.sendMessage(
              m.chat,
              {
                sticker: stiker,
              },
              {
                quoted: m,
              }
            );
          }
        }
        reduceLimit(botId, m.sender);
      }
      break;

    // fitur owner
    case "autoreadsw":
      {
        if (!OwnerDimz) return reply(mess.mowner);

        const current = getData(botId, "global").autoreadsw ?? false;
        const status = argss[0]?.toLowerCase();
        if (status !== "on" && status !== "off") {
          return reply(
            `Penggunaan: ${prefix + command} on/off\nSaat ini status AutoReadSW sedang ${current ? "aktif" : "nonaktif"}.`
          );
        }

        const _new = status === "on";
        if (current === _new) {
          return reply(
            `AutoReadSW sudah ${_new ? "aktif" : "nonaktif"} sebelumnya`
          );
        }

        setData(botId, "global", "autoreadsw", _new);
        await reply(`AutoReadSW sudah di${_new ? "aktif" : "nonaktif"}kan`);
      }
      break;

    case "autoreactsw":
      {
        if (!OwnerDimz) return reply(mess.mowner);

        const current = getData(botId, "global").autoreactsw ?? false;
        let react = argss[0]?.toLowerCase();
        if (!react) {
          return reply(
            `Penggunaan: ${prefix + command} off/1 emoji apapun\nMisalnya:\n* ${prefix + command} off\n* ${prefix + command} 👍`
          );
        }

        react = react === "off" ? false : react;
        if (current === react) {
          return reply(
            `AutoReactSW sudah ${react ? "menggunakan emoji tersebut" : "nonaktif"} sebelumnya.`
          );
        }

        setData(botId, "global", "autoreactsw", react);
        await reply(
          `AutoReactSW sudah di${react ? "aktif" : "nonaktif"}kan.${react ? " Emoji yang digunakan: " + react : ""}`
        );
      }
      break;

    case "jpm-ht":
    case "jpm-hidetag":
      {
        if (!OwnerDimz) return reply(mess.mowner);

        const fullText = m.text || m.message?.conversation || "";
        const cmdText = fullText.slice((prefix + command).length).trim();

        const quoted = m.quoted || null;
        const isMedia =
          quoted && /image|video|audio|document/.test(quoted.mtype || "");

        if (!cmdText && !isMedia)
          return reply(
            `❌ *Format Salah!*

📢 *Cara Pakai:*
• ${prefix + command} Halo semua 👋
• ${prefix + command} Halo @628xxxxxxxx
• ${prefix + command} (reply media)

📌 *Catatan:*
• Bisa teks / reply media
• Caption bisa dari teks / media

📌 *Catatan Mention:*
• Gunakan format @62xxxxxxx
• Bisa lebih dari satu mention
• Contoh: @628123456789
• Contohnya: ${prefix + command} Hubungi @628123456789

⚠️ *PERINGATAN*
Broadcast ke SEMUA grup
Delay 30 detik / grup
Resiko ditanggung pengguna`
          );

        const delay = (ms) => new Promise((res) => setTimeout(res, ms));
        const groups = Object.values(
          await DimzBot.groupFetchAllParticipating()
        ).map((v) => v.id);
        const inputMentions = extractMentions(cmdText);

        let sukses = 0,
          gagal = 0;

        reply(
          `⚠️ *PERINGATAN RESIKO JPM*

• Broadcast ke *SEMUA GRUP*
• Delay: *30 detik / grup*
• Resiko BAN / LIMIT WhatsApp

📦 Total grup: ${groups.length}
🚀 Proses JPM-HIDETAG dimulai...`
        );

        for (const gid of groups) {
          try {
            const meta = await DimzBot.groupMetadata(gid);
            const members = meta.participants.map((p) => p.id);
            const allMentions = [...new Set([...members, ...inputMentions])];

            let sendObj = {
              mentions: allMentions,
              contextInfo: {
                mentionedJid: allMentions,
                externalAdReply: {
                  title: `📣 ${botName}`,
                  body: `⏰ ${moment.tz("Asia/Jakarta").format("HH:mm:ss")}`,
                  thumbnail: fs.readFileSync(global.thumbnail),
                  mediaType: 1,
                  renderLargerThumbnail: true,
                  sourceUrl: "https://softbotz.my.id",
                },
              },
            };

            // ===== MEDIA HANDLER =====
            if (isMedia) {
              const mediaCaption =
                cmdText || quoted.text || quoted.caption || "";

              if (/image/.test(quoted.mtype)) {
                sendObj.image = await quoted.download();
                sendObj.caption = mediaCaption;
              } else if (/video/.test(quoted.mtype)) {
                sendObj.video = await quoted.download();
                sendObj.caption = mediaCaption;
              } else if (/document/.test(quoted.mtype)) {
                sendObj.document = await quoted.download();
                sendObj.mimetype = quoted.mimetype;
                sendObj.fileName = quoted.fileName || "document";
                if (mediaCaption) sendObj.caption = mediaCaption;
              } else if (/audio/.test(quoted.mtype)) {
                sendObj.audio = await quoted.download();
                sendObj.mimetype = quoted.mimetype || "audio/mpeg";
                sendObj.ptt = false;
                sendObj.contextInfo.externalAdReply = {
                  title: botName,
                  body: `⏰ ${moment.tz("Asia/Jakarta").format("HH:mm:ss")}`,
                  thumbnail: fs.readFileSync(global.thumbnail),
                  mediaType: 2,
                  renderLargerThumbnail: false,
                };
              }
            }
            // ===== TEXT ONLY =====
            else {
              sendObj.text = cmdText;
            }

            await DimzBot.sendMessage(gid, sendObj, { quoted: fmeta });

            sukses++;
            await delay(30000);
          } catch (e) {
            gagal++;
          }
        }

        reply(
          `✅ JPM Hidetag selesai

✔️ Berhasil: ${sukses}
❌ Gagal: ${gagal}`
        );
      }
      break;

    case "jpm":
      {
        if (!OwnerDimz) return reply(mess.mowner);

        const fullText = m.text || m.message?.conversation || "";
        const isiCmd = fullText.slice((prefix + command).length).trim();

        const isQuoted = !!m.quoted;
        const mime = isQuoted ? m.quoted.mimetype || "" : "";
        const inputMentions = extractMentions(isiCmd);

        if (!isiCmd && !isQuoted) {
          return reply(
            `❌ *Format Salah!*

📢 *Cara Pakai:*
• ${prefix + command} Halo semua 👋
• ${prefix + command} Halo @628xxxxxxxx
• ${prefix + command} (reply media)

📌 *Catatan:*
• Bisa teks / reply media
• Caption bisa dari teks / media

📌 *Catatan Mention:*
• Gunakan format @62xxxxxxx
• Bisa lebih dari satu mention
• Contoh: @628123456789
• Contohnya: ${prefix + command} Hubungi @628123456789

⚠️ *PERINGATAN*
Broadcast ke SEMUA grup
Delay 30 detik / grup
Resiko ditanggung pengguna`
          );
        }

        const delay = (ms) => new Promise((res) => setTimeout(res, ms));
        const groups = Object.values(
          await DimzBot.groupFetchAllParticipating()
        ).map((v) => v.id);

        reply(
          `⚠️ *PERINGATAN RESIKO JPM*

• Broadcast ke *SEMUA GRUP*
• Delay: *30 detik / grup*
• Resiko BAN / LIMIT WhatsApp

📦 Total grup: ${groups.length}
🚀 Proses JPM dimulai...`
        );

        let sukses = 0;
        let gagal = 0;

        let mediaBuffer = null;
        if (isQuoted && !/text/.test(mime)) {
          mediaBuffer = await m.quoted.download();
        }

        for (const gid of groups) {
          try {
            let sendObj = {};
            let captionFinal = isiCmd;

            // ===== IMAGE =====
            if (/image/.test(mime)) {
              captionFinal = isiCmd || m.quoted.caption || "";
              sendObj = {
                image: mediaBuffer,
                caption: captionFinal,
                mentions: inputMentions,
              };
            }

            // ===== VIDEO =====
            else if (/video/.test(mime)) {
              captionFinal = isiCmd || m.quoted.caption || "";
              sendObj = {
                video: mediaBuffer,
                caption: captionFinal,
                mentions: inputMentions,
              };
            }

            // ===== AUDIO =====
            else if (/audio/.test(mime)) {
              sendObj = {
                audio: mediaBuffer,
                mimetype: "audio/mpeg",
                ptt: false,
                contextInfo: {
                  externalAdReply: {
                    title: botName,
                    body: `⏰ ${moment.tz("Asia/Jakarta").format("HH:mm:ss")}`,
                    thumbnail: fs.readFileSync(global.thumbnail),
                    mediaType: 2,
                    renderLargerThumbnail: true,
                  },
                },
              };
            }

            // ===== DOCUMENT =====
            else if (/application/.test(mime)) {
              captionFinal = isiCmd || m.quoted.caption || "";
              sendObj = {
                document: mediaBuffer,
                fileName: m.quoted.fileName || "file",
                mimetype: mime,
                caption: captionFinal,
                mentions: inputMentions,
              };
            }

            // ===== TEXT ONLY =====
            else {
              sendObj = {
                text: isiCmd,
                mentions: inputMentions,
              };
            }

            await DimzBot.sendMessage(gid, sendObj, { quoted: fmeta });
            sukses++;
            await delay(30000);
          } catch (e) {
            gagal++;
          }
        }

        reply(
          `✅ JPM selesai\n\n` +
            `✔️ Berhasil: ${sukses}\n` +
            `❌ Gagal: ${gagal}`
        );
      }
      break;

    case "jpm-swgc":
      {
        if (!OwnerDimz) return reply(mess.mowner);

        const delay = (ms) => new Promise((res) => setTimeout(res, ms));
        const isQuoted = !!m.quoted;
        const teks = text ? text.trim() : "";

        let media, mimeType;

        if (isQuoted) {
          mimeType = m.quoted.mimetype || m.quoted.mtype || "";
          media = await m.quoted.download();
        }

        if (!isQuoted && !teks) {
          return reply(`Contoh:\n${prefix + command} halo semua`);
        }

        const groups = Object.values(
          await DimzBot.groupFetchAllParticipating()
        ).map((v) => v.id);

        let sukses = 0;
        let gagal = 0;
        reply(
          `📢 JPM Status Grup dimulai\n` +
            `Total grup: ${groups.length}\n` +
            `Delay: 30 detik / grup, resiko di tanggung pengguna!`
        );

        for (const gid of groups) {
          try {
            let options = {};

            if (isQuoted) {
              if (/image/.test(mimeType)) {
                options = {
                  image: media,
                  caption: teks || m.quoted.text || "",
                };
              } else if (/video/.test(mimeType)) {
                options = {
                  video: media,
                  caption: teks || m.quoted.text || "",
                };
              } else if (/audio/.test(mimeType)) {
                options = {
                  audio: media,
                  mimetype: "audio/mpeg",
                  ptt: false,
                };
              } else {
                gagal++;
                continue;
              }
            } else {
              options = { text: teks };
            }

            await groupSatus(gid, options);
            sukses++;

            await delay(30000); // ⏱️ 30 detik per grup
          } catch (e) {
            gagal++;
          }
        }

        reply(
          `✅ JPM Status Grup selesai\n\n` +
            `✔️ Berhasil: ${sukses}\n` +
            `❌ Gagal: ${gagal}`
        );
      }
      break;

    case "setppbot":
      {
        if (!OwnerDimz) return reply(mess.mowner);
        if (!quoted)
          return reply(`Send/Reply Image With Caption ${prefix + command}`);
        if (!/image/.test(mime))
          return reply(`Send/Reply Image With Caption ${prefix + command}`);
        if (/webp/.test(mime))
          return reply(`Send/Reply Image With Caption ${prefix + command}`);
        const { S_WHATSAPP_NET } = require("@whiskeysockets/baileys");

        const buffer = await DimzBot.downloadAndSaveMediaMessage(quoted);
        var { img } = await generateProfilePicture(buffer);
        await DimzBot.query({
          tag: "iq",
          attrs: {
            // target: '0',
            to: S_WHATSAPP_NET,
            type: "set",
            xmlns: "w:profile:picture",
          },
          content: [
            {
              tag: "picture",
              attrs: {
                type: "image",
              },
              content: img,
            },
          ],
        });
        fs.unlinkSync(buffer);
        reply(`Sukses`);
      }
      break;

    case "creategc":
      {
        if (!OwnerDimz) return reply(mess.mowner);
        if (!argss.join(" ")) return reply(`Use ${prefix + command} groupname`);
        try {
          let cret = await DimzBot.groupCreate(argss.join(" "), []);
          let response = await DimzBot.groupInviteCode(cret.id);
          teks = `     「 Create Group 」

▸ Nama : ${cret.subject}
▸ Owner : @${cret.owner.split("@")[0]}
▸ Created : ${moment(cret.creation * 1000)
            .tz("Asia/Jakarta")
            .format("DD/MM/YYYY HH:mm:ss")}

https://chat.whatsapp.com/${response}
       `;
          await DimzBot.sendMessage(
            m.chat,
            {
              text: teks,
              mentions: await DimzBot.parseMention(teks),
            },
            {
              quoted: m,
            }
          );
        } catch {
          reply("Error!");
        }
      }
      break;

    case "listgc":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);
        if (!OwnerDimz) return reply(mess.mowner);
        try {
          let allGroups = await DimzBot.groupFetchAllParticipating();
          let groupList = Object.values(allGroups);
          let teks = `${themeemoji} *GROUP CHAT LIST*\n\nTotal Group: ${groupList.length} Group\n\n`;

          for (let group of groupList) {
            let metadata = group;
            let groupLink;
            try {
              groupLink = await DimzBot.groupInviteCode(metadata.id);
              groupLink = `https://chat.whatsapp.com/${groupLink}`;
            } catch (error) {
              if (
                error.data === 401 ||
                error.message.includes("not-authorized")
              ) {
                groupLink = "Unknown";
              } else {
                groupLink = "Unknown";
              }
            }

            teks +=
              `${themeemoji} *Name:* ${metadata.subject}\n` +
              `${themeemoji} *Owner:* ${metadata.owner !== undefined ? "@" + metadata.owner.split("@")[0] : "Unknown"}\n` +
              `${themeemoji} *ID:* ${metadata.id}\n` +
              `${themeemoji} *Made:* ${moment(metadata.creation * 1000)
                .tz("Asia/Jakarta")
                .format("DD/MM/YYYY HH:mm:ss")}\n` +
              `${themeemoji} *Members:* ${metadata.participants.length}\n` +
              `${themeemoji} *Link:* ${groupLink}\n\n` +
              `────────────────────────\n\n`;
          }
          await DimzBot.sendTextWithMentions(m.chat, teks, m);
        } catch (error) {
          DimzBot.sendText(
            m.chat,
            "❌ Terjadi kesalahan saat mengambil daftar grup. Silakan coba lagi nanti.",
            m
          );
        }
        reduceLimit(botId, m.sender);
      }
      break;

    case "gconly":
      {
        if (!OwnerDimz) return reply(mess.mowner);

        const mode = argss[0]?.toLowerCase();
        if (!mode || !["on", "off"].includes(mode)) {
          return reply(`Gunakan: ${prefix + command} on / off`);
        }

        if (mode === "on") {
          if (isGconly) {
            return reply("✅ Mode group only sudah diaktifkan sebelumnya.");
          }
          setData(botId, "global", "gconly", true);
          reply(
            "✅ Mode bot diubah ke *GROUP CHAT ONLY* (Bot hanya akan merespon di grup)"
          );
        } else if (mode === "off") {
          if (!isGconly) {
            return reply("🚫 Mode group only sudah dinonaktifkan sebelumnya.");
          }
          setData(botId, "global", "gconly", false);
          reply(
            "🚫 Mode bot diubah ke *ALL CHAT* (Bot akan merespon di grup dan private chat)"
          );
        }
      }
      break;

    case "setmode":
      {
        if (!OwnerDimz) return reply(mess.mowner);
        const mode = argss[0]?.toLowerCase();
        if (!mode) return reply(`Gunakan: ${prefix + command} public / self`);

        if (mode === "public") {
          setData(botId, "global", "public", true);
          reply("✅ Mode bot diubah ke *PUBLIC*");
        } else if (mode === "self") {
          setData(botId, "global", "public", false);
          reply("🚫 Mode bot diubah ke *SELF*");
        } else {
          reply(`Gunakan: ${prefix + command} public / self`);
        }
      }
      break;

    case "join":
      {
        if (!OwnerDimz) return reply(mess.mowner);
        if (!text) return reply(`Contoh: ${prefix + command} linkgrup`);

        if (!isUrl(text) || !text.includes("chat.whatsapp.com/")) {
          return reply("❌ Link tidak valid!");
        }
        const regex = /chat\.whatsapp\.com\/([a-zA-Z0-9]+)/;
        const match = text.match(regex);
        const inviteCode = match ? match[1] : null;

        if (!inviteCode)
          return reply("❌ Gagal mengambil kode undangan dari link.");

        try {
          await DimzBot.groupAcceptInvite(inviteCode);
          reply("✅ Berhasil masuk ke grup");
        } catch (error) {
          if (error.message === "not-authorized") {
            return reply(
              "❌ Bot tidak diizinkan untuk bergabung ke grup, Pastikan link valid"
            );
          } else {
            console.error("Error join:", error);
            return reply("❌ Terjadi kesalahan saat mencoba masuk ke grup.");
          }
        }
      }
      break;

    case "leavegc":
      {
        if (!OwnerDimz) return reply(mess.mowner);
        await DimzBot.groupLeave(m.chat);
        await reply(`Done`);
      }
      break;

    case "leavegcid":
      {
        if (!OwnerDimz) return reply(mess.mowner);
        let groupId = text;
        if (!groupId) {
          return reply(
            `Silakan masukkan ID grup. Contoh penggunaan: ${prefix}leave <ID Grup>`
          );
        }

        try {
          await DimzBot.groupLeave(groupId);
          reply(`Bot telah keluar dari grup dengan ID: ${groupId}`);
        } catch (error) {
          reply(
            `Gagal keluar dari grup. Mungkin bot bukan admin atau terjadi kesalahan.`
          );
        }
      }
      break;

    case "resetlimit":
      {
        if (!OwnerDimz) return reply(mess.mowner);
        const newLimit = global.limitawal.free;
        resetAllUserLimit(botId, newLimit);
        reply(
          `✅ Semua limit berhasil direset ke *${newLimit}* untuk semua user`
        );
      }
      break;

    case "addowner":
    case "delowner":
      {
        if (!OwnerDimz) return reply(mess.mowner);

        /** @type {"add"|"del"} */
        const type = command.slice(0, 3);
        await m.reply(type);
      }
      break;

    case "addlimit":
      {
        if (!OwnerDimz) return reply(mess.mowner);
        let argssx = text.split("|");
        if (argssx.length === 2) {
          let number = argssx[0].replace(/[^0-9]/g, "") + "@s.whatsapp.net";
          let limitToAdd = parseInt(argssx[1]);

          if (isNaN(limitToAdd))
            return reply("Masukkan jumlah limit yang valid.");

          let current = getLimit(botId, number);
          let updated = setLimit(botId, number, current + limitToAdd);

          return reply(
            `✅ Limit berhasil ditambahkan.\n📌 User: ${number}\n📊 Limit sekarang: ${updated}`
          );
        } else {
          return reply(
            `Format salah!\nContoh: ${prefix + command} 628xxxxxxxz | jumlah`
          );
        }
      }
      break;

    case "dellimit":
      {
        if (!OwnerDimz) return reply(mess.mowner);
        let argssx = text.split("|");
        if (argssx.length === 2) {
          let number = argssx[0].replace(/[^0-9]/g, "") + "@s.whatsapp.net";
          let limitToDel = parseInt(argssx[1]);

          if (isNaN(limitToDel))
            return reply("Masukkan jumlah limit yang valid.");

          let current = getLimit(botId, number);
          let newLimit = current - limitToDel;
          if (newLimit < 0) newLimit = 0;
          let updated = setLimit(botId, number, newLimit);

          return reply(
            `✅ Limit berhasil dikurangi.\n📌 User: ${number}\n📊 Limit sekarang: ${updated}`
          );
        } else {
          return reply(
            `Format salah!\nContoh: ${prefix + command} 628xxxxxxxz | jumlah`
          );
        }
      }
      break;

    case "limit":
      {
        reply("*Sisa Limit Kamu :* " + sisalimit);
      }
      break;

    // fitur downloader
    case "capcut":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);
        if (!text)
          return reply(
            `Contoh:\n${prefix + command} https://www.capcut.com/tv2/XXXX`
          );
        if (!text.includes("capcut.com"))
          return reply("❌ Masukkan link CapCut yang valid");

        await DimzBot.sendMessage(m.chat, {
          react: { text: "📩", key: m.key },
        });

        try {
          const axios = require("axios");
          const qs = require("qs");

          const url = text.trim();

          const { agent } = getRandomProxyAgent();

          const res = await axios.post(
            "https://3bic.com/api/download",
            qs.stringify({ url }),
            {
              headers: {
                "content-type": "application/x-www-form-urlencoded",
              },
              httpsAgent: agent, proxy: false,
              timeout: 20000,
              validateStatus: () => true,
            }
          );

          if (!res.data || res.data.code !== 200) {
            return reply("❌ Gagal mengambil data CapCut");
          }

          let data = res.data;

          if (data.originalVideoUrl?.startsWith("/")) {
            data.originalVideoUrl = "https://3bic.com" + data.originalVideoUrl;
          }

          const caption = `*CapCut Downloader*


🎬 *Judul:* ${data.title || "-"}
👤 *Author:* ${data.authorName || "-"}
🆔 *Status:* ${data.code || "-"}
📦 *Tipe:* Video MP4
🌐 *Platform:* CapCut

⚡ *Powered by 3bic*`;

          await DimzBot.sendMessage(
            m.chat,
            {
              video: { url: data.originalVideoUrl },
              caption,
              contextInfo: {
                externalAdReply: {
                  title: "🎬 CapCut Downloader",
                  body: `${data.title || "-"} • ${data.authorName || "-"}`,
                  thumbnailUrl: data.coverUrl,
                  mediaType: 1,
                  renderLargerThumbnail: true,
                  sourceUrl: url,
                },
              },
            },
            { quoted: m }
          );

          reduceLimit(botId, m.sender);

          await DimzBot.sendMessage(m.chat, {
            react: { text: "", key: m.key },
          });
        } catch (e) {
          reply("❌ Terjadi kesalahan saat mengambil video CapCut");
        }
      }
      break;

    case "mediafire":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);
        if (!text)
          return reply(
            `📦 Kirim link mediafire!\n\nContoh:\n${prefix + command} https://www.mediafire.com/file/xxxxx`
          );

        const url = text.trim();
        if (!url.includes("mediafire.com/"))
          return reply(
            "❌ Link tidak valid! Hanya mendukung link dari Mediafire."
          );

        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "⏳",
            key: m.key,
          },
        });

        const cheerio = require("cheerio");
        const { basename, extname } = require("path");
        const axios = require("axios");

        async function mediafire(url) {
          const { data } = await axios.get(url);
          const $ = cheerio.load(data);

          const title =
            $("meta[property='og:title']").attr("content")?.trim() || "Unknown";
          const size =
            /Download\s*\(([\d.]+\s*[KMGT]?B)\)/i.exec($.html())?.[1] ||
            "Unknown";
          const dl =
            $("a.popsok[href^='https://download']").attr("href")?.trim() ||
            $("a.popsok:not([href^='javascript'])").attr("href")?.trim() ||
            (() => {
              throw new Error("❌ Gagal menemukan link download.");
            })();

          return {
            name: title,
            filename: basename(dl),
            type: extname(dl),
            size,
            download: dl,
            link: url.trim(),
          };
        }

        try {
          const result = await mediafire(url);

          const info = `
📦 *Mediafire Downloader*
────────────────────
🧩 *Nama:* ${result.name}
🗂️ *File:* ${result.filename}
📏 *Ukuran:* ${result.size}
📁 *Tipe:* ${result.type || "Tidak diketahui"}
────────────────────`;

          await DimzBot.sendMessage(
            m.chat,
            {
              document: {
                url: result.download,
              },
              fileName: result.filename,
              mimetype: "application/octet-stream",
              caption: info,
            },
            {
              quoted: m,
            }
          );

          reduceLimit(botId, m.sender);
          await DimzBot.sendMessage(m.chat, {
            react: {
              text: "✅",
              key: m.key,
            },
          });
        } catch (err) {
          console.error("MEDIAFIRE ERROR:", err);
          reply(
            "❌ Gagal mengambil data dari Mediafire. Pastikan link benar atau tunggu beberapa saat"
          );
        }
      }
      break;

    case "sfile":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);
        const cheerio = require("cheerio");
        const fetch = require("node-fetch");

        const searchSfile = async (query, page = 1) => {
          const res = await fetch(
            `https://sfile.mobi/search.php?q=${encodeURIComponent(query)}&page=${page}`
          );
          const $ = cheerio.load(await res.text());
          const result = [];

          $("div.list").each(function () {
            const title = $(this).find("a").text();
            const size = $(this).text().trim().split("(")[1];
            const link = $(this).find("a").attr("href");
            if (link)
              result.push({
                title,
                size: size?.replace(")", ""),
                link,
              });
          });

          return result;
        };

        const getSfileDownload = async (url) => {
          const res = await fetch(url, {
            headers: {
              "User-Agent": FakeUseragent(),
            },
          });
          const $ = cheerio.load(await res.text());

          const filename = $("img.intro").attr("alt");
          const mimetype = $("div.list")
            .text()
            .split(" - ")[1]
            .split("\n")[0]
            .trim();
          const dlPage = $("#download").attr("href");
          const up_at = $(".list").eq(2).text().split(":")[1].trim();
          const uploader = $(".list").eq(1).find("a").eq(0).text().trim();
          const total_down = $(".list").eq(3).text().split(":")[1].trim();

          const dlRes = await fetch(dlPage, {
            headers: {
              "User-Agent": FakeUseragent(),
              Referer: url,
            },
          });
          const $$ = cheerio.load(await dlRes.text());
          const scriptText = $$("script").text();
          const download = scriptText
            .split('sf = "')[1]
            .split('"')[0]
            .replace(/\\/g, "");

          return {
            filename,
            mimetype,
            up_at,
            uploader,
            total_down,
            download,
          };
        };

        if (!text)
          return reply(
            `Contoh:\n${prefix}sfile Mobile Legends\natau\n${prefix}sfile https://sfile.mobi/xxxxx`
          );

        if (text.includes("sfile.mobi")) {
          try {
            const res = await getSfileDownload(text);
            const buff = Buffer.from(
              await (
                await fetch(res.download, {
                  headers: {
                    "User-Agent": FakeUseragent(),
                    Referer: text,
                  },
                })
              ).arrayBuffer()
            );

            await DimzBot.sendMessage(
              m.chat,
              {
                document: buff,
                fileName: res.filename,
                mimetype: res.mimetype || "application/octet-stream",
                caption: `*SFILE DOWNLOADER*

*⭔ Nama File:* ${res.filename}
*⭔ Tipe:* ${res.mimetype}
*⭔ Upload:* ${res.up_at}
*⭔ Uploader:* ${res.uploader}
*⭔ Total Unduhan:* ${res.total_down}
*⭔ Link:* ${res.download}`,
              },
              {
                quoted: m,
              }
            );
          } catch (e) {
            console.error(e);
            reply("❌ Gagal mengambil file dari sfile.");
          }
        } else {
          try {
            const results = await searchSfile(text);
            if (!results.length) return reply("Tidak ditemukan!");

            let teks = `*Hasil Pencarian Sfile: ${text}*\n\n`;
            for (let i of results.slice(0, 10)) {
              teks += `📦 *${i.title}* (${i.size})\n🔗 ${i.link}\n\n`;
            }
            reply(teks.trim());
          } catch (e) {
            console.error(e);
            reply("❌ Gagal mencari file.");
          }
        }
        reduceLimit(botId, m.sender);
      }
      break;

    case "douyin":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);
        if (!text)
          return reply(
            `Contoh: ${prefix + command} https://v.douyin.com/iNW2KHeV`
          );
        if (!/^https:\/\/(.*\.)?douyin\.com\/.+$/i.test(text))
          return reply(`Link Douyin tidak valid!`);

        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "📩",
            key: m.key,
          },
        });

        try {
          const res = await axios.get(
            `https://anabot.my.id/api/download/douyin?url=${text}&apikey=${apiana}`
          );
          const data = res.data.data;
          const videoUrl = data.result.urls.find((v) =>
            v.type.toLowerCase().includes("mp4")
          )?.url;
          const mp3Url = data.result.urls.find((v) =>
            v.type.toLowerCase().includes("mp3")
          )?.url;

          if (!videoUrl) return reply(`❌ Gagal mengambil video`);

          await DimzBot.sendMessage(
            m.chat,
            {
              video: {
                url: videoUrl,
              },
              caption: `*「 DOUYIN DOWNLOADER 」*


*📝 Caption:* ${data.result.caption}`,
              contextInfo: {
                externalAdReply: {
                  containsAutoReply: true,
                  title: botName,
                  thumbnailUrl: data.result.thumb,
                  mediaType: 1,
                  renderLargerThumbnail: true,
                  sourceUrl: "https://douyin.com",
                },
              },
            },
            {
              quoted: m,
            }
          );

          await DimzBot.sendMessage(m.chat, {
            react: {
              text: "✅",
              key: m.key,
            },
          });
        } catch (err) {
          reply(`❌ Terjadi error saat mengambil video`);
        }
        reduceLimit(botId, m.sender);
      }
      break;

    case "tiktok":
    case "tt":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);
        if (!text)
          return reply(
            `Contoh: ${prefix + command} https://vt.tiktok.com/ZSLnkTBNR/`
          );
        if (!text.includes("tiktok.com/"))
          return reply(`Masukkan link TikTok yang valid`);

        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "📩",
            key: m.key,
          },
        });

        const headers = {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
          Accept: "application/json, text/plain, */\*",
          Connection: "keep-alive",
          "X-Api-Key":
            "tk_0fe9265d9ab676f4bae10d3b2147bbb1aa8153d18963e22955a1d9b8882d5414",
        };

        try {
          const { agent } = getRandomProxyAgent();

          const { data } = await axios.get(
            `https://api-faa.my.id/faa/tiktok?url=${encodeURIComponent(text)}`,
            {
              httpsAgent: agent, proxy: false,
              timeout: 30000,
            }
          );

          if (!data.status || !data.result)
            return reply("❌ Gagal mengambil data TikTok.");

          const res = data.result;

          /* ================= IMAGE / SLIDE ================= */
          if (res.type === "image" && Array.isArray(res.data)) {
            for (const img of res.data) {
              if (typeof img === "string" && img.startsWith("http")) {
                await DimzBot.sendMessage(
                  m.chat,
                  { image: { url: img } },
                  { quoted: m }
                );
                await new Promise((r) => setTimeout(r, 2000));
              }
            }
          }

          /* ================= VIDEO ================= */
          if (res.type === "video" && res.data) {
            await DimzBot.sendMessage(
              m.chat,
              {
                video: { url: res.data },
                mimetype: "video/mp4",
                caption: `
*[ TIKTOK DOWNLOADER ]*

🎬 *Judul:* ${res.title}
🕒 *Durasi:* ${res.duration}
📅 *Upload:* ${res.taken_at}
🌍 *Region:* ${res.region}
🆔 *Video ID:* ${res.id}

📊 *STATISTIK*
👀 Views : ${res.stats?.views}
❤️ Likes : ${res.stats?.likes}
💬 Comment : ${res.stats?.comment}
🔁 Share : ${res.stats?.share}
⭐ Save : ${res.stats?.save}
⬇️ Download : ${res.stats?.download}

🎵 *MUSIC*
• Judul  : ${res.music_info?.title}
• Author : ${res.music_info?.author}
• Durasi : ${res.music_info?.duration}
• Original : ${res.music_info?.original}

👤 *AUTHOR*
• Nickname : ${res.author?.nickname}
• Fullname : ${res.author?.fullname}
• ID       : ${res.author?.id}

*「 TIKTOK V1 」*
        `.trim(),
                contextInfo: {
                  forwardingScore: 9999,
                  isForwarded: true,
                  businessMessageForwardInfo: {
                    businessOwnerJid: nobisnis,
                  },
                  mentionedJid: [m.sender, creator2, "0@s.whatsapp.net"],
                },
              },
              { quoted: m }
            );
          }

          /* ================= MUSIC ================= */
          if (res.music_info?.url) {
            await DimzBot.sendMessage(
              m.chat,
              {
                audio: { url: res.music_info.url },
                mimetype: "audio/mpeg",
                fileName: `${res.music_info.title}.mp3`,
                ptt: false,
                contextInfo: {
                  forwardingScore: 9999,
                  isForwarded: true,
                  businessMessageForwardInfo: {
                    businessOwnerJid: nobisnis,
                  },
                },
              },
              { quoted: m }
            );
          }

          await DimzBot.sendMessage(m.chat, {
            react: { text: "✅", key: m.key },
          });
        } catch (err1) {
          console.warn("⚠️ API V1 gagal, fallback ke V2:", err1.message);

          try {
            const { agent } = getRandomProxyAgent();
            const res2 = await axios.get(
              `https://api.tiklydown.eu.org/api/download/v5?url=${text}`,
              {
                headers,
                httpsAgent: agent, proxy: false,
                timeout: 30000,
              }
            );
            const result = res2.data?.result;

            if (!result?.hdplay && !result?.play && !result?.wmplay)
              return reply("❌ Gagal mendapatkan video dari server 2");

            const videoUrl = result.hdplay || result.play || result.wmplay;

            await DimzBot.sendMessage(
              m.chat,
              {
                video: {
                  url: videoUrl,
                },
                caption: `
*[ TIKTOK DOWNLOADER ]*

> *_Title:_* ${result.title}
> *_Duration:_* ${result.duration}s
> *_Watermark:_* No

> *_Like:_* ${result.digg_count}
> *_Comment:_* ${result.comment_count}
> *_Share:_* ${result.share_count}
> *_View:_* ${result.play_count}

> *「 MUSIC 」*
> *_${result.music_info.title}_* by *${result.music_info.author}*

> *「 USER 」*
> *_@${result.author.unique_id}_*

*「 TIKTOK V2 」*
`.trim(),
                mimetype: "video/mp4",
                contextInfo: {
                  forwardingScore: 9999,
                  isForwarded: true,
                  businessMessageForwardInfo: {
                    businessOwnerJid: nobisnis,
                  },
                  mentionedJid: [m.sender, creator2, "0@s.whatsapp.net"],
                },
              },
              {
                quoted: m,
              }
            );

            if (result.music_info?.play) {
              await DimzBot.sendMessage(
                m.chat,
                {
                  audio: {
                    url: result.music_info.play,
                  },
                  fileName: `${result.music_info.title}.mp3`,
                  mimetype: "audio/mpeg",
                  ptt: false,
                  contextInfo: {
                    forwardingScore: 9999,
                    isForwarded: true,
                    businessMessageForwardInfo: {
                      businessOwnerJid: nobisnis,
                    },
                    externalAdReply: {
                      containsAutoReply: true,
                      title: result.music_info.title,
                      body: result.music_info.author,
                      thumbnailUrl: result.cover,
                      sourceUrl: result.music_info.play,
                      mediaUrl: result.music_info.play,
                      mediaType: 2,
                    },
                  },
                },
                {
                  quoted: m,
                }
              );
            }
          } catch (err2) {
            console.warn("⚠️ API V2 gagal, fallback ke V3:", err2.message);

            try {
              const axios = require("axios");
              const FormData = require("form-data");

              const form = new FormData();
              form.append("url", text);
              form.append("count", "12");
              form.append("cursor", "0");
              form.append("web", "1");
              form.append("hd", "1");

              const { agent } = getRandomProxyAgent();
              const { data } = await axios.post(
                "https://www.tikwm.com/api/",
                form,
                {
                  headers: form.getHeaders(),
                  httpsAgent: agent, proxy: false,
                  timeout: 30000,
                }
              );

              if (data.code !== 0 || data.msg !== "success" || !data.data)
                return;

              const d = data.data;
              const meta = {
                title: d.title || "Tanpa Judul",
                author: d.author.nickname || "Tidak diketahui",
                username: d.author.unique_id || "-",
                like: d.digg_count || 0,
                comment: d.comment_count || 0,
                share: d.share_count || 0,
                views: d.play_count || 0,
                region: d.region || "??",
              };

              if (d.images && d.images.length > 0) {
                const caption = `
*[ TIKTOK DOWNLOADER IMAGE ]*

👤 Creator: ${meta.author} (@${meta.username})
🌍 Region: ${meta.region}
❤️ Like: ${meta.like}
💬 Komentar: ${meta.comment}
🔁 Share: ${meta.share}
👀 Views: ${meta.views}

🎵 Sound: ${d.music_info?.title || "Original Sound"}

*「 TIKTOK V3 」*
`.trim();

                for (let i = 0; i < d.images.length; i++) {
                  await DimzBot.sendMessage(
                    m.chat,
                    {
                      image: {
                        url: d.images[i],
                      },
                      caption: i === 0 ? caption : undefined,
                      contextInfo: {
                        forwardingScore: 9999,
                        isForwarded: true,
                        businessMessageForwardInfo: {
                          businessOwnerJid: nobisnis,
                        },
                        mentionedJid: [m.sender, creator2],
                        externalAdReply: {
                          title: "TikTok Downloader V3",
                          body: `Powered by ${botName}`,
                          thumbnailUrl: d.cover,
                          sourceUrl: text,
                          mediaUrl: text,
                          mediaType: 1,
                        },
                      },
                    },
                    {
                      quoted: m,
                    }
                  );
                  await sleep(800);
                }
              } else {
                const videoUrl = d.hdplay || d.play || d.wmplay;
                await DimzBot.sendMessage(
                  m.chat,
                  {
                    video: {
                      url: videoUrl,
                    },
                    caption: `
*[ TIKTOK DOWNLOADER ]*

🎵 Judul: ${meta.title}
👤 Creator: ${meta.author} (@${meta.username})
🌍 Region: ${meta.region}
❤️ Like: ${meta.like}
💬 Komentar: ${meta.comment}
🔁 Share: ${meta.share}
👀 Views: ${meta.views}

🎧 Musik: ${d.music_info?.title || "Original Sound"}

*「 TIKTOK V3 」*
`.trim(),
                    mimetype: "video/mp4",
                    contextInfo: {
                      forwardingScore: 9999,
                      isForwarded: true,
                      businessMessageForwardInfo: {
                        businessOwnerJid: nobisnis,
                      },
                      mentionedJid: [m.sender, creator2],
                      externalAdReply: {
                        title: "TikTok Downloader V3",
                        body: `Powered by ${botName}`,
                        thumbnailUrl: d.cover,
                        sourceUrl: text,
                        mediaUrl: text,
                        mediaType: 2,
                      },
                    },
                  },
                  {
                    quoted: m,
                  }
                );
              }

              reduceLimit(botId, m.sender);
              await DimzBot.sendMessage(m.chat, {
                react: {
                  text: "✅",
                  key: m.key,
                },
              });
            } catch (err3) {
              console.warn("⚠️ API V3 gagal, fallback ke V4:", err3.message);

              try {
                const { agent } = getRandomProxyAgent();
                const apiUrl = `https://api.siputzx.my.id/api/d/tiktok/v2?url=${encodeURIComponent(text)}`;
                const { data } = await axios.get(apiUrl, {
                  httpsAgent: agent, proxy: false,
                  timeout: 30000,
                });

                if (!data.status || !data.data)
                  return reply("❌ Gagal mendapatkan data dari API.");

                const d = data.data;

                // ===== FIXED STRUCTURE =====
                const title = d.text || "Tanpa Judul";
                const stats = {
                  likeCount: d.like_count || 0,
                  commentCount: d.comment_count || 0,
                  shareCount: d.share_count || 0,
                  playCount: d.play_count || 0,
                };

                const videoList = d.no_watermark_link_hd
                  ? [d.no_watermark_link_hd]
                  : d.no_watermark_link
                    ? [d.no_watermark_link]
                    : [];

                const photoList = Array.isArray(d.slides) ? d.slides : [];

                // ===== VIDEO =====
                if (videoList.length) {
                  const videoUrl = videoList[0];

                  await DimzBot.sendMessage(
                    m.chat,
                    {
                      video: { url: videoUrl },
                      caption: `
*[ TIKTOK DOWNLOADER ]*

🎵 Judul: ${title}
❤️ Like: ${stats.likeCount}
💬 Komentar: ${stats.commentCount}
🔁 Share: ${stats.shareCount}
👀 Views: ${stats.playCount}

*「 TIKTOK V4 」*
`.trim(),
                      mimetype: "video/mp4",
                      contextInfo: {
                        forwardingScore: 9999,
                        isForwarded: true,
                        businessMessageForwardInfo: {
                          businessOwnerJid: nobisnis,
                        },
                        mentionedJid: [m.sender, creator2],
                        externalAdReply: {
                          title: "TikTok Downloader V4",
                          body: `Powered by ${botName}`,
                          thumbnailUrl: d.cover_link || videoUrl,
                          sourceUrl: text,
                          mediaUrl: text,
                          mediaType: 2,
                        },
                      },
                    },
                    { quoted: m }
                  );

                  // ===== PHOTO =====
                } else if (photoList.length) {
                  const caption = `
*[ TIKTOK DOWNLOADER IMAGE ]*

🖼️ Jumlah Foto: ${photoList.length}
🎵 Judul: ${title}
❤️ Like: ${stats.likeCount}
💬 Komentar: ${stats.commentCount}
🔁 Share: ${stats.shareCount}
👀 Views: ${stats.playCount}

*「 TIKTOK V4 」*
`.trim();

                  for (let i = 0; i < photoList.length; i++) {
                    await DimzBot.sendMessage(
                      m.chat,
                      {
                        image: { url: photoList[i] },
                        caption: i === 0 ? caption : undefined,
                        contextInfo: {
                          forwardingScore: 9999,
                          isForwarded: true,
                          businessMessageForwardInfo: {
                            businessOwnerJid: nobisnis,
                          },
                          mentionedJid: [m.sender, creator2],
                          externalAdReply: {
                            title: "TikTok Downloader V4",
                            body: `Powered by ${botName}`,
                            thumbnailUrl: photoList[0],
                            sourceUrl: text,
                            mediaUrl: text,
                            mediaType: 1,
                          },
                        },
                      },
                      { quoted: m }
                    );
                    await sleep(1000);
                  }
                } else {
                  return reply(
                    "❌ Tidak ditemukan media (video/foto) pada link TikTok tersebut."
                  );
                }

                reduceLimit(botId, m.sender);
                await DimzBot.sendMessage(m.chat, {
                  react: { text: "✅", key: m.key },
                });
              } catch (err4) {
                console.error(
                  "❌ [TIKTOK API ERROR]",
                  err4.response?.data || err4.message
                );

                try {
                  const { agent } = getRandomProxyAgent();
                  const apiUrl = `https://api-faa.my.id/faa/tiktok?url=${encodeURIComponent(text)}`;

                  const { data } = await axios.get(apiUrl, {
                    httpsAgent: agent, proxy: false,
                    timeout: 30000,
                  });

                  if (!data?.status || !data?.result)
                    throw new Error("Invalid response from API");

                  const result = data.result;

                  if (
                    result.type === "image" &&
                    Array.isArray(result.data) &&
                    result.data.length > 0
                  ) {
                    const caption = `
*[ TIKTOK DOWNLOADER IMAGE ]*

> *Title:* ${result.title}
> *Author:* ${result.author.nickname}
> *Uploaded:* ${result.taken_at}

> *Views:* ${result.stats.views}
> *Likes:* ${result.stats.likes}
> *Comments:* ${result.stats.comment}
> *Shares:* ${result.stats.share}
> *Favorites:* ${result.stats.save}

> *「 MUSIC 」*
> *Title:* ${result.music_info.title}
> *Author:* ${result.music_info.author}

*「 TIKTOK V5 」*
    `.trim();
                    for (let i = 0; i < result.data.length; i++) {
                      await DimzBot.sendMessage(
                        m.chat,
                        {
                          image: {
                            url: result.data[i],
                          },
                          caption: i === 0 ? caption : undefined,
                        },
                        {
                          quoted: m,
                        }
                      );
                      await new Promise((res) => setTimeout(res, 1000));
                    }

                    if (result.music_info?.url) {
                      await DimzBot.sendMessage(
                        m.chat,
                        {
                          audio: {
                            url: result.music_info.url,
                          },
                          fileName: `${result.music_info.title}.mp3`,
                          mimetype: "audio/mpeg",
                        },
                        {
                          quoted: m,
                        }
                      );
                    }

                    reduceLimit(botId, m.sender);
                  } else {
                    if (typeof result.data !== "string")
                      throw new Error("Video URL not found");

                    const videoBuffer = await axios.get(result.data, {
                      responseType: "arraybuffer",
                      httpsAgent: agent, proxy: false,
                      timeout: 30000,
                    });

                    await DimzBot.sendMessage(
                      m.chat,
                      {
                        video: Buffer.from(videoBuffer.data),
                        caption: `
*[ TIKTOK DOWNLOADER - VIDEO ]*

> *Title:* ${result.title}
> *Author:* ${result.author.nickname}
> *Uploaded:* ${result.taken_at}
> *Duration:* ${result.duration}

> *Views:* ${result.stats.views}
> *Likes:* ${result.stats.likes}
> *Comments:* ${result.stats.comment}
> *Shares:* ${result.stats.share}
> *Favorites:* ${result.stats.save}

> *「 MUSIC 」*
> *Title:* ${result.music_info.title}
> *Author:* ${result.music_info.author}

*「 TIKTOK V5 」*
        `.trim(),
                      },
                      {
                        quoted: m,
                      }
                    );

                    reduceLimit(botId, m.sender);
                  }
                } catch (err5) {
                  console.error("Error TikTokV5:", err5);
                  reply(
                    "❌ Terjadi kesalahan saat mendownload TikTok. Coba lagi nanti."
                  );
                }
              }
            }
          }
        }
      }
      break;

    case "ig":
    case "instagram":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);
        if (!text)
          return reply(
            `Contoh: ${prefix + command} https://www.instagram.com/reel/XXXXX`
          );
        if (!text.includes("instagram.com/"))
          return reply(`Masukkan Link Instagram yang valid.`);

        await DimzBot.sendMessage(m.chat, {
          react: { text: "📩", key: m.key },
        });

        const axios = require("axios");
        const delay = (ms) => new Promise((r) => setTimeout(r, ms));

        // ambil proxy SEKALI
        const { agent } = getRandomProxyAgent();

        // ================= SERVER 1 =================
        try {
          const encoded = encodeURIComponent(text.trim());

          const { data } = await axios.get(
            `https://api-faa.my.id/faa/igdl?url=${encoded}`,
            {
              httpsAgent: agent, proxy: false,
              timeout: 20000,
              validateStatus: () => true,
            }
          );

          if (!data?.status) throw "SERVER1_FAIL";

          const result = data.result;
          const mediaList = result.url || [];
          if (!mediaList.length) throw "SERVER1_FAIL";

          const meta = result.metadata || {};

          const baseCaption =
            `📥 *Instagram Downloader*\n\n` +
            `👤 *Username:* ${meta.username || "-"}\n` +
            `❤️ *Like:* ${meta.like || 0}\n` +
            `💬 *Comment:* ${meta.comment || 0}\n` +
            `📝 *Caption:*\n${meta.caption || "-"}\n`;

          let index = 1;
          for (const url of mediaList) {
            if (!url) continue;

            const caption =
              `${baseCaption}\n` +
              `📦 Media ${index} dari ${mediaList.length}\n` +
              `🎞 *Type:* ${meta.isVideo ? "Video" : "Foto"}`;

            if (meta.isVideo) {
              await DimzBot.sendMessage(
                m.chat,
                { video: { url }, caption },
                { quoted: m }
              );
            } else {
              await DimzBot.sendMessage(
                m.chat,
                { image: { url }, caption },
                { quoted: m }
              );
            }

            index++;
            await delay(1000);
          }

          reduceLimit(botId, m.sender);
          return;
        } catch (e) {
          console.error("IGDL SERVER1 ERROR:", e);
        }

        // ================= SERVER 2 (IGRAM + PROXY) =================
        try {
          const endpoint =
            "https://igram.website/content.php?url=" +
            encodeURIComponent(text.trim());

          const { data } = await axios.post(endpoint, "", {
            httpsAgent: agent, proxy: false,
            timeout: 20000,
            headers: {
              referer: "https://igram.website/",
              "user-agent": "Mozilla/5.0",
            },
          });

          if (!data?.html) throw "SERVER2_FAIL";

          let html = data.html.replace(/\n|\t/g, "");

          const videos = [...html.matchAll(/<source[^>]+src="([^"]+)"/g)].map(
            (v) => v[1]
          );
          const images = [...html.matchAll(/<img[^>]+src="([^"]+)"/g)]
            .map((i) => i[1])
            .filter((u) => /instagram|cdn/i.test(u));

          const captionMatch = html.match(/<p class="text-sm"[^>]*>(.*?)<\/p>/);
          const captionText = captionMatch
            ? captionMatch[1].replace(/<br ?\/?>/g, "\n")
            : "-";

          const caption =
            `📥 *Instagram Downloader*\n\n` + `📝 *Caption:*\n${captionText}`;

          if (videos.length) {
            await DimzBot.sendMessage(
              m.chat,
              { video: { url: videos[0] }, caption },
              { quoted: m }
            );
            reduceLimit(botId, m.sender);
            return;
          }

          if (images.length) {
            let sent = false;
            for (const img of images) {
              await DimzBot.sendMessage(
                m.chat,
                {
                  image: { url: img },
                  caption: sent ? "" : caption,
                },
                { quoted: m }
              );
              sent = true;
              await delay(1000);
            }
            reduceLimit(botId, m.sender);
            return;
          }

          reply("❌ Media tidak ditemukan.");
        } catch (e) {
          console.error("IGDL SERVER2 ERROR:", e);
          reply("❌ Semua server gagal mengambil media Instagram.");
        }
      }
      break;

    case "facebook":
    case "fb":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);
        if (!text)
          return reply(
            `Contoh: ${prefix + command} https://www.facebook.com/share/r/KF4zW3Voz36y5LFg/?mibextid=xfxF2i`
          );

        if (!text.includes("https://www.facebook.com/"))
          return reply(`Masukkan Link Facebook Video Nya`);

        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "📩",
            key: m.key,
          },
        });

        try {
          const data = await Fbdl3(text);
          const { title, thumbnail, sd, hd } = data;

          const videoSources = [
            {
              quality: "SD",
              url: sd,
            },
            {
              quality: "HD",
              url: hd,
            },
          ];

          for (let source of videoSources) {
            const msg =
              require("@whiskeysockets/baileys").generateWAMessageFromContent(
                m.chat,
                {
                  interactiveMessage: {
                    body: {
                      text: `Nih Kak ${pushname}`,
                    },
                    footer: {
                      text: "sᴛᴀᴛᴜs: ᴅᴏɴᴇ",
                    },
                    header: {
                      title: `

- Source : ${text}
- Quality : ${source.quality}
- Judul Video : ${data.title}

`,
                      hasMediaAttachment: false,
                      ...(await require("@whiskeysockets/baileys").prepareWAMessageMedia(
                        {
                          video: {
                            url: source.url,
                          },
                        },
                        {
                          upload: DimzBot.waUploadToServer,
                        }
                      )),
                    },
                    nativeFlowMessage: {
                      buttons: [{}],
                    },
                  },
                },
                {
                  quoted: m,
                }
              );
            await DimzBot.relayMessage(m.chat, msg.message, {});
          }
          reduceLimit(botId, m.sender);
        } catch (err) {
          console.error("Facebook download error:", err);
          await reply(`Gagal mengambil video Facebook: ${err.message || err}`);
        }
      }
      break;

    case "search":
    case "yts":
    case "ytsearch":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);
        if (!text) return reply(`Contoh : ${prefix + command} story wa anime`);
        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "⏳",
            key: m.key,
          },
        });
        let yts = require("yt-search");
        let search = await yts(text);
        let initext = `
_Nih Kak ${pushname} Hasil Pencarian Dari_
*_YouTube Search:_*
`;
        let rows = search.all.map((i) => {
          return {
            title: i.title,
            header: i.ago,
            description: "Durasi: " + i.timestamp,
            id: ".ytmp3 " + i.url,
          };
        });

        let sections = [
          {
            title: `${text}`,
            highlight_label: "Download Audio",
            rows: rows,
          },
        ];

        let listMessage = {
          title: "List Hasil Pencarian",
          sections,
        };

        let msg = generateWAMessageFromContent(
          m.from,
          {
            viewOnceMessage: {
              message: {
                messageContextInfo: {
                  deviceListMetadata: {},
                  deviceListMetadataVersion: 2,
                },
                interactiveMessage: proto.Message.InteractiveMessage.create({
                  body: proto.Message.InteractiveMessage.Body.create({
                    text: "",
                  }),
                  footer: proto.Message.InteractiveMessage.Footer.create({
                    text: `> ${text}`,
                  }),
                  header: proto.Message.InteractiveMessage.Header.create({
                    title: initext,
                    hasMediaAttachment: true,
                    ...(await require("@whiskeysockets/baileys").prepareWAMessageMedia(
                      {
                        image: {
                          url: search.all[0].thumbnail,
                        },
                      },
                      {
                        upload: DimzBot.waUploadToServer,
                      }
                    )),
                  }),
                  nativeFlowMessage:
                    proto.Message.InteractiveMessage.NativeFlowMessage.create({
                      buttons: [
                        {
                          name: "quick_reply",
                          buttonParamsJson: JSON.stringify({
                            display_text: "Search Result Link 🔗 ",
                            id: `.ser ${text}`,
                          }),
                        },
                        {
                          name: "single_select",
                          buttonParamsJson: JSON.stringify(listMessage),
                        },
                      ],
                    }),
                  contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    businessMessageForwardInfo: {
                      businessOwnerJid: "6282133394459@s.whatsapp.net",
                    },
                    forwardedNewsletterMessageInfo: {
                      newsletterJid: "120363179857645465@newsletter",
                      newsletterName: "☰『✦ Powered by softbotz.my.id ✦』",
                    },
                    mentionedJid: [m.sender, "0@s.whatsapp.net"],
                    externalAdReply: {
                      containsAutoReply: true,
                    },
                    stanzaId: m.key.id,
                    remoteJid: m.key.remoteJid,
                    participant: m.key.participant || m.key.remoteJid,
                    fromMe: m.key.fromMe,
                    quotedMessage: m.message,
                  },
                }),
              },
            },
          },
          {
            quoted: m,
          }
        );
        await DimzBot.relayMessage(m.chat, msg.message, {});
        reduceLimit(botId, m.sender);
      }
      break;

    case "ser":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);
        if (!text) return reply(`Contoh : ${prefix + command} story wa anime`);
        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "⏳",
            key: m.key,
          },
        });
        let yts = require("yt-search");
        let search = await yts(text);
        let teks = `*_Nih Kak @${m.sender.split("@")[0]} Hasil Pencarian Dari YouTube Search:_*\n\n\n`;
        let no = 1;
        for (let i of search.all) {
          teks += `${themeemoji} Nomor : ${no++}\n${themeemoji} Type : ${
            i.type
          }\n${themeemoji} Video ID : ${i.videoId}\n${themeemoji} Judul : ${
            i.title
          }\n${themeemoji} Views : ${i.views}\n${themeemoji} Durasi : ${
            i.timestamp
          }\n${themeemoji} Uploaded : ${i.ago}\n${themeemoji} Url : ${
            i.url
          }\n\n─────────────────\n\n`;
        }
        await DimzBot.sendMessage(
          m.chat,
          {
            text: teks,
            contextInfo: {
              mentionedJid: [m.sender, creator2, "0@s.whatsapp.net"],
              externalAdReply: {
                title: `🔍 Hasil Pencarian: ${text} `,
                thumbnailUrl: search.all[0].thumbnail,
                containsAutoReply: true,
                sourceUrl: `https://youtube.com`,
                mediaType: 1,

                renderLargerThumbnail: true,
              },
            },
          },
          {
            quoted: m,
          }
        );
        reduceLimit(botId, m.sender);
      }
      break;

    case "play":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);
        if (!text) return reply(`Contoh : ${prefix + command} story wa anime`);

        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "⏳",
            key: m.key,
          },
        });

        let yts = require("yt-search");
        let search = await yts(text);

        if (search.all.length < 2)
          return reply("Tidak ada cukup hasil pencarian!");

        let video = search.all[0];
        let teks = `- *Type* : ${video.type}\n`;
        teks += `- *Video ID* : ${video.videoId}\n`;
        teks += `- *Judul* : ${video.title}\n`;
        teks += `- *Views* : ${video.views}\n`;
        teks += `- *Durasi* : ${video.timestamp}\n`;
        teks += `- *Uploaded* : ${video.ago}\n`;
        teks += `- *Url* : ${video.url}\n\n\n*_Silahkan Pilih Type Nya!_*`;

        const btn = baileys.proto.Message.ButtonsMessage;
        const { imageMessage } = await baileys.generateWAMessageContent(
          {
            image: {
              url: video.thumbnail,
            },
          },
          {
            upload: DimzBot.waUploadToServer,
          }
        );

        const buttonsMessage = btn.fromObject({
          contentText: teks,
          footerText: botName,
          headerType: btn.HeaderType.IMAGE,
          imageMessage,
          buttons: [
            btn.Button.fromObject({
              buttonId: `.ytmp4 ${video.url}`,
              buttonText: btn.Button.ButtonText.fromObject({
                displayText: "VIDEO ▶",
              }),
              type: btn.Button.Type.RESPONSE,
            }),
            btn.Button.fromObject({
              buttonId: `.ytmp3 ${video.url}`,
              buttonText: btn.Button.ButtonText.fromObject({
                displayText: "AUDIO 🔊",
              }),
              type: btn.Button.Type.RESPONSE,
            }),
          ],
        });
        const msg = baileys.generateWAMessageFromContent(
          m.chat,
          {
            viewOnceMessage: {
              message: {
                buttonsMessage,
              },
            },
          },
          {
            quoted: m,
          }
        );
        await DimzBot.relayMessage(m.chat, msg.message, {});
        reduceLimit(botId, m.sender);
      }
      break;

    case "ytmp3":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);
        if (!text)
          return reply(
            `Example : ${prefix + command} https://youtube.com/watch?v=example`
          );
        if (!/(youtu\.be|youtube\.com)/i.test(text))
          return reply(`Link YouTube Tidak Valid Le!`);
        if (/\/(channel|c|user)\//i.test(text))
          return reply(
            `Itu link *channel* YouTube, bukan link video\n\nKirim link video langsung ya cuy!`
          );

        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "⏳",
            key: m.key,
          },
        });

        try {
          const response = await axios.get(
            `https://ytdlpyton.nvlgroup.my.id/download/audio?url=${text}&mode=url&bitrate=auto`,
            {
              headers: {
                "User-Agent": FakeUseragent(),
                Accept: "application/json",
              },
            }
          );

          const resData = response.data;
          if (resData.status !== "Success" || !resData.download_url)
            throw new Error("❌ Gagal mengonversi video.");

          const { title, thumbnail, download_url } = resData;

          await DimzBot.sendMessage(
            m.chat,
            {
              audio: {
                url: download_url,
              },
              fileName: `${title}.mp3`,
              mimetype: "audio/mpeg",
              ptt: false,
              contextInfo: {
                forwardingScore: 9999,
                isForwarded: true,
                businessMessageForwardInfo: {
                  businessOwnerJid: nobisnis,
                },
                externalAdReply: {
                  containsAutoReply: true,
                  title: title,
                  body: text,
                  thumbnailUrl: thumbnail,
                  sourceUrl: text,
                  mediaType: 2,
                  mediaUrl: text,
                },
              },
            },
            {
              quoted: m,
            }
          );

          await DimzBot.sendMessage(m.chat, {
            react: {
              text: "✅",
              key: m.key,
            },
          });
        } catch (error) {
          console.error(error);

          const btn = baileys.proto.Message.ButtonsMessage;
          const buttonsMessage = btn.fromObject({
            contentText:
              "> *_❌ Gagal mengambil audio. Silakan coba lagi nanti._*\n\n",
            footerText: `*Atau klik tombol di bawah ini!*`,
            headerType: btn.HeaderType.EMPTY,
            buttons: [
              btn.Button.fromObject({
                buttonId: `.ytmp3 ${text}`,
                buttonText: btn.Button.ButtonText.fromObject({
                  displayText: "PENCARIAN ULANG 🔂",
                }),
                type: btn.Button.Type.RESPONSE,
              }),
            ],
          });

          const msg = baileys.generateWAMessageFromContent(
            m.chat,
            {
              viewOnceMessage: {
                message: {
                  buttonsMessage,
                },
              },
            },
            {
              quoted: m,
            }
          );

          await DimzBot.relayMessage(m.chat, msg.message, {});
        }
        reduceLimit(botId, m.sender);
      }
      break;

    case "ytmp4":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);
        if (!text)
          return reply(
            `Contoh: ${prefix + command} https://youtube.com/watch?v=example`
          );
        if (!/(youtu\.be|youtube\.com)/i.test(text))
          return reply(`Link YouTube Tidak Valid Le!`);
        if (/\/(channel|c|user)\//i.test(text))
          return reply(
            `Itu link *channel* YouTube, bukan link video\n\nKirim link video langsung ya cuy!`
          );

        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "📩",
            key: m.key,
          },
        });

        try {
          const videoUrl = encodeURIComponent(text);
          const response = await axios.get(
            `https://ytdlpyton.nvlgroup.my.id/download/?url=${videoUrl}&resolution=1080&mode=url`,
            {
              headers: {
                "User-Agent": FakeUseragent(),
                Accept: "application/json",
              },
            }
          );

          const resData = response.data;
          if (!resData || !resData.download_url)
            throw new Error("❌ Gagal mengambil data video.");

          const {
            title,
            thumbnail,
            uploader,
            duration: durationInSeconds,
            resolution,
            description,
            download_url,
            filesize,
          } = resData;

          const formatDuration = (seconds) => {
            if (isNaN(seconds) || seconds < 0) return "Tidak diketahui";
            const h = Math.floor(seconds / 3600);
            const m = Math.floor((seconds % 3600) / 60);
            const s = seconds % 60;
            return h > 0
              ? `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
              : `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
          };

          const formattedDuration = formatDuration(durationInSeconds);
          const quality = `${resolution}p`;
          const sizeMB =
            parseFloat((filesize || "0").toString().replace(/[^\d.]/g, "")) ||
            0;
          const terlaluBesar = sizeMB > 50;

          if (terlaluBesar) {
            await DimzBot.sendMessage(
              m.chat,
              {
                text: `⚠️ Ukuran video cukup besar (${sizeMB.toFixed(1)}MB)\n📁 Mengirim sebagai *document...*`,
              },
              {
                quoted: m,
              }
            );
          }

          await DimzBot.sendMessage(
            m.chat,
            {
              [terlaluBesar ? "document" : "video"]: {
                url: download_url,
              },
              caption: `
📌 *Judul:* ${title}
👤 *Channel:* ${uploader}
⏳ *Durasi:* ${formattedDuration}
🎥 *Kualitas:* ${quality}
📖 *Deskripsi:* ${description || "Tidak ada deskripsi"}
🔗 *URL:* ${text}
      `,
              fileName: `${title}.mp4`,
              mimetype: "video/mp4",
              contextInfo: {
                forwardingScore: 9999,
                isForwarded: true,
                businessMessageForwardInfo: {
                  businessOwnerJid: nobisnis,
                },
                externalAdReply: {
                  containsAutoReply: true,
                  title: title,
                  body: `Download Video - ${quality}`,
                  thumbnailUrl: thumbnail,
                  sourceUrl: text,
                  mediaType: 2,
                  mediaUrl: text,
                  renderLargerThumbnail: true,
                },
              },
            },
            {
              quoted: m,
            }
          );

          await DimzBot.sendMessage(m.chat, {
            react: {
              text: "✅",
              key: m.key,
            },
          });
        } catch (error) {
          console.error(error);
          const btn = baileys.proto.Message.ButtonsMessage;
          const buttonsMessage = btn.fromObject({
            contentText:
              "> *_❌ Gagal mengambil video. Silakan coba lagi nanti._*\n\n",
            footerText: `*Atau klik tombol di bawah ini!*`,
            headerType: btn.HeaderType.EMPTY,
            buttons: [
              btn.Button.fromObject({
                buttonId: `.ytmp4 ${text}`,
                buttonText: btn.Button.ButtonText.fromObject({
                  displayText: "PENCARIAN ULANG 🔂",
                }),
                type: btn.Button.Type.RESPONSE,
              }),
            ],
          });

          const msg = baileys.generateWAMessageFromContent(
            m.chat,
            {
              viewOnceMessage: {
                message: {
                  buttonsMessage,
                },
              },
            },
            {
              quoted: m,
            }
          );

          await DimzBot.relayMessage(m.chat, msg.message, {});
        }
        reduceLimit(botId, m.sender);
      }
      break;

    // stiker
    case "qc":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);
        const wm = argss
          .join(" ")
          .split("|")
          .map((v) => v.trim());
        const { quote } = require("./lib/quote.js");
        if (!text) return reply("Masukkan Text");
        let ppuser = await DimzBot.profilePictureUrl(m.sender, "image").catch(
          () =>
            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60"
        );

        let q;
        if (m.quoted?.text) {
          try {
            const { pushName: name } = await store.loadMessage(
              m.chat,
              m.quoted.id
            );
            q = {
              name,
              text: m.quoted.text,
            };
          } catch (e) {
            console.error(e);
            q = null;
          }
        }

        const rest = await quote(text, pushname, ppuser, q);

        stiker = await sticker(
          Buffer.from(rest.result),
          false,
          stikerpack,
          stikerauth
        );

        await DimzBot.sendMessage(
          m.chat,
          {
            sticker: stiker,
          },
          {
            quoted: m,
          }
        );
        reduceLimit(botId, m.sender);
      }
      break;
    case "qcc":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);

        const colorMap = {
          pink: "#f68ac9",
          biru: "#6cace4",
          merah: "#f44336",
          hijau: "#4caf50",
          kuning: "#ffeb3b",
          ungu: "#9c27b0",
          birutua: "#0d47a1",
          birumuda: "#03a9f4",
          abu: "#9e9e9e",
          orange: "#ff9800",
          hitam: "#000000",
          putih: "#ffffff",
          teal: "#008080",
          merahmuda: "#FFC0CB",
          cokelat: "#A52A2A",
          salmon: "#FFA07A",
          magenta: "#FF00FF",
          tan: "#D2B48C",
          wheat: "#F5DEB3",
          deeppink: "#FF1493",
          api: "#B22222",
          birulangit: "#00BFFF",
          jingga: "#FF7F50",
          birulangitcerah: "#1E90FF",
          hotpink: "#FF69B4",
          birumudalangit: "#87CEEB",
          hijaulaut: "#20B2AA",
          merahtua: "#8B0000",
          oranyemerah: "#FF4500",
          cyan: "#48D1CC",
          ungutua: "#BA55D3",
          hijaulumut: "#00FF7F",
          hijaugelap: "#008000",
          birulaut: "#191970",
          oranyetua: "#FF8C00",
          ungukehitaman: "#9400D3",
          fuchsia: "#FF00FF",
          magentagelap: "#8B008B",
          abuabutua: "#2F4F4F",
          peachpuff: "#FFDAB9",
          hijautua: "#BDB76B",
          merahgelap: "#DC143C",
          goldenrod: "#DAA520",
          ungugelap: "#483D8B",
          emas: "#FFD700",
          perak: "#C0C0C0",
        };

        if (!text) {
          const warnaList = Object.keys(colorMap).join(", ");
          return reply(
            `❌ Masukkan warna dan teks.\n\nContoh: *${prefix + command} pink Halo dunia!*\n\n📌 *Daftar warna yang tersedia:*\n${warnaList}`
          );
        }

        const [colorRaw, ...msgParts] = text.split(" ");
        const color = colorRaw.toLowerCase();
        const backgroundColor = colorMap[color];
        const message = backgroundColor ? msgParts.join(" ") : text;
        const finalColor = backgroundColor || "#000000";

        if (!backgroundColor) {
          const warnaList = Object.keys(colorMap).join(", ");
          return reply(
            `❌ Warna *${color}* tidak tersedia.\n\n📌 *Daftar warna yang tersedia:*\n${warnaList}`
          );
        }

        if (!message)
          return reply(
            `❌ Masukkan teks setelah warna.\n\nContoh: *${prefix + command} pink Halo dunia!*`
          );

        const axios = require("axios");
        const ppuser = await DimzBot.profilePictureUrl(m.sender, "image").catch(
          () =>
            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
        );

        let replyObj = null;
        if (m.quoted?.text) {
          try {
            const quoted = await store.loadMessage(m.chat, m.quoted.id);
            replyObj = {
              name: quoted.pushName || "Pengguna",
              text: m.quoted.text,
              chatId: 1,
            };
          } catch {
            replyObj = null;
          }
        }

        const payload = {
          type: "quote",
          format: "png",
          backgroundColor: finalColor,
          width: 512,
          height: 768,
          scale: 2,
          messages: [
            {
              entities: [],
              avatar: true,
              from: {
                id: 1,
                name: pushname,
                photo: {
                  url: ppuser,
                },
              },
              text: message,
              replyMessage: replyObj || {},
            },
          ],
        };

        const res = await axios.post(
          "https://qc.botcahx.eu.org/generate",
          payload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const buffer = Buffer.from(res.data.result.image, "base64");
        await DimzBot.sendImageAsSticker(m.chat, buffer, m, {
          packname: stikerpack,
          author: stikerauth,
        });
        reduceLimit(botId, m.sender);
      }
      break;
    case "brat":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);
        if (!text)
          return reply(
            `Silakan masukkan teks untuk membuat stiker, misalnya: ${prefix + command} Awokawok`
          );

        await DimzBot.sendMessage(m.chat, {
          react: { text: "👁‍🗨", key: m.key },
        });

        try {
          const fs = require("fs");
          const { HttpsProxyAgent } = require("https-proxy-agent");

          const proxies = fs.existsSync("../proxy.txt")
            ? fs
                .readFileSync("../proxy.txt", "utf-8")
                .trim()
                .split("\n")
                .filter(Boolean)
            : [];

          const proxy = proxies.length
            ? proxies[Math.floor(Math.random() * proxies.length)]
            : null;

          let agent = null;
          if (proxy) {
            const [host, port, user, pass] = proxy.split(":");
            agent = new HttpsProxyAgent(
              `http://${user}:${pass}@${host}:${port}`
            );
          }

          // 🔥 API LANGSUNG IMAGE
          const img = await axios.get(
            `https://api-faa.my.id/faa/brathd?text=${encodeURIComponent(text)}`,
            {
              responseType: "arraybuffer",
              timeout: 15000,
              ...(agent ? { httpsAgent: agent, proxy: false } : {}),
            }
          );

          await DimzBot.sendImageAsSticker(m.chat, Buffer.from(img.data), m, {
            packname: stikerpack,
            author: stikerauth,
          });

          await DimzBot.sendMessage(m.chat, {
            react: { text: "✅", key: m.key },
          });

          reduceLimit(botId, m.sender);
        } catch (e) {
          console.error("Error Brat:", e);
          reply("Terjadi kesalahan saat membuat stiker. Coba lagi nanti.");
        }
      }
      break;

    case "bratvid":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);
        if (!text)
          return reply(
            `Silakan masukkan teks untuk membuat stiker video\nContoh: ${prefix + command} chau nima`
          );

        await DimzBot.sendMessage(m.chat, {
          react: { text: "👁‍🗨", key: m.key },
        });

        try {
          const fs = require("fs");
          const { HttpsProxyAgent } = require("https-proxy-agent");

          const proxies = fs.existsSync("../proxy.txt")
            ? fs
                .readFileSync("../proxy.txt", "utf-8")
                .trim()
                .split("\n")
                .filter(Boolean)
            : [];

          const proxy = proxies.length
            ? proxies[Math.floor(Math.random() * proxies.length)]
            : null;

          const agent = proxy
            ? (() => {
                const [host, port, user, pass] = proxy.split(":");
                return new HttpsProxyAgent(
                  `http://${user}:${pass}@${host}:${port}`
                );
              })()
            : null;

          // ⚠️ API Faa → RESULT = VIDEO LANGSUNG
          const res = await axios.get(
            `https://api-faa.my.id/faa/bratvid?text=${encodeURIComponent(text)}`,
            {
              responseType: "arraybuffer",
              timeout: 20000,
              ...(agent ? { httpsAgent: agent, proxy: false } : {}),
            }
          );

          const videoBuffer = Buffer.from(res.data);

          await DimzBot.sendVideoAsSticker(m.chat, videoBuffer, m, {
            packname: stikerpack,
            author: stikerauth,
          });

          reduceLimit(botId, m.sender);

          await DimzBot.sendMessage(m.chat, {
            react: { text: "✅", key: m.key },
          });
        } catch (e) {
          console.error("Error BratVid:", e);
          reply("❌ Gagal membuat stiker video. Coba teks lain atau ulangi.");
        }
      }
      break;

    // voice changer
    case "kobo":
    case "zeta":
    case "gura":
    case "kaela":
    case "pekora":
    case "miko":
    case "subaru":
    case "korone":
    case "luna":
    case "anya":
    case "reine":
    case "calli":
    case "kroni":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);
        if (!text)
          return reply(`_Masukkan Pitch Nya_\nContoh : ${prefix + command} 14

 _*Pitch Untuk Cewek:*_
 0 Sampai 5

 _*Pitch Untuk Cowok:*_
 10 Sampai 15`);
        if (/audio/.test(mime)) {
          await DimzBot.sendMessage(m.chat, {
            react: {
              text: "🕒",
              key: m.key,
            },
          });
          await sleep(2000);
          reply(mess.vcwet);
          let vok = await DimzBot.downloadAndSaveMediaMessage(quoted);
          let buffer = fs.readFileSync(vok);
          let zet = await all(command, buffer, text);
          reply(mess.sending);
          await DimzBot.sendMessage(
            from,
            {
              audio: {
                url: zet.base64,
              },
              ptt: false,
              mimetype: "audio/mp4",
              contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                  newsletterJid: "120363179857645465@newsletter",
                  newsletterName: "☰『✦ Powered by softbotz.my.id ✦』",
                },
              },
            },
            {
              quoted: m,
            }
          );
        } else {
          reply(mess.vcreply);
        }
      }
      break;

    case "voice-zeta":
    case "voice-moona":
    case "voice-iofi":
    case "voice-risu":
    case "voice-ollie":
    case "voice-reine":
    case "voice-anya":
    case "voice-kobo":
    case "voice-kaela":
      {
        try {
          if (!hasLimit(botId, m.sender)) return reply(mess.limit0);
          if (!text) {
            return reply(`_Masukkan Pitch Nya_\nContoh : ${prefix + command} 14

 _*Pitch Untuk Cewek:*_
 0 Sampai 5

 _*Pitch Untuk Cowok:*_
 10 Sampai 15`);
          }
          let pitch = parseInt(text);
          if (isNaN(pitch) || pitch < 0 || pitch > 20) {
            return reply(`Pitch tidak valid! Masukkan angka antara 0 hingga 20\n\nContoh penggunaan:\n${prefix + command} 12
                
 _*Pitch Untuk Cewek:*_
 0 Sampai 5

 _*Pitch Untuk Cowok:*_
 10 Sampai 15`);
          }

          if (!quoted || !/audio/.test(mime)) {
            return reply(
              `Kirim/Reply Audio Dengan Caption ${prefix + command}`
            );
          }

          reply(mess.vcwet);
          let filnya = command.replace("voice-", "");
          const validModels = [
            "zeta",
            "moona",
            "iofi",
            "risu",
            "ollie",
            "reine",
            "anya",
            "kobo",
            "kaela",
          ];
          if (!validModels.includes(filnya)) {
            return reply("Model tidak ditemukan! Gunakan command yang valid.");
          }
          let vok = await DimzBot.downloadAndSaveMediaMessage(quoted);
          let buffer = fs.readFileSync(vok);
          console.log("Audio berhasil dibaca sebagai buffer.");
          let zet = await hololive(buffer.toString("base64"), filnya, pitch);
          await DimzBot.sendMessage(m.chat, {
            react: {
              text: "⏳",
              key: m.key,
            },
          });

          await DimzBot.sendMessage(
            from,
            {
              audio: {
                url: zet,
              },
              ptt: false,
              mimetype: "audio/mp4",
              contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                  newsletterJid: "120363179857645465@newsletter",
                  newsletterName: "☰『✦ Powered by softbotz.my.id ✦』",
                },
              },
            },
            {
              quoted: m,
            }
          );
          reduceLimit(botId, m.sender);
        } catch (error) {
          reply(`Terjadi kesalahan: ${error.message}`);
        }
        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "",
            key: m.key,
          },
        });
      }
      break;

    // menfess confess
    case "menfess":
    case "menfes":
      {
        const botGlobal = (await getGlobal(botId)) || {};
        if (botGlobal.global_disabled?.menfess)
          return reply(`❌ Fitur ${command} sedang dimatikan oleh owner`);
        this.menfes = this.menfes ? this.menfes : {};
        roof = Object.values(this.menfes).find((menpes) =>
          [menpes.a, menpes.b].includes(m.sender)
        );
        if (roof) return reply("Kamu masih berada dalam sesi menfess");
        if (m.isGroup) return reply("Fitur Khusus Di private chat!");
        if (!text)
          return reply(
            `Kirim perintah ${prefix + command} nama|nomor|pesan\n\nContoh:\n${prefix + command} Dimas|628xxx|Menfes nih`
          );

        if (!text.includes("|"))
          return reply(
            `Kirim perintah ${prefix + command} nama|nomor|pesan\n\nContoh:\n${prefix + command} Dimas|628xxx|Menfes nih`
          );

        let [namaNya, nomorNya, pesanNya] = text
          .split("|")
          .map((v) => v.trim());

        nomorNya = nomorNya.replace(/[^0-9]/g, "");

        if (!nomorNya || isNaN(nomorNya))
          return reply("Nomor tidak valid! Hanya boleh angka.");

        const senderNum = m.sender.replace(/[^0-9]/g, "");
        if (nomorNya === senderNum)
          return reply("Kamu tidak bisa mengirim ke nomor sendiri!");

        var yoi = `╭─❏ *M E N F E S S*
│ • Dari     : ${namaNya}
│ • Tanggal  : ${day(Date.now())}, ${tanggal(Date.now())} ${bulan(Date.now())} ${tahun(Date.now())}
│ • Jam      : ${xtime}
╰───────────────

💌 *Pesan:*  
${pesanNya}



`;

        let sections = [
          {
            title: `${botName} by ${global.wmbotzz}`,
            rows: [
              {
                title: "Stop Menfess",
                description: `Berhenti Dari Sesi Menfess Ini`,
                id: `${prefix}stopmenfess`,
              },
            ],
          },
        ];

        let listMessage = {
          title: "Pilih Opsi Di Sini",
          sections,
        };

        let msg = generateWAMessageFromContent(
          m.chat,
          {
            viewOnceMessage: {
              message: {
                messageContextInfo: {
                  deviceListMetadata: {},
                  deviceListMetadataVersion: 2,
                },
                interactiveMessage: proto.Message.InteractiveMessage.create({
                  body: proto.Message.InteractiveMessage.Body.create({
                    text: ``,
                  }),
                  footer: proto.Message.InteractiveMessage.Footer.create({
                    text: `💬 ᴘᴇsᴀɴ ɪɴɪ ᴅɪ ᴛᴜʟɪs ᴏʟᴇʜ sᴇsᴇᴏʀᴀɴɢ ᴘᴇɴɢɢᴜɴᴀ ʙᴏᴛ, sᴀʏᴀ ʜᴀɴʏᴀ ᴍᴇɴʏᴀᴍᴘᴀɪᴋᴀɴ ᴘᴇsᴀɴ ɴʏᴀ sᴀᴊᴀ.
⚠️sᴀᴀᴛ ʙᴏᴛ ʀᴇsᴛᴀʀᴛ ᴍᴀᴋᴀ sᴇsɪ ᴍᴇɴғᴇss/ᴄᴏɴғᴇss ᴀᴋᴀɴ ʙᴇʀᴀᴋʜɪʀ sᴇᴄᴀʀᴀ ᴏᴛᴏᴍᴀᴛɪs
☎ ᴛᴇʟᴘᴏɴ/ᴠᴄ ʙᴏᴛ? ʙʟᴏᴋ ᴘᴇʀᴍᴀɴᴇɴ`,
                  }),
                  header: proto.Message.InteractiveMessage.Header.create({
                    title: yoi,
                    hasMediaAttachment: false,
                  }),
                  nativeFlowMessage:
                    proto.Message.InteractiveMessage.NativeFlowMessage.create({
                      buttons: [
                        {
                          name: "single_select",
                          buttonParamsJson: JSON.stringify(listMessage),
                        },
                        {
                          name: "quick_reply",
                          buttonParamsJson: JSON.stringify({
                            display_text: `Terima Pesan Menfess ✅`,
                            id: ".balasmenfess",
                          }),
                        },
                        {
                          name: "quick_reply",
                          buttonParamsJson: JSON.stringify({
                            display_text: `Tolak Pesan Menfess ❌`,
                            id: ".tolakmenfess",
                          }),
                        },
                      ],
                    }),
                  contextInfo: {
                    mentionedJid: [m.sender, "0@s.whatsapp.net"],
                    externalAdReply: {
                      containsAutoReply: true,
                    },
                  },
                }),
              },
            },
          },
          {
            quoted: fmenfessverif,
          }
        );

        let id = m.sender;
        this.menfes[id] = {
          id,
          a: m.sender,
          b: nomorNya + "@s.whatsapp.net",
          state: "WAITING",
        };
        await DimzBot.relayMessage(nomorNya + "@s.whatsapp.net", msg.message, {
          messageId: msg.key.id,
        });
        reply(
          `Pesan berhasil dikirim ke nomor tujuan. Semoga dibalas ya!
Untuk keluar dari sesi menfess, ketik *${prefix}stopmenfess*

━━━〔 *INFORMASI & RULES MENFESS* 〕━━━

1. Kamu bisa mengirim pesan berupa:
   • Teks
   • Stiker
   • Gambar
   • VN (Voice Note)
   • Audio
   • Emoji / GIF
   • Video pendek (≤15 detik)
   • Share Lokasi
   • Dokumen kecil (PDF, TXT, dsb)

2. *Dilarang keras* melakukan:
   • Spam pesan berulang
   • Kirim konten terlarang / SARA
   • Telpon / VC ke bot (akan langsung diblok)
   • Kirim file berukuran besar (maks 10MB)

3. Semua pesan akan dikirim secara *anonim*.
   Identitas kamu akan tetap *dirahasiakan*.

4. Untuk menghentikan sesi menfess kapan saja:
   Ketik *${prefix}stopmenfess*

5. ⚠️ *Catatan Penting:*
   Jika bot *direstart* atau *dimatikan*, maka semua sesi menfess yang sedang aktif akan otomatis berakhir. Lanjutkan dengan kirim ulang dari awal jika ingin mengirim lagi.

━━━━━━━━━━━━━━━━━━━━━━━
Gunakan fitur ini dengan bijak dan jangan bikin malu sendiri ya!`
        );
      }
      break;

    case "balasmenfess":
    case "balasmenfes":
      {
        roof = Object.values(this.menfes).find((menpes) =>
          [menpes.a, menpes.b].includes(m.sender)
        );
        if (!roof) return reply("Belum ada sesi menfess");
        find = Object.values(this.menfes).find(
          (menpes) => menpes.state == "WAITING"
        );
        let room = Object.values(this.menfes).find(
          (room) =>
            [room.a, room.b].includes(m.sender) && room.state === "WAITING"
        );
        let other = [room.a, room.b].find((user) => user !== m.sender);
        find.b = m.sender;
        find.state = "CHATTING";
        this.menfes[find.id] = {
          ...find,
        };

        await DimzBot.sendMessage(other, {
          text: `_@${m.sender.split("@")[0]} telah menerima menfess kamu, sekarang kamu bisa chat lewat bot ini._

━━━〔 *INFORMASI & RULES MENFESS* 〕━━━

1. Kamu bisa mengirim pesan berupa:
   • Teks
   • Stiker
   • Gambar
   • VN (Voice Note)
   • Audio
   • Emoji / GIF
   • Video pendek (≤15 detik)
   • Share Lokasi
   • Dokumen kecil (PDF, TXT, dsb)

2. *Dilarang keras* melakukan:
   • Spam pesan berulang
   • Kirim konten terlarang / SARA
   • Telpon / VC ke bot (akan langsung diblok)
   • Kirim file berukuran besar (maks 10MB)

3. Semua pesan akan dikirim secara *anonim*.
   Identitas kamu akan tetap *dirahasiakan*.

4. Untuk menghentikan sesi menfess kapan saja:
   Ketik *${prefix}stopmenfess*

5. ⚠️ *Catatan Penting:*
   Jika bot *direstart* atau *dimatikan*, maka semua sesi menfess yang sedang aktif akan otomatis berakhir. Lanjutkan dengan kirim ulang dari awal jika ingin mengirim lagi.

━━━━━━━━━━━━━━━━━━━━━━━

Gunakan fitur ini dengan bijak dan sopan ya!
`,
          mentions: [m.sender],
        });

        await DimzBot.sendMessage(m.chat, {
          text: `_Menfess telah diterima, sekarang kamu bisa chat-an lewat bot ini._

━━━〔 *INFORMASI & RULES MENFESS* 〕━━━

1. Kamu bisa mengirim pesan berupa:
   • Teks
   • Stiker
   • Gambar
   • VN (Voice Note)
   • Audio
   • Emoji / GIF
   • Video pendek (≤15 detik)
   • Share Lokasi
   • Dokumen kecil (PDF, TXT, dsb)

2. *Dilarang keras* melakukan:
   • Spam pesan berulang
   • Kirim konten terlarang / SARA
   • Telpon / VC ke bot (akan langsung diblok)
   • Kirim file berukuran besar (maks 10MB)

3. Semua pesan akan dikirim secara *anonim*.
   Identitas kamu akan tetap *dirahasiakan*.

4. Untuk menghentikan sesi menfess kapan saja:
   Ketik *${prefix}stopmenfess*

5. ⚠️ *Catatan Penting:*
   Jika bot *direstart* atau *dimatikan*, maka semua sesi menfess yang sedang aktif akan otomatis berakhir. Lanjutkan dengan kirim ulang dari awal jika ingin mengirim lagi.

━━━━━━━━━━━━━━━━━━━━━━━

Selamat mengobrol secara anonim!
`,
        });
      }
      break;

    case "tolakmenfess":
    case "tolakmenfes":
      {
        let room = Object.values(this.menfes).find((menpes) =>
          [menpes.a, menpes.b].includes(m.sender)
        );
        if (!room) return reply("Belum ada sesi menfess");

        if (room.state === "WAITING") {
          let other = [room.a, room.b].find((user) => user !== m.sender);

          DimzBot.sendMessage(other, {
            text: `_Uppsss... @${m.sender.split("@")[0]} menolak menfess kamu_`,
            mentions: [m.sender],
          });

          reply("Menfess berhasil ditolak 🤚");
          delete this.menfes[room.id];
        } else {
          reply("Tidak ada sesi menfess yang bisa ditolak");
        }
      }
      break;

    case "stopmenfess":
    case "stopmenfes":
      {
        let room = Object.values(this.menfes).find((menpes) =>
          [menpes.a, menpes.b].includes(m.sender)
        );
        if (!room) return reply("Belum ada sesi menfess");

        const to = room.a === m.sender ? room.b : room.a;

        DimzBot.sendMessage(to, {
          text: `_Teman chat telah menghentikan menfess ini_`,
          mentions: [m.sender],
        });

        await reply("Sesi menfess telah dihentikan ❌");
        delete this.menfes[room.id];
      }
      break;

    case "confess":
    case "confes":
      {
        const botGlobal = (await getGlobal(botId)) || {};
        if (botGlobal.global_disabled?.confess)
          return reply(`❌ Fitur ${command} sedang dimatikan oleh owner`);
        if (Object.values(anon.anonymous).find((p) => p.check(sender)))
          return reply("Kamu Masih Di Dalam Room");
        if (m.isGroup) return reply(mess.private);
        if (argss.length < 1)
          return reply(
            `Use ${prefix + command} number|your message\nContoh ${
              prefix + command
            } ${ownernumber}|Hay`
          );
        if (text > 700)
          return reply(`Teksnya terlalu panjang dan isi dengan benar`);
        num = q.split("|")[0].replace(/[^0-9]/g, "") + "@s.whatsapp.net";
        pesan = q.split("|")[1];
        let cekno = await DimzBot.onWhatsApp(num);
        if (cekno.length == 0)
          return reply(
            `Masukkan nomor yang valid dan terdaftar di WhatsApp!!!`
          );
        if (num === m.sender) return reply(`Tidak Bisa Ke Nomor Sendiri!!!`);
        if (num === botNumber) return reply(`Tidak Bisa ke nomor bot!!!`);
        var nomor = m.sender;

        const xeonconfesmsg = `Hay Kak Saya Bot\n\n*Seseorang mengirimkan pesan ke kamu*

💬 Pesan : ${pesan}



\n\n\n*Powered By* @${creator2.split("@")[0]}`;

        await DimzBot.sendMessage(
          num,
          {
            text: xeonconfesmsg,
            contextInfo: {
              mentionedJid: [m.sender, creator2, "0@s.whatsapp.net"],
              externalAdReply: {
                containsAutoReply: true,
                title: `📢Jika tidak ingin membalas silahkan ketik .leave dan kirim`,
                body: botName,
                previewType: "PHOTO",
                thumbnailUrl: defaultpp,
                sourceUrl: `${wagc}`,
              },
            },
          },
          {
            quoted: fmenfess,
          }
        );

        await DimzBot.sendMessage(
          num,
          {
            text: `Saya cuma bot kak,jangan telpon saya,ngeyel blok permanen\n\n_Pengen bales pesan? cukup ketik apa yg kakak mau nanti saya sampaikan,klo gk mau bales bisa ketik leave_\n\n\*_⚠️saat bot restart maka sesi confess akan berakhir secara otomatis_*`,
          },
          {
            quoted: fverif,
          }
        );
        lidt = `Pesan sukses terkirim
👤 Dari : wa.me/${nomor.split("@s.whatsapp.net")[0]}
👥 Ke : wa.me/${q.split("|")[0].replace(/[^0-9]/g, "")}

Pesan Anda  ${pesan}



> \`Kamu bisa langsung saling chat ke wa.me/${q.split("|")[0].replace(/[^0-9]/g, "")} tanpa perlu persetujuan dari penerima, karena sistem confess sama seperti anonymous chat 💬\`

*ketik .leave untuk keluar dari sesi anonymous*


*_⚠️saat bot restart maka sesi confess akan berakhir secara otomatis_*`;
        var check = Object.values(anon.anonymous).find(
          (p) => p.state == "WAITING"
        );
        if (!check) {
          anon.createRoom(sender, num);
          return reply(lidt);
        }
      }
      break;
    case "leave":
      {
        if (m.isGroup) return reply("hanya untuk private chat");
        var room = Object.values(anon.anonymous).find((p) => p.check(sender));
        if (!room) return reply("Kamu Tidak Di Dalam Room");
        reply("Berhasil Keluar Dari Sesi Anonymous Chat");
        var other = room.other(sender);
        delete anon.anonymous[room.id];
        if (other != "")
          await DimzBot.sendMessage(other, {
            text: "Teman Telah Keluar Dari Sesi Anonymous Chat",
          });
        if (command == "leave") break;
      }
      break;

    // fitur ai
    case "watercolor":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);

        const quotedMsg = m.quoted || m;
        const mime = quotedMsg.mimetype || "";

        if (!/image/.test(mime)) {
          return reply("❌ Reply foto untuk dijadikan *watercolor style*.");
        }

        await DimzBot.sendMessage(m.chat, {
          react: { text: "🎨", key: m.key },
        });

        try {
          const { agent } = getRandomProxyAgent();

          const buffer = await quotedMsg.download();
          const imageUrl = await drizzup(buffer);

          const res = await axios.get(
            `https://api.nekolabs.web.id/style.changer/watercolor?imageUrl=${encodeURIComponent(imageUrl)}`,
            {
              httpsAgent: agent, proxy: false,
              timeout: 30000,
              validateStatus: () => true,
            }
          );

          if (!res.data || !res.data.success || !res.data.result) {
            return reply("❌ Gagal mengubah gambar ke watercolor style.");
          }

          const imgBuffer = await getBuffer(res.data.result, agent);

          await DimzBot.sendMessage(
            m.chat,
            { image: imgBuffer },
            { quoted: m }
          );

          reduceLimit(botId, m.sender);
        } catch (e) {
          console.error("WATERCOLOR ERROR:", e);
          reply("❌ Terjadi kesalahan saat memproses gambar.");
        }
      }
      break;

    case "vintage":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);

        const quotedMsg = m.quoted || m;
        const mime = quotedMsg.mimetype || "";

        if (!/image/.test(mime)) {
          return reply("❌ Reply foto untuk dijadikan *vintage style*.");
        }

        await DimzBot.sendMessage(m.chat, {
          react: { text: "📸", key: m.key },
        });

        try {
          const { agent } = getRandomProxyAgent();

          const buffer = await quotedMsg.download();
          const imageUrl = await drizzup(buffer);

          const res = await axios.get(
            `https://api.nekolabs.web.id/style.changer/vintage?imageUrl=${encodeURIComponent(imageUrl)}`,
            {
              httpsAgent: agent, proxy: false,
              timeout: 30000,
              validateStatus: () => true,
            }
          );

          if (!res.data || !res.data.success || !res.data.result) {
            return reply("❌ Gagal mengubah gambar ke vintage style.");
          }

          const imgBuffer = await getBuffer(res.data.result, agent);

          await DimzBot.sendMessage(
            m.chat,
            { image: imgBuffer },
            { quoted: m }
          );

          reduceLimit(botId, m.sender);
        } catch (e) {
          console.error("VINTAGE ERROR:", e);
          reply("❌ Terjadi kesalahan saat memproses gambar.");
        }
      }
      break;

    case "animestyle":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);

        const quotedMsg = m.quoted || m;
        const mime = quotedMsg.mimetype || "";

        if (!/image/.test(mime)) {
          return reply("❌ Reply foto untuk dijadikan *anime style*.");
        }

        await DimzBot.sendMessage(m.chat, {
          react: { text: "🎨", key: m.key },
        });

        try {
          const { agent } = getRandomProxyAgent();

          const buffer = await quotedMsg.download();
          const imageUrl = await drizzup(buffer);

          const res = await axios.get(
            `https://api.nekolabs.web.id/style.changer/anime?imageUrl=${encodeURIComponent(imageUrl)}`,
            {
              httpsAgent: agent, proxy: false,
              timeout: 30000,
              validateStatus: () => true,
            }
          );

          if (!res.data || !res.data.success || !res.data.result) {
            return reply("❌ Gagal mengubah gambar ke anime style.");
          }

          const imgBuffer = await getBuffer(res.data.result, agent);

          await DimzBot.sendMessage(
            m.chat,
            { image: imgBuffer },
            { quoted: m }
          );

          reduceLimit(botId, m.sender);
        } catch (e) {
          console.error("ANIMESTYLE ERROR:", e);
          reply("❌ Terjadi kesalahan saat memproses gambar.");
        }
      }
      break;

    case "bing":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);
        if (!text) return reply(`Contoh:\n${prefix + command} kucing`);

        await DimzBot.sendMessage(m.chat, {
          react: { text: "🔎", key: m.key },
        });

        try {
          const axios = require("axios");
          const { agent } = getRandomProxyAgent();

          const res = await axios.get(
            `https://api.siputzx.my.id/api/s/bimg?query=${encodeURIComponent(text)}`,
            {
              httpsAgent: agent, proxy: false,
              timeout: 20000,
            }
          );

          if (!res.data?.status || !Array.isArray(res.data.data))
            return reply("❌ Gagal mengambil gambar dari Bing.");

          const images = res.data.data;
          if (!images.length) return reply("❌ Gambar tidak ditemukan.");

          // ambil random 1 gambar
          const img = images[Math.floor(Math.random() * images.length)];

          await DimzBot.sendMessage(
            m.chat,
            {
              image: { url: img },
              caption: `🔎 *Bing Image Search*\n\n📌 Query: *${text}*`,
            },
            { quoted: m }
          );

          reduceLimit(botId, m.sender);
        } catch (e) {
          console.error("BING ERROR:", e);
          reply("❌ Terjadi kesalahan saat mengambil gambar.");
        }
      }
      break;

    case "nanoai":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);
        if (!m.quoted || !/image/.test(m.quoted.mimetype || "")) {
          return reply(
            `Balas gambar dengan format:\n` +
              `${prefix + command} perempuan | 18-24 | beautiful woman wearing elegant pink outfit, glasses, realistic portrait
      
hanya laki-laki atau perempuan`
          );
        }

        if (!text || !text.includes("|")) {
          return reply(
            `Format salah!\n` +
              `Contoh:\n` +
              `${prefix + command} perempuan | 18-24 | beautiful woman wearing elegant pink outfit, glasses
      
hanya laki-laki atau perempuan`
          );
        }

        await DimzBot.sendMessage(m.chat, {
          react: { text: "🧠", key: m.key },
        });

        try {
          const axios = require("axios");
          const crypto = require("crypto");
          const FormData = require("form-data");

          const [genderRaw, ageRaw, ...promptArr] = text
            .split("|")
            .map((v) => v.trim());
          const prompt = promptArr.join(" | ");

          const gender = genderRaw.toLowerCase().includes("perem")
            ? "Perempuan"
            : "Laki-laki";

          const age = ageRaw || "18-24";

          const deviceNames = [
            // ===== ANDROID — SAMSUNG =====
            "Samsung SM-A136B",
            "Samsung SM-A236E",
            "Samsung SM-A336E",
            "Samsung SM-A536E",
            "Samsung SM-A546E",
            "Samsung Galaxy S20",
            "Samsung Galaxy S21",
            "Samsung Galaxy S22",
            "Samsung Galaxy S23",
            "Samsung Galaxy S24",
            "Samsung Galaxy S23 Ultra",
            "Samsung Galaxy S24 Ultra",
            "Samsung Galaxy Note 20",
            "Samsung Galaxy M14",
            "Samsung Galaxy M23",
            "Samsung Galaxy M34",
            "Samsung Galaxy M54",
            "Samsung Galaxy Z Flip 4",
            "Samsung Galaxy Z Flip 5",
            "Samsung Galaxy Z Fold 4",
            "Samsung Galaxy Z Fold 5",

            // ===== ANDROID — XIAOMI / POCO =====
            "Xiaomi Redmi 9A",
            "Xiaomi Redmi 10",
            "Xiaomi Redmi 12",
            "Xiaomi Redmi Note 10",
            "Xiaomi Redmi Note 11",
            "Xiaomi Redmi Note 12",
            "Xiaomi Redmi Note 13",
            "Xiaomi Mi 10",
            "Xiaomi Mi 11",
            "Xiaomi Mi 12",
            "Xiaomi 12 Pro",
            "Xiaomi 13",
            "Xiaomi 13 Pro",
            "Xiaomi Poco X3",
            "Xiaomi Poco X5",
            "Xiaomi Poco X6 Pro",
            "Xiaomi Poco F3",
            "Xiaomi Poco F4",
            "Xiaomi Poco F5",

            // ===== ANDROID — OPPO =====
            "Oppo A15",
            "Oppo A16",
            "Oppo A54",
            "Oppo A57",
            "Oppo A78",
            "Oppo Reno 6",
            "Oppo Reno 7",
            "Oppo Reno 8",
            "Oppo Reno 10",
            "Oppo Find X3",
            "Oppo Find X5",
            "Oppo Find X6 Pro",

            // ===== ANDROID — VIVO =====
            "Vivo Y12",
            "Vivo Y16",
            "Vivo Y20",
            "Vivo Y21",
            "Vivo Y33s",
            "Vivo Y35",
            "Vivo Y36",
            "Vivo V23",
            "Vivo V25",
            "Vivo V27",
            "Vivo X60",
            "Vivo X70",
            "Vivo X80 Pro",

            // ===== ANDROID — REALME =====
            "Realme C11",
            "Realme C21",
            "Realme C33",
            "Realme C55",
            "Realme 8",
            "Realme 9",
            "Realme 10",
            "Realme GT Neo 2",
            "Realme GT Neo 3",
            "Realme GT 5",

            // ===== ANDROID — INFINIX / TECNO =====
            "Infinix Hot 10",
            "Infinix Hot 11",
            "Infinix Hot 12",
            "Infinix Hot 30",
            "Infinix Note 10",
            "Infinix Note 12",
            "Infinix Zero 5G",
            "Infinix Zero Ultra",
            "Tecno Spark 8",
            "Tecno Spark 10",
            "Tecno Pova 3",
            "Tecno Pova 5",
            "Tecno Camon 18",
            "Tecno Camon 20",

            // ===== iOS — IPHONE =====
            "iPhone 8",
            "iPhone 8 Plus",
            "iPhone X",
            "iPhone XR",
            "iPhone XS",
            "iPhone XS Max",
            "iPhone 11",
            "iPhone 11 Pro",
            "iPhone 11 Pro Max",
            "iPhone SE (2020)",
            "iPhone 12",
            "iPhone 12 Mini",
            "iPhone 12 Pro",
            "iPhone 12 Pro Max",
            "iPhone 13",
            "iPhone 13 Mini",
            "iPhone 13 Pro",
            "iPhone 13 Pro Max",
            "iPhone SE (2022)",
            "iPhone 14",
            "iPhone 14 Plus",
            "iPhone 14 Pro",
            "iPhone 14 Pro Max",
            "iPhone 15",
            "iPhone 15 Plus",
            "iPhone 15 Pro",
            "iPhone 15 Pro Max",
          ];

          const deviceId = crypto.randomBytes(16).toString("hex");
          const deviceName =
            deviceNames[Math.floor(Math.random() * deviceNames.length)];

          const mediaBuffer = await m.quoted.download();

          const { agent } = getRandomProxyAgent();

          const inst = axios.create({
            baseURL: "https://api.bananoai.store",
            headers: {
              "user-agent": "Linux",
              "accept-encoding": "gzip",
            },
            httpsAgent: agent, proxy: false,
            timeout: 30000,
          });

          const { data: auth } = await inst.post(
            "/user/login?language=id&version=4",
            {
              device_id: deviceId,
              platform: "android",
              device_name: deviceName,
              provider: "guest",
              uid: "",
              name: "",
              avatar: "",
              exp: {},
            }
          );

          if (!auth?.token) return reply("❌ Gagal login ke NanoAI");

          inst.defaults.headers.authorization = `Bearer ${auth.token}`;

          const form = new FormData();
          form.append("prompt", prompt);
          form.append("image_portrait", mediaBuffer, {
            filename: `nanoai_${Date.now()}.jpg`,
            contentType: "image/jpeg",
          });

          const { data: task } = await inst.post(
            `/image/generate_ai_studio?language=id&age=${encodeURIComponent(
              age
            )}&gender=${encodeURIComponent(gender)}&version=4`,
            form,
            { headers: form.getHeaders() }
          );

          if (!task?.data?.order_code)
            return reply("❌ Gagal membuat task NanoAI");

          let resultUrl = null;

          while (!resultUrl) {
            const { data } = await inst.get("/image/generate_result", {
              params: {
                order_code: task.data.order_code,
                language: "id",
                age,
                gender,
                version: "4",
              },
            });

            if (data?.data?.status === 1 && data.data.image_result?.length) {
              resultUrl = data.data.image_result[0];
              break;
            }

            if (data?.data?.status === -1) {
              await delay(2000);
              continue;
            }

            return reply("❌ Proses NanoAI gagal");
          }

          const caption =
            `🧠 *NanoAI*\n\n` +
            `👤 *Gender:* ${gender}\n` +
            `🎂 *Usia:* ${age}\n` +
            `🎨 *Prompt:*\n${prompt}\n\n` +
            `✨ Generated by NanoAI\n🔥 Powered by softbotz.my.id`;

          await DimzBot.sendMessage(
            m.chat,
            {
              image: { url: resultUrl },
              caption,
            },
            { quoted: m }
          );

          reduceLimit(botId, m.sender);
        } catch (e) {
          reply("❌ Terjadi kesalahan saat memproses NanoAI, coba lagi nanti");
        }

        await DimzBot.sendMessage(m.chat, { react: { text: "", key: m.key } });
      }
      break;

    case "toreal":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);
        if (!m.quoted || !/image/.test(m.quoted.mtype))
          return reply(`Balas gambar dengan caption:\n${prefix + command}`);

        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "✨",
            key: m.key,
          },
        });

        try {
          const filePath = await DimzBot.downloadAndSaveMediaMessage(m.quoted);
          const uploader = await drizzup(filePath);

          const { agent } = getRandomProxyAgent();
          const apiUrl = `https://api-faa.my.id/faa/toreal?url=${encodeURIComponent(uploader)}`;

          const res = await axios.get(apiUrl, {
            responseType: "arraybuffer",
            httpsAgent: agent, proxy: false,
            timeout: 30000,
          });

          const buffer = Buffer.from(res.data);

          await DimzBot.sendMessage(
            m.chat,
            {
              image: buffer,
              caption: "✨ Gambar berhasil diubah menjadi versi realistik!",
            },
            {
              quoted: m,
            }
          );
          fs.unlinkSync(filePath);

          reduceLimit(botId, m.sender);
        } catch (err) {
          console.error("Error toreal:", err);
          reply(
            "❌ Terjadi kesalahan saat memproses gambar menjadi realistik. Coba lagi nanti."
          );
        }

        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "",
            key: m.key,
          },
        });
      }
      break;

    case "tozombie":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);
        if (!m.quoted || !/image/.test(m.quoted.mtype))
          return reply(`Balas gambar dengan caption:\n${prefix + command}`);

        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "🧟",
            key: m.key,
          },
        });

        try {
          const filePath = await DimzBot.downloadAndSaveMediaMessage(m.quoted);
          const uploader = await drizzup(filePath);

          const { agent } = getRandomProxyAgent();
          const apiUrl = `https://api-faa.my.id/faa/tozombie?url=${encodeURIComponent(uploader)}`;

          const res = await axios.get(apiUrl, {
            responseType: "arraybuffer",
            httpsAgent: agent, proxy: false,
            timeout: 30000,
          });

          const buffer = Buffer.from(res.data);

          await DimzBot.sendMessage(
            m.chat,
            {
              image: buffer,
              caption: "🧟 Gambar berhasil diubah menjadi zombie!",
            },
            {
              quoted: m,
            }
          );
          fs.unlinkSync(filePath);

          reduceLimit(botId, m.sender);
        } catch (err) {
          console.error("Error tozombie:", err);
          reply(
            "❌ Terjadi kesalahan saat memproses gambar menjadi zombie. Coba lagi nanti."
          );
        }

        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "",
            key: m.key,
          },
        });
      }
      break;

    case "totua":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);
        if (!m.quoted || !/image/.test(m.quoted.mtype))
          return reply(`Balas gambar dengan caption:\n${prefix + command}`);

        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "👴",
            key: m.key,
          },
        });

        try {
          const filePath = await DimzBot.downloadAndSaveMediaMessage(m.quoted);
          const uploader = await drizzup(filePath);

          const { agent } = getRandomProxyAgent();
          const apiUrl = `https://api-faa.my.id/faa/totua?url=${encodeURIComponent(uploader)}`;

          const res = await axios.get(apiUrl, {
            responseType: "arraybuffer",
            httpsAgent: agent, proxy: false,
            timeout: 30000,
          });

          const buffer = Buffer.from(res.data);

          await DimzBot.sendMessage(
            m.chat,
            {
              image: buffer,
              caption: "👴 Gambar berhasil diubah menjadi versi tua!",
            },
            {
              quoted: m,
            }
          );
          fs.unlinkSync(filePath);
          reduceLimit(botId, m.sender);
        } catch (err) {
          console.error("Error totua:", err);
          reply(
            "❌ Terjadi kesalahan saat memproses gambar menjadi versi tua. Coba lagi nanti."
          );
        }

        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "",
            key: m.key,
          },
        });
      }
      break;

    case "toroblox":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);
        if (!m.quoted || !/image/.test(m.quoted.mtype))
          return reply(`Balas gambar dengan caption:\n${prefix + command}`);

        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "🎮",
            key: m.key,
          },
        });

        try {
          const filePath = await DimzBot.downloadAndSaveMediaMessage(m.quoted);
          const uploader = await drizzup(filePath);

          const { agent } = getRandomProxyAgent();
          const apiUrl = `https://api-faa.my.id/faa/toroblox?url=${encodeURIComponent(uploader)}`;

          const res = await axios.get(apiUrl, {
            responseType: "arraybuffer",
            httpsAgent: agent, proxy: false,
            timeout: 30000,
          });

          const buffer = Buffer.from(res.data);

          await DimzBot.sendMessage(
            m.chat,
            {
              image: buffer,
              caption: "🎮 Gambar berhasil diubah menjadi Roblox!",
            },
            {
              quoted: m,
            }
          );
          fs.unlinkSync(filePath);

          reduceLimit(botId, m.sender);
        } catch (err) {
          console.error("Error toroblox:", err);
          reply(
            "❌ Terjadi kesalahan saat mengubah gambar menjadi Roblox. Coba lagi nanti."
          );
        }

        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "",
            key: m.key,
          },
        });
      }
      break;

    case "tojepang":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);
        if (!m.quoted || !/image/.test(m.quoted.mtype))
          return reply(`Balas gambar dengan caption:\n${prefix + command}`);

        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "🗾",
            key: m.key,
          },
        });

        try {
          const filePath = await DimzBot.downloadAndSaveMediaMessage(m.quoted);
          const uploader = await drizzup(filePath);

          const { agent } = getRandomProxyAgent();
          const apiUrl = `https://api-faa.my.id/faa/tojepang?url=${encodeURIComponent(uploader)}`;

          const res = await axios.get(apiUrl, {
            responseType: "arraybuffer",
            httpsAgent: agent, proxy: false,
            timeout: 30000,
          });

          const buffer = Buffer.from(res.data);

          await DimzBot.sendMessage(
            m.chat,
            {
              image: buffer,
              caption: "🇯🇵 Gambar berhasil diubah menjadi di Jepang!",
            },
            {
              quoted: m,
            }
          );
          fs.unlinkSync(filePath);
          reduceLimit(botId, m.sender);
        } catch (err) {
          console.error("Error tojepang:", err);
          reply(
            "❌ Terjadi kesalahan saat mengubah gambar ke di Jepang. Coba lagi nanti."
          );
        }

        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "",
            key: m.key,
          },
        });
      }
      break;

    case "tomonyet":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);
        if (!m.quoted || !/image/.test(m.quoted.mtype))
          return reply(`Balas gambar dengan caption:\n${prefix + command}`);

        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "🐒",
            key: m.key,
          },
        });

        try {
          const filePath = await DimzBot.downloadAndSaveMediaMessage(m.quoted);
          const uploader = await drizzup(filePath);

          const { agent } = getRandomProxyAgent();
          const apiUrl = `https://api-faa.my.id/faa/tomonyet?url=${encodeURIComponent(uploader)}`;

          const res = await axios.get(apiUrl, {
            responseType: "arraybuffer",
            httpsAgent: agent, proxy: false,
            timeout: 30000,
          });

          const buffer = Buffer.from(res.data);

          await DimzBot.sendMessage(
            m.chat,
            {
              image: buffer,
              caption: "✅ Gambar berhasil diubah menjadi monyet 🐒",
            },
            {
              quoted: m,
            }
          );
          fs.unlinkSync(filePath);
          reduceLimit(botId, m.sender);
        } catch (err) {
          console.error("Error tomonyet:", err);
          reply(
            "❌ Terjadi kesalahan saat mengubah gambar menjadi monyet. Coba lagi nanti."
          );
        }

        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "",
            key: m.key,
          },
        });
      }
      break;

    case "tomirror":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);
        if (!m.quoted || !/image/.test(m.quoted.mtype))
          return reply(`Balas gambar dengan caption:\n${prefix + command}`);

        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "🪞",
            key: m.key,
          },
        });

        try {
          const filePath = await DimzBot.downloadAndSaveMediaMessage(m.quoted);
          const uploader = await drizzup(filePath);

          const { agent } = getRandomProxyAgent();
          const apiUrl = `https://api-faa.my.id/faa/tomirror?url=${encodeURIComponent(uploader)}`;

          const res = await axios.get(apiUrl, {
            responseType: "arraybuffer",
            httpsAgent: agent, proxy: false,
            timeout: 30000,
          });

          const buffer = Buffer.from(res.data);

          await DimzBot.sendMessage(
            m.chat,
            {
              image: buffer,
              caption: "✅ Gambar berhasil diubah menjadi mirror + IPhone!",
            },
            {
              quoted: m,
            }
          );
          fs.unlinkSync(filePath);
          reduceLimit(botId, m.sender);
        } catch (err) {
          console.error("Error tomirror:", err);
          reply("❌ Gagal memproses mirror. Coba lagi nanti.");
        }

        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "",
            key: m.key,
          },
        });
      }
      break;

    case "tochibi":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);
        if (!m.quoted || !/image/.test(m.quoted.mtype))
          return reply(`Balas gambar dengan caption:\n${prefix + command}`);

        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "⏳",
            key: m.key,
          },
        });

        try {
          const filePath = await DimzBot.downloadAndSaveMediaMessage(m.quoted);
          const uploader = await drizzup(filePath);

          const { agent } = getRandomProxyAgent();
          const apiUrl = `https://api-faa.my.id/faa/tochibi?url=${encodeURIComponent(uploader)}`;

          const res = await axios.get(apiUrl, {
            responseType: "arraybuffer",
            httpsAgent: agent, proxy: false,
            timeout: 30000,
          });

          const buffer = Buffer.from(res.data);

          await DimzBot.sendMessage(
            m.chat,
            {
              image: buffer,
              caption: "✨ Nih versi chibi kamu yang imut banget!",
            },
            {
              quoted: m,
            }
          );
          fs.unlinkSync(filePath);
          reduceLimit(botId, m.sender);
        } catch (err) {
          console.error(err);
          reply(
            "❌ Gagal mengubah gambar menjadi versi chibi. Coba lagi nanti."
          );
        }

        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "",
            key: m.key,
          },
        });
      }
      break;

    case "tobotak":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);
        if (!m.quoted || !/image/.test(m.quoted.mtype))
          return reply(`Balas gambar dengan caption:\n${prefix + command}`);

        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "⏳",
            key: m.key,
          },
        });

        try {
          const filePath = await DimzBot.downloadAndSaveMediaMessage(m.quoted);
          const uploader = await drizzup(filePath);

          const { agent } = getRandomProxyAgent();
          const apiUrl = `https://api-faa.my.id/faa/tobotak?url=${encodeURIComponent(uploader)}`;

          const res = await axios.get(apiUrl, {
            responseType: "arraybuffer",
            httpsAgent: agent, proxy: false,
            timeout: 30000,
          });

          const buffer = Buffer.from(res.data);

          await DimzBot.sendMessage(
            m.chat,
            {
              image: buffer,
              caption: "😂 Kepala kamu sekarang botak licin!",
            },
            {
              quoted: m,
            }
          );
          fs.unlinkSync(filePath);

          reduceLimit(botId, m.sender);
        } catch (err) {
          console.error(err);
          reply("❌ Gagal memproses gambar menjadi botak. Coba lagi nanti.");
        }

        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "",
            key: m.key,
          },
        });
      }
      break;

    case "toghibli":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);
        if (!m.quoted || !/image/.test(m.quoted.mtype))
          return reply(`Balas gambar dengan caption:\n${prefix + command}`);

        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "⏳",
            key: m.key,
          },
        });

        try {
          const filePath = await DimzBot.downloadAndSaveMediaMessage(m.quoted);
          const uploader = await drizzup(filePath);

          const { agent } = getRandomProxyAgent();
          const apiUrl = `https://api-faa.my.id/faa/toghibli?url=${encodeURIComponent(uploader)}`;

          const res = await axios.get(apiUrl, {
            responseType: "arraybuffer",
            httpsAgent: agent, proxy: false,
            timeout: 30000,
          });

          const buffer = Buffer.from(res.data);

          await DimzBot.sendMessage(
            m.chat,
            {
              image: buffer,
              caption: "✅ Gaya Ghibli berhasil dibuat!",
            },
            {
              quoted: m,
            }
          );
          fs.unlinkSync(filePath);
          reduceLimit(botId, m.sender);
        } catch (err) {
          console.error(err);
          reply(
            "❌ Gagal memproses gambar menjadi gaya Ghibli. Coba lagi nanti."
          );
        }

        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "",
            key: m.key,
          },
        });
      }
      break;

    case "text2img":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);
        try {
          if (!text)
            return reply(
              `Masukkan prompt, contoh: ${prefix + command} kucing lucu di taman`
            );
          await DimzBot.sendMessage(m.chat, {
            react: {
              text: "⏳",
              key: m.key,
            },
          });
          const res = await axios.get(
            `https://api-faa.my.id/faa/ai-text2img-pro?prompt=${encodeURIComponent(text)}`,
            {
              responseType: "arraybuffer",
              httpsAgent: agent, proxy: false,
              timeout: 30000,
            }
          );
          await DimzBot.sendMessage(
            m.chat,
            {
              image: Buffer.from(res.data),
              caption: "🖼️ Hasil dari prompt kamu!",
            },
            {
              quoted: m,
            }
          );
          reduceLimit(botId, m.sender);
        } catch {
          reply("Terjadi kesalahan saat memproses gambar.");
        }
      }
      break;

    case "blurface":
      {
        try {
          if (!m.quoted || !/image/.test(m.quoted.mtype))
            return reply("Reply gambar yang ingin diblur wajahnya!");
          if (!hasLimit(botId, m.sender)) return reply(mess.limit0);
          await DimzBot.sendMessage(m.chat, {
            react: {
              text: "⏳",
              key: m.key,
            },
          });
          const saved = await DimzBot.downloadAndSaveMediaMessage(m.quoted);
          const url = await drizzup(saved);
          const res = await axios.get(
            `https://api-faa.my.id/faa/blurwajah?image=${encodeURIComponent(url)}`,
            {
              responseType: "arraybuffer",
            }
          );
          await DimzBot.sendMessage(
            m.chat,
            {
              image: Buffer.from(res.data),
              caption: "Wajah berhasil diblur!",
            },
            {
              quoted: m,
            }
          );
          reduceLimit(botId, m.sender);
        } catch {
          reply("Terjadi kesalahan saat memproses gambar.");
        }
      }
      break;

    case "toanime":
    case "jadianime":
      {
        try {
          if (!m.quoted || !/image/.test(m.quoted.mtype))
            return reply("Reply gambar yang ingin diubah jadi anime!");
          if (!hasLimit(botId, m.sender)) return reply(mess.limit0);
          await DimzBot.sendMessage(m.chat, {
            react: {
              text: "⏳",
              key: m.key,
            },
          });
          const { agent } = getRandomProxyAgent();
          const saved = await DimzBot.downloadAndSaveMediaMessage(m.quoted);
          const url = await drizzup(saved);

          const res = await axios.get(
            `https://api-faa.my.id/faa/toanime?url=${encodeURIComponent(url)}`,
            {
              responseType: "arraybuffer",
              httpsAgent: agent, proxy: false,
              timeout: 30000,
            }
          );
          await DimzBot.sendMessage(
            m.chat,
            {
              image: Buffer.from(res.data),
              caption: "✨ Hasil jadi anime!",
            },
            {
              quoted: m,
            }
          );
          reduceLimit(botId, m.sender);
        } catch {
          reply("Terjadi kesalahan saat memproses gambar.");
        }
      }
      break;

    case "unblur":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);
        const quoted = m.quoted ? m.quoted : m;
        const mime = quoted?.mimetype || quoted.message?.imageMessage?.mimetype;
        if (!mime || !/image\/.*/.test(mime)) {
          return reply(
            `❌ Kirim atau reply gambar dengan caption *${prefix + command}*`
          );
        }
        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "⏳",
            key: m.key,
          },
        });

        try {
          const axios = require("axios");
          const FormData = require("form-data");
          const crypto = require("crypto");

          const mediaPath = await DimzBot.downloadAndSaveMediaMessage(quoted);
          const imageUrl = await drizzup(mediaPath);
          const img = await axios.get(imageUrl, {
            responseType: "arraybuffer",
          });
          const buffer = Buffer.from(img.data);

          const serial = crypto.randomBytes(16).toString("hex");
          const fname = `Image_${crypto.randomBytes(6).toString("hex")}.jpg`;
          const form = new FormData();

          form.append("original_image_file", buffer, {
            filename: fname,
            contentType: "image/jpeg",
          });
          form.append("scale_factor", 2);
          form.append("upscale_type", "image-upscale");

          const headers = {
            ...form.getHeaders(),
            "product-serial": serial,
          };
          const res = await axios.post(
            "https://api.unblurimage.ai/api/imgupscaler/v2/ai-image-unblur/create-job",
            form,
            {
              headers,
            }
          );

          const jobId = res.data?.result?.job_id;
          if (!jobId) return reply("❌ Gagal membuat job di server.");

          let output,
            done = false;
          const timeout = Date.now() + 180000;
          while (!done && Date.now() < timeout) {
            const poll = await axios.get(
              `https://api.unblurimage.ai/api/imgupscaler/v2/ai-image-unblur/get-job/${jobId}`,
              {
                headers,
              }
            );
            if (
              poll.data.code === 100000 &&
              poll.data.result?.output_url?.[0]
            ) {
              output = poll.data.result.output_url[0];
              done = true;
            } else await new Promise((r) => setTimeout(r, 3000));
          }

          if (!output)
            return reply("❌ Gagal mendapatkan hasil. Coba lagi nanti!");

          await DimzBot.sendMessage(
            m.chat,
            {
              image: {
                url: output,
              },
              caption: `✨ *Hasil Unblur Selesai!*\n🧾 Job ID: ${jobId}`,
            },
            {
              quoted: m,
            }
          );

          reduceLimit(botId, m.sender);
          await DimzBot.sendMessage(m.chat, {
            react: {
              text: "✅",
              key: m.key,
            },
          });
        } catch (e) {
          console.error("UNBLUR ERROR:", e);
          reply("❌ Terjadi kesalahan saat memproses gambar.");
        }
      }
      break;

    case "hitamkan":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);
        const quoted = m.quoted ? m.quoted : m;
        const mime = quoted?.mimetype || quoted.message?.imageMessage?.mimetype;
        if (!mime || !/image\/.*/.test(mime)) {
          return reply(
            `❌ Kirim gambar dengan caption *${prefix + command}*, atau reply gambar dengan command tersebut`
          );
        }

        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "⏳",
            key: m.key,
          },
        });
        const { agent } = getRandomProxyAgent();

        try {
          const mediaPath = await DimzBot.downloadAndSaveMediaMessage(quoted);
          const uploadedUrl = await drizzup(mediaPath);
          const response = await axios.get(
            `https://api.ootaizumi.web.id/ai-image/hytamkan?imageUrl=${encodeURIComponent(uploadedUrl)}`,
            {
              httpsAgent: agent, proxy: false,
              timeout: 30000,
            }
          );

          if (response.data.status && response.data.result?.download) {
            const resultImageUrl = response.data.result.download;
            await DimzBot.sendMessage(
              m.chat,
              {
                image: {
                  url: resultImageUrl,
                },
                caption: `✅ @${m.sender.split("@")[0]} nih sudah di hitamkan 💀`,
                contextInfo: {
                  mentionedJid: [m.sender],
                  externalAdReply: {
                    title: botName,
                    body: `⏰ Time Now ${moment.tz("Asia/Jakarta").format("HH : mm : ss")}`,
                    thumbnail: fs.readFileSync(global.thumbnail),
                    mediaType: 1,
                    sourceUrl: wagc,
                  },
                },
              },
              {
                quoted: m,
              }
            );
            reduceLimit(botId, m.sender);
            await DimzBot.sendMessage(m.chat, {
              react: {
                text: "✅",
                key: m.key,
              },
            });
          } else {
            reply(
              "❌ Gagal memproses hitamkan gambar. Silakan coba lagi nanti."
            );
          }
        } catch (e) {
          reply(
            "❌ Terjadi kesalahan saat memproses hitamkan gambar. Coba lagi nanti."
          );
        }
      }
      break;

    case "tofigure2":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);
        if (!m.quoted || !/image/.test(m.quoted.mtype))
          return reply(`Balas gambar dengan caption:\n${prefix + command}`);

        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "🧠",
            key: m.key,
          },
        });

        try {
          const filePath = await DimzBot.downloadAndSaveMediaMessage(m.quoted);
          const uploader = await drizzup(filePath);

          const { agent } = getRandomProxyAgent();
          const apiUrl = `https://api-faa.my.id/faa/tofigurav2?url=${encodeURIComponent(uploader)}`;

          const res = await axios.get(apiUrl, {
            responseType: "arraybuffer",
            httpsAgent: agent, proxy: false,
            timeout: 30000,
          });

          const buffer = Buffer.from(res.data);

          await DimzBot.sendMessage(
            m.chat,
            {
              image: buffer,
              caption: "✅ Figur v2 kamu berhasil dibuat!",
            },
            {
              quoted: m,
            }
          );
          fs.unlinkSync(filePath);
          reduceLimit(botId, m.sender);
        } catch (err) {
          console.error("Error tofigure2:", err);
          reply("❌ Gagal membuat figur versi 2. Coba lagi nanti.");
        }

        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "",
            key: m.key,
          },
        });
      }
      break;

    case "tofigure3":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);
        if (!m.quoted || !/image/.test(m.quoted.mtype))
          return reply(`Balas gambar dengan caption:\n${prefix + command}`);

        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "🧠",
            key: m.key,
          },
        });

        try {
          const filePath = await DimzBot.downloadAndSaveMediaMessage(m.quoted);
          const uploader = await drizzup(filePath);

          const { agent } = getRandomProxyAgent();
          const apiUrl = `https://api-faa.my.id/faa/tofigurav3?url=${encodeURIComponent(uploader)}`;

          const res = await axios.get(apiUrl, {
            responseType: "arraybuffer",
            httpsAgent: agent, proxy: false,
            timeout: 30000,
          });

          const buffer = Buffer.from(res.data);

          await DimzBot.sendMessage(
            m.chat,
            {
              image: buffer,
              caption: "✅ Figur v3 kamu berhasil dibuat!",
            },
            {
              quoted: m,
            }
          );
          fs.unlinkSync(filePath);
          reduceLimit(botId, m.sender);
        } catch (err) {
          console.error("Error tofigure3:", err);
          reply("❌ Gagal membuat figur versi 3. Coba lagi nanti.");
        }

        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "",
            key: m.key,
          },
        });
      }
      break;

    case "ai":
    case "chatgpt":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);
        if (!text) {
          return reply(
            `Chat Dengan AI.\n\nContoh:\n${prefix + command} Siapa Joko Widodo`
          );
        }

        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "⏳",
            key: m.key,
          },
        });

        async function gpt4o(options) {
          try {
            options = {
              messages: [
                {
                  role: "system",
                  content: `${options?.systemInstruction}, Anda adalah model GPT-4o mini yang selalu menjawab dalam bahasa Indonesia dan selalu menggunakan bahasa slank kekinian dan emoji ketika membalas pesan user. Nama kamu adalah ${botName} dan penciptamu adalah ${ownName}. Sekarang tanggal ${xdate} dan jam ${xtime} WIB`,
                },
                ...options?.messages.filter((d) => d.role !== "system"),
              ],
              temperature: options?.temperature || 0.9,
              top_p: options?.top_p || 0.7,
              top_k: options?.top_k || 40,
              max_tokens: options?.max_tokens || 512,
            };

            return await new Promise(async (resolve, reject) => {
              if (
                !Array.isArray(options?.messages) ||
                options?.messages.length === 0
              ) {
                return reject("invalid array messages input!");
              }
              axios
                .post(
                  "https://api.deepenglish.com/api/gpt_open_ai/chatnew",
                  options,
                  {
                    headers: {
                      "Content-Type": "application/json",
                      Authorization:
                        "Bearer UFkOfJaclj61OxoD7MnQknU1S2XwNdXMuSZA+EZGLkc=",
                    },
                  }
                )
                .then((res) => {
                  const data = res.data;
                  if (!data.success) {
                    return reject("failed get response!");
                  }
                  resolve({
                    success: true,
                    answer: data.message,
                  });
                })
                .catch((error) => {
                  reject(error);
                });
            });
          } catch (e) {
            return {
              success: false,
              errors: [e],
            };
          }
        }

        const options = {
          systemInstruction: "You are a helpful assistant",
          messages: [
            {
              role: "user",
              content: text,
            },
          ],
          temperature: 0.9,
          top_p: 0.7,
          top_k: 40,
          max_tokens: 100,
        };

        try {
          const response = await gpt4o(options);
          if (response.success) {
            await DimzBot.sendMessage(
              m.chat,
              {
                text: `*Responed By* @${
                  m.sender.split("@")[0]
                }\n\n${response.answer}\n\n\n\n\n*_Powered By_* @${creator2.split("@")[0]}`,
                contextInfo: {
                  mentionedJid: [m.sender, creator2, "0@s.whatsapp.net"],
                  externalAdReply: {
                    title: `Model: GPT4o-mini \nHay ${pushname}`,
                    thumbnailUrl:
                      "https://telegra.ph/file/92c2f311b5217bb7d34b5.jpg",
                    sourceUrl: `${wagc}`,
                    mediaType: 1,

                    renderLargerThumbnail: true,
                  },
                },
              },
              {
                quoted: m,
              }
            );
            reduceLimit(botId, m.sender);
          } else {
            reply(
              `Maaf, terjadi kesalahan saat mendapatkan respon. Silakan coba lagi nanti.`
            );
          }
        } catch (error) {
          reply(`Maaf, ada kesalahan saat memproses permintaan Anda.`);
        }
      }
      break;

    case "iqc":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);
        const moment = require("moment-timezone");
        const { agent } = getRandomProxyAgent();
        const time = moment().tz("Asia/Jakarta").format("HH:mm");

        let carrierName = "Telkomsel";
        let message = text;

        if (text.includes("|")) {
          const parts = text.split("|");
          carrierName = parts[0].trim();
          message = parts.slice(1).join("|").trim();
        }

        if (!message)
          return reply(
            `❌ Masukkan teks.\nContoh:\n${prefix + command} Halo 😹\n${prefix + command} Telkomsel|Halo 😹`
          );

        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "⏳",
            key: m.key,
          },
        });

        const battery = Math.floor(Math.random() * 100) + 1;
        const url = `https://brat.siputzx.my.id/iphone-quoted?time=${encodeURIComponent(
          time
        )}&batteryPercentage=${battery}&carrierName=${encodeURIComponent(
          carrierName
        )}&messageText=${encodeURIComponent(message)}&emojiStyle=apple`;

        await DimzBot.sendMessage(
          m.chat,
          {
            image: {
              url,
            },
          },
          {
            quoted: m,
          }
        );

        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "",
            key: m.key,
          },
        });
        reduceLimit(botId, m.sender);
      }
      break;

    case "hitamkan":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);
        if (!m.quoted || !/image/.test(m.quoted.mtype))
          return reply(`Balas gambar dengan caption:\n${prefix + command}`);

        const { agent } = getRandomProxyAgent();
        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "⏳",
            key: m.key,
          },
        });

        try {
          const filePath = await DimzBot.downloadAndSaveMediaMessage(m.quoted);
          const uploader = await drizzup(filePath);
          fs.unlinkSync(filePath);

          const apiUrl = `https://api.ootaizumi.web.id/ai-image/hytamkan?imageUrl=${encodeURIComponent(
            uploader
          )}`;
          const { data } = await axios.get(apiUrl, {
            timeout: 30000,
            httpsAgent: agent, proxy: false,
          });

          if (!data?.status || !data?.result?.download)
            return reply("❌ Gagal memproses gambar");

          await DimzBot.sendMessage(
            m.chat,
            {
              image: {
                url: data.result.download,
              },
              caption: `✅ Gambar berhasil dihitamkan!`,
            },
            {
              quoted: m,
            }
          );

          reduceLimit(botId, m.sender);
        } catch {
          reply("❌ Terjadi kesalahan saat memproses gambar, coba lagi nanti.");
        }

        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "",
            key: m.key,
          },
        });
      }
      break;

    case "hd":
    case "remini":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);
        if (!quoted || !/image/.test(mime)) {
          return reply(
            `*Reply foto yang ingin diperjelas!*\n\n${readmore}\n*Mau HD video? ketik ${prefix}hdvid*`
          );
        }

        await DimzBot.sendMessage(m.chat, {
          react: { text: "⏳", key: m.key },
        });

        let success = false;
        const { agent } = getRandomProxyAgent();

        try {
          const mediaPath = await DimzBot.downloadAndSaveMediaMessage(quoted);
          const imageUrl = await drizzup(mediaPath);

          /* ===== SERVER 1 ===== */
          try {
            await reply(
              "> _*Proses sedikit lama karena Upscale 16x (Server 1)*_"
            );

            const { data } = await axios.get(
              `https://api.nekolabs.web.id/tools/upscale/supawork?imageUrl=${encodeURIComponent(imageUrl)}&scale=16`,
              {
                httpsAgent: agent, proxy: false,
                timeout: 90000,
                validateStatus: () => true,
              }
            );

            if (data?.success && data?.result) {
              const sent = await DimzBot.sendMessage(
                m.chat,
                {
                  image: { url: data.result },
                  caption: `*Harap save sebelum 5 menit*\n\n> *_Foto dari server 1_*\n\n${readmore}\n> *_Mau HD in Video? Ketik: ${prefix}hdvid_*`,
                },
                { quoted: m }
              );

              setTimeout(
                () => DimzBot.sendMessage(m.chat, { delete: sent.key }),
                300000
              );

              await DimzBot.sendMessage(m.chat, {
                react: { text: "✅", key: m.key },
              });

              reduceLimit(botId, m.sender);
              success = true;
            }
          } catch (e) {
            console.error("SERVER 1 UPSCALE ERROR:", e);
          }

          /* ===== SERVER 2 ===== */
          if (!success) {
            try {
              const res = await axios.get(
                `https://api.siputzx.my.id/api/tools/upscale?url=${encodeURIComponent(imageUrl)}&scale=4`,
                {
                  responseType: "arraybuffer",
                  httpsAgent: agent, proxy: false,
                  timeout: 30000,
                }
              );

              const sent = await DimzBot.sendMessage(
                m.chat,
                {
                  image: Buffer.from(res.data),
                  caption: `*Harap save sebelum 5 menit*\n\n> *_Foto dari server 2_*\n\n${readmore}\n> *_Mau HD in Video? Ketik: ${prefix}hdvid_*`,
                },
                { quoted: m }
              );

              setTimeout(
                () => DimzBot.sendMessage(m.chat, { delete: sent.key }),
                300000
              );
              await DimzBot.sendMessage(m.chat, {
                react: { text: "✅", key: m.key },
              });

              reduceLimit(botId, m.sender);
              success = true;
            } catch {}
          }

          /* ===== SERVER 3 (FAA HDV3 - ARRAYBUFFER) ===== */
          if (!success) {
            try {
              const res = await axios.get(
                `https://api-faa.my.id/faa/hdv3?image=${encodeURIComponent(imageUrl)}`,
                {
                  responseType: "arraybuffer",
                  httpsAgent: agent, proxy: false,
                  timeout: 30000,
                }
              );

              const sent = await DimzBot.sendMessage(
                m.chat,
                {
                  image: Buffer.from(res.data),
                  caption: `*Harap save sebelum 5 menit*\n\n> *_Foto dari server 3_*\n\n${readmore}\n> *_Mau HD in Video? Ketik: ${prefix}hdvid_*`,
                },
                { quoted: m }
              );

              setTimeout(
                () => DimzBot.sendMessage(m.chat, { delete: sent.key }),
                300000
              );
              await DimzBot.sendMessage(m.chat, {
                react: { text: "✅", key: m.key },
              });

              reduceLimit(botId, m.sender);
              success = true;
            } catch {}
          }

          if (!success) {
            reply("❌ Semua server gagal memperjelas gambar. Coba lagi nanti.");
          }
        } catch {
          reply("⚠️ Terjadi kesalahan, coba lagi nanti!");
        }
      }
      break;

    case "hdvideo":
    case "hdvid":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);

        const quoted = m.quoted || m;
        const mime = quoted?.msg?.mimetype || quoted?.mimetype || "";
        const duration = quoted?.msg?.seconds || quoted?.seconds || 0;

        if (!/video/.test(mime)) {
          return reply(
            "❗Silakan reply atau kirim video yang ingin dijadikan HD!"
          );
        }

        let [res, fpsText] = text?.trim().toLowerCase().split(" ");
        let fps = 60;

        if (fpsText && fpsText.endsWith("fps")) {
          fps = parseInt(fpsText.replace("fps", ""));
          if (isNaN(fps) || fps < 30 || fps > 240) {
            return reply(
              "❗ FPS harus antara 30 hingga 240. Contoh: 60fps / 120fps"
            );
          }
        }

        const resolutions = {
          480: "480",
          720: "720",
          1080: "1080",
          "2k": "1440",
          "4k": "2160",
          "8k": "4320",
        };

        if (!resolutions[res]) {
          return reply(
            `❌ Pilih Resolusi!\nContoh: ${prefix + command} 480 / 720 / 1080 / 2k / 4k / 8k`
          );
        }

        if (duration > 50) {
          return reply(`*❗ Durasi Video Terlalu Panjang! Maksimal durasi yang diperbolehkan adalah 50 detik*
${readmore}

🎥 Untuk menjaga kualitas dan performa saat proses *HD Upscale* video, sistem kami membatasi durasi maksimal menjadi 40 detik. Proses konversi video ke resolusi tinggi (720p/1080p hingga 4K atau 8K) membutuhkan sumber daya CPU yang sangat tinggi, terutama pada file berdurasi panjang.

*🚫 Jika durasi terlalu panjang, proses encoding dan render akan:*
- Membebani server secara berlebihan
- Meningkatkan risiko lag, timeout, crash dan membuat bot jadi lemot
- Menyebabkan antrian proses pengguna lain menjadi lambat

✅ *Solusi*: Silakan potong video terlebih dahulu atau kirim cuplikan dengan durasi maksimal 50 detik. Ini akan mempercepat proses dan memastikan hasil tetap maksimal tanpa mengorbankan performa.

Terima kasih atas pengertiannya 🙏`);
        }

        const targetHeight = resolutions[res];
        const id = m.sender.split("@")[0];
        const inputName = `input_${id}.mp4`;
        const outputName = `hdvideo_${id}.mp4`;

        reply(
          `_⏳ Sedang memproses video ke resolusi *${res.toUpperCase()}* ${fps}FPS, mohon tunggu..._`
        );

        try {
          const downloaded = await DimzBot.downloadAndSaveMediaMessage(
            quoted,
            inputName
          );

          const stats = fs.statSync(downloaded);
          const fileSizeInMB = stats.size / (1024 * 1024);
          if (fileSizeInMB > 15) {
            fs.unlinkSync(downloaded);
            return reply(
              `❌ Ukuran video terlalu besar (${fileSizeInMB.toFixed(2)} MB)\nMaksimal ukuran yang diizinkan adalah *15 MB*!\n\nSilakan kompres dulu videonya atau kirim ulang dengan ukuran lebih kecil`
            );
          }

          if (!fs.existsSync("./temp")) fs.mkdirSync("./temp");

          const FormData = require("form-data");
          const axios = require("axios");
          const form = new FormData();

          form.append("video", fs.createReadStream(downloaded));
          form.append("resolution", targetHeight);
          form.append("fps", fps);

          const response = await axios.post(
            "http://api.drizznesiasite.biz.id:4167/hdvideo",
            form,
            {
              headers: {
                ...form.getHeaders(),
                "x-api-key": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa-superadmin",
              },
              responseType: "stream",
              maxBodyLength: Infinity,
              maxContentLength: Infinity,
            }
          );

          const outputPath = `./temp/${outputName}`;
          const writer = fs.createWriteStream(outputPath);
          response.data.pipe(writer);

          writer.on("finish", async () => {
            const buffer = fs.readFileSync(outputPath);
            let caption = `Video berhasil diubah ke resolusi *${res.toUpperCase()} ${fps}FPS* dengan kualitas tinggi!`;

            if (["2k", "4k", "8k"].includes(res)) {
              caption += `${readmore}\n\n⚠️ WARNING! ⚠️
Resolusi ${res.toUpperCase()} mungkin tidak kompatibel dengan semua perangkat!

*📌 Detail Kompatibilitas Resolusi:*
- ✅ 720p (HD): Aman di hampir semua HP Android
- ⚠️ 1080p (Full HD): Lancar di HP kelas menengah ke atas
- ⚠️ 2K (1440p): Butuh layar & performa tinggi, minimal chipset Snapdragon seri 7/8 atau setara
- ❗ 4K (2160p): Biasanya hanya didukung HP flagship atau PC/laptop dengan GPU kuat
- 🔥 8K (4320p): Ekstrem! Butuh layar besar, RAM tinggi, dan prosesor super cepat. Tidak semua aplikasi/media player bisa memutar dengan lancar


*💡 Tips Jika Video Tidak Bisa Diputar:*
Gunakan pemutar video seperti VLC atau MX Player dan sejenisnya!
Coba buka di PC/Laptop atau HP flagship terbaru

Hindari buka langsung dari galeri/whatsapp jika hasil layar hitam / macet atau ngefreeze

Kalau tetap error: gunakan resolusi lebih rendah (contoh: ${prefix + command} 1080 atau 2k).`;
            }

            await DimzBot.sendMessage(
              m.chat,
              {
                video: buffer,
                caption,
              },
              {
                quoted: m,
              }
            );

            fs.unlinkSync(downloaded);
            fs.unlinkSync(outputPath);
          });

          writer.on("error", () => {
            reply("❌ Gagal menyimpan file hasil, Ulangi lagi nanti");
          });
        } catch (err) {
          reply("❌ Gagal memproses video, Coba beberapa saat lagi");
        }

        reduceLimit(botId, m.sender);
      }
      break;

    // fitur stalker
    case "ttstalk":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);
        if (!text)
          return reply(
            `Masukkan username TikTok!\nContoh: ${prefix + command} mrbeast`
          );
        const axios = require("axios");

        function tryParse(text) {
          try {
            return JSON.parse(text);
          } catch {
            return null;
          }
        }

        function findUser(obj) {
          if (!obj || typeof obj !== "object") return null;
          if (
            obj.id &&
            (obj.uniqueId || obj.unique_id || obj.nickname || obj.shortId)
          )
            return obj;
          for (const k of Object.keys(obj)) {
            try {
              const res = findUser(obj[k]);
              if (res) return res;
            } catch {}
          }
          return null;
        }

        async function scrape(username) {
          const ip = `${Math.floor(Math.random() * 255) + 1}.${Math.floor(Math.random() * 255) + 1}.${Math.floor(Math.random() * 255) + 1}.${Math.floor(Math.random() * 255) + 1}`;
          const ua =
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";
          const { data: html } = await axios.get(
            `https://www.tiktok.com/@${username}`,
            {
              headers: {
                "User-Agent": ua,
                Accept:
                  "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/\*;q=0.8",
                "Accept-Language": "en-US,en;q=0.9",
                Connection: "keep-alive",
                "X-Forwarded-For": ip,
                "X-Real-IP": ip,
              },
              timeout: 10000,
            }
          );

          const candidates = [];
          const regexes = [
            /<script id="SIGI_STATE"[^>]*>([\s\S]*?)<\/script>/i,
            /<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/i,
            /<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__"[^>]*>([\s\S]*?)<\/script>/i,
            /<script id="RENDER_DATA"[^>]*>([\s\S]*?)<\/script>/i,
          ];
          for (const r of regexes) {
            const m = html.match(r);
            if (m) candidates.push(m[1]);
          }
          const reAll =
            /<script[^>]*type=["']application\/json["'][^>]*>([\s\S]*?)<\/script>/gi;
          let mm;
          while ((mm = reAll.exec(html)) !== null) candidates.push(mm[1]);

          const seen = new Set();
          for (const txt of candidates) {
            const key = (txt || "").length;
            if (seen.has(key)) continue;
            seen.add(key);
            const cleaned = (txt || "").replace(/&quot;/g, '"');
            const parsed = tryParse(cleaned) || tryParse(txt);
            if (!parsed) continue;
            const user = findUser(parsed);
            if (user) {
              const stats =
                parsed?.UserModule?.stats?.[user.id] ||
                parsed?.UserModule?.stats?.[user.uniqueId] ||
                parsed?.UserModule?.stats?.[user.unique_id] ||
                parsed?.__DEFAULT_SCOPE__?.["webapp.user-detail"]?.userInfo
                  ?.stats ||
                {};
              return {
                id: user.id || null,
                uniqueId:
                  user.uniqueId || user.unique_id || user.shortId || null,
                nickname: user.nickname || user.displayName || null,
                bio: user.signature || user.bio || user.signatureText || "",
                region: user.region || null,
                verified: !!user.verified,
                private: !!user.privateAccount,
                avatar:
                  user.avatarLarger || user.avatarThumb || user.avatar || null,
                followers:
                  stats.followerCount ||
                  stats.follower_count ||
                  user.followerCount ||
                  0,
                following:
                  stats.followingCount ||
                  stats.following_count ||
                  user.followingCount ||
                  0,
                hearts:
                  stats.heartCount || stats.heart_count || user.heartCount || 0,
                videos:
                  stats.videoCount || stats.video_count || user.videoCount || 0,
              };
            }
          }
          return null;
        }

        try {
          await DimzBot.sendMessage(m.chat, {
            react: {
              text: "🔍",
              key: m.key,
            },
          });
          const res = await scrape(text);
          if (!res)
            return reply(
              "Gagal mengambil data. Pastikan username benar atau akunnya tidak private."
            );
          const teks = `*[ TIKTOK STALK ]*

👤 Nama: ${res.nickname}
🔖 Username: ${res.uniqueId}
📄 Bio: ${res.bio}
🌍 Region: ${res.region || "-"}
✅ Verified: ${res.verified ? "Terverifikasi" : "Tidak Terverifikasi"}
🔒 Private: ${res.private ? "Akun Privat" : "Akun Publik"}
👥 Followers: ${res.followers}
👤 Following: ${res.following}
❤️ Likes: ${res.hearts}
🎥 Videos: ${res.videos}
🔗 Link: https://www.tiktok.com/@${res.uniqueId}`;
          await DimzBot.sendMessage(
            m.chat,
            {
              image: {
                url: res.avatar,
              },
              caption: teks,
            },
            {
              quoted: m,
            }
          );
          await DimzBot.sendMessage(m.chat, {
            react: {
              text: "",
              key: m.key,
            },
          });
          reduceLimit(botId, m.sender);
        } catch {
          reply("Terjadi kesalahan.");
        }
      }
      break;

    case "igstalk":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);
        if (!text)
          return reply(
            `❌ Masukkan username Instagram.\nContoh: *${prefix + command} banh_dims0*`
          );

        try {
          const axios = require("axios");
          const res = await axios.get(
            `https://api.zenzxz.my.id/stalker/instagram?username=${encodeURIComponent(text)}`
          );
          const data = res.data?.result;

          if (!res.data?.status || !data)
            return reply("❌ Gagal mengambil data.");

          const caption = `
📸 *Instagram Stalk*

• Username : ${data.username}
• Nama : ${data.name}
• Bio : ${data.bio}
• Followers : ${data.followers}
• Following : ${data.following}
• Posts : ${data.posts}
• Verified : ${data.verified ? "✅ Ya" : "❌ Tidak"}
• Engagement : ${data.engagement_rate}%
`.trim();

          await DimzBot.sendMessage(
            m.chat,
            {
              image: {
                url: data.profile_pic,
              },
              caption,
            },
            {
              quoted: m,
            }
          );
          reduceLimit(botId, m.sender);
        } catch (e) {
          reply("❌ Error: " + e.message);
        }
      }
      break;

    // fitur tools
    case "whatmusic":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);
        const acrcloud = require("acrcloud");
        const fs = require("fs");
        const path = require("path");
        const ffmpeg = require("fluent-ffmpeg");

        const quotedMsg = m.quoted || m;
        const mime = quotedMsg.mimetype || "";

        if (!quotedMsg || !/audio|video/.test(mime)) {
          return reply("❌ *Reply audio atau video untuk mencari musiknya!*");
        }

        await DimzBot.sendMessage(m.chat, {
          react: { text: "⏳", key: m.key },
        });

        try {
          const { agent } = getRandomProxyAgent();

          // ===== 3 KEY ACRCLOUD (GANTI SENDIRI) =====
          const KEYS = [
            {
              host: "identify-ap-southeast-1.acrcloud.com",
              access_key: "5f2c6e3587de806fa51bd688fae99f1b",
              access_secret: "28MZZorSvpme226qV3TqWi0sEIlW90LRI9sx0Wgr",
            },
            {
              host: "identify-ap-southeast-1.acrcloud.com",
              access_key: "KEY_2_GANTI",
              access_secret: "SECRET_2_GANTI",
            },
            {
              host: "identify-ap-southeast-1.acrcloud.com",
              access_key: "KEY_3_GANTI",
              access_secret: "SECRET_3_GANTI",
            },
          ];

          // ===== DOWNLOAD MEDIA =====
          const buffer = await quotedMsg.download();
          const tmpDir = "./temp";
          if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

          const inputPath = path.join(tmpDir, `input_${Date.now()}`);
          const wavPath = path.join(tmpDir, `acr_${Date.now()}.wav`);
          fs.writeFileSync(inputPath, buffer);

          // ===== CONVERT → WAV 16kHz (30 DETIK) =====
          await new Promise((resolve, reject) => {
            ffmpeg(inputPath)
              .noVideo()
              .audioChannels(1)
              .audioFrequency(16000)
              .format("wav")
              .duration(30)
              .on("end", resolve)
              .on("error", reject)
              .save(wavPath);
          });

          const wavBuffer = fs.readFileSync(wavPath);

          // ===== SHUFFLE KEY (RANDOM) =====
          KEYS.sort(() => Math.random() - 0.5);

          let hasil = null;

          // ===== COBA 1 PER 1 KEY =====
          for (const k of KEYS) {
            try {
              const acr = new acrcloud({
                host: k.host,
                access_key: k.access_key,
                access_secret: k.access_secret,
                http_agent: agent,
                https_agent: agent,
              });

              const res = await acr.identify(wavBuffer);
              if (res?.status?.code === 0) {
                hasil = res;
                break;
              }
            } catch {}
          }

          fs.unlinkSync(inputPath);
          fs.unlinkSync(wavPath);

          if (!hasil) {
            await DimzBot.sendMessage(m.chat, {
              react: { text: "❌", key: m.key },
            });
            return reply(
              "❌ *Musik tidak dikenali.*\n\n" +
                "💡 Coba bagian reff / suara musik lebih jelas."
            );
          }

          const music = hasil.metadata.music[0];

          const title = music.title || "-";
          const artist = music.artists?.map((a) => a.name).join(", ") || "-";
          const album = music.album?.name || "-";
          const genre = music.genres?.map((g) => g.name).join(", ") || "-";
          const release = music.release_date || "-";

          const teks = `
🎵 *MUSIK TERDETEKSI*

🎶 Judul   : ${title}
👤 Artis  : ${artist}
💿 Album  : ${album}
🏷 Genre  : ${genre}
📅 Rilis  : ${release}

⚡ Sample : 30 detik (WAV 16kHz)
`.trim();

          await DimzBot.sendMessage(m.chat, { text: teks }, { quoted: m });
          reduceLimit(botId, m.sender);
          await DimzBot.sendMessage(m.chat, {
            react: { text: "✅", key: m.key },
          });
        } catch (err) {
          console.error("WHATMUSIC ERROR:", err);
          await DimzBot.sendMessage(m.chat, {
            react: { text: "❌", key: m.key },
          });
          reply("⚠️ Terjadi kesalahan saat mencari judul musik.");
        }
      }
      break;

    case "toimg":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);
        const fs = require("fs");
        const { exec } = require("child_process");

        if (!m.quoted)
          return reply("❌ Balas stiker yang ingin diubah menjadi gambar!");
        if (m.quoted.mtype !== "stickerMessage")
          return reply("❌ Balas stiker, bukan jenis lain!");
        if (!fs.existsSync("./temp"))
          fs.mkdirSync("./temp", {
            recursive: true,
          });

        const timestamp = Date.now();
        const mediaPath = `./temp/${timestamp}_sticker.webp`;
        const outputFile = `./temp/${timestamp}_output.png`;

        try {
          const buffer = await m.quoted.download();
          if (!buffer)
            return reply("❌ Tidak bisa mengambil stiker dari pesan!");
          fs.writeFileSync(mediaPath, buffer);

          reply("⏳ Mengonversi stiker ke gambar...");

          exec(`ffmpeg -y -i "${mediaPath}" "${outputFile}"`, async (err) => {
            if (fs.existsSync(mediaPath)) fs.unlinkSync(mediaPath);

            if (err) {
              console.error("[FFMPEG ERROR]", err.message);
              return reply("❌ Gagal mengonversi stiker ke gambar.");
            }

            if (!fs.existsSync(outputFile))
              return reply("⚠️ File hasil konversi tidak ditemukan.");

            const imgBuffer = fs.readFileSync(outputFile);
            await DimzBot.sendMessage(
              m.chat,
              {
                image: imgBuffer,
                caption: "✅ Stiker berhasil dikonversi menjadi gambar!",
              },
              {
                quoted: m,
              }
            );
            fs.unlinkSync(outputFile);
          });
          reduceLimit(botId, m.sender);
        } catch (e) {
          console.error("[TOIMG ERROR]", e);
          reply("❌ Terjadi kesalahan saat memproses stiker.");
        }
      }
      break;

    case "tovideo":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);
        if (!m.quoted)
          return reply(
            "_Balas stiker bergerak (animasi) yang ingin dikonversi ya!_"
          );

        const mime = m.quoted.mtype;
        if (mime !== "stickerMessage")
          return reply("_Yang direply harus stiker!_");

        const mediaPath = await DimzBot.downloadAndSaveMediaMessage(m.quoted);
        reply("_⏳ Sedang dikonversi, harap tunggu..._");

        try {
          const { webp2mp4File } = require("./lib/uploader");
          const webpToMp4 = await webp2mp4File(mediaPath);

          await DimzBot.sendMessage(
            m.chat,
            {
              video: {
                url: webpToMp4.result,
                caption: "✅ Berhasil convert ke video (stiker animasi)",
              },
            },
            {
              quoted: m,
            }
          );

          fs.unlinkSync(mediaPath);
        } catch (e) {
          console.warn("❌ Gagal convert ke video, mencoba ke gambar PNG...");

          try {
            const outputFile = `${Math.floor(Math.random() * 10000)}.png`;
            exec(`ffmpeg -i ${mediaPath} ${outputFile}`, async (err) => {
              fs.unlinkSync(mediaPath);

              if (err || !fs.existsSync(outputFile)) {
                return reply(
                  "❌ Gagal convert ke gambar juga. Pastikan stikernya valid."
                );
              }

              const buffer = fs.readFileSync(outputFile);
              await DimzBot.sendMessage(
                m.chat,
                {
                  image: buffer,
                },
                {
                  quoted: m,
                }
              );
              fs.unlinkSync(outputFile);
            });
            reduceLimit(botId, m.sender);
          } catch (err2) {
            console.error("Fallback ke gambar gagal:", err2);
            reply("❌ Gagal total convert. Coba kirim ulang stikernya.");
          }
        }
      }
      break;

    case "toaudio":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);

        if (!/video/.test(mime) && !/audio/.test(mime))
          return reply(
            `Kirim atau balas Video/Audio yang ingin dijadikan Audio dengan caption ${prefix + command}`
          );
        if (!quoted)
          return reply(
            `Kirim atau balas Video/Audio yang ingin dijadikan Audio dengan caption ${prefix + command}`
          );

        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "📩",
            key: m.key,
          },
        });

        let media = await quoted.download();
        let { toAudio } = require("./lib/converter");
        let audio = await toAudio(media, "mp4");

        await DimzBot.sendMessage(
          m.chat,
          {
            audio: audio,
            mimetype: "audio/mpeg",
          },
          {
            quoted: m,
          }
        );

        reduceLimit(botId, m.sender);
      }
      break;

    case "tomp3":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);

        if (/document/.test(mime))
          return reply(
            `Kirim atau balas Video/Audio yang ingin diubah menjadi MP3 dengan caption ${prefix + command}`
          );
        if (!/video/.test(mime) && !/audio/.test(mime))
          return reply(
            `Kirim atau balas Video/Audio yang ingin diubah menjadi MP3 dengan caption ${prefix + command}`
          );
        if (!quoted)
          return reply(
            `Kirim atau balas Video/Audio yang ingin diubah menjadi MP3 dengan caption ${prefix + command}`
          );

        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "📩",
            key: m.key,
          },
        });

        let media = await quoted.download();
        let { toAudio } = require("./lib/converter");
        let audio = await toAudio(media, "mp4");

        await DimzBot.sendMessage(
          m.chat,
          {
            document: audio,
            mimetype: "audio/mpeg",
            fileName: `Convert By ${botName}.mp3`,
          },
          {
            quoted: m,
          }
        );

        reduceLimit(botId, m.sender);
      }
      break;

    case "tovn":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);
        if (!m.quoted || (!/video/.test(mime) && !/audio/.test(mime))) {
          return reply(
            `Reply video atau audio yang ingin diubah menjadi VN dengan caption ${prefix + command}`
          );
        }

        const duration =
          quoted.message?.videoMessage?.seconds ||
          quoted.message?.audioMessage?.seconds ||
          0;
        if (duration > 300) {
          return reply(
            `❌ Gagal, durasi media terlalu panjang. Maksimal adalah 5 menit.`
          );
        }

        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "⏳",
            key: m.key,
          },
        });

        try {
          let media = await DimzBot.downloadAndSaveMediaMessage(quoted);
          let ran = getRandom(".ogg");

          exec(
            `ffmpeg -i ${media} -c:a libopus -vn -vbr on ${ran}`,
            async (err) => {
              fs.unlinkSync(media);
              if (err) {
                console.error("FFmpeg tovn Error:", err);
                if (fs.existsSync(ran)) fs.unlinkSync(ran);
                return reply("❌ Gagal mengonversi media, coba lagi.");
              }

              let buff = fs.readFileSync(ran);
              await DimzBot.sendMessage(
                m.chat,
                {
                  audio: buff,
                  mimetype: "audio/ogg; codecs=opus",
                  ptt: true,
                },
                {
                  quoted: m,
                }
              );

              fs.unlinkSync(ran);
            }
          );
          reduceLimit(botId, m.sender);
        } catch (e) {
          console.error("Tovn Error:", e);
          reply("❌ Terjadi kesalahan saat memproses media.");
        }
      }
      break;

    case "pin":
    case "pinterest":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);
        if (!text)
          return reply(
            `Contoh: ${prefix + command} waifu\nAtau: ${prefix + command} down https://...`
          );
        const argss = text.split(" ");
        const subcmd = argss[0].toLowerCase();

        if (subcmd === "down") {
          const url = argss.slice(1).join(" ");
          if (!url || !isUrl(url))
            return reply("❌ Masukkan URL Pinterest yang valid!");
          await DimzBot.sendMessage(m.chat, {
            react: {
              text: "📩",
              key: m.key,
            },
          });
          try {
            const isVideo = url.includes(".mp4");
            const caption = `✅ *Berhasil Download dari Pinterest!*\n\n📦 *Tipe:* ${isVideo ? "Video" : "Image"}`;
            const mediaBuffer = await getBuffer(url);
            if (isVideo) {
              await DimzBot.sendMessage(
                m.chat,
                {
                  video: mediaBuffer,
                  caption,
                },
                {
                  quoted: m,
                }
              );
            } else {
              await DimzBot.sendMessage(
                m.chat,
                {
                  image: mediaBuffer,
                  caption,
                },
                {
                  quoted: m,
                }
              );
            }
          } catch (err) {
            console.error("Pinterest Download Error:", err);
            reply("❌ Gagal mendownload media dari Pinterest.");
          }
          break;
        }

        try {
          await DimzBot.sendMessage(m.chat, {
            react: {
              text: "⏳",
              key: m.key,
            },
          });
          const query = text.trim();
          const { data } = await axios.get(
            `https://api.siputzx.my.id/api/s/pinterest?query=${encodeURIComponent(query)}&type=image`
          );
          if (!data.status || !data.data || data.data.length === 0)
            return reply(`❌ Tidak ditemukan hasil untuk "${query}".`);
          const results = data.data;
          const initext = `_Nih Kak ${pushname}, hasil pencarian dari Pinterest:_\n\n🧠 *Query:* ${query}\n📊 *Total:* ${results.length} hasil`;

          const rows = results.map((item) => ({
            header: item.grid_title || item.seo_alt_text || "Tidak ada judul",
            title: item.grid_title || "Tanpa Judul",
            description: `👤 ${item.pinner?.username || "Unknown"} | ❤️ ${(item.reaction_counts && Object.values(item.reaction_counts)[0]) || 0} | 📅 ${item.created_at}`,
            id: `.pinterest down ${item.video_url || item.image_url}`,
          }));

          const sections = [
            {
              title: `Hasil Pencarian - ${query}`,
              highlight_label: "Pilih untuk Download",
              rows,
            },
          ];

          const listMessage = {
            title: "📌 Pinterest Search Result",
            sections,
          };

          const msg = generateWAMessageFromContent(
            m.chat,
            {
              viewOnceMessage: {
                message: {
                  messageContextInfo: {
                    deviceListMetadata: {},
                    deviceListMetadataVersion: 2,
                  },
                  interactiveMessage: proto.Message.InteractiveMessage.create({
                    body: proto.Message.InteractiveMessage.Body.create({
                      text: "",
                    }),
                    footer: proto.Message.InteractiveMessage.Footer.create({
                      text: `> Hasil untuk ${query}`,
                    }),
                    header: proto.Message.InteractiveMessage.Header.create({
                      title: initext,
                      hasMediaAttachment: true,
                      ...(await prepareWAMessageMedia(
                        {
                          image: {
                            url: results[0].image_url,
                          },
                        },
                        {
                          upload: DimzBot.waUploadToServer,
                        }
                      )),
                    }),
                    nativeFlowMessage:
                      proto.Message.InteractiveMessage.NativeFlowMessage.create(
                        {
                          buttons: [
                            {
                              name: "single_select",
                              buttonParamsJson: JSON.stringify(listMessage),
                            },
                          ],
                        }
                      ),
                    contextInfo: {
                      mentionedJid: [m.sender],
                      externalAdReply: {
                        title: "Pinterest Search",
                        body: `Hasil untuk: ${query}`,
                        containsAutoReply: true,
                      },
                    },
                  }),
                },
              },
            },
            {
              quoted: m,
            }
          );
          await DimzBot.relayMessage(m.chat, msg.message, {});
          reduceLimit(botId, m.sender);
        } catch (err) {
          console.error("Pinterest Search Error:", err);
          reply("❌ Gagal mengambil data dari Pinterest. Coba lagi nanti.");
        }
      }
      break;

    case "ssweb":
{
  if (!hasLimit(botId, m.sender)) return reply(mess.limit0);

  const fs = require("fs");
  const path = require("path");
  const puppeteer = require("puppeteer");

  if (!text)
    return reply(
      `Contoh:\n${prefix + command} https://softbotz.my.id\n${prefix + command} hp https://softbotz.my.id\n${prefix + command} full https://softbotz.my.id`
    );

  let mode = "desktop";
  let raw = text.trim();

  if (/^hp\s+/i.test(raw)) {
    mode = "hp";
    raw = raw.replace(/^hp\s+/i, "").trim();
  } else if (/^full\s+/i.test(raw)) {
    mode = "full";
    raw = raw.replace(/^full\s+/i, "").trim();
  }

  if (!raw) return reply("❌ URL tidak boleh kosong.");

  let targetUrl = raw.replace(/\n/g, "").replace(/\s+/g, "");

  if (!/^https?:\/\//i.test(targetUrl)) {
    targetUrl = "https://" + targetUrl;
  }

  try {
    new URL(targetUrl);
  } catch {
    return reply("❌ URL tidak valid.");
  }

  await reply(
    `⏳ Mengambil screenshot...\n🌐 URL: ${targetUrl}\n📱 Mode: ${mode}`
  );

  let browser;

  try {
    browser = await puppeteer.launch({
      executablePath: "/usr/bin/chromium",
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage"
      ],
    });

    const page = await browser.newPage();

    if (mode === "hp") {
      await page.setViewport({
        width: 414,
        height: 896,
        deviceScaleFactor: 2,
      });
    } else {
      await page.setViewport({
        width: 1280,
        height: 720,
        deviceScaleFactor: 2,
      });
    }

    await page.goto(targetUrl, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    await new Promise(r => setTimeout(r, 2000));

    const tempDir = path.join(__dirname, "./temp");
    if (!fs.existsSync(tempDir))
      fs.mkdirSync(tempDir, { recursive: true });

    const filePath = path.join(tempDir, `ssweb_${Date.now()}.png`);

    await page.screenshot({
      path: filePath,
      type: "png",
      fullPage: mode === "full",
    });

    await DimzBot.sendMessage(
      m.chat,
      {
        image: fs.readFileSync(filePath),
        caption: `✅ Screenshot berhasil!\n🌐 URL: ${targetUrl}\n📱 Mode: ${mode}`,
      },
      { quoted: m }
    );

    try { fs.unlinkSync(filePath); } catch {}

    reduceLimit(botId, m.sender);

  } catch {
    reply("❌ Gagal mengambil screenshot.");
  } finally {
    if (browser) {
      try { await browser.close(); } catch {}
    }
  }
}
break;

    case "tempmail":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);
        const base = "https://tempail.top/api";
        const headers = {
          "user-agent": "Postify/1.0.0",
        };

        const createEmail = async () => {
          try {
            const res = await axios.post(
              `${base}/email/create/ApiTempail`,
              null,
              {
                headers,
              }
            );
            if (res.data.status !== "success")
              return reply("❌ Gagal membuat email sementara, coba lagi!");
            const { email, email_token, deleted_in } = res.data.data;
            return {
              email,
              email_token,
              deleted_in,
            };
          } catch (err) {
            return reply(`❌ Error`);
          }
        };

        const getMessages = async (token) => {
          try {
            const res = await axios.get(
              `${base}/messages/${token}/ApiTempail`,
              {
                headers,
              }
            );
            if (res.data.status !== "success")
              return reply("❌ Gagal mengambil daftar pesan email.");
            return res.data.data.messages;
          } catch (err) {
            return reply(`❌ Error`);
          }
        };

        const getMessage = async (id) => {
          try {
            const res = await axios.get(`${base}/message/${id}/ApiTempail`, {
              headers,
            });
            if (res.data.status !== "success")
              return reply("❌ Gagal mengambil isi pesan.");
            return res.data.data[0];
          } catch (err) {
            return reply(`❌ Error`);
          }
        };

        try {
          const subcmd = (argss[0] || "").toLowerCase();

          // === Buat Email Baru ===
          if (subcmd === "new") {
            const data = await createEmail();
            if (!data) return;
            reply(
              `📧 *TEMP MAIL DIBUAT!*

🆔 *Email:* ${data.email}
🔑 *Token:* ${data.email_token}
⏰ *Kadaluarsa:* ${data.deleted_in}

Gunakan:
• *${prefix + command} list <token>* – lihat pesan masuk
• *${prefix + command} read <id>* – baca pesan tertentu`
            );
            return;
          }

          // === Lihat Semua Pesan Masuk ===
          if (subcmd === "list") {
            if (!argss[1])
              return reply(
                `❌ Masukkan token!\nContoh: *${prefix + command} list <token>*`
              );
            const messages = await getMessages(argss[1]);
            if (!Array.isArray(messages) || messages.length === 0)
              return reply("📭 Tidak ada pesan masuk di inbox kamu.");

            let teks = "📨 *Daftar Pesan Masuk:*\n\n";
            messages.forEach((msg, i) => {
              teks += `${i + 1}. *${msg.subject}*\nDari: ${msg.from_email}\nID: ${msg.id}\n──────────────\n`;
            });
            reply(teks);
            return;
          }

          // === Baca Pesan Tertentu ===
          if (subcmd === "read") {
            if (!argss[1])
              return reply(
                `❌ Masukkan ID pesan!\nContoh: *${prefix + command} read <id>*`
              );
            const message = await getMessage(argss[1]);
            if (!message) return;
            reply(
              `📩 *Isi Pesan Ditemukan!*

🗂️ *Subjek:* ${message.subject}
👤 *Dari:* ${message.from_email}
🕓 *Diterima:* ${message.receivedAt}

📬 *Isi Pesan:*
${message.content}`
            );
            return;
          }

          // === Help ===
          return reply(
            `📮 *TEMPMAIL MENU*

• *${prefix + command} new* — buat email baru
• *${prefix + command} list <token>* — lihat pesan masuk
• *${prefix + command} read <id>* — baca pesan`
          );
          reduceLimit(botId, m.sender);
        } catch (e) {
          console.error("TEMPMAIL ERROR:", e);
          reply("❌ Terjadi kesalahan saat menjalankan perintah tempmail.");
        }
      }
      break;

    case "rvo":
    case "readvo":
      {
        if (!m.quoted)
          return reply(
            `Balas pesan *View Once* (gambar/video/stiker/dokumen/audio) nya`
          );
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);

        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "⏳",
            key: m.key,
          },
        });
        try {
          await DimzBot.copyNForward(
            m.chat,
            m.quoted.fakeObj || m.quoted,
            true,
            {
              readViewOnce: true,
            }
          );
          return;
        } catch {}

        const msg = (m.quoted.fakeObj || m.quoted).message || {};
        const unwrapVO = (node) => {
          let cur = node;
          const chain = [
            "ephemeralMessage",
            "viewOnceMessage",
            "viewOnceMessageV2",
            "viewOnceMessageV2Extension",
          ];
          for (const key of chain) {
            if (cur?.[key]?.message) cur = cur[key].message;
          }
          return cur;
        };

        const inner = unwrapVO(msg);
        const type = inner.imageMessage
          ? "imageMessage"
          : inner.videoMessage
            ? "videoMessage"
            : inner.stickerMessage
              ? "stickerMessage"
              : inner.audioMessage
                ? "audioMessage"
                : inner.documentMessage
                  ? "documentMessage"
                  : null;

        if (!type)
          return reply(
            "Itu *bukan* pesan View Once yang didukung (image/video/stiker/audio/dokumen)."
          );

        try {
          const {
            downloadContentFromMessage,
          } = require("@whiskeysockets/baileys");

          const streamType =
            type === "imageMessage"
              ? "image"
              : type === "videoMessage"
                ? "video"
                : type === "audioMessage"
                  ? "audio"
                  : type === "stickerMessage"
                    ? "sticker"
                    : type === "documentMessage"
                      ? "document"
                      : "document";

          const stream = await downloadContentFromMessage(
            inner[type],
            streamType
          );
          let buffer = Buffer.from([]);
          for await (const chunk of stream)
            buffer = Buffer.concat([buffer, chunk]);

          const caption = inner[type]?.caption || "";
          if (type === "imageMessage") {
            await DimzBot.sendMessage(
              m.chat,
              {
                image: buffer,
                caption,
              },
              {
                quoted: m,
              }
            );
          } else if (type === "videoMessage") {
            await DimzBot.sendMessage(
              m.chat,
              {
                video: buffer,
                caption,
              },
              {
                quoted: m,
              }
            );
          } else if (type === "stickerMessage") {
            await DimzBot.sendMessage(
              m.chat,
              {
                sticker: buffer,
              },
              {
                quoted: m,
              }
            );
          } else if (type === "audioMessage") {
            await DimzBot.sendMessage(
              m.chat,
              {
                audio: buffer,
                mimetype: inner[type]?.mimetype || "audio/mpeg",
                ptt: !!inner[type]?.ptt,
              },
              {
                quoted: m,
              }
            );
          } else if (type === "documentMessage") {
            await DimzBot.sendMessage(
              m.chat,
              {
                document: buffer,
                fileName: inner[type]?.fileName || "file",
                mimetype: inner[type]?.mimetype || "application/octet-stream",
              },
              {
                quoted: m,
              }
            );
          }
          reduceLimit(botId, m.sender);
        } catch (e) {
          return reply("Gagal mengambil View Once.");
        }
        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "",
            key: m.key,
          },
        });
      }
      break;

    case "lirik":
    case "lyrics":
      {
        if (!text)
          return reply(
            `❌ Masukkan judul lagu atau link Genius!\nContoh: *${prefix}lirik hindia rumah ke rumah*`
          );
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);

        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "🎵",
            key: m.key,
          },
        });

        try {
          const result = await genius(text);

          if (result.error) {
            return reply(`❌ ${result.error}`);
          }

          let info = `
🎵 *LIRIK DARI GENIUS* 🎵
━━━━━━━━━━━━━━━━━━━━━━
🎤 *Artist & Judul:* ${result.title || "Tidak Diketahui"}
💿 *Album:* ${result.album || "Tidak Diketahui"}
📅 *Rilis:* ${result.releaseDate || "Tidak Diketahui"}
━━━━━━━━━━━━━━━━━━━━━━
${result.lyrics}
        `.trim();

          reply(info);

          reduceLimit(botId, m.sender);
        } catch (e) {
          console.error("[LIRIK ERROR]", e);
          reply("❌ Terjadi kesalahan saat mencari lirik.");
        }

        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "✅",
            key: m.key,
          },
        });
      }
      break;

    case "exiftool":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);
        if (!quoted || !/image/.test(mime))
          return reply(
            `Balas gambar dengan caption *${prefix + command}* untuk membaca metadata dari document foto!`
          );

        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "🔍",
            key: m.key,
          },
        });

        try {
          const buffer = await quoted.download();
          const metadata = await exifr.parse(buffer, {
            tiff: true,
            ifd0: true,
            exif: true,
            gps: true,
          });

          if (!metadata)
            return reply("❌ Tidak ditemukan metadata pada gambar");

          function dmsToDecimal(dms, ref) {
            if (!Array.isArray(dms)) return NaN;
            const [deg, min, sec] = dms;
            let dec = deg + min / 60 + sec / 3600;
            if (ref === "S" || ref === "W") dec = -dec;
            return dec;
          }

          let info = `*📸 Metadata Lengkap:*\n\n`;

          if (metadata.Make || metadata.Model)
            info += `• Kamera: ${metadata.Make || "-"} ${metadata.Model || "-"}\n`;

          if (metadata.LensMake || metadata.LensModel)
            info += `• Lensa: ${metadata.LensMake || "-"} ${metadata.LensModel || "-"}\n`;

          if (metadata.DateTimeOriginal)
            info += `• Diambil: ${metadata.DateTimeOriginal}\n`;

          if (metadata.CreateDate) info += `• Dibuat: ${metadata.CreateDate}\n`;

          if (metadata.ModifyDate) info += `• Diubah: ${metadata.ModifyDate}\n`;

          if (metadata.ExposureTime)
            info += `• Exposure: ${metadata.ExposureTime}s\n`;

          if (metadata.FNumber) info += `• Aperture: f/${metadata.FNumber}\n`;

          if (metadata.ISO) info += `• ISO: ${metadata.ISO}\n`;

          if (metadata.FocalLength)
            info += `• Focal Length: ${metadata.FocalLength}mm\n`;

          if (metadata.Orientation)
            info += `• Orientasi: ${metadata.Orientation}\n`;

          let lat = dmsToDecimal(metadata.GPSLatitude, metadata.GPSLatitudeRef);
          let lon = dmsToDecimal(
            metadata.GPSLongitude,
            metadata.GPSLongitudeRef
          );

          if (!isNaN(lat) && !isNaN(lon)) {
            const latStr = lat.toFixed(6).replace(",", ".");
            const lonStr = lon.toFixed(6).replace(",", ".");

            info += `• Lokasi: ${latStr}, ${lonStr}\n`;
            info += `• Maps: https://www.google.com/maps?q=${latStr},${lonStr}\n`;

            await DimzBot.sendMessage(
              m.chat,
              {
                location: {
                  degreesLatitude: parseFloat(latStr),
                  degreesLongitude: parseFloat(lonStr),
                },
              },
              {
                quoted: m,
              }
            );
          } else {
            info += `• Lokasi: Tidak tersedia\n`;
          }

          await reply(info);
          reduceLimit(botId, m.sender);
        } catch (err) {
          reply("❌ Terjadi kesalahan saat membaca metadata.");
        }
      }
      break;

    case "bass":
    case "blown":
    case "deep":
    case "earrape":
    case "fast":
    case "fat":
    case "nightcore":
    case "reverse":
    case "robot":
    case "slow":
    case "smooth":
    case "squirrel":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);
        try {
          let set;
          if (/bass/.test(command))
            set = "-af equalizer=f=54:width_type=o:width=2:g=20";
          if (/blown/.test(command)) set = "-af acrusher=.1:1:64:0:log";
          if (/deep/.test(command)) set = "-af atempo=4/4,asetrate=44500*2/3";
          if (/earrape/.test(command)) set = "-af volume=12";
          if (/fast/.test(command))
            set = '-filter:a "atempo=1.63,asetrate=44100"';
          if (/fat/.test(command))
            set = '-filter:a "atempo=1.6,asetrate=22100"';
          if (/nightcore/.test(command))
            set = "-filter:a atempo=1.06,asetrate=44100*1.25";
          if (/reverse/.test(command)) set = '-filter_complex "areverse"';
          if (/robot/.test(command))
            set =
              "-filter_complex \"afftfilt=real='hypot(re,im)*sin(0)':imag='hypot(re,im)*cos(0)':win_size=512:overlap=0.75\"";
          if (/slow/.test(command))
            set = '-filter:a "atempo=0.7,asetrate=44100"';
          if (/smooth/.test(command))
            set =
              "-filter:v \"minterpolate='mi_mode=mci:mc_mode=aobmc:vsbmc=1:fps=120'\"";
          if (/squirrel/.test(command))
            set = '-filter:a "atempo=0.5,asetrate=65100"';
          if (/audio/.test(mime)) {
            reply(mess.wait);
            let media = await DimzBot.downloadAndSaveMediaMessage(quoted);
            let ran = getRandom(".mp3");
            exec(
              `ffmpeg -i ${media} ${set} ${ran}`,
              async (err, stderr, stdout) => {
                fs.unlinkSync(media);
                if (err) return reply(err);
                let buff = fs.readFileSync(ran);
                await DimzBot.sendMessage(
                  m.chat,
                  {
                    audio: buff,
                    mimetype: "audio/mpeg",
                  },
                  {
                    quoted: m,
                  }
                );
                fs.unlinkSync(ran);
              }
            );
          } else
            reply(
              `Reply audio yang ingin kamu ubah dengan *${prefix + command}*`
            );
          reduceLimit(botId, m.sender);
        } catch (e) {
          reply(e);
        }
      }
      break;

    case "removebg":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);
        if (!quoted)
          return reply(
            `Balas foto yang ingin dihapus latar belakangnya, lalu ketik ${prefix + command}`
          );

        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "⏳",
            key: m.key,
          },
        });
        if (/image/.test(mime)) {
          reply(mess.wait);
          let mee = await DimzBot.downloadAndSaveMediaMessage(quoted);
          const { request, remove, render } = require("./crab/rmbg");

          try {
            const session = await request();
            const imageBuffer = fs.readFileSync(mee);
            const maskBuffer = await remove(imageBuffer, session);
            const finalImage = await render(imageBuffer, maskBuffer);
            const tmpDir = "./temp";
            if (!fs.existsSync(tmpDir)) {
              fs.mkdirSync(tmpDir);
            }
            const outputPath = `${tmpDir}/output.png`;
            await finalImage.writeAsync(outputPath);
            await DimzBot.sendMessage(
              m.chat,
              {
                image: fs.readFileSync(outputPath),
                caption: mess.success,
              },
              {
                quoted: m,
              }
            );
            reduceLimit(botId, m.sender);
          } catch (error) {
            reply("Terjadi kesalahan saat memproses gambar. Coba lagi nanti.");
          }
        } else {
          reply("File yang dikirim bukan gambar!");
        }
      }
      break;

    case "tourl":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);
        if (!m.quoted)
          return reply(
            `Balas gambar/video/audio etc  dengan caption: ${prefix + command}`
          );

        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "⏳",
            key: m.key,
          },
        });

        try {
          const fileName = `upload_${Date.now()}`;
          const saved = await DimzBot.downloadAndSaveMediaMessage(
            m.quoted,
            fileName
          );

          const stats = fs.statSync(saved);
          const size = stats.size;
          const formatSize = (bytes) => {
            if (bytes < 1024) return bytes + " B";
            if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
            if (bytes < 1024 * 1024 * 1024)
              return (bytes / (1024 * 1024)).toFixed(2) + " MB";
            return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
          };

          const url = await drizzup(saved);
          fs.unlinkSync(saved);

          if (!url) return reply("❌ Gagal upload file.");

          reply(
            `✅ *Upload Berhasil!*
🌐 URL: ${url}
📂 Nama File: ${fileName}
📏 Ukuran: ${formatSize(size)}
⏰ Expired: 24 Jam`
          );
          reduceLimit(botId, m.sender);
        } catch (err) {
          reply("❌ Terjadi kesalahan saat upload file, coba lagi nanti.");
        }

        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "",
            key: m.key,
          },
        });
      }
      break;

    // fitur game
    /*
    case "mining":
    case "mine": {
      const cooldownStatus = checkCooldown(botId, m.sender, 'mining'); 
      if (cooldownStatus.onCooldown) {
        return reply(`⛏️ Kamu sedang kelelahan setelah menambang.\nCoba lagi setelah ${cooldownStatus.formatted}.`);
      }
      const result = runMining(botId, m.sender);
      setCooldown(botId, m.sender, 'mining'); 
      if (!result.success) {
          return reply(`❌ ${result.message}\nCooldown 30 Menit.`);
      }
      const foundItem = result.found;
      const itemAmount = result.amount;
      
      // Ambil data inventory terbaru setelah menambang
      const inventory = getInventory(botId, m.sender);
      const toolId = inventory.tools['mine'].currentId;
      const tool = inventory.tools[toolId];

      let responseText = `
    ⛏️ *Berhasil Menambang!*
    Kamu menggunakan ${tool.emoji} ${tool.name}.

    ${itemAmount > 0 
        ? `🎉 *Ditemukan:* ${foundItem.emoji} ${foundItem.name} x${itemAmount}!` 
        : `❌ *Gagal:* Hanya menemukan batu biasa.`}

    > 💠 +${result.exp} EXP
    > 🛠️ Durability Pickaxe: *${tool.durability}*
    > ⏳ Cooldown: 30 Menit.

    Cek item kamu dengan *${prefix}inventory*.
      `;
      reply(responseText);
    }
    break;
    case "buytool":
    case "beli": {
        const toolId = argss[0]?.toLowerCase();

        // 🟢 Jika tidak ada input, tampilkan daftar alat yang lebih informatif
        if (!toolId || !TOOLS[toolId]) {
            let toolList = Object.entries(getToolList()).map(([id, t]) => {
                // Mengubah tipe 'mine'/'chop' menjadi lebih deskriptif
                const typeName = t.type === 'mine' ? 'Mining' : (t.type === 'chop' ? 'Menebang' : 'Lainnya');
                return `• ID: *${id}*\n  ${t.emoji} ${t.name} (*${typeName}*)\n  Harga: ${t.price} Coin\n  Durability: ${t.durability}`;
            }).join("\n\n");
            
            return reply(`
    🛠️ *Daftar Alat yang Tersedia:*

    ${toolList}

    Gunakan: *${prefix}beli <ID Alat>*
    Contoh: *${prefix}beli wood_pickaxe*
            `);
        }

        const result = buyTool(botId, m.sender, toolId);
        
        if (result.success) {
            // 🟢 Pesan sukses yang dinamis sesuai tipe alat
            let nextAction = "";
            if (result.toolType === 'mine') {
                nextAction = `Lanjutkan dengan *${prefix}mining*!`;
            } else if (result.toolType === 'chop') {
                // Asumsi command menebang adalah .chop
                nextAction = `Lanjutkan dengan *${prefix}chop*!`; 
            }

            reply(`✅ Selamat! Kamu berhasil membeli ${result.toolName} dan menjadikannya alat utama.\n${nextAction}`);
        } else {
            reply(`❌ Gagal membeli: ${result.message}`);
        }
    }
    break;

    case "invmining":
    case "inventory": {
        const inventory = getInventory(botId, m.sender);
        const user = getUserExp(botId, m.sender);
        
        const currentToolId = inventory.tools.current;
        const currentTool = inventory.tools[currentToolId];

        let toolStatus = currentTool 
            ? `${currentTool.emoji} *${currentTool.name}*\n  Durability: ${currentTool.durability}/${TOOLS[currentToolId].durability}`
            : "❌ Belum ada alat tambang!";

        let itemStatus = "*Daftar Item Tambang:*\n";
        const itemEntries = Object.entries(inventory.items);

        if (itemEntries.length === 0) {
            itemStatus += "  (Kosong. Mulai tambang dengan *"+prefix+"mining*)";
        } else {
            itemEntries.forEach(([itemId, count]) => {
                const item = getItemList()[itemId];
                const value = item.value * count;
                itemStatus += `• ${item.emoji} ${item.name} x${count} (Total Jual: ${value} Coin)\n`;
            });
        }

        reply(`
    👤 *INVENTORY TAMBANG*
    ━━━━━━━━━━━━━━━━━━━━━━
    💰 *Coin Kamu:* ${user.coins} Coin
    ⭐ *Level:* ${user.level}

    🛠️ *Alat Tambang Utama:*
    ${toolStatus}
    ━━━━━━━━━━━━━━━━━━━━━━
    ${itemStatus}

    Jual item dengan: *${prefix}sellitem <ID> <jumlah>*
    Contoh: *${prefix}sellitem diamond 1*
        `);
    }
    break;
    */
    case "sellitem":
    case "sell":
    case "jual":
      {
        const [itemOrType, jumlahStr] = argss;
        const jumlah = parseInt(jumlahStr);
        const user = m.sender;
        const itemIdLower = itemOrType?.toLowerCase();

        if (!itemOrType || !jumlahStr || isNaN(jumlah) || jumlah <= 0) {
          return reply(
            `❌ Format salah!\n\nGunakan:\n• Jual Coin ke EXP: *${prefix}sell coin <jumlah>*\n\nContoh: *${prefix}sell coin 20000*`
          );
        }

        // --- LOGIKA 1: JUAL COIN KE EXP ---
        if (itemIdLower === "coin") {
          const expData = loadExpData(botId);
          if (!expData[user])
            expData[user] = {
              exp: 0,
              coins: 0,
              level: 1,
            };
          let userCoins = expData[user].coins || 0;
          const hargaExp = 20000; // Harga 1 EXP = 20.000 Coin

          if (userCoins < jumlah) {
            return reply(
              `💰 Coin kamu tidak cukup! Kamu cuma punya ${userCoins} coin.`
            );
          }
          if (jumlah % hargaExp !== 0) {
            return reply(
              `❌ Jumlah minimal coin harus kelipatan *${hargaExp}* untuk ditukar ke EXP.`
            );
          }

          const expGain = Math.floor(jumlah / hargaExp);

          expData[user].coins -= jumlah;
          expData[user].exp += expGain;

          const oldLevel = expData[user].level;
          const newLevel = Math.floor(expData[user].exp / 100) + 1;
          if (newLevel > oldLevel) expData[user].level = newLevel;

          saveExpData(botId, expData);

          reply(`
✅ *Penukaran Coin Berhasil!*
💰 Coin ditukar: ${jumlah}
📈 EXP didapat: ${expGain}
🏅 Level kamu: ${expData[user].level}
        `);
          return;
        }

        // --- LOGIKA 2: JUAL ITEM TAMBANG ---

        const itemInfo = getItemList()[itemIdLower];
        if (!itemInfo) {
          return reply(
            `❌ Item ID *${itemIdLower}* tidak valid! Cek ID dengan *${prefix}inventory*.`
          );
        }

        const result = sellItem(botId, m.sender, itemIdLower, jumlah);

        if (result.success) {
          reply(`
✅ *Penjualan Item Tambang Berhasil!*
📦 Item Terjual: ${result.item} x${result.amount}
💰 Total Didapat: ${result.earnings} Coin
📊 Saldo Baru: ${getUserExp(botId, m.sender).coins} Coin
        `);
        } else {
          reply(`❌ Gagal Menjual: ${result.message}`);
        }
      }
      break;

    case "profile":
      {
        const user = getUserExp(botId, m.sender);
        const rank = getRank(user.level);
        const bar = getProgressBar(user.exp, 100, 12, user.level);

        reply(`⚔️ *${botName} RPG PROFILE*
👤 ${m.pushName}
⭐ Level: ${user.level}
💠 EXP: ${user.exp}
💰 Coin: ${user.coins || 0}
🎯 Rank: ${rank}
📊 Progress: ${bar}`);
      }
      break;

    case "leaderboard":
    case "lb":
      {
        const dbFile = `./database/${botId}.json`;
        if (!fs.existsSync(dbFile)) return reply("❌ Belum ada data EXP!");

        const data = JSON.parse(fs.readFileSync(dbFile));
        const sorted = Object.entries(data)
          .sort(([, a], [, b]) => b.exp - a.exp)
          .slice(0, 10);

        if (sorted.length === 0)
          return reply("📊 Belum ada pemain yang tercatat di leaderboard.");

        const medals = ["🥇", "🥈", "🥉"];
        let text = `🏆 *TOP GLOBAL LEADERBOARD*\n👑 *${botName}*\n\n`;

        sorted.forEach(([jid, user], i) => {
          const medal = medals[i] ? `${medals[i]}✨` : `#${i + 1}`;
          const name = `@${jid.split("@")[0]}`;
          const rank = getRank(user.level);
          const bar = getProgressBar(user.exp, 100, 8, user.level);

          text += `${medal} ${name}\n`;
          text += `   ⭐ Level: *${user.level}*\n`;
          text += `   💠 EXP: *${user.exp}*\n`;
          text += `   💰 Coin: *${user.coins || 0}*\n`;
          text += `   🎯 Rank: ${rank}\n`;
          text += `   📊 ${bar}\n\n`;
        });

        text += `💫 Tetap aktif berinteraksi dengan ${botName}\nUntuk naik peringkat dan meningkatkan rank kamu!\n`;

        await reply(text, {
          mentions: sorted.map(([jid]) => jid),
        });
      }
      break;

    case "rankinfo":
    case "ranklist":
      {
        const user = getUserExp(botId, m.sender);
        const level = user.level;
        const rankNow = getRank(level);
        const bar = getProgressBar(user.exp, 100, 12, user.level);

        const ranks = [
          {
            min: 1,
            max: 4,
            name: "🥉 Newbie Bot",
          },
          {
            min: 5,
            max: 9,
            name: "🥈 Adept Warrior",
          },
          {
            min: 10,
            max: 14,
            name: "🥇 Battle Mage",
          },
          {
            min: 15,
            max: 19,
            name: "💎 Shadow Knight",
          },
          {
            min: 20,
            max: 24,
            name: "🔥 Dragon Slayer",
          },
          {
            min: 25,
            max: 29,
            name: "🌌 Ethereal Lord",
          },
          {
            min: 30,
            max: 39,
            name: "⚔️ Mythic Overlord",
          },
          {
            min: 40,
            max: 49,
            name: "🌠 Celestial Guardian",
          },
          {
            min: 50,
            max: 74,
            name: "🕊️ Divine Archon",
          },
          {
            min: 75,
            max: 99,
            name: "💫 Chrono Sage",
          },
          {
            min: 100,
            max: 149,
            name: "🌙 Arcane Warden",
          },
          {
            min: 150,
            max: 199,
            name: "🌀 Phantom Emperor",
          },
          {
            min: 200,
            max: 249,
            name: "🔥 Infernal Warlord",
          },
          {
            min: 250,
            max: 299,
            name: "❄️ Frost Monarch",
          },
          {
            min: 300,
            max: 349,
            name: "🌋 Crimson Tyrant",
          },
          {
            min: 350,
            max: 399,
            name: "⚡ Stormbringer Titan",
          },
          {
            min: 400,
            max: 449,
            name: "🌌 Cosmic Conqueror",
          },
          {
            min: 450,
            max: 499,
            name: "🪐 Eternal Dominator",
          },
          {
            min: 500,
            max: 599,
            name: "👁️ Void Emperor",
          },
          {
            min: 600,
            max: 699,
            name: "🦋 Transcendent Deity",
          },
          {
            min: 700,
            max: 799,
            name: "💀 Oblivion Monarch",
          },
          {
            min: 800,
            max: 899,
            name: "🩸 Abyssal Sovereign",
          },
          {
            min: 900,
            max: 999,
            name: "🌠 Galactic Paragon",
          },
          {
            min: 1000,
            max: 1499,
            name: "⚔️ Supreme Celestial God",
          },
          {
            min: 1500,
            max: 1999,
            name: "🔥 Primordial Creator",
          },
          {
            min: 2000,
            max: 2999,
            name: "💎 Eternal Reality Weaver",
          },
          {
            min: 3000,
            max: 4999,
            name: "🌌 Infinite Ascendant",
          },
          {
            min: 5000,
            max: 9999,
            name: "👑 Omniversal Lord",
          },
          {
            min: 10000,
            max: Infinity,
            name: "💫 Origin of All Realms",
          },
          {
            min: Infinity,
            max: Infinity,
            name: "🌌👑 Supreme Eternal Deity",
          },
        ];

        let text = `⚔️ *RANK SYSTEM - ${botName}*\n`;
        text += `📈 Level kamu saat ini: *${level}*\n`;
        text += `🎯 Rank: ${rankNow}\n`;
        text += `📊 Progress: ${bar}\n\n`;
        text += `📜 *Daftar Rank yang tersedia:*\n\n`;

        for (const r of ranks) {
          const isCurrent = level >= r.min && level <= r.max;
          text += `• ${r.name}  (Lvl ${r.min}–${r.max === Infinity ? "∞" : r.max}) ${isCurrent ? "🔥 [KAMU DI SINI] 🔥" : ""}\n`;
        }

        text += `\n💫 Terus berinteraksi dengan ${botName} untuk naik ke rank selanjutnya!\n`;

        await reply(text);
      }
      break;

    // fitur anime
    case "loli":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);

        await DimzBot.sendMessage(m.chat, {
          react: {
            text: "🤝",
            key: m.key,
          },
        });

        try {
          const response = await axios.get(
            "https://api.ootaizumi.web.id/random/loli",
            {
              responseType: "arraybuffer",
            }
          );
          await DimzBot.sendMessage(
            m.chat,
            {
              image: Buffer.from(response.data),
              caption: `💖 Berikut adalah gambar ${command} untukmu! 🎀`,
              contextInfo: {
                mentionedJid: [m.sender],
                externalAdReply: {
                  title: botName,
                  body: `⏰ Time Now ${moment.tz("Asia/Jakarta").format("HH : mm : ss")}`,
                  thumbnail: fs.readFileSync(global.thumbnail),
                  mediaType: 1,
                  sourceUrl: wagc,
                },
              },
            },
            {
              quoted: m,
            }
          );

          reduceLimit(botId, m.sender);

          await DimzBot.sendMessage(m.chat, {
            react: {
              text: "✅",
              key: m.key,
            },
          });
        } catch (e) {
          reply("❌ Gagal mengambil gambar loli. Silakan coba lagi nanti.");
        }
      }
      break;

    // fitur game catur
    case "catur":
      {
        try {
          const subcmd = (argss[0] || "").toLowerCase();

          if (subcmd === "start") {
            if (!m.mentionedJid || m.mentionedJid.length === 0)
              return reply(
                `❌ Tag lawan untuk memulai permainan.\nContoh: *${prefix}catur start @user*`
              );

            let lawan = m.mentionedJid[0];
            if (m.sender === lawan)
              return reply("❌ Tidak bisa bermain melawan diri sendiri!");
            if (games[m.sender])
              return reply(
                `⚠️ Kamu masih dalam sesi catur. Ketik *${prefix}catur delete* untuk menghapus game.`
              );
            if (games[lawan])
              return reply(
                `⚠️ @${lawan.split("@")[0]} sedang dalam sesi catur.`
              );

            const game = new Chess();
            games[m.sender] = {
              game,
              lawan,
              putih: m.sender,
              hitam: lawan,
            };
            games[lawan] = {
              game,
              lawan: m.sender,
              putih: m.sender,
              hitam: lawan,
            };

            const msg = `
♟️ *Permainan Catur Dimulai!*

⚪ *Putih:* @${m.sender.split("@")[0]}
⚫ *Hitam:* @${lawan.split("@")[0]}

🎯 Giliran pertama: *@${m.sender.split("@")[0]}*

💰 *Hadiah Menang:*
• EXP: 130 - 250
• Coin: 500.000 - 950.000

Ketik contoh:
• *${prefix}catur move e2e4*
• *${prefix}catur move g1f3*

💡 *Tips Contoh:*
• Gerak pion: e2e4
• Kuda: g1f3
• Rokade: e1g1 (O-O) atau e1c1 (O-O-O)
• Promosi: e7e8q (jadi queen)

Ketik *${prefix}catur delete* untuk membatalkan game
`.trim();

            await DimzBot.sendMessage(
              m.chat,
              {
                text: msg,
                mentions: [m.sender, lawan],
              },
              {
                quoted: m,
              }
            );
            sendChessBoard(m, m.sender);
            return;
          }

          if (subcmd === "delete") {
            if (!games[m.sender])
              return reply("⚠️ Kamu tidak sedang bermain catur!");

            let lawan = games[m.sender].lawan;
            delete games[m.sender];
            delete games[lawan];

            await DimzBot.sendMessage(
              m.chat,
              {
                text: `🗑️ *Sesi Catur Dihapus!*\n\n@${m.sender.split("@")[0]} menghapus sesi permainan dengan @${lawan.split("@")[0]}.\nGunakan *${prefix}catur start @user* untuk memulai permainan baru.`,
                mentions: [m.sender, lawan],
              },
              {
                quoted: m,
              }
            );
            return;
          }

          if (subcmd === "move") {
            if (!games[m.sender])
              return reply("⚠️ Kamu tidak sedang bermain catur!");
            if (!argss[1])
              return reply(
                `⚠️ Format gerakan salah!\nContoh: *${prefix}catur move e2e4*`
              );

            const session = games[m.sender];
            const { game, lawan, putih, hitam } = session;

            const turn = game.turn();
            const expected = turn === "w" ? putih : hitam;
            if (m.sender !== expected) {
              return DimzBot.sendMessage(
                m.chat,
                {
                  text: `⛔ Bukan giliranmu!\nSekarang giliran: @${expected.split("@")[0]}`,
                  mentions: [expected],
                },
                {
                  quoted: m,
                }
              );
            }

            const mv = argss[1].trim();
            let result = null;
            const uci = /^[a-h][1-8][a-h][1-8][qrbn]?$/i;
            if (uci.test(mv)) {
              const from = mv.slice(0, 2);
              const to = mv.slice(2, 4);
              const promoChar = mv[4]?.toLowerCase();
              const promo =
                promoChar && "qrbn".includes(promoChar) ? promoChar : undefined;
              result = game.move({
                from,
                to,
                promotion: promo,
              });
            } else {
              result = game.move(mv, {
                sloppy: true,
              });
            }

            if (!result)
              return reply("⚠️ Gerakan tidak sah! Coba langkah lain.");

            const nextTurn = game.turn() === "w" ? putih : hitam;
            const mentions = [m.sender, lawan];

            if (game.isCheckmate()) {
              delete games[putih];
              delete games[hitam];

              let exp = getRandomInt(130, 250);
              let coin = getRandomInt(500000, 950000);
              addExp(botId, m.sender, exp, true);
              addCoins(botId, m.sender, coin);

              await DimzBot.sendMessage(
                m.chat,
                {
                  text: `♟️ *Skakmat!*\n\n🎉 @${m.sender.split("@")[0]} memenangkan permainan!\n\n🏆 Hadiah:\n• Coin: ${coin}\n• EXP: ${exp}`,
                  mentions,
                },
                {
                  quoted: m,
                }
              );
              return;
            }

            if (
              game.isDraw() ||
              game.isStalemate() ||
              game.insufficient_material ||
              game.isThreefoldRepetition()
            ) {
              delete games[putih];
              delete games[hitam];

              await DimzBot.sendMessage(
                m.chat,
                {
                  text: `🤝 *Partai Seri!*\nAlasan: ${
                    game.isStalemate()
                      ? "Stalemate"
                      : game.insufficient_material
                        ? "Material tidak cukup"
                        : game.isThreefoldRepetition()
                          ? "Threefold repetition"
                          : "Draw"
                  }`,
                },
                {
                  quoted: m,
                }
              );
              return;
            }

            await DimzBot.sendMessage(
              m.chat,
              {
                text: `✅ *Gerakan Berhasil!* @${m.sender.split("@")[0]} memainkan *${mv}*\n\n👉 Giliran: @${nextTurn.split("@")[0]}`,
                mentions: [m.sender, lawan, nextTurn],
              },
              {
                quoted: m,
              }
            );

            sendChessBoard(m, m.sender);
            return;
          }

          return reply(`⚡ Format Salah!\nGunakan:
• *${prefix}catur start @user* – mulai permainan
• *${prefix}catur move e2e4* – gerakkan bidak
• *${prefix}catur delete* – hapus sesi permainan`);
        } catch (err) {
          console.error("ERROR CATUR:", err);
          reply(
            "Format tidak di kenali, perhatikan dan pastikan benar saat melangkah"
          );
        }
      }
      break;

    // fitur game tebak
    case "tebakgame":
      {
        if (!m.isGroup) return StickGroup();
        const gamecek = await cekgame(m.chat);
        if (gamecek) return reply("Masih ada sesi yang belum selesai!");

        try {
          let anu = await fetchJson(
            "https://raw.githubusercontent.com/qisyana/scrape/main/tebakgame.json"
          );
          let result = await pickRandom(anu);

          tebakgame[m.chat] = [
            await DimzBot.sendMessage(
              m.chat,
              {
                image: {
                  url: result.img,
                },
                caption: `Gambar di atas adalah game?\n\nWaktu: ${(120000 / 1000).toFixed(0)} detik\n\n_Ketik ${prefix}nyerah untuk menyerah_\n_Ketik ${prefix}bantuan untuk petunjuk_`,
              },
              {
                quoted: m,
              }
            ),
            result,
            getRandomInt(5000, 25000),
            setTimeout(() => {
              if (tebakgame[m.chat]) {
                waktuHabis(result.jawaban);
                delete tebakgame[m.chat];
              }
            }, 60000),
          ];
        } catch (error) {
          reply("*Gagal memuat database dari server*. ☹️");
        }
      }
      break;

    case "tebakgambar":
      {
        if (!m.isGroup) return StickGroup();

        const gamecek = await cekgame(m.chat);
        if (gamecek) return reply("Masih ada sesi yang belum selesai!");

        try {
          let data = await fetchJson(
            "https://raw.githubusercontent.com/BochilTeam/database/master/games/tebakgambar.json"
          );
          let result = await pickRandom(data);

          console.log("Jawaban:", result.jawaban);

          tebakgambar[m.chat] = [
            await DimzBot.sendMessage(
              m.chat,
              {
                image: {
                  url: result.img,
                },
                caption: `Silahkan jawab soal di atas ini\n\nDeskripsi: ${result.deskripsi}\nWaktu: 60 detik\n\n_Ketik ${prefix}nyerah untuk menyerah_\n_Ketik ${prefix}bantuan untuk petunjuk_`,
              },
              {
                quoted: m,
              }
            ),
            result,
            250,
            setTimeout(() => {
              if (tebakgambar[m.chat]) {
                waktuHabis(result.jawaban);
                delete tebakgambar[m.chat];
              }
            }, 60000),
          ];
        } catch (e) {
          console.error(e);
          reply("❌ Gagal memuat soal dari server");
        }
      }
      break;

    case "tebakgame":
      {
        if (!m.isGroup) return StickGroup();

        const gamecek = await cekgame(m.chat);
        if (gamecek) return reply("Masih ada sesi yang belum selesai!");

        try {
          let data = await fetchJson(
            "https://raw.githubusercontent.com/qisyana/scrape/main/tebakgame.json"
          );
          let result = await pickRandom(data);

          console.log("Jawaban:", result.jawaban);

          tebakgame[m.chat] = [
            await DimzBot.sendMessage(
              m.chat,
              {
                image: {
                  url: result.img,
                },
                caption: `Gambar di atas adalah game apa?\n\nWaktu: 60 detik\n\n_Ketik ${prefix}nyerah untuk menyerah_\n_Ketik ${prefix}bantuan untuk petunjuk_`,
              },
              {
                quoted: m,
              }
            ),
            result,
            250,
            setTimeout(() => {
              if (tebakgame[m.chat]) {
                waktuHabis(result.jawaban);
                delete tebakgame[m.chat];
              }
            }, 60000),
          ];
        } catch (e) {
          console.error(e);
          reply("❌ Gagal memuat soal dari server");
        }
      }
      break;

    case "tebakhero":
      {
        if (!m.isGroup) return StickGroup();

        const gamecek = await cekgame(m.chat);
        if (gamecek) return reply("Masih ada sesi yang belum selesai!");

        try {
          let anu = await fetchJson(
            "https://api.siputzx.my.id/api/games/tebakheroml"
          );
          let result = anu.data;
          console.log("Jawaban:", result.name);

          tebakhero[m.chat] = [
            await DimzBot.sendMessage(
              m.chat,
              {
                audio: {
                  url: result.audio,
                },
                caption: `Silahkan tebak hero berdasarkan audio berikut!\n\nWaktu: 60 detik\n\n_Ketik ${prefix}nyerah untuk menyerah_\n_Ketik ${prefix}bantuan untuk petunjuk_`,
              },
              {
                quoted: m,
              }
            ),
            result,
            250,
            setTimeout(() => {
              if (tebakhero[m.chat]) {
                waktuHabis(result.name);
                delete tebakhero[m.chat];
              }
            }, 60000),
          ];
        } catch (e) {
          console.error(e);
          reply("❌ Gagal memuat soal dari server.");
        }
      }
      break;

    case "tebakff":
      {
        if (!m.isGroup) return StickGroup();

        const gamecek = await cekgame(m.chat);
        if (gamecek) return reply("Masih ada sesi yang belum selesai!");

        try {
          let anu = await fetchJson(
            "https://api.siputzx.my.id/api/games/karakter-freefire"
          );
          let result = anu.data;
          console.log("Jawaban:", result.name);

          tebakff[m.chat] = [
            await DimzBot.sendMessage(
              m.chat,
              {
                image: {
                  url: result.gambar,
                },
                caption: `Siapa nama karakter yang ada pada gambar di atas?\n\nWaktu: 60 detik\n\n_Ketik ${prefix}nyerah untuk menyerah_\n_Ketik ${prefix}bantuan untuk petunjuk_`,
              },
              {
                quoted: m,
              }
            ),
            result,
            250,
            setTimeout(() => {
              if (tebakff[m.chat]) {
                waktuHabis(result.name);
                delete tebakff[m.chat];
              }
            }, 60000),
          ];
        } catch (e) {
          console.error(e);
          reply("❌ Gagal memuat soal dari server.");
        }
      }
      break;

    case "tebakkabupaten":
      {
        if (!m.isGroup) return StickGroup();
        const gamecek = await cekgame(m.chat);
        if (gamecek) return reply("Masih ada sesi yang belum selesai!");

        try {
          let result = await fetchJson(
            "https://api.siputzx.my.id/api/games/kabupaten"
          );
          console.log("Jawaban:", result.title);

          tebakkabupaten[m.chat] = [
            await DimzBot.sendMessage(
              m.chat,
              {
                image: {
                  url: result.url,
                },
                caption: `Logo Kabupaten manakah ini?\n\nWaktu: 60 detik\n\n_Ketik ${prefix}nyerah untuk menyerah_\n_Ketik ${prefix}bantuan untuk petunjuk_`,
              },
              {
                quoted: m,
              }
            ),
            result,
            250,
            setTimeout(() => {
              if (tebakkabupaten[m.chat]) {
                waktuHabis(result.title);
                delete tebakkabupaten[m.chat];
              }
            }, 60000),
          ];
        } catch (e) {
          console.error(e);
          reply("❌ Gagal memuat database dari server.");
        }
      }
      break;

    case "tebakjkt48":
      {
        if (!m.isGroup) return StickGroup();
        const gamecek = await cekgame(m.chat);
        if (gamecek) return reply("Masih ada sesi yang belum selesai!");

        try {
          let res = await fetchJson(
            "https://api.siputzx.my.id/api/games/tebakjkt"
          );
          let data = res.data;

          console.log("Jawaban:", data.jawaban);

          tebakjkt48[m.chat] = [
            await DimzBot.sendMessage(
              m.chat,
              {
                image: {
                  url: data.gambar,
                },
                caption: `Siapa nama member JKT48 ini?\n\nWaktu: 60 detik\n\n_Ketik ${prefix}nyerah untuk menyerah_\n_Ketik ${prefix}bantuan untuk petunjuk_`,
              },
              {
                quoted: m,
              }
            ),
            data,
            250,
            setTimeout(() => {
              if (tebakjkt48[m.chat]) {
                waktuHabis(data.jawaban);
                delete tebakjkt48[m.chat];
              }
            }, 60000),
          ];
        } catch (e) {
          console.error(e);
          reply("❌ Gagal memuat database dari server.");
        }
      }
      break;

    case "tebakaplikasi":
      {
        if (!m.isGroup) return StickGroup();
        const gamecek = await cekgame(m.chat);
        if (gamecek) return reply("Masih ada sesi yang belum selesai!");

        try {
          let anu = await fetchJson(
            "https://www.sock.my.id/cdn/game/tebakaplikasi.json"
          );
          let result = await pickRandom(anu);
          console.log("Jawaban:", result.jawaban);

          tebakaplikasi[m.chat] = [
            await DimzBot.sendMessage(
              m.chat,
              {
                image: {
                  url: result.image,
                },
                caption: `Gambar di atas adalah aplikasi?\n\nWaktu: 60 detik\n\n_Ketik ${prefix}nyerah untuk menyerah_\n_Ketik ${prefix}bantuan untuk petunjuk_`,
              },
              {
                quoted: m,
              }
            ),
            result,
            250,
            setTimeout(() => {
              if (tebakaplikasi[m.chat]) {
                waktuHabis(result.jawaban);
                delete tebakaplikasi[m.chat];
              }
            }, 60000),
          ];
        } catch (err) {
          console.error(err);
          reply("❌ Gagal memuat database dari server.");
        }
      }
      break;

    case "tebakkata":
      {
        if (!m.isGroup) return StickGroup();
        const gamecek = await cekgame(m.chat);
        if (gamecek) return reply("Masih ada sesi yang belum selesai!");

        try {
          let anu = await fetchJson(
            "https://raw.githubusercontent.com/BochilTeam/database/master/games/tebakkata.json"
          );
          let result = await pickRandom(anu);
          console.log("Jawaban:", result.jawaban);

          tebakkata[m.chat] = [
            await DimzBot.sendMessage(
              m.chat,
              {
                text: `Silahkan Jawab Pertanyaan Berikut\n\n${result.soal}\nWaktu: 60 detik\n\n_Ketik ${prefix}nyerah untuk menyerah_\n_Ketik ${prefix}bantuan untuk petunjuk_`,
              },
              {
                quoted: m,
              }
            ),
            result,
            250,
            setTimeout(() => {
              if (tebakkata[m.chat]) {
                waktuHabis(result.jawaban);
                delete tebakkata[m.chat];
              }
            }, 60000),
          ];
        } catch (err) {
          console.error(err);
          reply("❌ Gagal memuat database dari server.");
        }
      }
      break;

    case "asahotak":
      {
        if (!m.isGroup) return StickGroup();
        const gamecek = await cekgame(m.chat);
        if (gamecek) return reply("Masih ada sesi yang belum selesai!");

        try {
          let anu = await fetchJson(
            "https://www.sock.my.id/cdn/game/asahotak.json"
          );
          let result = await pickRandom(anu);
          console.log("Jawaban:", result.jawaban);

          asahotak[m.chat] = [
            await DimzBot.sendMessage(
              m.chat,
              {
                text: `Silahkan Jawab Pertanyaan Berikut\n\n${result.soal}\nWaktu: 60 detik\n\n_Ketik ${prefix}nyerah untuk menyerah_\n_Ketik ${prefix}bantuan untuk petunjuk_`,
              },
              {
                quoted: m,
              }
            ),
            result,
            250,
            setTimeout(() => {
              if (asahotak[m.chat]) {
                waktuHabis(result.jawaban);
                delete asahotak[m.chat];
              }
            }, 60000),
          ];
        } catch (err) {
          console.error(err);
          reply("❌ Gagal memuat database dari server.");
        }
      }
      break;

    case "lengkapikalimat":
      {
        if (!m.isGroup) return StickGroup();
        const gamecek = await cekgame(m.chat);
        if (gamecek) return reply("Masih ada sesi yang belum selesai!");

        try {
          let anu = await fetchJson(
            "https://www.sock.my.id/cdn/game/lengkapikalimat.json"
          );
          let result = await pickRandom(anu);
          console.log("Jawaban:", result.jawaban);

          lengkapikalimat[m.chat] = [
            await DimzBot.sendMessage(
              m.chat,
              {
                text: `Silahkan Jawab Pertanyaan Berikut\n\n${result.soal}\nWaktu: 60 detik\n\n_Ketik ${prefix}nyerah untuk menyerah_\n_Ketik ${prefix}bantuan untuk petunjuk_`,
              },
              {
                quoted: m,
              }
            ),
            result,
            250,
            setTimeout(() => {
              if (lengkapikalimat[m.chat]) {
                waktuHabis(result.jawaban);
                delete lengkapikalimat[m.chat];
              }
            }, 60000),
          ];
        } catch (err) {
          console.error(err);
          reply("❌ Gagal memuat database dari server.");
        }
      }
      break;

    case "tebakbendera":
      {
        if (!m.isGroup) return StickGroup();
        const gamecek = await cekgame(m.chat);
        if (gamecek) return reply("Masih ada sesi yang belum selesai!");

        try {
          let anu = await fetchJson(
            "https://raw.githubusercontent.com/BochilTeam/database/master/games/tebakbendera2.json"
          );
          let result = await pickRandom(anu);
          console.log("Jawaban:", result.name);

          tebakbendera[m.chat] = [
            await DimzBot.sendMessage(
              m.chat,
              {
                image: {
                  url: result.img,
                },
                caption: `Gambar di atas adalah bendera negara?\n\nWaktu: 60 detik\n\n_Ketik ${prefix}nyerah untuk menyerah_\n_Ketik ${prefix}bantuan untuk petunjuk_`,
              },
              {
                quoted: m,
              }
            ),
            result,
            250,
            setTimeout(() => {
              if (tebakbendera[m.chat]) {
                waktuHabis(result.name);
                delete tebakbendera[m.chat];
              }
            }, 60000),
          ];
        } catch (err) {
          console.error(err);
          reply("❌ Gagal memuat database dari server.");
        }
      }
      break;

    case "tebakkalimat":
      {
        if (!m.isGroup) return StickGroup();
        const gamecek = await cekgame(m.chat);
        if (gamecek) return reply("Masih ada sesi yang belum selesai!");

        try {
          let anu = await fetchJson(
            "https://raw.githubusercontent.com/BochilTeam/database/master/games/tebakkalimat.json"
          );
          let result = await pickRandom(anu);
          console.log("Jawaban:", result.jawaban);

          tebakkalimat[m.chat] = [
            await DimzBot.sendMessage(
              m.chat,
              {
                text: `Silahkan Jawab Pertanyaan Berikut\n\n${result.soal}\nWaktu: 60 detik\n\n_Ketik ${prefix}nyerah untuk menyerah_\n_Ketik ${prefix}bantuan untuk petunjuk_`,
              },
              {
                quoted: m,
              }
            ),
            result,
            250,
            setTimeout(() => {
              if (tebakkalimat[m.chat]) {
                waktuHabis(result.jawaban);
                delete tebakkalimat[m.chat];
              }
            }, 60000),
          ];
        } catch (err) {
          console.error(err);
          reply("❌ Gagal memuat database dari server.");
        }
      }
      break;

    case "tebaksiapa":
      {
        if (!m.isGroup) return StickGroup();
        const gamecek = await cekgame(m.chat);
        if (gamecek) return reply("Masih ada sesi yang belum selesai!");

        try {
          let anu = await fetchJson(
            "https://raw.githubusercontent.com/BochilTeam/database/master/games/siapakahaku.json"
          );
          let result = await pickRandom(anu);
          console.log("Jawaban:", result.jawaban);

          siapaaku[m.chat] = [
            await DimzBot.sendMessage(
              m.chat,
              {
                text: `Silahkan Jawab Pertanyaan Berikut\n\n${result.soal}\nWaktu: 60 detik\n\n_Ketik ${prefix}nyerah untuk menyerah_\n_Ketik ${prefix}bantuan untuk petunjuk_`,
              },
              {
                quoted: m,
              }
            ),
            result,
            250,
            setTimeout(() => {
              if (siapaaku[m.chat]) {
                waktuHabis(result.jawaban);
                delete siapaaku[m.chat];
              }
            }, 60000),
          ];
        } catch (err) {
          console.error(err);
          reply("❌ Gagal memuat database dari server.");
        }
      }
      break;

    case "tebakkimia":
      {
        if (!m.isGroup) return StickGroup();
        const gamecek = await cekgame(m.chat);
        if (gamecek) return reply("Masih ada sesi yang belum selesai!");

        try {
          let anu = await fetchJson(
            "https://raw.githubusercontent.com/BochilTeam/database/master/games/tebakkimia.json"
          );
          let result = await pickRandom(anu);
          console.log("Jawaban:", result.unsur);

          tebakkimia[m.chat] = [
            await DimzBot.sendMessage(
              m.chat,
              {
                text: `Apa Arti Dari Simbol : *${result.lambang}*?\nWaktu : 60 detik\n\n_Ketik ${prefix}nyerah untuk menyerah_\n_Ketik ${prefix}bantuan untuk petunjuk_`,
              },
              {
                quoted: m,
              }
            ),
            result,
            250,
            setTimeout(() => {
              if (tebakkimia[m.chat]) {
                waktuHabis(result.unsur);
                delete tebakkimia[m.chat];
              }
            }, 60000),
          ];
        } catch (err) {
          console.error(err);
          reply("❌ Gagal memuat database dari server.");
        }
      }
      break;

    case "tebaklirik":
      {
        if (!m.isGroup) return StickGroup();
        const gamecek = await cekgame(m.chat);
        if (gamecek) return reply("Masih ada sesi yang belum selesai!");

        try {
          let anu = await fetchJson(
            "https://raw.githubusercontent.com/BochilTeam/database/master/games/tebaklirik.json"
          );
          let result = await pickRandom(anu);
          console.log("Jawaban:", result.jawaban);

          tebaklirik[m.chat] = [
            await DimzBot.sendMessage(
              m.chat,
              {
                text: `Ini Adalah Lirik Dari Lagu Apa? : *${result.soal}*\nWaktu : 60 detik\n\n_Ketik ${prefix}nyerah untuk menyerah_\n_Ketik ${prefix}bantuan untuk petunjuk_`,
              },
              {
                quoted: m,
              }
            ),
            result,
            250,
            setTimeout(() => {
              if (tebaklirik[m.chat]) {
                waktuHabis(result.jawaban);
                delete tebaklirik[m.chat];
              }
            }, 60000),
          ];
        } catch (err) {
          console.error(err);
          reply("❌ Gagal memuat database dari server.");
        }
      }
      break;

    case "tebaktebakan":
      {
        if (!m.isGroup) return StickGroup();
        const gamecek = await cekgame(m.chat);
        if (gamecek) return reply("Masih ada sesi yang belum selesai!");

        try {
          let anu = await fetchJson(
            "https://raw.githubusercontent.com/BochilTeam/database/master/games/tebaktebakan.json"
          );
          let result = await pickRandom(anu);
          console.log("Jawaban:", result.jawaban);

          tebaktebakan[m.chat] = [
            await DimzBot.sendMessage(
              m.chat,
              {
                text: `Silahkan Jawab Pertanyaan Berikut\n\n${result.soal}\nWaktu : 60 detik\n\n_Ketik ${prefix}nyerah untuk menyerah_\n_Ketik ${prefix}bantuan untuk petunjuk_`,
              },
              {
                quoted: m,
              }
            ),
            result,
            250,
            setTimeout(() => {
              if (tebaktebakan[m.chat]) {
                waktuHabis(result.jawaban);
                delete tebaktebakan[m.chat];
              }
            }, 60000),
          ];
        } catch (error) {
          reply("❌ Gagal memuat database dari server.");
        }
      }
      break;

    case "susunkata":
      {
        if (!m.isGroup) return StickGroup();
        const gamecek = await cekgame(m.chat);
        if (gamecek) return reply("Masih ada sesi yang belum selesai!");

        try {
          let anu = await fetchJson(
            "https://raw.githubusercontent.com/BochilTeam/database/master/games/susunkata.json"
          );
          let result = await pickRandom(anu);
          console.log("Jawaban:", result.jawaban);

          susunkata[m.chat] = [
            await DimzBot.sendMessage(
              m.chat,
              {
                text: `*Jawablah Pertanyaan Berikut :*\nSoal : ${result.soal}\nTipe : ${result.tipe}\nWaktu : 60 detik\n\n_Ketik ${prefix}nyerah untuk menyerah_\n_Ketik ${prefix}bantuan untuk petunjuk_`,
              },
              {
                quoted: m,
              }
            ),
            result,
            250,
            setTimeout(() => {
              if (susunkata[m.chat]) {
                waktuHabis(result.jawaban);
                delete susunkata[m.chat];
              }
            }, 60000),
          ];
        } catch (error) {
          reply("❌ Gagal memuat database dari server.");
        }
      }
      break;

    case "caklontong":
      {
        if (!m.isGroup) return StickGroup();
        const gamecek = await cekgame(m.chat);
        if (gamecek) return reply("Masih ada sesi yang belum selesai!");

        try {
          let anu = await fetchJson(
            "https://raw.githubusercontent.com/BochilTeam/database/master/games/caklontong.json"
          );
          let result = await pickRandom(anu);
          console.log("Jawaban:", result.jawaban);

          caklontong[m.chat] = [
            await DimzBot.sendMessage(
              m.chat,
              {
                text: `*Jawablah Pertanyaan Berikut :*\nSoal : ${result.soal}\nWaktu : 60 detik\n\n_Ketik ${prefix}nyerah untuk menyerah_\n_Ketik ${prefix}bantuan untuk petunjuk_`,
              },
              {
                quoted: m,
              }
            ),
            result,
            250,
            setTimeout(() => {
              if (caklontong[m.chat]) {
                waktuHabis(result.jawaban);
                delete caklontong[m.chat];
              }
            }, 60000),
          ];
        } catch (error) {
          reply("❌ Gagal memuat database dari server.");
        }
      }
      break;

    case "tekateki":
      {
        if (!m.isGroup) return StickGroup();
        const gamecek = await cekgame(m.chat);
        if (gamecek) return reply("Masih ada sesi yang belum selesai!");

        try {
          let anu = await fetchJson(
            "https://raw.githubusercontent.com/BochilTeam/database/master/games/tekateki.json"
          );
          let result = await pickRandom(anu);
          console.log("Jawaban:", result.jawaban);

          tekateki[m.chat] = [
            await DimzBot.sendMessage(
              m.chat,
              {
                text: `Silahkan Jawab Pertanyaan Berikut\n\n${result.soal}\nWaktu : 60 detik\n\n_Ketik ${prefix}nyerah untuk menyerah_\n_Ketik ${prefix}bantuan untuk petunjuk_`,
              },
              {
                quoted: m,
              }
            ),
            result,
            250,
            setTimeout(() => {
              if (tekateki[m.chat]) {
                waktuHabis(result.jawaban);
                delete tekateki[m.chat];
              }
            }, 60000),
          ];
        } catch (error) {
          reply("❌ Gagal memuat database dari server.");
        }
      }
      break;

    case "family100":
      {
        if (!m.isGroup) return StickGroup();
        const gamecek = await cekgame(m.chat);
        if (gamecek) return reply("Masih ada sesi yang belum selesai!");

        try {
          let anu = await fetchJson(
            "https://api.siputzx.my.id/api/games/family100"
          );
          let result = anu.data;
          console.log("Soal:", result.soal);
          console.log("Jawaban:", result.jawaban);

          family100[m.chat] = [
            await DimzBot.sendMessage(
              m.chat,
              {
                text: `*Soal Family 100*: ${result.soal}\n\nWaktu: 60 detik\n\n_Ketik ${prefix}nyerah untuk menyerah_`,
              },
              {
                quoted: m,
              }
            ),
            result.jawaban,
            250,
            setTimeout(() => {
              if (family100[m.chat]) {
                let jawabanList = family100[m.chat][1];
                let jawabanUser = family100[m.chat].jawabanUser || [];
                let jawabanBelum = jawabanList.filter(
                  (jawaban) =>
                    !jawabanUser.includes(jawaban.toLowerCase().trim())
                );
                let jawabanDisplay =
                  jawabanBelum.join(", ") || "Semua jawaban sudah dijawab!";
                wktuhbisfamily(jawabanDisplay);
                delete family100[m.chat];
              }
            }, 60000),
          ];
        } catch (e) {
          reply("❌ Gagal memuat soal dari server.");
        }
      }
      break;

    case "bantuan":
      {
        try {
          const bantuanList = [
            {
              db: tebakgambar,
              key: "jawaban",
            },
            {
              db: tebakgame,
              key: "jawaban",
            },
            {
              db: tebakhero,
              key: "name",
            },
            {
              db: tebakff,
              key: "name",
            },
            {
              db: tebakkabupaten,
              key: "title",
            },
            {
              db: tebakjkt48,
              key: "name",
            },
            {
              db: tebakml,
              key: "title",
            },
            {
              db: tebakaplikasi,
              key: "jawaban",
            },
            {
              db: tebakkata,
              key: "jawaban",
            },
            {
              db: asahotak,
              key: "jawaban",
            },
            {
              db: lengkapikalimat,
              key: "jawaban",
            },
            {
              db: tebakbendera,
              key: "name",
            },
            {
              db: tebakkalimat,
              key: "jawaban",
            },
            {
              db: siapaaku,
              key: "jawaban",
            },
            {
              db: tebakkimia,
              key: "unsur",
            },
            {
              db: tebaklirik,
              key: "jawaban",
            },
            {
              db: tebaktebakan,
              key: "jawaban",
            },
            {
              db: susunkata,
              key: "jawaban",
            },
            {
              db: caklontong,
              key: "jawaban",
            },
            {
              db: tekateki,
              key: "jawaban",
            },
          ];

          for (const { db, key } of bantuanList) {
            if (m.chat in db) {
              const data = db[m.chat][1];
              if (db === tebakff && data && data.name) {
                const clue = (data.name || "").replace(
                  /[bcdfghjklmnpqrstvwxyz]/gi,
                  "_"
                );
                return reply("```" + clue + "```");
              } else {
                const clue = (data[key] || "").replace(
                  /[bcdfghjklmnpqrstvwxyz]/gi,
                  "_"
                );
                return reply("```" + clue + "```");
              }
            }
          }

          reply("❗Tidak ada sesi game aktif di chat ini.");
        } catch (err) {
          console.error(err);
          reply("❌ Gagal memuat petunjuk.");
        }
      }
      break;

    case "nyerah":
      {
        try {
          const semuaGame = [
            tebakgambar,
            tebakgame,
            tebakhero,
            tebakff,
            tebakkabupaten,
            tebakjkt48,
            tebakml,
            tebakaplikasi,
            tebakkata,
            asahotak,
            lengkapikalimat,
            tebakbendera,
            tebakkalimat,
            siapaaku,
            tebakkimia,
            tebaklirik,
            tebaktebakan,
            susunkata,
            caklontong,
            tekateki,
            family100,
          ];

          for (const game of semuaGame) {
            if (m.chat in game) {
              clearTimeout(game[m.chat][3]);
              if (game === family100) {
                const data = game[m.chat];
                const jawabanList = Array.isArray(data[1]) ? data[1] : [];
                if (!data.jawabanUser) data.jawabanUser = [];

                let jawabanDisplay = jawabanList
                  .map((jawaban, index) => {
                    const jawabLower = jawaban.toLowerCase().trim();
                    if (data.jawabanUser.includes(jawabLower)) {
                      return `${index + 1}. *${jawaban}*`;
                    } else {
                      return `${index + 1}. ${jawaban}`;
                    }
                  })
                  .join("\n");

                delete game[m.chat];
                return DimzBot.sendMessage(
                  m.chat,
                  {
                    text:
                      `*Game Dihentikan!*\n\n` +
                      `*Nih Jawaban Nya:*\n${jawabanDisplay}\n\n` +
                      `_Lemahhh_ 😏👎`,
                  },
                  {
                    quoted: m,
                  }
                );
              }

              delete game[m.chat];
              return DimzBot.sendMessage(
                m.chat,
                {
                  text: `_Lemahhh_ 😏👎`,
                },
                {
                  quoted: m,
                }
              );
            }
          }

          reply("❌ Tidak ada sesi game aktif yang bisa diserahin.");
        } catch (error) {
          reply("*Gagal memuat database dari server*. ☹️");
        }
      }
      break;

    // fitur random image
    case "yandere":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);

        await DimzBot.sendMessage(m.chat, {
          react: { text: "🩸", key: m.key },
        });

        try {
          const { agent } = getRandomProxyAgent();

          const res = await axios.get(
            "https://api.nekolabs.web.id/random/yande-re",
            {
              httpsAgent: agent, proxy: false,
              timeout: 20000,
              validateStatus: () => true,
            }
          );

          if (!res.data || !res.data.url) {
            return reply("❌ Gagal mengambil gambar yandere.");
          }

          const imgBuffer = await getBuffer(res.data.url, agent);

          await DimzBot.sendMessage(
            m.chat,
            { image: imgBuffer },
            { quoted: m }
          );

          reduceLimit(botId, m.sender);
        } catch (e) {
          console.error("YANDERE ERROR:", e);
          reply("❌ Terjadi kesalahan saat mengambil gambar.");
        }
      }
      break;

    case "waifu":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);

        await DimzBot.sendMessage(m.chat, {
          react: { text: "💖", key: m.key },
        });

        try {
          const axios = require("axios");
          const { agent } = getRandomProxyAgent();

          const res = await axios.get("https://api.siputzx.my.id/api/r/waifu", {
            responseType: "arraybuffer",
            httpsAgent: agent, proxy: false,
            timeout: 20000,
          });

          await DimzBot.sendMessage(
            m.chat,
            {
              image: Buffer.from(res.data),
              caption: "💖 *Random Waifu*",
            },
            { quoted: m }
          );

          reduceLimit(botId, m.sender);
        } catch (e) {
          console.error("WAIFU ERROR:", e);
          reply("❌ Gagal mengambil gambar waifu.");
        }
      }
      break;

    case "neko":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);

        await DimzBot.sendMessage(m.chat, {
          react: { text: "🐱", key: m.key },
        });

        try {
          const axios = require("axios");
          const { agent } = getRandomProxyAgent();

          const res = await axios.get("https://api.siputzx.my.id/api/r/neko", {
            responseType: "arraybuffer",
            httpsAgent: agent, proxy: false,
            timeout: 20000,
          });

          await DimzBot.sendMessage(
            m.chat,
            {
              image: Buffer.from(res.data),
              caption: "🐱 *Random Neko*",
            },
            { quoted: m }
          );

          reduceLimit(botId, m.sender);
        } catch (e) {
          console.error("NEKO ERROR:", e);
          reply("❌ Gagal mengambil gambar neko.");
        }
      }
      break;

    case "cecan-vietnam":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);

        await DimzBot.sendMessage(m.chat, {
          react: { text: "🇻🇳", key: m.key },
        });

        try {
          const axios = require("axios");
          const { agent } = getRandomProxyAgent();

          const res = await axios.get(
            "https://api.siputzx.my.id/api/r/cecan/vietnam",
            {
              responseType: "arraybuffer",
              httpsAgent: agent, proxy: false,
              timeout: 20000,
            }
          );

          await DimzBot.sendMessage(
            m.chat,
            {
              image: Buffer.from(res.data),
              caption: "🇻🇳 *Random Cecan Vietnam*",
            },
            { quoted: m }
          );

          reduceLimit(botId, m.sender);
        } catch (e) {
          console.error("CECAN VIETNAM ERROR:", e);
          reply("❌ Gagal mengambil cecan Vietnam.");
        }
      }
      break;

    case "cecan-thailand":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);

        await DimzBot.sendMessage(m.chat, {
          react: { text: "🇹🇭", key: m.key },
        });

        try {
          const axios = require("axios");
          const { agent } = getRandomProxyAgent();

          const res = await axios.get(
            "https://api.siputzx.my.id/api/r/cecan/thailand",
            {
              responseType: "arraybuffer",
              httpsAgent: agent, proxy: false,
              timeout: 20000,
            }
          );

          await DimzBot.sendMessage(
            m.chat,
            {
              image: Buffer.from(res.data),
              caption: "🇹🇭 *Random Cecan Thailand*",
            },
            { quoted: m }
          );

          reduceLimit(botId, m.sender);
        } catch (e) {
          console.error("CECAN THAILAND ERROR:", e);
          reply("❌ Gagal mengambil cecan Thailand.");
        }
      }
      break;

    case "cecan-korea":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);

        await DimzBot.sendMessage(m.chat, {
          react: { text: "🇰🇷", key: m.key },
        });

        try {
          const axios = require("axios");
          const { agent } = getRandomProxyAgent();

          const res = await axios.get(
            "https://api.siputzx.my.id/api/r/cecan/korea",
            {
              responseType: "arraybuffer",
              httpsAgent: agent, proxy: false,
              timeout: 20000,
            }
          );

          await DimzBot.sendMessage(
            m.chat,
            {
              image: Buffer.from(res.data),
              caption: "🇰🇷 *Random Cecan Korea*",
            },
            { quoted: m }
          );

          reduceLimit(botId, m.sender);
        } catch (e) {
          console.error("CECAN KOREA ERROR:", e);
          reply("❌ Gagal mengambil cecan Korea.");
        }
      }
      break;

    case "cecan-japan":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);

        await DimzBot.sendMessage(m.chat, {
          react: { text: "🇯🇵", key: m.key },
        });

        try {
          const axios = require("axios");
          const { agent } = getRandomProxyAgent();

          const res = await axios.get(
            "https://api.siputzx.my.id/api/r/cecan/japan",
            {
              responseType: "arraybuffer",
              httpsAgent: agent, proxy: false,
              timeout: 20000,
            }
          );

          await DimzBot.sendMessage(
            m.chat,
            {
              image: Buffer.from(res.data),
              caption: "🇯🇵 *Random Cecan Japan*",
            },
            { quoted: m }
          );

          reduceLimit(botId, m.sender);
        } catch (e) {
          console.error("CECAN JAPAN ERROR:", e);
          reply("❌ Gagal mengambil gambar cecan Japan.");
        }
      }
      break;

    case "cecan-china":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);

        await DimzBot.sendMessage(m.chat, {
          react: { text: "🇨🇳", key: m.key },
        });

        try {
          const axios = require("axios");
          const { agent } = getRandomProxyAgent();

          const res = await axios.get(
            "https://api.siputzx.my.id/api/r/cecan/china",
            {
              responseType: "arraybuffer",
              httpsAgent: agent, proxy: false,
              timeout: 20000,
            }
          );

          await DimzBot.sendMessage(
            m.chat,
            {
              image: Buffer.from(res.data),
              caption: "🇨🇳 *Random Cecan China*",
            },
            { quoted: m }
          );

          reduceLimit(botId, m.sender);
        } catch (e) {
          console.error("CECAN CHINA ERROR:", e);
          reply("❌ Gagal mengambil gambar cecan China.");
        }
      }
      break;

    case "cecan":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);

        await DimzBot.sendMessage(m.chat, {
          react: { text: "💃", key: m.key },
        });

        try {
          const axios = require("axios");
          const { agent } = getRandomProxyAgent();

          const res = await axios.get(
            "https://api.siputzx.my.id/api/r/cecan/indonesia",
            {
              responseType: "arraybuffer",
              httpsAgent: agent, proxy: false,
              timeout: 20000,
            }
          );

          await DimzBot.sendMessage(
            m.chat,
            {
              image: Buffer.from(res.data),
              caption: "🇮🇩 *Random Cecan Indonesia*",
            },
            { quoted: m }
          );

          reduceLimit(botId, m.sender);
        } catch (e) {
          console.error("CECAN ERROR:", e);
          reply("❌ Gagal mengambil gambar cecan.");
        }
      }
      break;

    case "bluearchive":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);

        await DimzBot.sendMessage(m.chat, {
          react: { text: "🎮", key: m.key },
        });

        try {
          const axios = require("axios");
          const { agent } = getRandomProxyAgent();

          const res = await axios.get(
            "https://api.siputzx.my.id/api/r/blue-archive",
            {
              responseType: "arraybuffer",
              httpsAgent: agent, proxy: false,
              timeout: 20000,
            }
          );

          await DimzBot.sendMessage(
            m.chat,
            {
              image: Buffer.from(res.data),
              caption: "🎮 *Blue Archive Random Image*",
            },
            { quoted: m }
          );

          reduceLimit(botId, m.sender);
        } catch (e) {
          console.error("BLUEARCHIVE ERROR:", e);
          reply("❌ Gagal mengambil gambar Blue Archive.");
        }
      }
      break;

    // fitur canva
    case "nulis": {
  if (!hasLimit(botId, m.sender)) return reply(mess.limit0)

  if (!text)
    return reply(
`❌ Format salah!

Gunakan:
${prefix + command} Nama|Kelas|Teks

Contoh:
${prefix + command} Budi|11|Aku janji tidak bolos lagi`
    )

  const [nama, kelas, ...isi] = text.split("|").map(v => v?.trim())
  const tulisan = isi.join("|")

  if (!nama || !kelas || !tulisan)
    return reply("❌ Format harus: Nama|Kelas|Teks")

  await DimzBot.sendMessage(m.chat, {
    react: { text: "✍️", key: m.key }
  })

  try {
    const { agent } = getRandomProxyAgent()

    const url =
      "https://api.apocalypse.web.id/canvas/nulis" +
      `?nama=${encodeURIComponent(nama)}` +
      `&kelas=${encodeURIComponent(kelas)}` +
      `&text=${encodeURIComponent(tulisan)}`

    const { data } = await axios.get(url, {
      httpsAgent: agent, proxy: false,
      responseType: "arraybuffer",
      timeout: 30000
    })

    await DimzBot.sendMessage(
      m.chat,
      { image: Buffer.from(data) },
      { quoted: m }
    )

    await DimzBot.sendMessage(m.chat, {
      react: { text: "✅", key: m.key }
    })

    reduceLimit(botId, m.sender)

  } catch (e) {
    console.error("NULIS ERROR:", e)
    reply("❌ Gagal membuat tulisan")
  }
}
break;

    case "fakewa": {
  if (!hasLimit(botId, m.sender)) return reply(mess.limit0)

  if (!text)
    return reply(
`❌ Format salah!

Gunakan:
${prefix + command} Nama|Bio|Nomor

📌 *reply gambar* sebagai avatar
`
    )

  if (!m.quoted || !/image/.test(m.quoted.mimetype)) {
    return reply(
`❌ *Avatar tidak ditemukan*

📸 Silakan *reply gambar* yang ingin dijadikan avatar Fake WhatsApp

Contoh:
• Reply foto
• Ketik: ${prefix + command} Budi|Orang Baik|0853xxxx`
    )
  }

  const [nama, bio, nomor] = text.split("|").map(v => v?.trim())

  if (!nama || !bio || !nomor)
    return reply("❌ Format harus: Nama|Bio|Nomor")

  await DimzBot.sendMessage(m.chat, {
    react: { text: "⏳", key: m.key }
  })

  try {
    const mediaPath = await DimzBot.downloadAndSaveMediaMessage(m.quoted)
    const avatarUrl = await drizzup(mediaPath)

    const { agent } = getRandomProxyAgent()

    const url =
      "https://api.apocalypse.web.id/canvas/fakewa" +
      `?nama=${encodeURIComponent(nama)}` +
      `&bio=${encodeURIComponent(bio)}` +
      `&nomor=${encodeURIComponent(nomor)}` +
      `&avatarURL=${encodeURIComponent(avatarUrl)}`

    const { data } = await axios.get(url, {
      httpsAgent: agent, proxy: false,
      responseType: "arraybuffer",
      timeout: 30000
    })

    await DimzBot.sendMessage(
      m.chat,
      { image: Buffer.from(data) },
      { quoted: m }
    )

    await DimzBot.sendMessage(m.chat, {
      react: { text: "✅", key: m.key }
    })

    reduceLimit(botId, m.sender)

  } catch (e) {
    console.error("FAKEWA ERROR:", e)
    reply("❌ Gagal membuat Fake WhatsApp")
  }
}
break;

    case "gura-maker":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);

        if (!m.quoted || !/image/.test(m.quoted.mimetype || "")) {
          return reply("❌ Reply *gambar* nya!");
        }

        await DimzBot.sendMessage(m.chat, {
          react: { text: "🦈", key: m.key },
        });

        try {
          const { agent } = getRandomProxyAgent();

          const mediaPath = await DimzBot.downloadAndSaveMediaMessage(m.quoted);
          const imageUrl = await drizzup(mediaPath);

          const apiUrl =
            "https://api.nekolabs.web.id/canvas/gura?imageUrl=" +
            encodeURIComponent(imageUrl);

          const resultBuffer = await getBuffer(apiUrl, agent);

          await DimzBot.sendMessage(
            m.chat,
            {
              image: resultBuffer,
            },
            { quoted: m }
          );

          reduceLimit(botId, m.sender);
        } catch (e) {
          console.error("GURA ERROR:", e);
          reply("❌ Gagal memproses gambar.");
        }
      }
      break;

    case "ba-logo":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);
        if (!text) return reply(`Contoh:\n${prefix + command} Soft|Botz`);

        const [textL, textR] = text.split("|").map((v) => v?.trim());
        if (!textL || !textR)
          return reply(`Format salah!\nContoh:\n${prefix + command} Soft|Botz`);

        await DimzBot.sendMessage(m.chat, {
          react: { text: "🎨", key: m.key },
        });

        try {
          const { agent } = getRandomProxyAgent();
          const url = `https://api.nekolabs.web.id/canvas/ba-logo?textL=${encodeURIComponent(textL)}&textR=${encodeURIComponent(textR)}`;

          await DimzBot.sendMessage(
            m.chat,
            {
              image: { url },
              caption: `🎨 *BA Logo*\n\n🅰️ Kiri : ${textL}\n🅱️ Kanan : ${textR}`,
            },
            { quoted: m }
          );

          reduceLimit(botId, m.sender);
        } catch (e) {
          console.error("BA-LOGO ERROR:", e);
          reply("❌ Gagal membuat Blue Archive Logo.");
        }
      }
      break;

    case "ektp":
{
  if (!hasLimit(botId, m.sender)) return reply(mess.limit0)

  if (!m.quoted || !/image/.test(m.quoted.mimetype || "")) {
    return reply("❌ *Reply foto untuk dijadikan foto e-KTP!*")
  }

  if (!text || !text.includes("|")) {
    return reply(
`❌ *Format salah!*

📌 *Contoh:*
${prefix + command}
John Doe | Bandung, 01-01-1990 | Laki-laki | O | Jl. Contoh | 001/002 | Sukajadi | Sukajadi | Islam | Belum Kawin | Programmer | WNI | Seumur Hidup | JAWA BARAT | BANDUNG`
    )
  }

  await DimzBot.sendMessage(m.chat, {
    react: { text: "🪪", key: m.key }
  })

  try {
    const axios = require("axios")
    const fs = require("fs")

    const savedPath = await DimzBot.downloadAndSaveMediaMessage(m.quoted)

    if (!savedPath || !fs.existsSync(savedPath)) {
      return reply("❌ Gagal menyimpan foto.")
    }

    const photoUrl = await drizzup(savedPath)

    if (!photoUrl) {
      return reply("❌ Gagal upload foto.")
    }

    const [
      nama, ttl, jk, gol,
      alamat, rtrw, kel, kec,
      agama, status, kerja,
      wn, berlaku, prov, kota
    ] = text.split("|").map(v => v.trim())

    const params = new URLSearchParams({
      provinsi: prov || "JAWA BARAT",
      kota: kota || "BANDUNG",
      nik: Math.floor(Math.random() * 1e16).toString().padEnd(16,"0"),
      nama: nama || m.pushName || "Warga Negara",
      ttl: ttl || "Indonesia, 01-01-2000",
      jenis_kelamin: jk || "Laki-laki",
      golongan_darah: gol || "-",
      alamat: alamat || "-",
      "rt/rw": rtrw || "000/000",
      "kel/desa": kel || "-",
      kecamatan: kec || "-",
      agama: agama || "-",
      status: status || "-",
      pekerjaan: kerja || "-",
      kewarganegaraan: wn || "WNI",
      masa_berlaku: berlaku || "Seumur Hidup",
      terbuat: new Date().toLocaleDateString("id-ID"),
      pas_photo: photoUrl
    })

    const apiUrl = "https://api.siputzx.my.id/api/canvas/ektp?" + params.toString()

    const res = await axios.get(apiUrl, {
      responseType: "arraybuffer",
      timeout: 20000
    })

    await DimzBot.sendMessage(
      m.chat,
      {
        image: Buffer.from(res.data),
        caption: "🪪 *e-KTP Generator (Hiburan)*"
      },
      { quoted: m }
    )

    reduceLimit(botId, m.sender)

  } catch (e) {
    console.error("EKTP ERROR:", e)
    reply("❌ Gagal membuat e-KTP.")
  }
}
break;

    case "sertifikat-tolol":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);

        // Ambil teks dari arg atau reply
        const inputText =
          text || (m.quoted && (m.quoted.text || m.quoted.caption));

        if (!inputText)
          return reply(`Contoh:\n${prefix + command} ${pushname}`);

        await DimzBot.sendMessage(m.chat, {
          react: { text: "🤣", key: m.key },
        });

        try {
          const axios = require("axios");

          // PROXY
          const { agent } = getRandomProxyAgent();

          const url =
            "https://api.siputzx.my.id/api/canvas/sertifikat-tolol?text=" +
            encodeURIComponent(inputText);

          const res = await axios.get(url, {
            responseType: "arraybuffer",
            httpsAgent: agent, proxy: false,
            timeout: 20000,
          });

          await DimzBot.sendMessage(
            m.chat,
            {
              image: Buffer.from(res.data),
              caption: "🏆 *SERTIFIKAT RESMI* 🏆",
            },
            { quoted: m }
          );

          reduceLimit(botId, m.sender);
        } catch (e) {
          console.error("SERTIFIKAT TOLOL ERROR:", e);
          reply("❌ Gagal membuat sertifikat, coba lagi nanti.");
        }
      }
      break;

    case "gay":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);

        await DimzBot.sendMessage(m.chat, {
          react: { text: "🤣", key: m.key },
        });

        try {
          const axios = require("axios");

          // ===== TARGET =====
          let target =
            m.mentionedJid?.[0] || (m.quoted ? m.quoted.sender : m.sender);

          // ===== NAMA =====
          const nama = pushname || m.sender.split("@")[0];

          // ===== AVATAR =====
          let avatar;
          try {
            avatar = await DimzBot.profilePictureUrl(target, "image");
          } catch {
            avatar =
              "https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg";
          }

          // ===== RANDOM SCORE 1–101 =====
          const num = Math.floor(Math.random() * 101) + 1;

          // ===== PROXY =====
          const { agent } = getRandomProxyAgent();

          const url =
            `https://api.siputzx.my.id/api/canvas/gay` +
            `?nama=${encodeURIComponent(nama)}` +
            `&avatar=${encodeURIComponent(avatar)}` +
            `&num=${num}`;

          const res = await axios.get(url, {
            httpsAgent: agent, proxy: false,
            responseType: "arraybuffer",
            timeout: 20000,
          });

          if (!res.data) throw "EMPTY_RESULT";

          await DimzBot.sendMessage(
            m.chat,
            {
              image: Buffer.from(res.data),
              caption:
                `🤣 *GAY CHECK*\n\n` +
                `👤 Nama : ${nama}\n` +
                `🏳️‍🌈 Persentase : *${num}%*\n\n` +
                `*Dasar gay 😆*`,
              contextInfo: {
                mentionedJid: [target],
              },
            },
            { quoted: m }
          );

          reduceLimit(botId, m.sender);

          await DimzBot.sendMessage(m.chat, {
            react: { text: "✅", key: m.key },
          });
        } catch (e) {
          console.error("GAY CANVAS ERROR:", e);
          reply("❌ Gagal membuat canvas. Coba lagi nanti.");
        }
      }
      break;

    case "fake-xnxx":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);
        if (!text || !text.includes("|"))
          return reply(
            `❌ *Format salah!*\n\n` +
              `📌 Contoh:\n` +
              `${prefix + command} Nelson Mandela | Keberanian adalah kemenangan atas ketakutan\n\n` +
              `📌 Dengan Like & Dislike:\n` +
              `${prefix + command} Nelson Mandela | Quote | 10 | 2`
          );

        const args = text.split("|").map((v) => v.trim());

        const name = args[0];
        const quote = args[1];
        const likes = isNaN(args[2]) ? 2 : parseInt(args[2]);
        const dislikes = isNaN(args[3]) ? 0 : parseInt(args[3]);

        if (!name || !quote)
          return reply("❌ Nama dan quote tidak boleh kosong!");

        await DimzBot.sendMessage(m.chat, {
          react: { text: "🎨", key: m.key },
        });

        try {
          const axios = require("axios");

          // ===== PROXY =====
          const { agent } = getRandomProxyAgent();

          const url =
            `https://api.siputzx.my.id/api/canvas/fake-xnxx` +
            `?name=${encodeURIComponent(name)}` +
            `&quote=${encodeURIComponent(quote)}` +
            `&likes=${likes}` +
            `&dislikes=${dislikes}`;

          const res = await axios.get(url, {
            httpsAgent: agent, proxy: false,
            responseType: "arraybuffer",
            timeout: 20000,
          });

          if (!res.data) throw "EMPTY_IMAGE";

          await DimzBot.sendMessage(
            m.chat,
            {
              image: Buffer.from(res.data),
              caption:
                `🖼 *CANVAS FAKE XNXX*\n\n` +
                `👤 Nama : ${name}\n` +
                `👍 Like : ${likes}\n` +
                `👎 Dislike : ${dislikes}\n\n` +
                `💬 Quote:\n${quote}`,
            },
            { quoted: m }
          );

          reduceLimit(botId, m.sender);

          await DimzBot.sendMessage(m.chat, {
            react: { text: "✅", key: m.key },
          });
        } catch (e) {
          console.error("CANVA ERROR:", e);
          reply("❌ Gagal membuat canvas. Coba lagi nanti.");
        }
      }
      break;

    // fitur cerpen
    case "dongeng":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);

        await DimzBot.sendMessage(m.chat, {
          react: { text: "📖", key: m.key },
        });

        try {
          const axios = require("axios");
          const { agent } = getRandomProxyAgent();

          const { data } = await axios.get(
            "https://apizell.web.id/random/dongeng",
            {
              httpsAgent: agent, proxy: false,
              timeout: 20000,
              validateStatus: () => true,
            }
          );

          if (!data || !data.storyContent) {
            return reply("❌ Gagal mengambil dongeng.");
          }

          const title = data.title || "-";
          const author = data.author || "-";
          const story = data.storyContent
            .replace(/&nbsp;/g, " ")
            .replace(/\n{3,}/g, "\n\n");

          const caption = `📚 *RANDOM DONGENG*

📖 *Judul:* ${title}
✍️ *Penulis:* ${author}


${story}`;

          if (data.image) {
            await DimzBot.sendMessage(
              m.chat,
              {
                image: { url: data.image },
                caption,
              },
              { quoted: m }
            );
          } else {
            await DimzBot.sendMessage(m.chat, { text: caption }, { quoted: m });
          }

          reduceLimit(botId, m.sender);
        } catch (e) {
          console.error("DONGENG ERROR:", e);
          reply("❌ Terjadi kesalahan saat mengambil dongeng.");
        }
      }
      break;

    // fitur ephoto
    case "glitchtext":
    case "writetext":
    case "advancedglow":
    case "typographytext":
    case "pixelglitch":
    case "neonglitch":
    case "flagtext":
    case "flag3dtext":
    case "deletingtext":
    case "blackpinkstyle":
    case "glowingtext":
    case "underwatertext":
    case "logomaker":
    case "cartoonstyle":
    case "papercutstyle":
    case "watercolortext":
    case "effectclouds":
    case "blackpinklogo":
    case "gradienttext":
    case "summerbeach":
    case "luxurygold":
    case "multicoloredneon":
    case "sandsummer":
    case "galaxywallpaper":
    case "1917style":
    case "makingneon":
    case "royaltext":
    case "freecreate":
    case "galaxystyle":
    case "lighteffects":
      {
        if (!hasLimit(botId, m.sender)) return reply(mess.limit0);
        if (!text) return reply(`Contoh:\n${prefix + command} softbotz`);

        await DimzBot.sendMessage(m.chat, {
          react: { text: "🎨", key: m.key },
        });

        try {
          const axios = require("axios");
          const { agent } = getRandomProxyAgent();

          const url = `https://api.vreden.my.id/api/v1/maker/ephoto/${command}?text=${encodeURIComponent(text)}`;

          const { data } = await axios.get(url, {
            httpsAgent: agent, proxy: false,
            timeout: 30000,
            validateStatus: () => true,
          });

          if (!data || !data.status || !data.result) {
            return reply("❌ Gagal membuat gambar.");
          }

          await DimzBot.sendMessage(
            m.chat,
            {
              image: { url: data.result },
              caption: `🖼️ *EPHOTO*\n\n✨ Effect : ${command}\n✏️ Text   : ${text}`,
            },
            { quoted: m }
          );

          reduceLimit(botId, m.sender);
        } catch (e) {
          console.error(e);
          reply("❌ Terjadi kesalahan.");
        }
      }
      break;

    // fitur advanced
    case "clearstore":
    case "cs":
      {
        if (!GlobalOwner) return;

        let total = 0;

        if (store && store.messages) {
          for (const key of Object.keys(store.messages)) {
            const msgs = store.messages[key];
            if (msgs && typeof msgs.clear === "function") {
              total += msgs.size || 0;
              msgs.clear();
            }
          }
        }

        reply(`🧹 Store dibersihkan\n📦 Total pesan dihapus: ${total}`);
      }
      break;

    case "smodul":
      {
        if (!GlobalOwner) return;

        try {
          if (!text || !text.includes("|")) {
            return reply(
              `Contoh:\n${prefix + command} @whiskeysockets/baileys | kata kunci`
            );
          }

          let [folder, keyword] = text.split("|").map((v) => v.trim());
          if (!folder || !keyword) {
            return reply(
              `Format salah!\nContoh:\n${prefix + command} @whiskeysockets/baileys | kata kunci`
            );
          }

          const fs = require("fs");
          const path = require("path");

          // 🔥 FIX DI SINI
          const baseDir = path.join(process.cwd(), "node_modules", folder);

          if (!fs.existsSync(baseDir)) {
            return reply(`❌ Folder *node_modules/${folder}* tidak ditemukan!`);
          }

          const target = keyword.toLowerCase();
          let hasil = [];

          function searchInFile(filePath) {
            const lines = fs.readFileSync(filePath, "utf8").split("\n");
            lines.forEach((line, index) => {
              if (line.toLowerCase().includes(target)) {
                hasil.push(
                  `📍 *${filePath.replace(process.cwd(), "")}* (baris ${index + 1})\n> ${line.trim()}`
                );
              }
            });
          }

          function walkDir(dir) {
            const files = fs.readdirSync(dir);
            for (const file of files) {
              const fullPath = path.join(dir, file);
              const stat = fs.statSync(fullPath);

              if (stat.isDirectory()) {
                walkDir(fullPath);
              } else if (/\.(js|ts|json)$/i.test(fullPath)) {
                try {
                  const content = fs.readFileSync(fullPath, "utf8");
                  if (content.toLowerCase().includes(target)) {
                    searchInFile(fullPath);
                  }
                } catch {}
              }
            }
          }

          walkDir(baseDir);

          if (!hasil.length) {
            reply(`❌ Tidak ditemukan '${keyword}' di module *${folder}*`);
          } else {
            const teks = hasil.join("\n\n").slice(0, 6000);
            reply(`✅ *Ditemukan ${hasil.length} hasil:*\n\n${teks}`);
          }
        } catch (e) {
          console.error(e);
          reply("❌ Terjadi error saat scanning module.");
        }
      }
      break;

    case "get":
      {
        if (!GlobalOwner) return;
        if (!text && !m.quoted)
          return reply(
            `*Contoh:* ${prefix + command} https://example.com/file.jpg\nAtau balas pesan/media.`
          );

        return (async () => {
          const axios = require("axios");
          const FileType = require("file-type");

          const streamToBuffer = (stream) =>
            new Promise((resolve, reject) => {
              const chunks = [];
              stream.on("data", (chunk) => chunks.push(chunk));
              stream.on("end", () => resolve(Buffer.concat(chunks)));
              stream.on("error", reject);
            });

          try {
            await DimzBot.sendMessage(m.chat, {
              react: {
                text: "⏳",
                key: m.key,
              },
            });

            let buffer,
              mimetype = "application/octet-stream",
              filename = "file.bin";

            if (text?.startsWith("http")) {
              const res = await axios.get(text, {
                headers: {
                  "User-Agent":
                    "Mozilla/5.0 (Linux; Android 11; SM-A505F) Chrome/99 Safari/537.36",
                },
                responseType: "arraybuffer",
              });

              buffer = Buffer.from(res.data);
              if (!buffer?.length) return reply("❌ Tidak ada data dari URL.");

              const detected = await FileType.fromBuffer(buffer);
              const headerMime = res.headers["content-type"];
              mimetype = detected?.mime || headerMime || mimetype;

              if (mimetype === "image/webp") mimetype = "image/png";

              filename = decodeURIComponent(
                new URL(text).pathname.split("/").pop() ||
                  `file.${detected?.ext || "bin"}`
              );
            } else if (m.quoted?.message) {
              const type = Object.keys(m.quoted.message)[0];
              if (type === "conversation" || type === "extendedTextMessage") {
                return reply(m.quoted.text.slice(0, 4000));
              }

              const stream = await m.quoted.download();
              buffer = await streamToBuffer(stream);
              const typeinfo = await FileType.fromBuffer(buffer);
              mimetype = typeinfo?.mime || mimetype;
              filename = `media.${typeinfo?.ext || "bin"}`;
            } else {
              return reply("❌ Tidak ditemukan URL atau media yang dikutip.");
            }

            // cek apakah JSON/text
            const isText = /^(text\/|application\/(json|xml|javascript))/.test(
              mimetype
            );
            if (isText) {
              const txt = buffer.toString("utf-8").trim();
              try {
                const json = JSON.parse(txt);
                return reply(JSON.stringify(json, null, 2));
              } catch {
                return reply(txt.length > 4000 ? txt.slice(0, 4000) : txt);
              }
            }

            // sisanya kirim media
            const mimeMain = mimetype.split("/")[0];
            if (mimeMain === "image") {
              await DimzBot.sendMessage(
                m.chat,
                {
                  image: buffer,
                  fileName: filename,
                  caption: `✅ ${filename}`,
                },
                {
                  quoted: m,
                }
              );
            } else if (mimeMain === "video") {
              await DimzBot.sendMessage(
                m.chat,
                {
                  video: buffer,
                  fileName: filename,
                  caption: `✅ ${filename}`,
                },
                {
                  quoted: m,
                }
              );
            } else if (mimeMain === "audio") {
              await DimzBot.sendMessage(
                m.chat,
                {
                  audio: buffer,
                  fileName: filename,
                },
                {
                  quoted: m,
                }
              );
            } else {
              await DimzBot.sendMessage(
                m.chat,
                {
                  document: buffer,
                  mimetype,
                  fileName: filename,
                  caption: `✅ ${filename}`,
                },
                {
                  quoted: m,
                }
              );
            }

            await DimzBot.sendMessage(m.chat, {
              react: {
                text: "",
                key: m.key,
              },
            });
          } catch (err) {
            console.error("❌ Debug GET error:", err);
            return reply("❌ Gagal mengambil dan mengirim file.");
          }
        })();
      }
      break;

    case "file":
      {
        if (!GlobalOwner) return;

        const argss = text.trim().split(" ");
        const subcmd = argss[0];

        if (!["up", "del"].includes(subcmd)) {
          return m.reply(
            `❌ Subcommand tidak valid!\n\nContoh:\n• *${prefix + command} up ./folder/\*\n• *${prefix + command} up ./folder/ nama.js*\n• *${prefix + command} del ./folder/nama.js*`
          );
        }

        if (subcmd === "up") {
          if (!m.quoted || !m.quoted.fileName)
            return m.reply("❌ Balas file yang ingin diupload.");

          const folder = argss[1];
          const customName = argss[2];

          if (!folder)
            return m.reply(
              `❌ Format salah!\nContoh: *${prefix + command} up ./folder/ [optional-namafile]*`
            );

          try {
            const buff = await m.quoted.download();
            const namaFile = customName || m.quoted.fileName;
            const savePath = path.join(__dirname, folder, namaFile);

            fs.mkdirSync(path.dirname(savePath), {
              recursive: true,
            });
            fs.writeFileSync(savePath, buff);

            m.reply(`✅ File *${namaFile}* berhasil disimpan ke *${savePath}*`);
          } catch (e) {
            m.reply(`❌ Gagal simpan: ${e.message}`);
          }
        }

        if (subcmd === "del") {
          const fileTarget = argss[1];
          if (!fileTarget)
            return m.reply(
              `❌ Format salah!\nContoh: *${prefix + command} del ./folder/nama.js*`
            );

          const deletePath = path.join(__dirname, fileTarget);
          if (!fs.existsSync(deletePath))
            return m.reply("❌ File tidak ditemukan.");

          try {
            fs.unlinkSync(deletePath);
            m.reply(`🗑️ File berhasil dihapus: *${deletePath}*`);
          } catch (e) {
            m.reply(`❌ Gagal hapus: ${e.message}`);
          }
        }
      }
      break;

    case "cheat":
      {
        if (!GlobalOwner) return;

        const input = text.split("|");
        if (input.length < 2)
          return reply("⚙️ Format: *.cheat nomor|jumlah [exp/coin/level]*");

        let target = input[0].trim().replace(/[^0-9]/g, "") + "@s.whatsapp.net";
        const valuePart = input[1].trim().split(" ");
        const amount = parseInt(valuePart[0]);
        const type = (valuePart[1] || "exp").toLowerCase(); // default exp

        if (isNaN(amount) || amount <= 0)
          return reply("🚫 Jumlah tidak valid!");

        const data = loadExpData(botId);

        if (!data[target]) {
          data[target] = {
            exp: 0,
            level: 1,
            coins: 0,
            lastExp: 0,
            nextExpTime: 0,
            dailyCount: 0,
            lastDay: new Date().getDate(),
          };
        }

        const user = data[target];

        switch (type) {
          case "exp":
            user.exp += amount;
            break;
          case "coin":
          case "coins":
            user.coins += amount;
            break;
          case "level":
            user.level += amount;
            break;
          default:
            return reply(
              "⚠️ Jenis cheat tidak valid! Gunakan: exp, coin, level"
            );
        }

        saveExpData(botId, data);

        await DimzBot.sendMessage(
          m.chat,
          {
            text: `✅ Cheat berhasil!\n\n🎯 Target: @${target.split("@")[0]}\n📈 Tambahan: +${amount} ${type}\n⭐ Level Sekarang: ${user.level}\n💠 EXP: ${user.exp}\n💰 Coin: ${user.coins}`,
            mentions: [target],
          },
          {
            quoted: m,
          }
        );
      }
      break;
    case "myip":
      {
        if (!GlobalOwner) return;
        var http = require("http");
        http.get(
          {
            host: "api.ipify.org",
            port: 80,
            path: "/",
          },
          function (resp) {
            resp.on("data", function (ip) {
              reply("🔎 My public IP address is: " + ip);
            });
          }
        );
      }
      break;
    case "sub":
      {
        if (!GlobalOwner) return;
        await DimzBot.sendMessage(
          from,
          {
            text: `

──────────────✪
☯ sᴜʙ ᴏᴡɴᴇʀ ғɪᴛᴜʀ
──────────────✦
○ ${prefix}clearstore
○ ${prefix}smodul
○ ${prefix}get
○ ${prefix}file
○ ${prefix}cheat
○ ${prefix}myip
`,
            contextInfo: {
              forwardingScore: 9999,
              isForwarded: true,
              businessMessageForwardInfo: {
                businessOwnerJid: "6289603732786@s.whatsapp.net",
              },
              mentionedJid: [m.sender, creator2, "0@s.whatsapp.net"],
              externalAdReply: {
                renderLargerThumbnail: true,
                title: `亗 ᴅɪᴍᴀs ʙᴏᴛᴢᴢ ʙʏ: ᴠͥɪͣᴘͫ𝐃𝐑𝐈𝐙𝐙𝐘♔`,
                body: `⏰ Time Now ${moment.tz("Asia/Jakarta").format("HH : mm : ss")}`,
                containsAutoReply: true,
                mediaType: 1,
                thumbnail: fs.readFileSync("Media2/theme/thumb.jpg"),
                mediaUrl: `http://instagram.com/banh_dims0`,
                sourceUrl: `http://instagram.com/banh_dims0`,
              },
            },
          },
          {
            quoted: m,
          }
        );
      }
      break;

    case "jadibot":
      {
        const textnya = `
*🚀 Selamat Datang di Soft Botz*

- Platform Jadibot WhatsApp Canggih, Respon Cepat, dan Serba Otomatis
- Bangun bot WhatsApp kamu sendiri hanya dalam hitungan detik!
- Dengan Soft Botz, kamu bisa membuat, mengelola, dan menjalankan bot WhatsApp tanpa ribet.
- Semua fitur sudah disiapkan — tinggal klik, koneksi, dan bot kamu langsung aktif 💥


*💡 Kenapa Pilih Soft Botz?*
- ⚙️ Tanpa Setup Ribet — cukup tautkan perangkat dan bot langsung aktif.

- 💬 Fitur Lengkap — dari auto-reply, AI, downloader, store, stiker hingga grup management, cocok untuk jaga grup ataupun berjualan

- 🌐 Cloud-Based System — online 24 jam


*🌟 Cocok Untuk*
- _Creator konten, penjual online, jaga grup, komunitas, atau siapa pun yang butuh asisten WhatsApp otomatis._
- _Cukup satu akun, kamu bisa punya bot pribadi yang siap bantu kerja kamu 24/7._


*🕹️ Mulai Sekarang*
Daftar gratis dan rasakan kemudahan membuat bot WhatsApp sendiri di
👉 softbotz.my.id


*🎥 Playlist video tutorial*
Tutorial lengkap menggunakan softbotz
👉 https://youtube.com/playlist?list=PLOesEwJIPNXg0pNbNKTi9mDbPWNsdPtqs&si=bNHMp0MzgaHOOznt

> ©Soft Botz — “The Next Generation Bot Platform”
`;

        const footerText = global.wmbotzz || `©Soft Botzz 2K26`;

        // Menggunakan generateWAMessageFromContent dengan struktur InteractiveMessage yang disederhanakan
        const msg = generateWAMessageFromContent(
          m.chat,
          {
            viewOnceMessage: {
              message: {
                messageContextInfo: {
                  deviceListMetadata: {},
                  deviceListMetadataVersion: 2,
                },
                interactiveMessage: proto.Message.InteractiveMessage.create({
                  header: proto.Message.InteractiveMessage.Header.create({
                    title: ``,
                    subtitle: "Soft Botzz - Panel & Services",
                    hasMediaAttachment: false,
                    // Bisa tambahkan thumbnail jika mau:
                    /*
                  ...(await prepareWAMessageMedia({
                      image: fs.readFileSync(global.thumbnail)
                  }, { upload: DimzBot.waUploadToServer })),
                  */
                  }),
                  body: proto.Message.InteractiveMessage.Body.create({
                    text: textnya,
                  }),
                  footer: proto.Message.InteractiveMessage.Footer.create({
                    text: footerText,
                  }),
                  nativeFlowMessage:
                    proto.Message.InteractiveMessage.NativeFlowMessage.create({
                      buttons: [
                        {
                          name: "cta_url",
                          buttonParamsJson: JSON.stringify({
                            display_text: "Hubungi Admin Softbotz",
                            url: `https://wa.me/6289603732786`,
                            merchant_url: `https://wa.me/6289603732786`,
                          }),
                        },
                        {
                          name: "cta_url",
                          buttonParamsJson: JSON.stringify({
                            display_text: "Grup Soft Botzz",
                            url: `https://chat.whatsapp.com/EEYblODGNuw8pvlg0bLGVh`,
                            merchant_url: `https://chat.whatsapp.com/EEYblODGNuw8pvlg0bLGVh`,
                          }),
                        },
                        {
                          name: "cta_url",
                          buttonParamsJson: JSON.stringify({
                            display_text: "Jadibot Gratis!",
                            url: `https://softbotz.my.id/register`,
                            merchant_url: `https://softbotz.my.id/register`,
                          }),
                        },
                        {
                          name: "cta_url",
                          buttonParamsJson: JSON.stringify({
                            display_text: "Saluran Update",
                            url: `https://whatsapp.com/channel/0029VaFJJHh6hENqH3EYO33m`,
                            merchant_url: `https://whatsapp.com/channel/0029VaFJJHh6hENqH3EYO33m`,
                          }),
                        },
                      ],
                    }),
                  contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true,
                  },
                }),
              },
            },
          },
          {
            quoted: m,
          }
        );

        await DimzBot.relayMessage(m.chat, msg.message, {
          messageId: msg.key.id,
        });
      }
      break;
    default:
      if (isCmd && budy.toLowerCase() != undefined) {
        if (m.chat.endsWith("broadcast")) return;
        if (m.isBaileys) return;
        const msgs = getLists(m.chat);
        if (!(budy.toLowerCase() in msgs)) return;
        DimzBot.copyNForward(m.chat, msgs[budy.toLowerCase()], true);
      }
  }
};
