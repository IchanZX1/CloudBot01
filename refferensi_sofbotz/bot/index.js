require("./settings");
const { db, markChanged } = require("./lib/config");
const { getData, getGlobal } = require("./lib/globaldata");
const pkg = require("./package.json");
const { modul } = require("./module");
const moment = require("moment-timezone");
const cron = require("node-cron");
const osUtils = require("os-utils");
const os = require("os");
const gradient = require("gradient-string");
const QR = require("qrcode-terminal");
const http = require("http");
const { execSync } = require("child_process");
const {
  baileys,
  chalk,
  fs,
  figlet,
  FileType,
  path,
  pino,
  process,
  PhoneNumber,
  axios,
  _,
} = modul;
process.env.TMPDIR = path.resolve(__dirname, "./temp");
const input = require("input");
const {
  default: DimzBotConnect,
  initInMemoryKeyStore,
  DisconnectReason,
  useMultiFileAuthState,
  delay,
  jidNormalizedUser,
  makeWASocket,
  makeCacheableSignalKeyStore,
  generateForwardMessageContent,
  prepareWAMessageMedia,
  generateWAMessageFromContent,
  generateMessageID,
  downloadContentFromMessage,
  jidDecode,
  proto,
  fetchLatestWaWebVersion,
  Browsers,
} = require("@whiskeysockets/baileys");
const { makeInMemoryStore } = require("./lib/store/");
const db_wel = db.setwel;
const { tanggal, day, bulan, tahun, weton } = require("./lib/myfunc");
const { color, bgcolor } = require("./lib/color");
const { uncache, nocache } = require("./lib/loader");
const {
  imageToWebp,
  videoToWebp,
  writeExifImg,
  writeExifVid,
} = require("./lib/exif");
const {
  smsg,
  isUrl,
  generateMessageTag,
  getBuffer,
  getSizeMedia,
  sleep,
  reSize,
} = require("./lib/myfunc");
const Pino = require("pino");
const NodeCache = require("node-cache");
const more = String.fromCharCode(8206);
const readmore = more.repeat(4001);
const prefix = "";
const botId = global.botId;
const botName = global.botname || "Soft Botz";
const args = JSON.parse(process.argv[2] || "{}");
console.log("phone number = " + args.phoneNumber);
const ownernumber = (global.ownernomer = args.ownernum);
global.ownername = args.owner;
global.botname = args.botname;
global.packnane = args.sticker;
global.author = args.author;

const stop = (code) => {
  if (process.env.pm_id) {
    execSync(`pm2 stop ${process.env.pm_id}`);
  }
  process.exit(code ?? 1);
};
const debug = (...args) => {
  if (
    process.env.NODE_ENV === "development" ||
    process.env.LEVEL === "debug" ||
    process.env.LEVEL === "trace"
  ) {
    console.trace("[DEBUG]", ...args);
  }
};

const type = (x) => x?.constructor?.name || (x === null ? "null" : "undefined");
const isStringSame = (x, y) => (Array.isArray(y) ? y.includes(x) : y === x);

const buttonTypes = [
  "single_select",
  "quick_reply",
  "cta_url",
  "cta_call",
  "cta_copy",
  "cta_reminder",
  "cta_cancel_reminder",
  "address_message",
  "send_location",
];

const store = makeInMemoryStore({
  logger: pino().child({
    level: process.env.LEVEL || "silent",
    stream: "store",
  }),
});

/*
const clearStore = () => {
  console.log(`${chalk.white.bgGreenBright.bold("[ INFO ]")} ${chalk.white.bgGrey.bold("membersihkan data store")}`);
  store.data = {};
};
setInterval(clearStore, 1800000);
*/

const useMobile = process.argv.includes("--mobile");

console.log(
  `${chalk.white.bgGreenBright.bold("Starting")} ${chalk.white.bgGrey.bold(`${global.botname}`)}`
);
/*
setTimeout(async () => {
  console.clear();
  const padLabel = (label, length = 12) => label.padEnd(length, " ");
  const text = figlet.textSync(`Soft Botz`, {
    font: "Standard",
    horizontalLayout: "default",
    verticalLayout: "default",
    whitespaceBreak: true
  });

  const info = `
📌 ${padLabel("Author")} : Dimzz
🚀 ${padLabel("Type")} : ${pkg.type}
💻 ${padLabel("Version")} : ${pkg.version}
📂 ${padLabel("Source")} : Private Source
📢 ${padLabel("GitHub")} : github.com/Dimsbot
📩 ${padLabel("Contact")} : Instagram @banh_dims0
`;

  console.log(gradient.pastel.multiline(text));
  console.log(gradient.vice(info));
}, 3000);
*/

async function DimzBotzz() {
  const { saveCreds, state } = await useMultiFileAuthState(
    `./session/${args.id}`
  );
  const msgRetryCounterCache = new NodeCache();

  const groupCache = new NodeCache({
    stdTTL: 60 * 5,
    useClones: false,
  });

  const clearCacheIfNecessary = () => {
    if (Object.keys(msgRetryCounterCache.keys()).length > 1000) {
      // Cek jika cache terlalu besar
      console.log(
        `${chalk.red.bold("[ ⚠WARNING⚠ ]")} ${chalk.yellowBright.bgRed.bold("cache terlalu besar, membersihkan....")}`
      );
      msgRetryCounterCache.flushAll();
    }
  };

  const { version: _v, isLatest, error } = await fetchLatestWaWebVersion();
  const version = error ? [2, 3000, 1027934701] : _v;
  const DimzBot = DimzBotConnect({
    version,
    logger: pino({
      level: process.env.LEVEL || "silent",
    }),
    browser: Browsers.macOS('Safari'),
    auth: state,
    markOnlineOnConnect: false,
    generateHighQualityLinkPreview: false,
    getMessage: async (key) => {
      let jid = jidNormalizedUser(key.remoteJid);
      let msg = await store.loadMessage(jid, key.id);
      return msg?.message || "";
    },
    msgRetryCounterCache,
    cachedGroupMetadata: (jid) => groupCache.get(jid),
  });
  const _close = setTimeout(
    () => {
      stop();
    },
    1000 * 60 * 5
  );

  if (store) {
    store.bind(DimzBot.ev);
  }

  DimzBot.ev.on("creds.update", saveCreds);

  if (!DimzBot.authState.creds.registered) {
    const connectMethod = args.connectMethod || "qr"; // Default to QR
    if (connectMethod === "pairing") {
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      const number = args.phoneNumber !== undefined ? args.phoneNumber : "";
      if (number) {
        console.log(
          chalk.black(chalk.bgGreen(`Requesting Pairing Code for ${number}`))
        );
        await delay(5000);
        const code = await DimzBot.requestPairingCode(number, "SOFTBOTZ");
        console.log(
          chalk.black(chalk.bgGreen(`Your Pairing Code: `)),
          chalk.black(chalk.white(code))
        );
        process.send({
          type: "process:msg",
          data: {
            type: "pairingCodeResult",
            code,
          },
        });
      } else {
        console.log(
          chalk.red.bold("Error: Phone number not provided for pairing code.")
        );
      }
    } else {
      console.log(
        chalk.black(
          chalk.bgGreen("No session found. Please scan the QR code to connect.")
        )
      );
    }
  }

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function isOwner(jid) {
    const number = jid.split(/[@:]/)[0];
    const owners = getData(botId, "global").owners || [];
    return [global.ownernomer, ...owners]
      .map((v) => v.split(/[@:]/)[0])
      .includes(number);
  }

  async function typingEffect(text, delayMs = 50) {
    for (let char of text) {
      process.stdout.write(char);
      await delay(delayMs);
    }
    process.stdout.write("\n");
  }

  DimzBot.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      process.send({
        type: "process:msg",
        data: {
          type: "qrCodeResult",
          qr,
        },
      });
      console.log("[QR-CODE] QR code generated. Scan with your phone.");
    }

    if (connection === "connecting") {
      console.log(
        `${chalk.yellow.bgBlue(" [ STARTUP ] ")} ${chalk.yellow.bgGrey(" Process Socket Connection.... ")}`
      );
    } else if (connection === "open") {
      clearInterval(_close);
      console.log(
        `${chalk.green.bgBlue(" [ SUCCES ] ")}  ${chalk.green.bgGrey(" Connected ")}`
      );

      // === AUTO FOLLOW NEWSLETTER ===
      try {
        await DimzBot.newsletterFollow("120363179857645465@newsletter");
      } catch (e) {}
    } else if (connection === "close") {
      const reason = lastDisconnect?.error?.output?.statusCode;
      const statusMessage = lastDisconnect?.error?.message || "No message";
      const detailedReason = DisconnectReason[reason] || "Unknown Reason";

      console.log(
        chalk.red.bgBlue("[ DISCONNECTED ]"),
        chalk.yellow(`Reason: ${detailedReason} (${reason})`)
      );
      console.log(chalk.red("Message:"), statusMessage);

      if (
        reason === DisconnectReason.loggedOut ||
        reason === DisconnectReason.forbidden
      ) {
        console.log(chalk.bgRed("❌ Terlogout, keluar dari proses."));
        stop();
      } else {
        console.log(chalk.yellow("Koneksi gagal, memulai ulang proses..."));
        process.exit(1);
      }
    }
  });

  // read sw
  const seen = new Set();

  DimzBot.ev.on("messages.upsert", async (chatUpdate) => {
    if (!chatUpdate?.messages?.[0] || chatUpdate.type !== "notify") return;

    try {
      const message = chatUpdate.messages[0];
      const m = smsg(DimzBot, message, store);
      if (!message.message) return;

      if (message.message.ephemeralMessage)
        message.message = message.message.ephemeralMessage.message;

      if (message.message.viewOnceMessage) return;
      //if (message.message?.extendedTextMessage?.contextInfo?.externalAdReply)
      //  return;

      debug({
        seen: seen.has(message.key.id),
      });
      if (seen.has(message.key.id)) return;
      if (message.message) seen.add(message.key.id);
      setTimeout(() => seen.delete(message.key.id), 1000 * 60 * 5);

      const senderJid =
        message.key.participant || message.participant || message.key.remoteJid;

      // 🔥 ambil mode dari database lokal (globaldata.json)
      const datapub = getData(botId, "global");
      const isPublic = datapub.public ?? true;
      /*
      // 🔒 kalau mode self dan bukan owner, skip
      if (
        !m.key.fromMe &&
        !isOwner(senderJid) &&
        !isPublic
      ) {
        return;
      }
*/
      require("./DimasBotzz")(DimzBot, m, chatUpdate, store);
    } catch (err) {
      console.error(chalk.red("[MESSAGE PROCESSING ERROR]"), err);
    }
  });

  /*
// Helper functions
async function handleStatusBroadcast(message) {
  const allowedSenders = [
    "6281447345627@s.whatsapp.net", 
    "628145563553@s.whatsapp.net"
  ];

  // Skip if:
  // 1. It's a reaction message
  // 2. Sender is in allowed list
  // 3. Status is older than 5 minutes
  if (message.message.reactionMessage || 
      allowedSenders.includes(message.keyparticipantPn) ||
      (Date.now() - message.messageTimestamp * 1000 > 300000)) {
    return;
  }

  await DimzBot.readMessages([message.key]);

  const emojis = [
    "🔥", "✨", "🗿", "👻", "🤖", "🌟", "🌞", "🎉", "🎊", "😺", 
    "❤️", "💔", "💖", "💫", "🌈", "🌸", "🌼", "🌻", "🌺", "💐"
    // ... (keep your existing emoji list)
  ];

  const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
  
  await DimzBot.sendMessage("status@broadcast", {
    react: { 
      text: randomEmoji, 
      key: message.key 
    }
  }, {
    statusJidList: [message.keyparticipantPn] 
  });

  console.log(chalk.bgGrey.bold(`Berhasil memberi reaksi ${randomEmoji} pada status dari ${chalk.bgGrey.bold.yellow(message.pushName)}`));
}
*/

  //fake
  const ftroli = {
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
        message: "『⌕ ❙❘❙❙❘❙❚❙❘❙❙❚❙❘❙❘❙❚❙❘❙❙❚❙❘❙❙❘❙❚❙❘ ⌕』",
        orderTitle: ownername,
        sellerJid: "0@s.whatsapp.net",
      },
    },
    contextInfo: {
      forwardingScore: 999,
      isForwarded: true,
    },
    sendEphemeral: true,
  };

  DimzBot.ev.on("groups.update", async (updates) => {
    for (const update of updates) {
      const id = update.id;
      groupCache.del(id);
      const metadata = await DimzBot.groupMetadata(id);
      groupCache.set(id, metadata);
    }
  });

  // Listen for messages from PM2 (server.js)
  process.on("message", async (message) => {
    if (message.type === "generatePairingCode") {
      const phoneNumber = message.phoneNumber;
      try {
        const code = await DimzBot.requestPairingCode(phoneNumber);
        process.send({
          type: "process:msg",
          data: {
            type: "pairingCodeResult",
            code,
          },
        });
      } catch (error) {
        process.send({
          type: "process:msg",
          data: {
            type: "pairingCodeError",
            error: error.message,
          },
        });
      }
    }
  });

  DimzBot.ev.on("call", async (calls) => {
    for (const { groupJid, from } of calls) {
      const group = getData(botId, groupJid) || {};
      const me = DimzBot.user.id.replace(/:[0-9]+/, "");
      if (group.anticallgc) {
        const { participants } = await DimzBot.groupMetadata(groupJid);
        const isAdmin = !!participants.find((p) => {
          return p.id === from || p.jid === from;
        }).admin;
        const isBotAdmin = !!participants.find((p) => {
          return p.id === me || p.jid === me;
        }).admin;
        if (isAdmin || !isBotAdmin) {
          continue;
        }

        await DimzBot.sendMessage(groupJid, {
          text: `@${from.split("@")[0]} Panggilan grup tidak diizinkan! Kamu akan di-kick.`,
          mentions: [from],
        });
        await DimzBot.groupParticipantsUpdate(groupJid, [from], "remove");
      }
    }
  });

  DimzBot.ev.on("group-participants.update", async (anu) => {
    const group = getData(botId, anu.id);
    const { welcome, left } = group;
    const isJoin = anu.action === "add";
    const isLeft = anu.action === "remove";
    try {
      groupCache.del(anu.id);
      const metadata = await DimzBot.groupMetadata(anu.id);
      groupCache.set(anu.id, metadata);
      const participants = anu.participants.map((id) => {
        const { jid } = metadata.participants.find((u) => {
          return u.id === id || u.lid === id || u.jid === id;
        }) || { jid: id };
        return jid;
      });
      for (const num of participants) {
        let ppuser;
        let ppgrup;
        try {
          ppuser = await DimzBot.profilePictureUrl(num, "image");
        } catch {
          ppuser =
            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60";
        }
        try {
          ppgroup = await DimzBot.profilePictureUrl(anu.id, "image");
        } catch {
          ppgroup = "https://i.ibb.co/RBx5SQC/avatar-group-large-v2.png?q=60";
        }
        //welcome\\
        memb = metadata.participants.length;
        DimWelcome = await getBuffer(ppuser);
        XeonLft = await getBuffer(ppuser);

        const db_wel = db.setwel;
        const db_Lef = db.setleft;

        let groupWelData = db_wel[anu.id] || {};
        let teksWelRaw =
          groupWelData.text ||
          "*Selamat Datang! Jangan Lupa Baca Rules Grup Di Deskripsi Yaa!!! 🤩*";
        let teksWel = teksWelRaw
          .replace(/@user/gi, `@${num.split("@")[0]}`)
          .replace(/@grup/gi, metadata.subject);
        let styleWel = groupWelData.style || "style1";

        let teksLef =
          db_Lef[anu.id]?.text ||
          `Sayonaraa 👋\nTerima kasih sudah menjadi bagian dari grup ${metadata.subject} ❤️`;

        if (isJoin && welcome) {
          let xeonName = num;
          const xtime = moment.tz("Asia/Jakarta").format("HH:mm:ss");
          const xdate = moment.tz("Asia/Jakarta").format("DD/MM/YYYY");
          const xmembers = metadata.participants.length;
          bodytext = `┏────❖
┇──「 sᴇʟᴀᴍᴀᴛ ᴅᴀᴛᴀɴɢ 」
┇「  @${xeonName.split("@")[0]}  」
┗──────────────┈┈❖

ᴡᴇʟᴄᴏᴍᴇ ᴛᴏ ɢʀᴜᴘ:
🔰 ${metadata.subject}
ᴊᴏɪɴ ᴘᴀᴅᴀ ᴊᴀᴍ:
⏰ ${xtime}
ᴛᴀɴɢɢᴀʟ ᴊᴏɪɴ:
📆 ${day(Date.now())} ${weton(Date.now())}, ${tanggal(Date.now())} ${bulan(Date.now())} ${tahun(Date.now())}
────────────────┈ ⳹

${teksWel}

「 *Powered By* @${creator2.split("@")[0]}」
`;

          if (styleWel === "style1") {
            let msgs = generateWAMessageFromContent(
              anu.id,
              {
                messageTimestamp: Math.floor(Date.now() / 1000),
                viewOnceMessage: {
                  message: {
                    messageContextInfo: {
                      deviceListMetadata: {},
                      deviceListMetadataVersion: 2,
                    },
                    interactiveMessage: proto.Message.InteractiveMessage.create(
                      {
                        body: proto.Message.InteractiveMessage.Body.create({
                          text: "",
                        }),
                        footer: proto.Message.InteractiveMessage.Footer.create({
                          text: global.footer,
                        }),
                        header: proto.Message.InteractiveMessage.Header.create({
                          title: bodytext,
                          hasMediaAttachment: true,
                          ...(await require("@whiskeysockets/baileys").prepareWAMessageMedia(
                            { image: DimWelcome },
                            { upload: DimzBot.waUploadToServer }
                          )),
                        }),
                        nativeFlowMessage:
                          proto.Message.InteractiveMessage.NativeFlowMessage.create(
                            {
                              buttons: [
                                {
                                  name: "quick_reply",
                                  buttonParamsJson: JSON.stringify({
                                    display_text:
                                      groupWelData.buttonText || "INTRO",
                                    id: groupWelData.buttonReply
                                      ? `.butwelreply`
                                      : `.intro`,
                                  }),
                                },
                              ],
                            }
                          ),
                        contextInfo: {
                          mentionedJid: [num, creator2, "0@s.whatsapp.net"],
                          externalAdReply: {
                            containsAutoReply: true,
                            title: metadata.subject,
                            body: `ᴊᴜᴍʟᴀʜ ᴍᴇᴍʙᴇʀ ${xmembers}`,
                            previewType: "PHOTO",
                            thumbnail: DimWelcome,
                            sourceUrl: wagc,
                            mediaType: 1,
                            renderLargerThumbnail: true,
                          },
                        },
                      }
                    ),
                  },
                },
              },
              {}
            );

            await DimzBot.relayMessage(anu.id, msgs.message, {
              messageId: msgs.key.id,
            });
          } else {
            // === STYLE 2: SIMPLE TEXT + EXTERNAL PREVIEW ===
            await DimzBot.sendMessage(anu.id, {
              text: teksWel,
              contextInfo: {
                mentionedJid: [num, "0@s.whatsapp.net"],
                externalAdReply: {
                  containsAutoReply: true,
                  title: `🪀 WELCOME TO GROUP: ${metadata.subject}`,
                  body: `ᴊᴜᴍʟᴀʜ ᴍᴇᴍʙᴇʀ ${xmembers}`,
                  previewType: "PHOTO",
                  thumbnailUrl: ``,
                  thumbnail: DimWelcome,
                  sourceUrl: wagc,
                  mediaType: 1,
                  renderLargerThumbnail: true,
                },
              },
            });
          }
        } else if (isLeft && left) {
          let usrName = num.split("@")[0];

          let teksLef = (
            db_Lef[anu.id]?.text ||
            `👋 Selamat tinggal @user! Semoga harimu menyenangkan`
          ).replace(/@user/gi, `@${usrName}`);

          await DimzBot.sendMessage(anu.id, {
            text: teksLef,
            mentions: [num],
            contextInfo: {
              mentionedJid: [num],
              externalAdReply: {
                containsAutoReply: true,
                title: `🪀 LEFT GROUP: ${metadata.subject}`,
                body: metadata.subject,
                previewType: "PHOTO",
                thumbnailUrl: ppuser,
                mediaUrl: channel,
                sourceUrl: wagc,
                mediaType: 1,
                renderLargerThumbnail: true,
              },
            },
          });
        }
      }
    } catch (err) {
      console.error(err);
    }
  });

  DimzBot.sendTextWithMentions = async (jid, text, quoted, options = {}) =>
    DimzBot.sendMessage(
      jid,
      {
        text: text,
        contextInfo: {
          mentionedJid: [...text.matchAll(/@(\d{0,16})/g)].map(
            (v) => v[1] + "@s.whatsapp.net"
          ),
        },
        ...options,
      },
      {
        quoted,
      }
    );

  DimzBot.decodeJid = (jid) => {
    if (!jid) return jid;
    if (/:\d+@/gi.test(jid)) {
      let decode = jidDecode(jid) || {};
      return (
        (decode.user && decode.server && decode.user + "@" + decode.server) ||
        jid
      );
    } else return jid;
  };

  DimzBot.getName = (jid, withoutContact = false) => {
    id = DimzBot.decodeJid(jid);
    withoutContact = DimzBot.withoutContact || withoutContact;
    let v;
    if (id.endsWith("@g.us"))
      return new Promise(async (resolve) => {
        v = store.contacts[id] || {};
        if (!(v.name || v.subject)) v = DimzBot.groupMetadata(id) || {};
        resolve(
          v.name ||
            v.subject ||
            PhoneNumber("+" + id.replace("@s.whatsapp.net", "")).getNumber(
              "international"
            )
        );
      });
    else
      v =
        id === "0@s.whatsapp.net"
          ? {
              id,
              name: "WhatsApp",
            }
          : id === DimzBot.decodeJid(DimzBot.user.id)
            ? DimzBot.user
            : store.contacts[id] || {};
    return (
      (withoutContact ? "" : v.name) ||
      v.subject ||
      v.verifiedName ||
      PhoneNumber("+" + jid.replace("@s.whatsapp.net", "")).getNumber(
        "international"
      )
    );
  };

  DimzBot.parseMention = (text = "") => {
    return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(
      (v) => v[1] + "@s.whatsapp.net"
    );
  };

  DimzBot.sendContact = async (jid, kon, quoted = "", opts = {}) => {
    let list = [];
    for (let i of kon) {
      list.push({
        displayName: await DimzBot.getName(i),
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await DimzBot.getName(i)}\nFN:${await DimzBot.getName(i)}\nitem1.TEL;waid=${i}:${i}\nitem1.X-ABLabel:Click here to chat\nitem2.EMAIL;type=INTERNET:${ytname}\nitem2.X-ABLabel:YouTube\nitem3.URL:${socialm}\nitem3.X-ABLabel:GitHub\nitem4.ADR:;;${location};;;;\nitem4.X-ABLabel:Region\nEND:VCARD`,
      });
    }
    DimzBot.sendMessage(
      jid,
      {
        contacts: {
          displayName: `${list.length} Contact`,
          contacts: list,
        },
        ...opts,
      },
      {
        quoted,
      }
    );
  };

  DimzBot.public = !process.argv.includes("--self");

  DimzBot.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
    let buff = Buffer.isBuffer(path)
      ? path
      : /^data:.*?\/.*?;base64,/i.test(path)
        ? Buffer.from(path.split`,`[1], "base64")
        : /^https?:\/\//.test(path)
          ? await await getBuffer(path)
          : fs.existsSync(path)
            ? fs.readFileSync(path)
            : Buffer.alloc(0);
    let buffer;
    if (options && (options.packname || options.author)) {
      buffer = await writeExifImg(buff, options);
    } else {
      buffer = await imageToWebp(buff);
    }
    await DimzBot.sendMessage(
      jid,
      {
        sticker: {
          url: buffer,
        },
        ...options,
      },
      {
        quoted,
      }
    ).then((response) => {
      fs.unlinkSync(buffer);
      return response;
    });
  };

  DimzBot.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
    let buff = Buffer.isBuffer(path)
      ? path
      : /^data:.*?\/.*?;base64,/i.test(path)
        ? Buffer.from(path.split`,`[1], "base64")
        : /^https?:\/\//.test(path)
          ? await await getBuffer(path)
          : fs.existsSync(path)
            ? fs.readFileSync(path)
            : Buffer.alloc(0);
    let buffer;
    if (options && (options.packname || options.author)) {
      buffer = await writeExifVid(buff, options);
    } else {
      buffer = await videoToWebp(buff);
    }
    await DimzBot.sendMessage(
      jid,
      {
        sticker: {
          url: buffer,
        },
        ...options,
      },
      {
        quoted,
      }
    );
    return buffer;
  };

  DimzBot.sendImageAsStickerAvatar = async (
    jid,
    path,
    quoted,
    options = {}
  ) => {
    let buff = Buffer.isBuffer(path)
      ? path
      : /^data:.*?\/.*?;base64,/i.test(path)
        ? Buffer.from(path.split`,`[1], "base64")
        : /^https?:\/\//.test(path)
          ? await await getBuffer(path)
          : fs.existsSync(path)
            ? fs.readFileSync(path)
            : Buffer.alloc(0);
    let buffer;
    if (options && (options.packname || options.author)) {
      buffer = await writeExifImgAvatar(buff, options);
    } else {
      buffer = await imageToWebpAvatar(buff);
    }
    await DimzBot.sendMessage(
      jid,
      {
        sticker: {
          url: buffer,
        },
        ...options,
      },
      {
        quoted,
      }
    ).then((response) => {
      fs.unlinkSync(buffer);
      return response;
    });
  };

  DimzBot.sendVideoAsStickerAvatar = async (
    jid,
    path,
    quoted,
    options = {}
  ) => {
    let buff = Buffer.isBuffer(path)
      ? path
      : /^data:.*?\/.*?;base64,/i.test(path)
        ? Buffer.from(path.split`,`[1], "base64")
        : /^https?:\/\//.test(path)
          ? await await getBuffer(path)
          : fs.existsSync(path)
            ? fs.readFileSync(path)
            : Buffer.alloc(0);
    let buffer;
    if (options && (options.packname || options.author)) {
      buffer = await writeExifVidAvatar(buff, options);
    } else {
      buffer = await videoToWebpAvatar(buff);
    }
    await DimzBot.sendMessage(
      jid,
      {
        sticker: {
          url: buffer,
        },
        ...options,
      },
      {
        quoted,
      }
    );
    return buffer;
  };

  DimzBot.copyNForward = async (
    jid,
    message,
    forceForward = false,
    options = {}
  ) => {
    let vtype;
    if (options.readViewOnce) {
      message.message =
        message.message &&
        message.message.ephemeralMessage &&
        message.message.ephemeralMessage.message
          ? message.message.ephemeralMessage.message
          : message.message || undefined;
      vtype = Object.keys(message.message.viewOnceMessage.message)[0];
      delete (message.message && message.message.ignore
        ? message.message.ignore
        : message.message || undefined);
      delete message.message.viewOnceMessage.message[vtype].viewOnce;
      message.message = {
        ...message.message.viewOnceMessage.message,
      };
    }
    let mtype = Object.keys(message.message)[0];
    let content = await generateForwardMessageContent(message, forceForward);
    let ctype = Object.keys(content)[0];
    let context = {};
    if (mtype != "conversation") context = message.message[mtype].contextInfo;
    content[ctype].contextInfo = {
      ...context,
      ...content[ctype].contextInfo,
    };
    const waMessage = await generateWAMessageFromContent(
      jid,
      content,
      options
        ? {
            ...content[ctype],
            ...options,
            ...(options.contextInfo
              ? {
                  contextInfo: {
                    ...content[ctype].contextInfo,
                    ...options.contextInfo,
                  },
                }
              : {}),
          }
        : {}
    );
    await DimzBot.relayMessage(jid, waMessage.message, {
      messageId: waMessage.key.id,
    });
    return waMessage;
  };

  DimzBot.downloadAndSaveMediaMessage = async (
    message,
    filename,
    attachExtension = true
  ) => {
    let quoted = message.msg ? message.msg : message;
    let mime = (message.msg || message).mimetype || "";
    let messageType = message.mtype
      ? message.mtype.replace(/Message/gi, "")
      : mime.split("/")[0];
    const stream = await downloadContentFromMessage(quoted, messageType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }
    let type = await FileType.fromBuffer(buffer);

    let trueFileName;

    if (type.ext == "ogg" || type.ext == "opus") {
      trueFileName = attachExtension ? filename + ".mp3" : filename;
      await fs.writeFileSync(trueFileName, buffer);
    } else {
      trueFileName = attachExtension ? filename + "." + type.ext : filename;
      await fs.writeFileSync(trueFileName, buffer);
    }
    return trueFileName;
  };

  DimzBot.downloadMediaMessage = async (message) => {
    let mime = (message.msg || message).mimetype || "";
    let messageType = message.mtype
      ? message.mtype.replace(/Message/gi, "")
      : mime.split("/")[0];
    const stream = await downloadContentFromMessage(message, messageType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }
    return buffer;
  };

  DimzBot.getFile = async (PATH, save) => {
    let res;
    let data = Buffer.isBuffer(PATH)
      ? PATH
      : /^data:.*?\/.*?;base64,/i.test(PATH)
        ? Buffer.from(PATH.split`,`[1], "base64")
        : /^https?:\/\//.test(PATH)
          ? await (res = await getBuffer(PATH))
          : fs.existsSync(PATH)
            ? ((filename = PATH), fs.readFileSync(PATH))
            : typeof PATH === "string"
              ? PATH
              : Buffer.alloc(0);
    let type = (await FileType.fromBuffer(data)) || {
      mime: "application/octet-stream",
      ext: ".bin",
    };
    filename = path.join(__filename, "./lib" + new Date() * 1 + "." + type.ext);
    if (data && save) fs.promises.writeFile(filename, data);
    return {
      res,
      filename,
      size: await getSizeMedia(data),
      ...type,
      data,
    };
  };

  DimzBot.sendText = (jid, text, quoted = "", options) =>
    DimzBot.sendMessage(
      jid,
      {
        text: text,
        ...options,
      },
      {
        quoted,
      }
    );

  DimzBot.serializeM = (m) => smsg(DimzBot, m, store);

  DimzBot.sendKatalog = async (
    jid,
    title = "",
    desc = "",
    gam,
    options = {}
  ) => {
    let message = await prepareWAMessageMedia(
      {
        image: gam,
      },
      {
        upload: DimzBot.waUploadToServer,
      }
    );
    const tod = generateWAMessageFromContent(
      jid,
      {
        productMessage: {
          product: {
            productImage: message.imageMessage,
            productId: "9999",
            title: title,
            description: desc,
            currencyCode: "IDR",
            priceAmount1000: "100000",
            url: `${websitex}`,
            productImageCount: 1,
            salePriceAmount1000: "0",
          },
          businessOwnerJid: `${ownernumber}@s.whatsapp.net`,
        },
      },
      options
    );
    return DimzBot.relayMessage(jid, tod.message, {
      messageId: tod.key.id,
    });
  };

  DimzBot.sendButImg = async (jid, path, teks, fke, but) => {
    let img = Buffer.isBuffer(path)
      ? path
      : /^data:.*?\/.*?;base64,/i.test(path)
        ? Buffer.from(path.split`,`[1], "base64")
        : /^https?:\/\//.test(path)
          ? await await getBuffer(path)
          : fs.existsSync(path)
            ? fs.readFileSync(path)
            : Buffer.alloc(0);
    let fjejfjjjer = {
      image: img,
      jpegThumbnail: img,
      caption: teks,
      fileLength: "1",
      footer: fke,
      buttons: but,
      headerType: 4,
    };
    DimzBot.sendMessage(jid, fjejfjjjer, {
      quoted: m,
    });
  };

  /**
   * Send Media/File with Automatic Type Specifier
   * @param {String} jid
   * @param {String|Buffer} path
   * @param {String} filename
   * @param {String} caption
   * @param {import('@whiskeysockets/baileys').proto.WebMessageInfo} quoted
   * @param {Boolean} ptt
   * @param {Object} options
   */
  DimzBot.sendFile = async (
    jid,
    path,
    filename = "",
    caption = "",
    quoted,
    ptt = false,
    options = {}
  ) => {
    let type = await DimzBot.getFile(path, true);
    let { res, data: file, filename: pathFile } = type;
    if ((res && res.status !== 200) || file.length <= 65536) {
      try {
        throw {
          json: JSON.parse(file.toString()),
        };
      } catch (e) {
        if (e.json) throw e.json;
      }
    }
    const fileSize = fs.statSync(pathFile).size / 1024 / 1024;
    if (fileSize >= 1800) throw new Error(" The file size is too large\n\n");
    let opt = {};
    if (quoted) opt.quoted = quoted;
    if (!type) options.asDocument = true;
    let mtype = "",
      mimetype = options.mimetype || type.mime,
      convert;
    if (
      /webp/.test(type.mime) ||
      (/image/.test(type.mime) && options.asSticker)
    )
      mtype = "sticker";
    else if (
      /image/.test(type.mime) ||
      (/webp/.test(type.mime) && options.asImage)
    )
      mtype = "image";
    else if (/video/.test(type.mime)) mtype = "video";
    else if (/audio/.test(type.mime))
      ((convert = await toAudio(file, type.ext)),
        (file = convert.data),
        (pathFile = convert.filename),
        (mtype = "audio"),
        (mimetype = options.mimetype || "audio/mpeg; codecs=mp3"));
    else mtype = "document";
    if (options.asDocument) mtype = "document";

    delete options.asSticker;
    delete options.asLocation;
    delete options.asVideo;
    delete options.asDocument;
    delete options.asImage;

    let message = {
      ...options,
      caption,
      ptt,
      [mtype]: {
        url: pathFile,
      },
      mimetype,
      fileName: filename || pathFile.split("/").pop(),
    };
    /**
     * @type {import('@whiskeysockets/baileys').proto.WebMessageInfo}
     */
    let m;
    try {
      m = await DimzBot.sendMessage(jid, message, {
        ...opt,
        ...options,
      });
    } catch (e) {
      console.error(e);
      m = null;
    } finally {
      if (!m)
        m = await DimzBot.sendMessage(
          jid,
          {
            ...message,
            [mtype]: file,
          },
          {
            ...opt,
            ...options,
          }
        );
      file = null; // releasing the memory
      return m;
    }
  };

  DimzBot.sendFile = async (jid, media, options = {}) => {
    let file = await DimzBot.getFile(media);
    let mime = file.ext,
      type;

    // Tentukan tipe file berdasarkan ekstensi
    if (mime == "mp3") {
      type = "audio";
      options.mimetype = "audio/mpeg";
      options.ptt = options.ptt || false;
    } else if (mime == "jpg" || mime == "jpeg" || mime == "png") {
      type = "image";
    } else if (mime == "webp") {
      type = "sticker";
    } else if (mime == "mp4") {
      type = "video";
    } else {
      type = "document";
    }

    return DimzBot.sendMessage(
      jid,
      {
        [type]: file.data,
        caption: options.caption || "",
        ...options,
      },
      {
        quoted: options.quoted || "",
        ...options,
      }
    );
  };

  DimzBot.sendFileUrl = async (jid, url, caption, quoted, options = {}) => {
    let mime = "";
    let res = await axios.head(url);
    mime = res.headers["content-type"];
    if (mime.split("/")[1] === "gif") {
      return DimzBot.sendMessage(
        jid,
        {
          video: await getBuffer(url),
          caption: caption,
          gifPlayback: true,
          ...options,
        },
        {
          quoted: quoted,
          ...options,
        }
      );
    }
    let type = mime.split("/")[0] + "Message";
    if (mime === "application/pdf") {
      return DimzBot.sendMessage(
        jid,
        {
          document: await getBuffer(url),
          mimetype: "application/pdf",
          caption: caption,
          ...options,
        },
        {
          quoted: quoted,
          ...options,
        }
      );
    }
    if (mime.split("/")[0] === "image") {
      return DimzBot.sendMessage(
        jid,
        {
          image: await getBuffer(url),
          caption: caption,
          ...options,
        },
        {
          quoted: quoted,
          ...options,
        }
      );
    }
    if (mime.split("/")[0] === "video") {
      return DimzBot.sendMessage(
        jid,
        {
          video: await getBuffer(url),
          caption: caption,
          mimetype: "video/mp4",
          ...options,
        },
        {
          quoted: quoted,
          ...options,
        }
      );
    }
    if (mime.split("/")[0] === "audio") {
      return DimzBot.sendMessage(
        jid,
        {
          audio: await getBuffer(url),
          caption: caption,
          mimetype: "audio/mpeg",
          ...options,
        },
        {
          quoted: quoted,
          ...options,
        }
      );
    }
  };

  /**
   *
   * @param {*} jid
   * @param {*} name
   * @param [*] values
   * @returns
   */
  /**
   * @typedef Media
   * @prop {"image"|"video"|"document"} type
   * @prop {buffer|{ url: string }} data
   * @prop {{}} [options]
   */
  /**
   * @typedef Button
   * @prop {"single_select"|"quick_reply"|"cta_url"|"cta_call"|"cta_copy"|"cta_reminder"|"cta_cancel_reminder"|"address_message"|"send_location"} type
   * @prop {string} [title] single_select use this
   * @prop {Section[]} [sections]
   * @prop {string} [display_text] quick_reply, cta_reminder, cta_cancel_reminder, address_message, cta_call, cta_url, cta_copy use this
   * @prop {string} [id] quick_reply, cta_reminder, cta_cancel_reminder, address_message use this
   * @prop {string} [phone_number] cta_call use this
   * @prop {string} [url] cta_url use this
   * @prop {string} [merchant_url] cta_url use this
   * @prop {string} [copy_code] cta_copy use this
   */
  /**
   * @typedef Section
   * @prop {string} title
   * @prop {string} highlight_label
   * @prop {Row[]} rows
   */
  /**
   * @typedef Row
   * @prop {string} header
   * @prop {string} title
   * @prop {string} description
   * @prop {string} id
   */

  /**
   * Function to send interactiveMessage
   *
   * @param {string} jid
   * @param {string} body
   * @param {string} [footer]
   * @param {string} title
   * @param {string} [subtitle]
   * @param {Media} [media]
   * @param {Button[]} buttons
   * @param {proto.WebMessageInfo} [quoted]
   * @param {{}} [options={}]
   * @returns {Promise<proto.WebMessageInfo>}
   */
  DimzBot.sendInteractiveMessage = async function (
    jid,
    body,
    footer,
    title,
    subtitle,
    media,
    buttons,
    quoted,
    options = {}
  ) {
    // ### Start of validation ###
    if (type(jid) !== "String")
      throw TypeError(`jid only accepts String, type given: ${type(jid)}`);
    if (type(body) !== "String")
      throw TypeError(`body only accepts String, type given: ${type(body)}`);
    if (footer && type(footer) !== "String")
      throw TypeError(
        `footer only accepts String, type given: ${type(footer)}`
      );
    if (type(title) !== "String")
      throw TypeError(`title only accepts String, type given: ${type(title)}`);
    if (subtitle && type(subtitle) !== "String")
      throw TypeError(
        `subtitle only accepts String, type given: ${type(subtitle)}`
      );
    if (media && type(media) !== "Object")
      throw TypeError(`media only accepts Object, type given: ${type(media)}`);
    if (!Array.isArray(buttons))
      throw TypeError(
        `buttons only accepts Array, type given: ${type(buttons)}`
      );
    if (
      quoted &&
      type(quoted) !== "Object" &&
      type(quoted) !== "WebMessageInfo" &&
      type(quoted) !== "Message"
    )
      throw TypeError(
        `quoted only accepts Object, WebMessageInfo, and Message, type given: ${type(quoted)}`
      );
    if (options && type(options) !== "Object")
      throw TypeError(
        `options only accepts Object, type given: ${type(options)}`
      );

    if (media) {
      if (type(media.type) !== "String")
        throw new TypeError(
          `media.type only accepts String, type given: ${type(media.type)}`
        );
      if (type(media.data) !== "Buffer" && type(media.data) !== "Object")
        throw new TypeError(
          `media.data only accepts Buffer or Object, type given: ${type(media.data)}`
        );
      if (media.options && type(media.options) !== "Object")
        throw new TypeError(
          `media.options only accepts Object, type given: ${type(media.type)}`
        );
      if (!isStringSame(media.type, ["image", "video", "document"]))
        throw new TypeError(
          `media.type only accepts image, video, or document. Value given: ${media.type}`
        );
      if (!media.data?.url && type(media.data) !== "Buffer")
        throw new TypeError(
          `media.data only accepts Buffer or Object with url key, type given: ${type(media.data)}`
        );
    }
    for (const i in buttons) {
      const button = buttons[i];
      if (type(button.type) !== "String")
        throw new TypeError(
          `buttons[${i}].type only accepts String, type given: ${type(button.type)}`
        );
      if (!isStringSame(button.type, buttonTypes))
        throw new TypeError(
          `buttons[${i}].type is not supported. Type given: ${button.type}`
        );

      switch (button.type) {
        default: {
          throw new Error("wait... how is that possible??");
        }

        case "single_select": {
          if (type(button.title) !== "String")
            throw new TypeError(
              `buttons[${i}].title only accepts String, type given: ${type(button.title)}`
            );
          if (type(button.sections) !== "Array")
            throw new TypeError(
              `buttons[${i}].sections only accepts Array, type given: ${type(button.sections)}`
            );
          for (const ii in button.sections) {
            if (type(button.sections[ii].title) !== "String")
              throw new TypeError(
                `buttons[${i}].sections[${ii}].title only accepts String, type given: ${type(button.sections[ii].title)}`
              );
            if (type(button.sections[ii].highlight_label) !== "String")
              throw new TypeError(
                `buttons[${i}].sections[${ii}].highlight_label only accepts String, type given: ${type(button.sections[ii].highlight_label)}`
              );
            if (type(button.sections[ii].rows) !== "Array")
              throw new TypeError(
                `buttons[${i}].sections[${ii}].rows only accepts Array, type given: ${type(button.sections[ii].rows)}`
              );
            for (const iii in button.sections[ii].rows) {
              if (type(button.sections[ii].rows[iii].header) !== "String")
                throw new TypeError(
                  `buttons[${i}].rows[iii].sections[${ii}].rows[iii].header only accepts String, type given: ${type(button.sections[ii].rows[iii].header)}`
                );
              if (type(button.sections[ii].rows[iii].title) !== "String")
                throw new TypeError(
                  `buttons[${i}].rows[iii].sections[${ii}].rows[iii].title only accepts String, type given: ${type(button.sections[ii].rows[iii].title)}`
                );
              if (type(button.sections[ii].rows[iii].description) !== "String")
                throw new TypeError(
                  `buttons[${i}].rows[iii].sections[${ii}].rows[iii].description only accepts String, type given: ${type(button.sections[ii].rows[iii].description)}`
                );
              if (type(button.sections[ii].rows[iii].id) !== "String")
                throw new TypeError(
                  `buttons[${i}].rows[iii].sections[${ii}].rows[iii].id only accepts String, type given: ${type(button.sections[ii].rows[iii].id)}`
                );
            }
          }
          break;
        }
        case "quick_reply":
        case "cta_reminder":
        case "cta_cancel_reminder":
        case "address_message": {
          if (type(button.display_text) !== "String")
            throw new TypeError(
              `buttons[${i}].display_text only accepts String, type given: ${type(button.display_text)}`
            );
          if (type(button.id) !== "String")
            throw new TypeError(
              `buttons[${i}].id only accepts String, type given: ${type(button.id)}`
            );
          break;
        }
        case "cta_call": {
          if (type(button.display_text) !== "String")
            throw new TypeError(
              `buttons[${i}].display_text only accepts String, type given: ${type(button.display_text)}`
            );
          if (type(button.phone_number) !== "String")
            throw new TypeError(
              `buttons[${i}].phone_number only accepts String, type given: ${type(button.phone_number)}`
            );
          break;
        }
        case "cta_url": {
          if (type(button.display_text) !== "String")
            throw new TypeError(
              `buttons[${i}].display_text only accepts String, type given: ${type(button.display_text)}`
            );
          if (type(button.url) !== "String")
            throw new TypeError(
              `buttons[${i}].url only accepts String, type given: ${type(button.url)}`
            );
          if (type(button.merchant_url) !== "String")
            throw new TypeError(
              `buttons[${i}].merchant_url only accepts String, type given: ${type(button.merchant_url)}`
            );
          break;
        }
        case "cta_copy": {
          if (type(button.display_text) !== "String")
            throw new TypeError(
              `buttons[${i}].display_text only accepts String, type given: ${type(button.display_text)}`
            );
          if (type(button.copy_code) !== "String")
            throw new TypeError(
              `buttons[${i}].copy_code only accepts String, type given: ${type(button.copy_code)}`
            );
          break;
        }
        case "send_location": {
          break;
        }
      }
    }
    if (buttons.length > 10) throw new RangeError("maximum is 10 buttons");
    // ### End of validation ###

    // ### Start of sending message ###
    const msg = baileys.generateWAMessageFromContent(
      jid,
      {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2,
            },
            interactiveMessage: proto.Message.InteractiveMessage.fromObject({
              body: proto.Message.InteractiveMessage.Body.fromObject({
                text: body,
              }),
              footer: proto.Message.InteractiveMessage.Footer.fromObject({
                text: footer,
              }),
              header: proto.Message.InteractiveMessage.Header.fromObject({
                title,
                subtitle,
                hasMediaAttachment: !!media,
                ...(media
                  ? await baileys.generateWAMessageContent(
                      {
                        [media.type]: media.data,
                        ...(media.options || {}),
                      },
                      {
                        upload: DimzBot.waUploadToServer,
                      }
                    )
                  : {}),
              }),
              nativeFlowMessage:
                proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                  buttons: buttons.map((v) => {
                    const { type } = v;
                    delete v.type;
                    return {
                      name: type,
                      buttonParamsJson: JSON.stringify(v),
                    };
                  }),
                }),
              contextInfo: {
                mentionedJid: options.mentions || [],
                ...options.contextInfo,
                ...(quoted
                  ? {
                      stanzaId: quoted.key.id,
                      remoteJid: quoted.key.remoteJid,
                      participant:
                        quoted.keyparticipantPn || quoted.key.remoteJid,
                      fromMe: quoted.key.fromMe,
                      quotedMessage: quoted.message,
                    }
                  : {}),
              },
            }),
          },
        },
      },
      {}
    );
    await DimzBot.relayMessage(msg.key.remoteJid, msg.message, {});
    // ### End of sending message ###

    return msg;
  };

  DimzBot.sendListMessage = async function (
    jid,
    text,
    footer,
    title,
    media,
    buttonText,
    content,
    quoted,
    options
  ) {
    const buttons = [
      {
        type: "single_select",
        title: buttonText,
        sections: content.map((i) => ({
          title: i[0],
          highlight_label: "",
          rows: i[1].map((ii) => ({
            header: ii.header || "",
            title: ii.title || "",
            description: ii.description || "",
            id: ii.id,
          })),
        })),
      },
    ];
    return await DimzBot.sendInteractiveMessage(
      jid,
      text,
      footer,
      title,
      "",
      media,
      buttons,
      quoted,
      options
    );
  };

  cron.schedule("0 */2 * * *", () => {
    console.log(
      `${chalk.red.bold("[ SYSTEM ]")} ${chalk.yellowBright.bgRed.bold("Membersihkan cache & store")}`
    );
    msgRetryCounterCache.flushAll();
    const threeHours = 1000 * 60 * 60 * 3;
    const now = Date.now();

    let deletedTotal = 0;
    for (const [jid, msgs] of store.messages) {
      for (const [key, msg] of msgs) {
        const ts = msg.messageTimestamp?.low * 1000 || 0;
        if (now - ts > threeHours) {
          msgs.delete(key);
          deletedTotal++;
        }
      }
    }

    if (deletedTotal > 0) {
      console.log(
        `🧹 Berhasil hapus ${deletedTotal} pesan lama dari store: ${deletedTotal} pesan`
      );
    }
  });

  return DimzBot;
}

DimzBotzz();

process.on("uncaughtException", function (err) {
  console.error("Caught exception: ", err);
});

// === Auto Reload ===
const file = require.resolve("./DimasBotzz");
fs.watchFile(file, () => {
  delete require.cache[file];
  require(file);
});
