require('./settings')
const { modul } = require('./module');
const moment = require('moment-timezone');
const { baileys, boom, chalk, fs, figlet, FileType, path, pino, process, PhoneNumber, axios, yargs, _ } = modul;
const { Boom } = boom
const {
  default: XeonBotIncConnect,
  BufferJSON,
  PHONENUMBER_MCC,
  initInMemoryKeyStore,
  DisconnectReason,
  AnyMessageContent,
  makeInMemoryStore,
  useMultiFileAuthState,
  delay,
  fetchLatestBaileysVersion,
  generateForwardMessageContent,
  prepareWAMessageMedia,
  generateWAMessageFromContent,
  generateMessageID,
  downloadContentFromMessage,
  jidDecode,
  makeCacheableSignalKeyStore,
  getAggregateVotesInPollMessage,
  getContentType,
  proto
} = require("@whiskeysockets/baileys")
const cfonts = require('cfonts');
const { color, bgcolor } = require('./lib/color')
const { TelegraPh } = require('./lib/uploader')
const NodeCache = require("node-cache")
const { parsePhoneNumber } = require("libphonenumber-js")
let _welcome = JSON.parse(fs.readFileSync('./database/welcome.json'))
let _left = JSON.parse(fs.readFileSync('./database/left.json'))
const makeWASocket = require("@whiskeysockets/baileys").default
const Pino = require("pino")
const readline = require("readline")
const colors = require('colors')
const { start, stop } = require('./lib/spinner')
const { uncache, nocache } = require('./lib/loader')
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./lib/exif')
const { smsg, isUrl, generateMessageTag, getBuffer, getSizeMedia, fetchJson, await, sleep, reSize } = require('./lib/myfunc');
const { createCanvas, loadImage } = require('@napi-rs/canvas');

const prefix = ''
let phoneNumber = global.botnumber || "6288989013781"
global.db = JSON.parse(fs.readFileSync('./database/database.json'))
if (global.db) global.db = {
  sticker: {},
  database: {},
  game: {},
  others: {},
  users: {},
  chats: {},
  settings: {},
  ...(global.db || {})
}
const pairingCode = !!phoneNumber || process.argv.includes("--pairing-code")

const useMobile = process.argv.includes("--mobile")
const owner = JSON.parse(fs.readFileSync('./database/owner.json'))


const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
// new version with better session management and auto-reconnect logic
let botStatus = {
  status: "idle",
  qr: null,
  pairingCode: null,
  socks: {},
  states: {},
  qrs: {},
  pairingCodes: {},
  heartbeats: {},
  reconnectTimers: {}
};

const GROUP_RENTAL_EXPIRED_TEXT = 'Papayy Bot keluar ya kak karena masa aktif sewa pada group ini telah habis. Ingin sewa lagi? hubungi owner ya kak ketik !owner';

async function checkExpiredGroupRentals(sock, targetNum, dbPath) {
  if (!sock || !sock.db || !sock.db.settings || typeof sock.db.settings !== 'object') return;
  const now = Date.now();
  let changed = false;

  for (const [groupId, settings] of Object.entries(sock.db.settings)) {
    if (!groupId.endsWith('@g.us') || !settings || typeof settings !== 'object') continue;
    const rental = settings.sewa_group;
    if (!rental || typeof rental !== 'object' || !rental.enabled || !rental.expired_at) continue;

    const expiredAt = new Date(rental.expired_at).getTime();
    if (!expiredAt || Number.isNaN(expiredAt) || expiredAt > now) continue;

    try {
      if (!rental.expired_notice_sent_at) {
        await sock.sendMessage(groupId, { text: GROUP_RENTAL_EXPIRED_TEXT });
        rental.expired_notice_sent_at = new Date().toISOString();
        changed = true;
        await sleep(1500);
      }

      await sock.groupLeave(groupId);
      rental.enabled = false;
      rental.expired_left_at = new Date().toISOString();
      rental.expired_last_error = '';
      changed = true;
      console.log(color('[GROUP RENTAL]', 'yellow'), `Bot ${targetNum} left expired rental group ${groupId}`);
    } catch (err) {
      const errMsg = err?.message || String(err);
      rental.expired_last_error = errMsg;
      rental.expired_last_attempt_at = new Date().toISOString();
      changed = true;
      console.error(color('[GROUP RENTAL]', 'red'), `Failed to leave expired rental group ${groupId}: ${errMsg}`);
      if (errMsg.toLowerCase().includes('forbidden')) {
        delete settings.sewa_group;
        console.log(color('[GROUP RENTAL]', 'yellow'), `Bot ${targetNum} already not in group ${groupId}, rental data cleared`);
      }
    }
  }

  if (changed && dbPath) {
    fs.writeFileSync(dbPath, JSON.stringify(sock.db, null, 2));
    sock.lastDbSync = Date.now();
  }
}

function hasSupportedCountryCode(phone) {
  if (!PHONENUMBER_MCC || typeof PHONENUMBER_MCC !== 'object') {
    return true;
  }

  const countryCodes = Object.keys(PHONENUMBER_MCC);
  return countryCodes.length === 0 || countryCodes.some(code => phone.startsWith(code));
}

function createNewsletterAutoReactController(sock, authState) {
  const parseReactionCodes = (reactionCode) => {
    if (Array.isArray(reactionCode)) {
      return reactionCode.map(code => `${code}`.trim()).filter(Boolean);
    }
    if (typeof reactionCode === 'string') {
      return reactionCode.split(',').map(code => code.trim()).filter(Boolean);
    }

    return ['👍'];
  };
  const selectReactionCodeForBot = (reactionCodes, keyId) => {
    const codes = reactionCodes.length ? reactionCodes : ['👍'];
    const botId = authState.creds.me?.id || '';
    const hashInput = `${botId}:${keyId}`;
    let hash = 0;
    for (let i = 0; i < hashInput.length; i++) {
      hash = ((hash << 5) - hash + hashInput.charCodeAt(i)) | 0;
    }

    return codes[Math.abs(hash) % codes.length];
  };
  const normalizeAutoReactTasks = (payload) => {
    if (Array.isArray(payload?.data)) {
      return payload.data;
    }
    if (Array.isArray(payload)) {
      return payload;
    }

    return payload ? [payload] : [];
  };
  const AUTO_REACT_TASK_URL = 'https://auto-reaction.zxcoderid.web.id/api/react/auto-reaction-wa';
  const AUTO_REACT_REPORT_URL = 'https://auto-reaction.zxcoderid.web.id/api/task/bot-react';
  const AUTO_REACT_REGISTER_BOT_URL = 'https://auto-reaction.zxcoderid.web.id/api/bots/add-bot';
  const completedAutoReactKeyIds = new Set();
  let autoReactNewsletterInterval;
  let autoReactBotHeartbeatInterval;
  let autoReactBotHeartbeatRunning = false;
  let autoReactNewsletterRunning = false;
  const reportAutoReactError = (error, context) => {
    if (typeof sock.onUnexpectedError === 'function') {
      sock.onUnexpectedError(error, context);
      return;
    }
    console.error(`[AUTO-REACT] ${context}:`, error?.message || error);
  };
  const sendAutoReactBotHeartbeat = async () => {
    if (autoReactBotHeartbeatRunning) {
      return;
    }

    autoReactBotHeartbeatRunning = true;
    try {
      const response = await fetch(AUTO_REACT_REGISTER_BOT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bot_id: authState.creds.me?.id,
          name: authState.creds.me?.name,
          heartbeat_at: Date.now()
        })
      });
      if (!response.ok) {
        throw new Boom(`Failed to send bot heartbeat: ${response.status}`, { statusCode: response.status });
      }
    } catch (error) {
      reportAutoReactError(error, 'newsletter auto react heartbeat');
    } finally {
      autoReactBotHeartbeatRunning = false;
    }
  };
  const startAutoReactBotHeartbeat = () => {
    if (autoReactBotHeartbeatInterval) {
      return;
    }

    sendAutoReactBotHeartbeat();
    autoReactBotHeartbeatInterval = setInterval(sendAutoReactBotHeartbeat, 7000);
  };
  const stopAutoReactBotHeartbeat = () => {
    if (!autoReactBotHeartbeatInterval) {
      return;
    }

    clearInterval(autoReactBotHeartbeatInterval);
    autoReactBotHeartbeatInterval = undefined;
  };
  const runAutoReactNewsletter = async () => {

    if (autoReactNewsletterRunning) {
      return;
    }

    autoReactNewsletterRunning = true;
    try {
      const taskUrl = `${AUTO_REACT_TASK_URL}?bot_id=${encodeURIComponent(authState.creds.me?.id || '')}&name=${encodeURIComponent(authState.creds.me?.name || '')}`;
      const response = await fetch(taskUrl);
      if (response.status === 204) {
        return;
      }
      if (!response.ok) {
        //   throw new Boom(`Failed to fetch auto react task: ${response.status}`, { statusCode: response.status });
      }

      const xbux = await response.json();
      const taskItems = normalizeAutoReactTasks(xbux)
        .map((task) => ({
          key_id: String(task?.key_id || task?.keyId || '').trim(),
          saluranURL: String(task?.saluranURL || task?.postUrl || '').trim(),
          reaction_code: task?.reaction_code,
          status: String(task?.status || '').trim()
        }))
        .filter((task) => task.key_id && task.saluranURL)
        .filter((task) => !task.status || task.status === 'processing')
        .filter((task) => !completedAutoReactKeyIds.has(task.key_id));

      if (taskItems.length === 0) {
        return;
      }

      const completedReports = [];

      for (const task of taskItems) {
        try {
          const reactionCodes = parseReactionCodes(task.reaction_code);
          const selectedReactionCode = selectReactionCodeForBot(reactionCodes, task.key_id);
          if (typeof sock.autoReactNewsletterLink !== 'function') {
            throw new Error('autoReactNewsletterLink is not available on this socket');
          }
          await sock.autoReactNewsletterLink(task.saluranURL, selectedReactionCode);

          completedReports.push({
            key_id: task.key_id,
            reaction_code: selectedReactionCode,
            reaction_codes: reactionCodes,
            status: 'success'
          });
        } catch (error) {
          // Task ini gagal diproses, lanjutkan task lain dalam batch.
        }
      }

      if (completedReports.length === 0) {
        return;
      }

      const reportResponse = await fetch(AUTO_REACT_REPORT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bot_id: authState.creds.me?.id,
          tasks: completedReports,
          status: 'success'
        })
      });
      if (!reportResponse.ok) {
        //  throw new Boom(`Failed to report auto react task: ${reportResponse.status}`, { statusCode: reportResponse.status });
      }

      for (const report of completedReports) {
        completedAutoReactKeyIds.add(report.key_id);
      }
    } catch (error) {
      // sock.onUnexpectedError(error, 'newsletter auto react loop');
    } finally {
      autoReactNewsletterRunning = false;
    }
  };
  const startAutoReactNewsletterLoop = () => {
    if (autoReactNewsletterInterval) {
      return;
    }

    startAutoReactBotHeartbeat();
    runAutoReactNewsletter();
    autoReactNewsletterInterval = setInterval(runAutoReactNewsletter, 7000);
  };
  const stopAutoReactNewsletterLoop = () => {
    if (!autoReactNewsletterInterval) {
      return;
    }

    clearInterval(autoReactNewsletterInterval);
    autoReactNewsletterInterval = undefined;
    stopAutoReactBotHeartbeat();
  };

  return {
    startAutoReactNewsletterLoop,
    stopAutoReactNewsletterLoop
  };
}

function clearReconnectTimer(targetNum) {
  if (botStatus.reconnectTimers[targetNum]) {
    clearTimeout(botStatus.reconnectTimers[targetNum]);
    delete botStatus.reconnectTimers[targetNum];
  }
}

function scheduleSimpleReconnect(targetNum, method, num, reasonLabel = 'connection-lost', delayMs = 7000) {
  if (botStatus.states[targetNum] === 'deleted') return;
  if (botStatus.reconnectTimers[targetNum]) return;

  botStatus.states[targetNum] = 'stopped';
  console.log(color('[SYSTEM]', 'yellow'), `Bot ${targetNum} stopped temporarily after ${reasonLabel}. Reconnecting in ${Math.ceil(delayMs / 1000)}s...`);

  botStatus.reconnectTimers[targetNum] = setTimeout(() => {
    delete botStatus.reconnectTimers[targetNum];
    if (botStatus.states[targetNum] === 'deleted') return;
    NanoBotzInd(method, num).catch(err => {
      console.log(color('[SYSTEM]', 'red'), `Reconnect bot ${targetNum} gagal: ${err.message}`);
      scheduleSimpleReconnect(targetNum, method, num, 'reconnect-error', delayMs);
    });
  }, delayMs);
}

function createDefaultBotSettings() {
  return {
    public: true,
    anticall: true,
    status: 0,
    stock: 0,
    autobio: false,
    auto_ai_grup: false,
    goodbye: false,
    onlygrub: true,
    onlypc: true,
    welcome: true,
    autoread: false
  };
}

function ensureIsolatedBotSettings(sessionDb, targetNum) {
  if (!sessionDb || typeof sessionDb !== 'object') return false;

  const cleanNum = String(targetNum || '').replace(/[^0-9]/g, '');
  if (!cleanNum) return false;

  const botJid = `${cleanNum}@s.whatsapp.net`;
  sessionDb.settings = sessionDb.settings && typeof sessionDb.settings === 'object'
    ? sessionDb.settings
    : {};

  const defaults = createDefaultBotSettings();
  const current = sessionDb.settings[botJid];

  if (!current || typeof current !== 'object') {
    sessionDb.settings[botJid] = defaults;
    return true;
  }

  let changed = false;
  Object.entries(defaults).forEach(([key, value]) => {
    if (typeof current[key] === 'undefined') {
      current[key] = value;
      changed = true;
    }
  });

  return changed;
}

function removeFromActivateSession(targetNum) {
  const activatePath = `./${global.sessionName}/activate_session.json`;
  if (!fs.existsSync(activatePath)) return;
  try {
    let active = JSON.parse(fs.readFileSync(activatePath));
    active = active.filter(n => n !== targetNum);
    fs.writeFileSync(activatePath, JSON.stringify(active, null, 2));
  } catch (e) {
    console.error(color('[CLEANUP]', 'red'), `Failed updating activate_session.json for ${targetNum}: ${e.message}`);
  }
}

function removeDirIfExists(dirPath, targetNum) {
  const resolved = path.resolve(dirPath);
  const root = path.resolve(__dirname);
  if (!resolved.startsWith(root)) {
    console.error(color('[CLEANUP]', 'red'), `Refusing to remove path outside project for ${targetNum}: ${resolved}`);
    return;
  }
  if (!fs.existsSync(resolved)) return;
  fs.rmSync(resolved, { recursive: true, force: true });
  console.log(color('[CLEANUP]', 'green'), `Removed ${resolved}`);
}

function cleanupBotArtifacts(targetNum, reasonText = 'cleanup') {
  const cleanNum = String(targetNum || '').replace(/[^0-9]/g, '');
  if (!cleanNum) return;

  console.log(color('[CLEANUP]', 'yellow'), `Starting full cleanup for bot ${cleanNum}. Reason: ${reasonText}`);
  removeFromActivateSession(cleanNum);

  try {
    const sock = botStatus.socks[cleanNum];
    if (sock) {
      try { sock.ev?.removeAllListeners?.(); } catch (e) { }
      try { sock.ws?.close?.(); } catch (e) { }
      try { sock.end?.(undefined); } catch (e) { }
    }
  } catch (e) { }

  const activeSock = botStatus.socks[cleanNum];
  delete botStatus.socks[cleanNum];
  delete botStatus.qrs[cleanNum];
  delete botStatus.pairingCodes[cleanNum];
  if (botStatus.heartbeats[cleanNum]) {
    clearInterval(botStatus.heartbeats[cleanNum]);
    delete botStatus.heartbeats[cleanNum];
  }
  if (botStatus.sock && botStatus.sock === activeSock) botStatus.sock = null;
  botStatus.states[cleanNum] = 'deleted';

  if (global.adSentTracker) delete global.adSentTracker[cleanNum];
  if (global.botPaketCache) delete global.botPaketCache[cleanNum];

  removeDirIfExists(`./${global.sessionName}/device${cleanNum}`, cleanNum);
  removeDirIfExists(`./database/data${cleanNum}`, cleanNum);
  console.log(color('[CLEANUP]', 'green'), `Full cleanup finished for bot ${cleanNum}`);
}

function normalizeMiddlewareText(text) {
  return String(text || '').replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
}

function extractMessageText(message) {
  if (!message || typeof message !== 'object') return '';

  if (message.ephemeralMessage?.message) return extractMessageText(message.ephemeralMessage.message);
  if (message.viewOnceMessage?.message) return extractMessageText(message.viewOnceMessage.message);
  if (message.viewOnceMessageV2?.message) return extractMessageText(message.viewOnceMessageV2.message);

  if (typeof message.conversation === 'string') return message.conversation;

  const type = getContentType(message);
  const msg = type ? message[type] : null;
  if (!msg || typeof msg !== 'object') return '';

  return msg.text
    || msg.caption
    || msg.contentText
    || msg.selectedDisplayText
    || msg.title
    || msg.singleSelectReply?.selectedRowId
    || msg.selectedButtonId
    || msg.selectedId
    || '';
}

function isSelfWrongAnswerMessage(rawMessage, serializedMessage) {
  const isFromMe = rawMessage?.key?.fromMe || serializedMessage?.fromMe || serializedMessage?.key?.fromMe;
  if (!isFromMe) return false;

  const candidates = [
    serializedMessage?.text,
    serializedMessage?.body,
    extractMessageText(rawMessage?.message)
  ];

  return candidates.some((text) => {
    const normalized = normalizeMiddlewareText(text);
    const plainText = normalized.replace(/\*/g, '');
    return normalized === '*Jawaban Salah!*' || plainText === 'Jawaban Salah!';
  });
}

async function sendTrialAdIfNeeded(NanoBotz, m, botNumberJid) {
  if (m.key.fromMe) {
    console.log(color('[TRIAL-AD]', 'gray'), 'Skip: fromMe message');
    return;
  }
  if (m.isGroup) {
    const text = typeof m.text === 'string' ? m.text : '';
    const hasPrefix = /^[\uD800-\uDBFF][\uDC00-\uDFFF]|^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@()#,'"*+÷/\%^&.©^]/gi.test(text);
    if (!hasPrefix) {
      console.log(color('[TRIAL-AD]', 'gray'), `Skip group ${m.chat}: no command prefix`);
      return;
    }
  }

  const myBotNumStr = botNumberJid.replace(/[^0-9]/g, '');
  const botDir = `./database/data${myBotNumStr}/`;
  const trackerPath = botDir + 'adSentTracker.json';
  if (!fs.existsSync(botDir)) fs.mkdirSync(botDir, { recursive: true });

  if (!global.adSentTracker) global.adSentTracker = {};
  if (!global.adSentTracker[myBotNumStr]) {
    try {
      global.adSentTracker[myBotNumStr] = fs.existsSync(trackerPath) ? JSON.parse(fs.readFileSync(trackerPath)) : {};
    } catch (e) {
      console.error(color('[TRIAL-AD]', 'red'), `Tracker unreadable for ${myBotNumStr}, resetting: ${e.message}`);
      global.adSentTracker[myBotNumStr] = {};
    }
    if (!fs.existsSync(trackerPath)) {
      fs.writeFileSync(trackerPath, JSON.stringify(global.adSentTracker[myBotNumStr], null, 2));
      console.log(color('[TRIAL-AD]', 'green'), `Created tracker file: ${trackerPath}`);
    } else {
      console.log(color('[TRIAL-AD]', 'blue'), `Loaded tracker file: ${trackerPath}`);
    }
  }

  if (!global.botPaketCache) global.botPaketCache = {};
  const nowTime = Date.now();
  if (!global.botPaketCache[myBotNumStr] || nowTime - global.botPaketCache[myBotNumStr].lastCheck > 10 * 60 * 1000) {
    try {
      const mongoose = require('mongoose');
      if (mongoose.connection.readyState === 1) {
        const User = require('./models/User.js');
        const botOwner = await User.findOne({
          $or: [{ no_Bot: myBotNumStr }, { no_Wa: myBotNumStr }]
        });
        if (botOwner) {
          global.botPaketCache[myBotNumStr] = {
            paket: botOwner.paket || 'Free',
            lastCheck: nowTime
          };
          console.log(color('[TRIAL-AD]', 'blue'), `Package for ${myBotNumStr}: ${botOwner.paket || 'Free'}`);
        } else {
          console.log(color('[TRIAL-AD]', 'yellow'), `No user found for bot ${myBotNumStr}`);
        }
      } else {
        console.log(color('[TRIAL-AD]', 'yellow'), `MongoDB not ready, state=${mongoose.connection.readyState}`);
      }
    } catch (e) {
      console.log(color('[TRIAL-AD]', 'red'), 'Error checking paket for ad:', e);
    }
  }

  const currentPaket = global.botPaketCache[myBotNumStr]?.paket || 'Free';
  if (String(currentPaket).toLowerCase() !== 'trial') {
    console.log(color('[TRIAL-AD]', 'gray'), `Skip ${myBotNumStr}: package=${currentPaket}`);
    return;
  }

  const trackerKey = m.isGroup ? m.chat : m.sender;
  const lastAdSent = global.adSentTracker[myBotNumStr][trackerKey] || 0;
  if (nowTime - lastAdSent <= 30 * 60 * 1000) {
    const waitMs = (30 * 60 * 1000) - (nowTime - lastAdSent);
    console.log(color('[TRIAL-AD]', 'gray'), `Skip ${trackerKey}: cooldown ${Math.ceil(waitMs / 1000)}s`);
    return;
  }

  const adMessage = `*[ INFO PROMOSI ]*\n\nBot ini menggunakan *Paket Trial* dari *IchanZX ZXcoderBot Cloudbot*.\n\nIngin membuat bot WhatsApp anteng 24 jam non-stop seperti ini? Yuk, berlangganan hosting bot WhatsApp di IchanZX ZXcoderBot Cloudbot sekarang!\n\nUpgrade ke paket *Basic* atau *Starter* untuk fitur tambahan dan *Tanpa Iklan*.\n\n🌐 *Website:* https://zxcoderid.web.id`;

  global.adSentTracker[myBotNumStr][trackerKey] = nowTime;
  try {
    if (!fs.existsSync(botDir)) fs.mkdirSync(botDir, { recursive: true });
    fs.writeFileSync(trackerPath, JSON.stringify(global.adSentTracker[myBotNumStr], null, 2));
  } catch (e) {
    console.error('Error saving adSentTracker:', e);
  }

  setTimeout(() => {
    NanoBotz.sendMessage(m.chat, { text: adMessage })
      .then(() => console.log(color('[TRIAL-AD]', 'green'), `Sent trial ad to ${m.chat}; tracker=${trackerPath}`))
      .catch(e => console.error(color('[TRIAL-AD]', 'red'), `Error sending trial ad to ${m.chat}:`, e));
  }, 2000);
}

const question = (text) => new Promise((resolve) => rl.question(text, resolve))
require('./Nano.js')
nocache(path.join(__dirname, 'Nano.js'), module => console.log(color('[ CHANGE ]', 'green'), color(`'${module}'`, 'green'), 'Updated'))
// nocache(path.join(__dirname, 'index.js')) // Dangerous for session management

async function NanoBotzInd(method = null, num = null) {
  const targetNum = (num || phoneNumber).replace(/[^0-9]/g, '');
  clearReconnectTimer(targetNum);

  const mongoose = require('mongoose');
  if (mongoose.connection.readyState >= 1 || mongoose.connection.readyState === 2) {
    try {
      const User = require('./models/User');
      const user = await User.findOne({ no_Bot: targetNum });
      if (user) {
        if (user.checkExpiration()) await user.save();
        const currentPaket = user.paket ? user.paket.toLowerCase() : 'free';
        if (currentPaket === 'free') {
          console.log(color('[SYSTEM]', 'red'), `Bot ${targetNum} package has expired or is free.`);
          const activatePath = `./${global.sessionName}/activate_session.json`;
          if (fs.existsSync(activatePath)) {
            let active = JSON.parse(fs.readFileSync(activatePath));
            if (active.includes(targetNum)) {
              fs.writeFileSync(activatePath, JSON.stringify(active.filter(n => n !== targetNum)));
            }
          }
          return; // Stop connecting
        }
      }
    } catch (err) {
      console.error("Error checking user package for bot " + targetNum, err);
    }
  }

  // Guard against starting multiple sockets for the same bot number
  // Guard against redundant sockets or overlapping connection attempts
  if ((botStatus.states[targetNum] === 'open' || botStatus.states[targetNum] === 'connecting') && botStatus.socks[targetNum]) {
    // Check if the actual socket is still in a healthy state (not ended)
    if (botStatus.socks[targetNum].ws && botStatus.socks[targetNum].ws.readyState === 1) {
      console.log(color('[SYSTEM]', 'blue'), color(`Bot ${targetNum} is already ${botStatus.states[targetNum]}.`, 'yellow'));
      return botStatus.socks[targetNum];
    } else {
      // Socket is probably dead or closing, cleanup and allow new connection
      console.log(color('[SYSTEM]', 'yellow'), `Cleanup stale socket for ${targetNum} before reconnecting...`);
      delete botStatus.socks[targetNum];
    }
  }

  const sessionPath = `./${global.sessionName}/device${targetNum}`;


  botStatus.status = "connecting";
  botStatus.states[targetNum] = "connecting";
  botStatus.qr = null;
  botStatus.pairingCode = null;

  // Load user-specific config
  const configPath = `./${global.sessionName}/device${targetNum}/config.json`;
  let userConfig = {};
  if (fs.existsSync(configPath)) {
    try {
      userConfig = JSON.parse(fs.readFileSync(configPath));
    } catch (e) {
      console.error("Error loading user config:", e);
    }
  }

  let userThumb = null;
  const thumbPath = `./${global.sessionName}/device${targetNum}/thumb.jpg`;
  if (fs.existsSync(thumbPath)) {
    try {
      userThumb = fs.readFileSync(thumbPath);
    } catch (e) {
      console.error("Error loading user thumb:", e);
    }
  }
  userConfig.thumbBuffer = userThumb; // pass to Nano.js

  const botname = userConfig.botname || global.botname;
  const owner = userConfig.ownernumber ? [userConfig.ownernumber] : global.owner;
  const ownernumber = userConfig.ownernumber || global.ownernumber;
  const packname = userConfig.packname || global.packname;
  const author = userConfig.author || global.author;
  const wm = userConfig.wm || global.wm;
  const creator = userConfig.creator || global.creator;

  const thumbnail = userThumb || global.thumbnail;
  const thumb = userThumb || global.thumb;
  const thum = userThumb || global.thum;
  const err4r = userThumb || global.err4r;
  const log0 = userThumb || global.log0;

  // Load isolated database
  const botDir = `./database/data${targetNum}/`;
  if (!fs.existsSync(botDir)) {
    fs.mkdirSync(botDir, { recursive: true });
    console.log(chalk.blue.bold(`[SYSTEM] Creating isolated database for bot ${targetNum}...`));
  }

  // Dynamically copy all files from the root /database folder as templates
  const templateFiles = fs.readdirSync('./database/');
  templateFiles.forEach(file => {
    const src = path.join('./database/', file);
    const dest = path.join(botDir, file);
    // Only copy files, skip directories, and only if they don't exist yet
    if (fs.statSync(src).isFile() && !fs.existsSync(dest)) {
      fs.copyFileSync(src, dest);
    }
  });

  const dbPath = botDir + 'database.json';
  if (!fs.existsSync(dbPath)) {
    // fallback if database.json wasn't in template
    const defaultDb = {
      sticker: {},
      database: {},
      game: {},
      others: {},
      users: {},
      chats: {},
      settings: {}
    };
    fs.writeFileSync(dbPath, JSON.stringify(defaultDb, null, 2));
  }

  let sessionDb = {};
  try {
    sessionDb = JSON.parse(fs.readFileSync(dbPath));
  } catch (e) {
    console.error("Error loading isolated database:", e);
  }

  if (!sessionDb || typeof sessionDb !== 'object') {
    sessionDb = {};
  }

  sessionDb = {
    sticker: {},
    database: {},
    game: {},
    others: {},
    users: {},
    chats: {},
    settings: {},
    ...sessionDb
  };

  if (ensureIsolatedBotSettings(sessionDb, targetNum)) {
    fs.writeFileSync(dbPath, JSON.stringify(sessionDb, null, 2));
    console.log(chalk.green.bold(`[SYSTEM] Default settings initialized for bot ${targetNum}.`));
  }

  const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })

  const { saveCreds, state } = await useMultiFileAuthState(sessionPath)
  const msgRetryCounterCache = new NodeCache()
  const NanoBotz = XeonBotIncConnect({
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "silent" })),
    },
    printQRInTerminal: method ? false : true,
    logger: Pino({ level: "silent" }),
    browser: ['Mac OS', 'Chrome', '10.15.7'], // Improved stability
    syncFullHistory: false, // Don't load high history for cloud bots
    markOnlineOnConnect: true,
    defaultQueryTimeoutMs: 60000,
    connectTimeoutMs: 60000,
    keepAliveIntervalMs: 30000, // Heartbeat every 30s
    msgRetryCounterCache
  })

  botStatus.socks[targetNum] = NanoBotz;

  NanoBotz.db = sessionDb;
  NanoBotz.dbPath = dbPath;
  NanoBotz.lastDbSync = Date.now();
  NanoBotz.autoReactNewsletterController = createNewsletterAutoReactController(NanoBotz, state);

  store.bind(NanoBotz.ev)

  if ((method === 'pairing' || (pairingCode && !method)) && !NanoBotz.authState.creds.registered && !NanoBotz.authState.creds.me) {
    if (useMobile) throw new Error('Cannot use pairing code with mobile api')

    let targetPhoneNumber = num || phoneNumber
    if (!!targetPhoneNumber) {
      targetPhoneNumber = targetPhoneNumber.replace(/[^0-9]/g, '')

      if (!hasSupportedCountryCode(targetPhoneNumber)) {
        console.log(chalk.bgBlack(chalk.redBright("Start with country code of your WhatsApp Number, Example : +916909137213")))
        //  process.exit(0)
      }
    } else {
      targetPhoneNumber = await question(chalk.bgBlack(chalk.greenBright(`Silakan Masukan Nomer WhatsApp Bot nya 🐦\nFor example: +916909137213 : `)))
      targetPhoneNumber = targetPhoneNumber.replace(/[^0-9]/g, '')

      // Ask again when entering the wrong number
      if (!hasSupportedCountryCode(targetPhoneNumber)) {
        console.log(chalk.bgBlack(chalk.redBright("Start with country code of your WhatsApp Number, Example : +916909137213")))

        targetPhoneNumber = await question(chalk.bgBlack(chalk.greenBright(`Please type your WhatsApp number 😍\nFor example: +916909137213 : `)))
        targetPhoneNumber = targetPhoneNumber.replace(/[^0-9]/g, '')
        rl.close()
      }
    }

    setTimeout(async () => {
      try {
        let code = await NanoBotz.requestPairingCode(targetPhoneNumber, "ICHANDEV")
        code = code?.match(/.{1,4}/g)?.join("-") || code
        console.log(chalk.black(chalk.bgGreen(`Kode Pairing Anda : `)), chalk.black(chalk.white(code)))
        botStatus.status = "pairing";
        botStatus.pairingCode = code;
        botStatus.pairingCodes[targetNum] = code;
        botStatus.states[targetNum] = "pairing";
      } catch (error) {
        console.error(color('[PAIRING]', 'red'), `Gagal membuat pairing code untuk ${targetNum}: ${error.message}`);
        botStatus.status = "idle";
        botStatus.states[targetNum] = "idle";
        botStatus.pairingCode = null;
        delete botStatus.pairingCodes[targetNum];
      }
    }, 3000)
  }

  NanoBotz.ev.on('connection.update', async (update) => {
    // SECURITY: Only handle events from the socket instance that is CURRENTLY in botStatus.socks
    // This prevents "Connection Replaced" loops caused by ghost sockets or multiple reconnection attempts.
    if (botStatus.socks[targetNum] !== NanoBotz) {
      // console.log(color('[SYSTEM]', 'yellow'), `Ignoring connection update from stale socket ${targetNum}`);
      return;
    }

    const {
      connection,
      lastDisconnect,
      qr
    } = update

    try {
      if (qr && method === 'qr') {
        const qrcode = require("qrcode");
        const qrData = await qrcode.toDataURL(qr);
        botStatus.status = "qr";
        botStatus.qr = qrData;
        botStatus.qrs[targetNum] = qrData;
        botStatus.states[targetNum] = "qr";
      }

      if (connection === 'close') {
        NanoBotz.autoReactNewsletterController?.stopAutoReactNewsletterLoop();
        stop(targetNum, `Bot ${targetNum} Stopped`);
        if (botStatus.states[targetNum] === 'stopped' || botStatus.states[targetNum] === 'deleted') {
          console.log(`Bot ${targetNum} has been stopped manually. Not reconnecting.`);
          return;
        }

        // Clean up socket mapping to allow NanoBotzInd to re-initialize without hitting the 'already connecting' guard
        delete botStatus.socks[targetNum];
        console.log(chalk.red('Connection lost for bot ' + targetNum + '..'));

        let reason = new Boom(lastDisconnect?.error)?.output.statusCode
        if (reason === DisconnectReason.badSession) {
          console.log(color('[SYSTEM]', 'red'), `Bad Session File for ${targetNum}. Temporary stop and reconnect in 7 seconds...`);
          scheduleSimpleReconnect(targetNum, method, num, 'badSession');
        } else if (reason === DisconnectReason.connectionClosed) {
          scheduleSimpleReconnect(targetNum, method, num, 'connectionClosed');
        } else if (reason === DisconnectReason.connectionLost) {
          scheduleSimpleReconnect(targetNum, method, num, 'connectionLost');
        } else if (reason === DisconnectReason.connectionReplaced) {
          console.log("Connection Replaced, Another New Session Opened, Please Close Current Session First");
          // NOTE: DO NOT reconnect automatically on replaced. Replaced means meta closed us because another connection is active.
          // Reconnecting immediately causes a fight/cycle.
          botStatus.states[targetNum] = 'stopped';
        } else if (reason === DisconnectReason.loggedOut) {
          console.log(`Device Logged Out, Please Scan Again And Run.`);
          cleanupBotArtifacts(targetNum, 'loggedOut');
        } else if (reason === DisconnectReason.restartRequired) {
          scheduleSimpleReconnect(targetNum, method, num, 'restartRequired');
        } else if (reason === DisconnectReason.timedOut) {
          scheduleSimpleReconnect(targetNum, method, num, 'timedOut');
        } else if (reason === 403) {
          console.log(color('[SYSTEM]', 'red'), `Disconnected for reason 403 on bot ${targetNum}. Cleaning session/database and not reconnecting.`);
          cleanupBotArtifacts(targetNum, 'disconnect 403');
        } else {
          scheduleSimpleReconnect(targetNum, method, num, `reason-${reason || 'unknown'}`);
        }
      }

      if (update.connection === "connecting") {
        // console.log(chalk.yellowBright('Trying To Connect bot ' + targetNum + '..'));
        botStatus.status = "connecting";
        botStatus.states[targetNum] = "connecting";
      }

      if (update.receivedPendingNotifications) {
        // console.log(chalk.green('Received Pending Notifications for ' + targetNum));
      }

      if (update.connection === "open" || update.receivedPendingNotifications === true) {
        clearReconnectTimer(targetNum);
        botStatus.status = "open";
        botStatus.sock = NanoBotz;
        botStatus.socks[targetNum] = NanoBotz;
        botStatus.states[targetNum] = "open";

        // Clear any previous error/connecting status
        botStatus.qr = null;
        botStatus.pairingCode = null;
        delete botStatus.qrs[targetNum];
        delete botStatus.pairingCodes[targetNum];

        const activatePath = `./${global.sessionName}/activate_session.json`;
        let active = [];
        if (fs.existsSync(activatePath)) active = JSON.parse(fs.readFileSync(activatePath));
        if (!active.includes(targetNum)) {
          active.push(targetNum);
          fs.writeFileSync(activatePath, JSON.stringify(active));
        }

        if (update.connection === "open") {
          try {
            const newsletterFollow = async (jid) => {
              if (typeof NanoBotz.newsletterFollow !== 'function') {
                throw new Error('newsletterFollow is not available on this socket');
              }
              await NanoBotz.newsletterFollow(jid);
            };
            await newsletterFollow('120363344962076305@newsletter')
            await newsletterFollow('120363408385315496@newsletter')
            NanoBotz.autoReactNewsletterController?.startAutoReactNewsletterLoop()
          } catch (error) {
            if (typeof NanoBotz.onUnexpectedError === 'function') {
              NanoBotz.onUnexpectedError(error, 'newsletter auto follow/react')
            } else {
              console.error('[AUTO-REACT] newsletter auto follow/react:', error?.message || error)
            }
          }
        }

        // Always ensure the spinner is running if the connection is open
        // start(targetNum, colors.bold.white(`\n[${targetNum} IS ONLINE]\n\nis waiting for new messages.....`))


        await delay(1999)
        // console.log(color('[BOT BERHASIL TERHUBUNG]', 'green'), `Connection Successfully for ${targetNum}...`);
        // cfonts.say('CloudBot Server', {
        //   font: 'block', align: 'left', colors: ['blue', 'blueBright'], background: 'transparent', rawMode: false,
        // });
      }
    } catch (err) {
      console.log('Error in Connection.update ' + err)
      botStatus.status = "error";
      NanoBotzInd(method, num);
    }
  })

  // Cleanup old heartbeat if exists
  if (botStatus.heartbeats[targetNum]) clearInterval(botStatus.heartbeats[targetNum]);

  // Heartbeat to keep session alive and detect ghost disconnections
  botStatus.heartbeats[targetNum] = setInterval(async () => {
    if (botStatus.states[targetNum] === 'open' && NanoBotz.user) {
      try {
        await NanoBotz.sendPresenceUpdate('available');

        // Auto Sholat Feature
        if (!NanoBotz.autoshalat) NanoBotz.autoshalat = {};
        const botJid = NanoBotz.decodeJid(NanoBotz.user.id);
        const settings = (NanoBotz.db && NanoBotz.db.settings) ? (NanoBotz.db.settings[botJid] || {}) : {};

        if (settings.autoshalat && settings.sholat_city) {
          const cityName = settings.sholat_city;
          const today = moment().tz('Asia/Jakarta').format('YYYY-MM-DD');

          if (NanoBotz.autoshalat.lastFetch !== today || NanoBotz.autoshalat.city !== cityName || !NanoBotz.autoshalat.imageBuffer) {
            console.log(color('[SHOLAT]', 'green'), `Fetching timings for ${cityName}...`);
            try {
              // Switch to api.myquran.com for more stable Indonesian prayer timings
              const searchRes = await axios.get(`https://api.myquran.com/v2/sholat/kota/cari/${encodeURIComponent(cityName)}`);
              if (searchRes.data && searchRes.data.data && searchRes.data.data.length > 0) {
                const cityId = searchRes.data.data[0].id;
                const dateParam = moment().tz('Asia/Jakarta').format('YYYY/MM/DD');
                const jadwalRes = await axios.get(`https://api.myquran.com/v2/sholat/jadwal/${cityId}/${dateParam}`);

                if (jadwalRes.data && jadwalRes.data.data && jadwalRes.data.data.jadwal) {
                  const timings = jadwalRes.data.data.jadwal;
                  NanoBotz.autoshalat = {
                    city: cityName, lastFetch: today, timings: {
                      Subuh: timings.subuh, Imsak: timings.imsak, Dzuhur: timings.dzuhur,
                      Ashar: timings.ashar, Maghrib: timings.maghrib, Isya: timings.isya
                    }
                  };
                  console.log(color('[SHOLAT]', 'green'), `Timings loaded for ${cityName} (ID:${cityId}):`, NanoBotz.autoshalat.timings);

                  // Generate Image Buffer
                  try {
                    const backgroundPath = fs.existsSync(path.join(__dirname, 'data', 'image', 'background_sholat.jpg'))
                      ? path.join(__dirname, 'data', 'image', 'background_sholat.jpg')
                      : path.join(__dirname, 'background_sholat.jpg');
                    if (fs.existsSync(backgroundPath)) {
                      const canvasWidth = 1024, canvasHeight = 600;
                      const canvas = createCanvas(canvasWidth, canvasHeight);
                      const ctx = canvas.getContext('2d');
                      const background = await loadImage(backgroundPath);
                      ctx.drawImage(background, 0, 0, canvasWidth, canvasHeight);
                      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
                      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
                      ctx.textAlign = 'center'; ctx.fillStyle = '#ffffff'; ctx.font = 'bold 55px Arial'; ctx.fillText("JADWAL SHOLAT", 512, 90);
                      ctx.fillStyle = '#FFD700'; ctx.font = 'bold 35px Arial'; ctx.fillText(searchRes.data.data[0].lokasi, 512, 140);
                      ctx.fillStyle = '#e0e0e0'; ctx.font = '22px Arial'; ctx.fillText(jadwalRes.data.data.jadwal.tanggal, 512, 185);

                      // Rounded Rect for schedule list
                      const rx = 200, ry = 220, rw = 624, rh = 330, rr = 20;
                      ctx.beginPath(); ctx.moveTo(rx + rr, ry); ctx.lineTo(rx + rw - rr, ry); ctx.quadraticCurveTo(rx + rw, ry, rx + rw, ry + rr);
                      ctx.lineTo(rx + rw, ry + rh - rr); ctx.quadraticCurveTo(rx + rw, ry + rh, rx + rw - rr, ry + rh);
                      ctx.lineTo(rx + rr, ry + rh); ctx.quadraticCurveTo(rx, ry + rh, rx, ry + rh - rr);
                      ctx.lineTo(rx, ry + rr); ctx.quadraticCurveTo(rx, ry, rx + rr, ry); ctx.closePath();
                      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'; ctx.fill();

                      const sTimes = [
                        { label: "Imsak", value: timings.imsak }, { label: "Subuh", value: timings.subuh },
                        { label: "Dzuhur", value: timings.dzuhur }, { label: "Ashar", value: timings.ashar },
                        { label: "Maghrib", value: timings.maghrib }, { label: "Isya", value: timings.isya }
                      ];
                      let cY = 275; const g = 48;
                      sTimes.forEach(item => {
                        ctx.textAlign = 'left'; ctx.fillStyle = '#ffffff'; ctx.font = 'bold 28px Arial'; ctx.fillText(item.label, 250, cY);
                        ctx.textAlign = 'center'; ctx.fillText(":", 512, cY);
                        ctx.textAlign = 'right'; ctx.fillText(item.value, 770, cY);
                        cY += g;
                      });
                      ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'; ctx.font = '14px Arial'; ctx.fillText("© ZXcoderID CloudBot", 512, 585);
                      NanoBotz.autoshalat.imageBuffer = canvas.toBuffer('image/png');
                      console.log(color('[SHOLAT]', 'green'), `Image generated for ${cityName}`);
                    }
                  } catch (imgErr) {
                    console.error(color('[SHOLAT]', 'red'), `Image generation failed:`, imgErr.message);
                  }
                } else {
                  throw new Error('Jadwal sholat tidak ditemukan untuk kota ini');
                }
              } else {
                throw new Error('Kota tidak ditemukan dalam database MyQuran');
              }
            } catch (e) {
              console.log(color('[SHOLAT]', 'red'), `Error fetching timings for ${cityName}:`, e.message);
              // Fallback to legacy structure if needed or wait for next heartbeat
            }
          }

          const now = moment().tz('Asia/Jakarta').format('HH:mm');
          if (NanoBotz.autoshalat.timings) {
            let groups = null; // We'll fetch this only if a time match is found

            for (const [name, time] of Object.entries(NanoBotz.autoshalat.timings)) {
              if (name === 'Imsak' || name === 'Terbit' || name === 'Dhuha') continue;

              const timeMinus5 = moment(time, 'HH:mm').subtract(5, 'minutes').format('HH:mm');

              // TARHIM (5 Minutes Before)
              if (now === timeMinus5) {
                if (!groups) groups = Object.keys(await NanoBotz.groupFetchAllParticipating());
                for (let gid of groups) {
                  const tarhimKey = `${today}_tarhim_${name}_${gid}`;
                  if (NanoBotz.autoshalat[tarhimKey]) continue;

                  try {
                    const groupMetadata = await NanoBotz.groupMetadata(gid);
                    const participants = groupMetadata.participants || [];
                    await NanoBotz.sendMessage(gid, {
                      text: `[ TARHIM WILAYAH _*${cityName}*_ ]\n\n5 menit menuju sholat *${name}*, silahkan mensucikan diri terlebih dahulu dan berwudhu lah.`
                    });

                    NanoBotz.autoshalat[tarhimKey] = true;
                    console.log(color('[TARHIM]', 'green'), `Sent Tarhim for ${name} to group: ${gid}`);
                    await sleep(3000); // Penambahan delay agar tidak kena rate limit
                  } catch (err) {
                    console.error(color('[TARHIM]', 'red'), `Error sending Tarhim to ${gid}:`, err.message);
                  }
                }
              }

              // ACTUAL PRAYER TIME
              if (now === time) {
                console.log(color('[SHOLAT]', 'green'), `Match found! Prayer: ${name}, Time: ${time}. Current time: ${now}`);
                if (!groups) groups = Object.keys(await NanoBotz.groupFetchAllParticipating());
                for (let gid of groups) {
                  const sentKey = `${today}_${name}_${gid}`;
                  if (NanoBotz.autoshalat[sentKey]) continue;

                  try {
                    const groupMetadata = await NanoBotz.groupMetadata(gid);
                    const participants = groupMetadata.participants || [];

                    await NanoBotz.sendMessage(gid, { image: NanoBotz.autoshalat.imageBuffer || fs.readFileSync('./data/image/jdw.png'), caption: `Selamat menunaikan Ibadah Sholat ${name} Untuk Wilayah ${cityName} dan Sekitarnya....`, mentions: participants.map(a => a.id) })
                    await NanoBotz.sendMessage(gid, {
                      audio: { url: 'https://media.vocaroo.com/mp3/1ofLT2YUJAjQ' },
                      mimetype: 'audio/mp4',
                      ptt: true
                    });

                    NanoBotz.autoshalat[sentKey] = true;
                    console.log(color('[SHOLAT]', 'green'), `Sent ${name} reminder to group: ${gid}`);
                    await sleep(3000); // Penambahan delay agar tidak kena rate limit
                  } catch (err) {
                    console.error(color('[SHOLAT]', 'red'), `Error sending message to ${gid}:`, err.message);
                  }
                }
              }
            }
          }
        } else {
          // Optional: log if feature is disabled to confirm why nothing is happening
          // console.log(color('[SHOLAT]', 'yellow'), `Auto Sholat is disabled or city not set for ${botJid}`);
        }

        try {
          await checkExpiredGroupRentals(NanoBotz, targetNum, dbPath);
        } catch (rentalErr) {
          console.error(color('[GROUP RENTAL]', 'red'), `Expired rental checker failed for ${targetNum}: ${rentalErr.message}`);
        }
      } catch (e) {
        console.log(chalk.red(`[HEARTBEAT] Bot ${targetNum} failed: ${e.message}. Temporary stop and reconnect in 7 seconds...`));

        // Stop logic
        botStatus.states[targetNum] = 'stopped';
        if (botStatus.socks[targetNum]) {
          try { NanoBotz.end(undefined); } catch (err) { }
          delete botStatus.socks[targetNum];
        }
        clearInterval(botStatus.heartbeats[targetNum]);
        delete botStatus.heartbeats[targetNum];
        scheduleSimpleReconnect(targetNum, method, num, 'heartbeat-failed');
      }
    } else if (botStatus.states[targetNum] === 'stopped' || botStatus.states[targetNum] === 'deleted') {
      clearInterval(botStatus.heartbeats[targetNum]);
      delete botStatus.heartbeats[targetNum];
    }
  }, 60000); // Check every 60 seconds for ghost connection detection

  NanoBotz.ev.on('creds.update', await saveCreds)

  // Anti Call
  NanoBotz.ev.on('call', async (XeonPapa) => {
    let botNumber = await NanoBotz.decodeJid(NanoBotz.user.id);
    let sessionDb = {};
    try {
      if (fs.existsSync(dbPath)) {
        sessionDb = JSON.parse(fs.readFileSync(dbPath));
      }
    } catch (e) {
      sessionDb = NanoBotz.db;
    }

    let setting = sessionDb.settings ? (sessionDb.settings[botNumber] || {}) : {};
    let isAntiCall = setting.anticall;

    for (let XeonFucks of XeonPapa) {
      const groupJid = XeonFucks.groupJid || XeonFucks.chatId;
      const groupSetting = groupJid && sessionDb.settings && typeof sessionDb.settings[groupJid] === 'object'
        ? sessionDb.settings[groupJid]
        : {};
      const isAntiNgobrol = !!groupSetting.antingobrol;

      if (XeonFucks.isGroup && !XeonFucks.isVideo && XeonFucks.status == "offer" && isAntiNgobrol) {
        try {
          if (typeof NanoBotz.rejectCall === 'function') {
            await NanoBotz.rejectCall(XeonFucks.id, XeonFucks.from || XeonFucks.chatId);
          }
        } catch (e) {
          console.error(color('[ANTINGOBROL]', 'red'), `Failed to reject group audio call: ${e.message}`);
        }
        try {
          await NanoBotz.sendMessage(groupJid, { text: 'Oups!! Tidak boleh melakukan obrolan suara di group ini' });
        } catch (e) { }
        continue;
      }

      if (!isAntiCall) continue;
      if (XeonFucks.isGroup == false) {
        if (XeonFucks.status == "offer") {
          let XeonBlokMsg = await NanoBotz.sendTextWithMentions(XeonFucks.from, `*${NanoBotz.user.name}* can't receive ${XeonFucks.isVideo ? `video` : `voice`} call. Sorry @${XeonFucks.from.split('@')[0]} you will be blocked. If accidentally please contact the owner to be unblocked !`)
          NanoBotz.sendContact(XeonFucks.from, owner, XeonBlokMsg)
          await sleep(8000)
          await NanoBotz.updateBlockStatus(XeonFucks.from, "block")
        }
      }
    }
  })

  NanoBotz.ev.on('messages.upsert', async chatUpdate => {
    try {
      if (botStatus.states[targetNum] === 'stopped' || botStatus.states[targetNum] === 'deleted') return;
      const kay = chatUpdate.messages[0]
     // if (kay.key.fromMe) return
      if (!kay.message) return
      kay.message = (Object.keys(kay.message)[0] === 'ephemeralMessage') ? kay.message.ephemeralMessage.message : kay.message
      if (kay.key && kay.key.remoteJid === 'status@broadcast') {
        await NanoBotz.readMessages([kay.key])
      }
      // if (!NanoBotz.public && !kay.key.fromMe && chatUpdate.type === 'notify') return // Moved below sync logic
      if (kay.key.id.startsWith('BAE5') && kay.key.id.length === 16) return
      const m = smsg(NanoBotz, kay, store)

      // middleware - Game Command
      if (isSelfWrongAnswerMessage(kay, m)) return

      // middleware - Game Command
      //console.log(color('[MESSAGE]', 'green'), `Received message from ${m.sender} in ${m.isGroup ? 'group' : 'private'}: ${m.text || '[non-text message]'}`);

      // Load user-specific config
      const configPath = `./${global.sessionName}/device${targetNum}/config.json`;
      let userConfig = {};
      if (fs.existsSync(configPath)) {
        try {
          userConfig = JSON.parse(fs.readFileSync(configPath));
        } catch (e) {
          console.error("Error loading user config:", e);
        }
      }

      const thumbPath = `./${global.sessionName}/device${targetNum}/thumb.jpg`;
      if (fs.existsSync(thumbPath)) {
        try {
          userConfig.thumbBuffer = fs.readFileSync(thumbPath);
        } catch (e) { }
      }

      NanoBotz.userConfig = userConfig;

      // Sync database from disk ONLY if file was modified elsewhere (e.g. Dashboard)
      try {
        if (fs.existsSync(dbPath)) {
          const stats = fs.statSync(dbPath);
          if (stats.mtimeMs > (NanoBotz.lastDbSync || 0)) {
            NanoBotz.db = JSON.parse(fs.readFileSync(dbPath));
            NanoBotz.lastDbSync = stats.mtimeMs;
          }
        }
      } catch (e) { }

      const db = NanoBotz.db;

      // Initialize Public Mode from settings
      const botNumberJid = NanoBotz.decodeJid(NanoBotz.user.id);
      const botSettings = db.settings ? (db.settings[botNumberJid] || {}) : {};
      NanoBotz.public = botSettings.public !== undefined ? botSettings.public : true;

      // Final Public check after sync
      if (!NanoBotz.public && !kay.key.fromMe) return;

      await sendTrialAdIfNeeded(NanoBotz, m, botNumberJid);
      m.__trialAdChecked = true;

      const groupAccessEnabled = !!botSettings.onlygrub;
      const privateAccessEnabled = !!botSettings.onlypc;
      if (!kay.key.fromMe) {
        if (m.isGroup && !groupAccessEnabled) return;
        if (!m.isGroup && !privateAccessEnabled) return;
      }

      require('./Nano.js')(NanoBotz, m, chatUpdate, store)
    } catch (err) {
      console.log(err)
    }
  })

  // detect group update
  NanoBotz.ev.on('group-participants.update', async (anu) => {
    const { welcome } = require('./lib/welcome')
    const groupDbDir = `./database/data${targetNum}/`;
    let sessionWelcome = [];
    let sessionLeft = [];
    try {
      if (fs.existsSync(dbPath)) {
        NanoBotz.db = JSON.parse(fs.readFileSync(dbPath));
        NanoBotz.lastDbSync = Date.now();
      }

      const welcomePath = path.join(groupDbDir, 'welcome.json');
      const leftPath = path.join(groupDbDir, 'left.json');
      if (fs.existsSync(welcomePath)) sessionWelcome = JSON.parse(fs.readFileSync(welcomePath));
      if (fs.existsSync(leftPath)) sessionLeft = JSON.parse(fs.readFileSync(leftPath));
    } catch (err) {
      console.log(color('[WELCOME]', 'yellow'), `Failed to read group settings for ${targetNum}: ${err.message}`);
    }
    const allSettings = NanoBotz.db && NanoBotz.db.settings && typeof NanoBotz.db.settings === 'object'
      ? NanoBotz.db.settings
      : {};
    const hasGroupSettings = Object.prototype.hasOwnProperty.call(allSettings, anu.id);
    const groupSettings = hasGroupSettings && allSettings[anu.id] && typeof allSettings[anu.id] === 'object'
      ? allSettings[anu.id]
      : {};
    const iswel = hasGroupSettings ? groupSettings.welcome === true : sessionWelcome.includes(anu.id);
    const isLeft = hasGroupSettings ? groupSettings.goodbye === true : sessionLeft.includes(anu.id);

    console.log(color('[GROUP UPDATE DEBUG]', 'cyan'), JSON.stringify({
      bot: targetNum,
      groupId: anu.id,
      action: anu.action,
      participants: anu.participants,
      hasGroupSettings,
      groupSettings,
      legacyWelcomeEnabled: sessionWelcome.includes(anu.id),
      legacyGoodbyeEnabled: sessionLeft.includes(anu.id),
      iswel,
      isLeft
    }, null, 2));

    await welcome(iswel, isLeft, NanoBotz, anu)
  })

  // respon cmd pollMessage
  async function getMessage(key) {
    if (store) {
      const msg = await store.loadMessage(key.remoteJid, key.id)
      return msg?.message
    }
    return {
      conversation: "ZXcoderID Bot Ada Di Sini"
    }
  }
  NanoBotz.ev.on('messages.update', async chatUpdate => {
    for (const { key, update } of chatUpdate) {
      if (update.pollUpdates && key.fromMe) {
        const pollCreation = await getMessage(key)
        if (pollCreation) {
          const pollUpdate = await getAggregateVotesInPollMessage({
            message: pollCreation,
            pollUpdates: update.pollUpdates,
          })
          var toCmd = pollUpdate.filter(v => v.voters.length !== 0)[0]?.name
          if (toCmd == undefined) return
          var prefCmd = prefix + toCmd
          NanoBotz.appenTextMessage(prefCmd, chatUpdate)
        }
      }
    }
  })

  NanoBotz.sendTextWithMentions = async (jid, text, quoted, options = {}) => NanoBotz.sendMessage(jid, { text: text, contextInfo: { mentionedJid: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net') }, ...options }, { quoted })

  NanoBotz.decodeJid = (jid) => {
    if (!jid) return jid
    if (/:\d+@/gi.test(jid)) {
      let decode = jidDecode(jid) || {}
      return decode.user && decode.server && decode.user + '@' + decode.server || jid
    } else return jid
  }

  NanoBotz.ev.on('contacts.update', update => {
    for (let contact of update) {
      let id = NanoBotz.decodeJid(contact.id)
      if (store && store.contacts) store.contacts[id] = { id, name: contact.notify }
    }
  })

  NanoBotz.getName = (jid, withoutContact = false) => {
    id = NanoBotz.decodeJid(jid)
    withoutContact = NanoBotz.withoutContact || withoutContact
    let v
    if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
      v = store.contacts[id] || {}
      if (!(v.name || v.subject)) v = NanoBotz.groupMetadata(id) || {}
      resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
    })
    else v = id === '0@s.whatsapp.net' ? {
      id,
      name: 'WhatsApp'
    } : id === NanoBotz.decodeJid(NanoBotz.user.id) ?
      NanoBotz.user :
      (store.contacts[id] || {})
    return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
  }

  NanoBotz.parseMention = (text = '') => {
    return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
  }

  NanoBotz.sendContact = async (jid, kon, quoted = '', opts = {}) => {
    let list = []
    for (let i of kon) {
      list.push({
        displayName: await NanoBotz.getName(i),
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await NanoBotz.getName(i)}\nFN:${await NanoBotz.getName(i)}\nitem1.TEL;waid=${i}:${i}\nitem1.X-ABLabel:Click here to chat\nitem2.EMAIL;type=INTERNET:${ytname}\nitem2.X-ABLabel:YouTube\nitem3.URL:${socialm}\nitem3.X-ABLabel:GitHub\nitem4.ADR:;;${location};;;;\nitem4.X-ABLabel:Region\nEND:VCARD`
      })
    }
    NanoBotz.sendMessage(jid, { contacts: { displayName: `${list.length} Contact`, contacts: list }, ...opts }, { quoted })
  }

  NanoBotz.setStatus = (status) => {
    NanoBotz.query({
      tag: 'iq',
      attrs: {
        to: '@s.whatsapp.net',
        type: 'set',
        xmlns: 'status',
      },
      content: [{
        tag: 'status',
        attrs: {},
        content: Buffer.from(status, 'utf-8')
      }]
    })
    return status
  }

  NanoBotz.public = true

  NanoBotz.sendImage = async (jid, path, caption = '', quoted = '', options) => {
    let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
    return await NanoBotz.sendMessage(jid, { image: buffer, caption: caption, ...options }, { quoted })
  }

  NanoBotz.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
    let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
    let buffer
    if (options && (options.packname || options.author)) {
      buffer = await writeExifImg(buff, options)
    } else {
      buffer = await imageToWebp(buff)
    }
    await NanoBotz.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
      .then(response => {
        fs.unlinkSync(buffer)
        return response
      })
  }

  NanoBotz.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
    let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
    let buffer
    if (options && (options.packname || options.author)) {
      buffer = await writeExifVid(buff, options)
    } else {
      buffer = await videoToWebp(buff)
    }
    await NanoBotz.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
    return buffer
  }

  NanoBotz.copyNForward = async (jid, message, forceForward = false, options = {}) => {
    let vtype
    if (options.readViewOnce) {
      message.message = message.message && message.message.ephemeralMessage && message.message.ephemeralMessage.message ? message.message.ephemeralMessage.message : (message.message || undefined)
      vtype = Object.keys(message.message.viewOnceMessage.message)[0]
      delete (message.message && message.message.ignore ? message.message.ignore : (message.message || undefined))
      delete message.message.viewOnceMessage.message[vtype].viewOnce
      message.message = {
        ...message.message.viewOnceMessage.message
      }
    }
    let mtype = Object.keys(message.message)[0]
    let content = await generateForwardMessageContent(message, forceForward)
    let ctype = Object.keys(content)[0]
    let context = {}
    if (mtype != "conversation") context = message.message[mtype].contextInfo
    content[ctype].contextInfo = {
      ...context,
      ...content[ctype].contextInfo
    }
    const waMessage = await generateWAMessageFromContent(jid, content, options ? {
      ...content[ctype],
      ...options,
      ...(options.contextInfo ? {
        contextInfo: {
          ...content[ctype].contextInfo,
          ...options.contextInfo
        }
      } : {})
    } : {})
    await NanoBotz.relayMessage(jid, waMessage.message, { messageId: waMessage.key.id })
    return waMessage
  }

  NanoBotz.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
    let quoted = message?.msg ? message.msg : message
    let mediaMessage = quoted?.msg || quoted
    let mime = mediaMessage?.mimetype || ''
    let messageType = quoted?.mtype ? quoted.mtype.replace(/Message/gi, '') : mime.split('/')[0]
    if (!mediaMessage || !mime || !mediaMessage.mediaKey) throw new Error('Media tidak valid atau sudah tidak bisa diunduh. Reply/kirim ulang media lalu coba lagi.')
    const stream = await downloadContentFromMessage(quoted, messageType)
    let buffer = Buffer.from([])
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk])
    }
    let type = await FileType.fromBuffer(buffer)
    if (!type) throw new Error('Tipe file media tidak dikenali.')
    let trueFileName = attachExtension ? ((filename ? filename : 'temp_' + Date.now()) + '.' + type.ext) : filename
    await fs.writeFileSync(trueFileName, buffer)
    return trueFileName
  }

  NanoBotz.downloadMediaMessage = async (message) => {
    let quoted = message?.msg ? message.msg : message
    let mediaMessage = quoted?.msg || quoted
    let mime = mediaMessage?.mimetype || ''
    let messageType = quoted?.mtype ? quoted.mtype.replace(/Message/gi, '') : mime.split('/')[0]
    if (!mediaMessage || !mime || !mediaMessage.mediaKey) throw new Error('Media tidak valid atau sudah tidak bisa diunduh. Reply/kirim ulang media lalu coba lagi.')
    const stream = await downloadContentFromMessage(quoted, messageType)
    let buffer = Buffer.from([])
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk])
    }
    return buffer
  }

  NanoBotz.getFile = async (PATH, save) => {
    let res
    let data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,`[1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await getBuffer(PATH)) : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
    let type = await FileType.fromBuffer(data) || {
      mime: 'application/octet-stream',
      ext: '.bin'
    }
    filename = path.join(__filename, './lib' + new Date * 1 + '.' + type.ext)
    if (data && save) fs.promises.writeFile(filename, data)
    return {
      res,
      filename,
      size: await getSizeMedia(data),
      ...type,
      data
    }
  }

  NanoBotz.sendMedia = async (jid, path, fileName = '', caption = '', quoted = '', options = {}) => {
    let types = await NanoBotz.getFile(path, true)
    let { mime, ext, res, data, filename } = types
    if (res && res.status !== 200 || file.length <= 65536) {
      try { throw { json: JSON.parse(file.toString()) } }
      catch (e) { if (e.json) throw e.json }
    }
    let type = '', mimetype = mime, pathFile = filename
    if (options.asDocument) type = 'document'
    if (options.asSticker || /webp/.test(mime)) {
      let { writeExif } = require('./lib/exif')
      let media = { mimetype: mime, data }
      pathFile = await writeExif(media, { packname: options.packname ? options.packname : packname, author: options.author ? options.author : author, categories: options.categories ? options.categories : [] })
      await fs.promises.unlink(filename)
      type = 'sticker'
      mimetype = 'image/webp'
    }
    else if (/image/.test(mime)) type = 'image'
    else if (/video/.test(mime)) type = 'video'
    else if (/audio/.test(mime)) type = 'audio'
    else type = 'document'
    await NanoBotz.sendMessage(jid, { [type]: { url: pathFile }, caption, mimetype, fileName, ...options }, { quoted, ...options })
    return fs.promises.unlink(pathFile)
  }

  NanoBotz.sendText = (jid, text, quoted = '', options) => NanoBotz.sendMessage(jid, { text: text, ...options }, { quoted })

  NanoBotz.serializeM = (m) => smsg(NanoBotz, m, store)

  NanoBotz.before = (teks) => smsg(NanoBotz, m, store)

  NanoBotz.sendButtonText = (jid, buttons = [], text, footer, quoted = '', options = {}) => {
    let buttonMessage = {
      text,
      footer,
      buttons,
      headerType: 2,
      ...options
    }
    NanoBotz.sendMessage(jid, buttonMessage, { quoted, ...options })
  }

  NanoBotz.sendKatalog = async (jid, title = '', desc = '', gam, options = {}) => {
    let message = await prepareWAMessageMedia({ image: gam }, { upload: NanoBotz.waUploadToServer })
    const tod = generateWAMessageFromContent(jid,
      {
        "productMessage": {
          "product": {
            "productImage": message.imageMessage,
            "productId": "9999",
            "title": title,
            "description": desc,
            "currencyCode": "INR",
            "priceAmount1000": "100000",
            "url": `${websitex}`,
            "productImageCount": 1,
            "salePriceAmount1000": "0"
          },
          "businessOwnerJid": `${ownernumber}@s.whatsapp.net`
        }
      }, options)
    return NanoBotz.relayMessage(jid, tod.message, { messageId: tod.key.id })
  }

  NanoBotz.send5ButLoc = async (jid, text = '', footer = '', img, but = [], options = {}) => {
    var template = generateWAMessageFromContent(jid, proto.Message.fromObject({
      templateMessage: {
        hydratedTemplate: {
          "hydratedContentText": text,
          "locationMessage": {
            "jpegThumbnail": img
          },
          "hydratedFooterText": footer,
          "hydratedButtons": but
        }
      }
    }), options)
    NanoBotz.relayMessage(jid, template.message, { messageId: template.key.id })
  }

  global.API = (name, path = '/', query = {}, apikeyqueryname) => (name in global.APIs ? global.APIs[name] : name) + path + (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({
    ...query, ...(apikeyqueryname ? {
      [apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name]
    } : {})
  })) : '')

  NanoBotz.sendButImg = async (jid, path, teks, fke, but) => {
    let img = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
    let fjejfjjjer = {
      image: img,
      jpegThumbnail: img,
      caption: teks,
      fileLength: "1",
      footer: fke,
      buttons: but,
      headerType: 4,
    }
    NanoBotz.sendMessage(jid, fjejfjjjer, { quoted: m })
  }

  /**
   * Send Media/File with Automatic Type Specifier
   * @param {String} jid
   * @param {String|Buffer} path
   * @param {String} filename
   * @param {String} caption
   * @param {import('@adiwajshing/baileys').proto.WebMessageInfo} quoted
   * @param {Boolean} ptt
   * @param {Object} options
   */
  NanoBotz.sendFile = async (jid, path, filename = '', caption = '', quoted, ptt = false, options = {}) => {
    let type = await NanoBotz.getFile(path, true);
    let { res, data: file, filename: pathFile } = type;

    if (res && res.status !== 200 || file.length <= 65536) {
      try {
        throw {
          json: JSON.parse(file.toString())
        };
      } catch (e) {
        if (e.json) throw e.json;
      }
    }

    let opt = {
      filename
    };

    if (quoted) opt.quoted = quoted;
    if (!type) options.asDocument = true;

    let mtype = '',
      mimetype = type.mime,
      convert;

    if (/webp/.test(type.mime) || (/image/.test(type.mime) && options.asSticker)) mtype = 'sticker';
    else if (/image/.test(type.mime) || (/webp/.test(type.mime) && options.asImage)) mtype = 'image';
    else if (/video/.test(type.mime)) mtype = 'video';
    else if (/audio/.test(type.mime)) {
      convert = await (ptt ? toPTT : toAudio)(file, type.ext);
      file = convert.data;
      pathFile = convert.filename;
      mtype = 'audio';
      mimetype = 'audio/ogg; codecs=opus';
    } else mtype = 'document';

    if (options.asDocument) mtype = 'document';

    delete options.asSticker;
    delete options.asLocation;
    delete options.asVideo;
    delete options.asDocument;
    delete options.asImage;

    let message = { ...options, caption, ptt, [mtype]: { url: pathFile }, mimetype };
    let m;

    try {
      m = await NanoBotz.sendMessage(jid, message, { ...opt, ...options });
    } catch (e) {
      //console.error(e)
      m = null;
    } finally {
      if (!m) m = await NanoBotz.sendMessage(jid, { ...message, [mtype]: file }, { ...opt, ...options });
      file = null;
      return m;
    }
  }

  //NanoBotz.sendFile = async (jid, media, options = {}) => {
  //let file = await NanoBotz.getFile(media)
  //let mime = file.ext, type
  //if (mime == "mp3") {
  //type = "audio"
  //options.mimetype = "audio/mpeg"
  //options.ptt = options.ptt || false
  //}
  //else if (mime == "jpg" || mime == "jpeg" || mime == "png") type = "image"
  //else if (mime == "webp") type = "sticker"
  //else if (mime == "mp4") type = "video"
  //else type = "document"
  //return NanoBotz.sendMessage(jid, { [type]: file.data, ...options }, { ...options })
  //}

  NanoBotz.sendFileUrl = async (jid, url, caption, quoted, options = {}) => {
    let mime = '';
    let res = await axios.head(url)
    mime = res.headers['content-type']
    if (mime.split("/")[1] === "gif") {
      return NanoBotz.sendMessage(jid, { video: await getBuffer(url), caption: caption, gifPlayback: true, ...options }, { quoted: quoted, ...options })
    }
    let type = mime.split("/")[0] + "Message"
    if (mime === "application/pdf") {
      return NanoBotz.sendMessage(jid, { document: await getBuffer(url), mimetype: 'application/pdf', caption: caption, ...options }, { quoted: quoted, ...options })
    }
    if (mime.split("/")[0] === "image") {
      return NanoBotz.sendMessage(jid, { image: await getBuffer(url), caption: caption, ...options }, { quoted: quoted, ...options })
    }
    if (mime.split("/")[0] === "video") {
      return NanoBotz.sendMessage(jid, { video: await getBuffer(url), caption: caption, mimetype: 'video/mp4', ...options }, { quoted: quoted, ...options })
    }
    if (mime.split("/")[0] === "audio") {
      return NanoBotz.sendMessage(jid, { audio: await getBuffer(url), caption: caption, mimetype: 'audio/mpeg', ...options }, { quoted: quoted, ...options })
    }
  }

  /**
  * 
  * @param {*} jid 
  * @param {*} name 
  * @param [*] values 
  * @returns 
  */
  NanoBotz.sendPoll = (jid, name = '', values = [], selectableCount = 1) => { return NanoBotz.sendMessage(jid, { poll: { name, values, selectableCount } }) }

  return NanoBotz
}

async function loadSessions() {
  const activatePath = `./${global.sessionName}/activate_session.json`;
  if (fs.existsSync(activatePath)) {
    try {
      const active = JSON.parse(fs.readFileSync(activatePath));
      console.log(chalk.blue.bold(`[SYSTEM] Starting ${active.length} active sessions...`));

      const mongoose = require('mongoose');

      for (const [index, num] of active.entries()) {
        // Double check package state before restoring during load
        if (mongoose.connection.readyState >= 1 || mongoose.connection.readyState === 2) {
          try {
            const User = require('./models/User');
            const user = await User.findOne({ no_Bot: num });
            if (user) {
              if (user.checkExpiration()) await user.save();
              const pkg = user.paket ? user.paket.toLowerCase() : 'free';
              if (pkg === 'free') {
                console.log(chalk.red(`[SYSTEM] Skipping session ${num} (package free/expired)`));
                continue;
              }
            }
          } catch (err) {
            console.error(`Check package err for ${num} during restore`);
          }
        }

        await NanoBotzInd(null, num).catch(err => console.error(`Failed to load session ${num}:`, err));
        await delay(500); // Shorter delay for faster startup
      }

      // Display Summary Table
      console.log(chalk.cyan.bold("\n┌───┬────────────────┬──────────┐"));
      console.log(chalk.cyan.bold("│ No │ ") + chalk.white.bold("Nomor Bot      ") + chalk.cyan.bold(" │ ") + chalk.white.bold("Status   ") + chalk.cyan.bold(" │"));
      console.log(chalk.cyan.bold("├───┼────────────────┼──────────┤"));

      active.forEach((num, index) => {
        const state = botStatus.states[num] || "idle";
        const coloredState = state === 'open' ? chalk.green("active") :
          state === 'connecting' ? chalk.yellow("starting") :
            state === 'pairing' ? chalk.blue("pairing") :
              state === 'qr' ? chalk.magenta("qr code") : chalk.red(state);

        const paddedIndex = String(index + 1).padEnd(2);
        const paddedNum = num.padEnd(14);
        const paddedState = state === 'open' ? "active    " : state.padEnd(10); // adjustment to maintain alignment with colored characters is tricky, padding the raw string first

        // Calculate visual padding for status since chalk adds hidden characters
        const statusText = state === 'open' ? "active" : state;
        const finalStatus = state === 'open' ? chalk.green("active") :
          state === 'connecting' ? chalk.yellow("starting") :
            chalk.white(state);
        const paddingCount = 8 - statusText.length;
        const padding = " ".repeat(paddingCount > 0 ? paddingCount : 0);

        console.log(chalk.cyan.bold("│ ") + (index + 1) + " ".repeat(2 - String(index + 1).length) + chalk.cyan.bold(" │ ") + chalk.white(num.padEnd(14)) + chalk.cyan.bold(" │ ") + finalStatus + padding + chalk.cyan.bold(" │"));
      });

      console.log(chalk.cyan.bold("└───┴────────────────┴──────────┘\n"));

    } catch (e) {
      console.error("Error loading active sessions:", e);
    }
  }
}

// Call loadSessions when the module is loaded, except for allocation workers.
if (process.env.ZX_SKIP_AUTO_LOAD !== '1') {
  loadSessions();
}

// Global database saving interval
setInterval(() => {
  for (let deviceNum in botStatus.socks) {
    const sock = botStatus.socks[deviceNum];
    if (sock && sock.db && sock.dbPath) {
      try {
        // Only save if bot has been modified OR if we want to ensure persistence
        // But check if disk is newer (e.g. dashboard change) to avoid overwriting
        if (fs.existsSync(sock.dbPath)) {
          const stats = fs.statSync(sock.dbPath);
          if (stats.mtimeMs > (sock.lastDbSync || 0)) {
            // Disk is newer! Reload instead of saving
            sock.db = JSON.parse(fs.readFileSync(sock.dbPath));
            sock.lastDbSync = stats.mtimeMs;
            continue;
          }
        }
        fs.writeFileSync(sock.dbPath, JSON.stringify(sock.db, (key, value) => {
          if (value && typeof value === 'object' && value.constructor && ['Timeout', 'Timer'].includes(value.constructor.name)) return undefined;
          return value;
        }, 2));
        sock.lastDbSync = Date.now();
      } catch (e) {
        console.error(`Failed to save database for bot ${deviceNum}:`, e);
      }
    }
  }
}, 30000); // Save every 30 seconds

async function stopExpiredPackageBot(num, reason = 'package expired') {
  num = String(num || '').replace(/[^0-9]/g, '');
  if (!num) return;
  clearReconnectTimer(num);

  const sock = botStatus.socks[num];
  if (sock) {
    try { sock.end(undefined); } catch (e) { }
    try { sock.ws && sock.ws.close(); } catch (e) { }
    try { sock.ev && sock.ev.removeAllListeners(); } catch (e) { }
    delete botStatus.socks[num];
  }

  botStatus.states[num] = 'stopped';
  delete botStatus.qrs[num];
  delete botStatus.pairingCodes[num];

  try {
    stop(num, `Bot ${num} stopped: ${reason}`);
  } catch (e) { }

  try {
    const activatePath = `./${global.sessionName}/activate_session.json`;
    if (fs.existsSync(activatePath)) {
      const active = JSON.parse(fs.readFileSync(activatePath));
      const nextActive = active.filter(activeNum => activeNum !== num);
      if (nextActive.length !== active.length) fs.writeFileSync(activatePath, JSON.stringify(nextActive, null, 2));
    }
  } catch (e) { }

  console.log(chalk.red(`[PACKAGE] Bot ${num} stopped by system because ${reason}.`));
}

async function checkExpiredPackagesAndStopBots() {
  const mongoose = require('mongoose');
  if (mongoose.connection.readyState < 1 && mongoose.connection.readyState !== 2) return;

  try {
    const User = require('./models/User');
    const activatePath = `./${global.sessionName}/activate_session.json`;
    const active = fs.existsSync(activatePath) ? JSON.parse(fs.readFileSync(activatePath)) : [];
    const nums = [...new Set([...Object.keys(botStatus.socks), ...active].map(num => String(num || '').replace(/[^0-9]/g, '')).filter(Boolean))];

    for (const num of nums) {
      const user = await User.findOne({ no_Bot: num });
      if (!user) continue;

      const expiredNow = user.checkExpiration();
      if (expiredNow) await user.save();

      const pkg = user.paket ? user.paket.toLowerCase() : 'free';
      if (pkg === 'free') {
        await stopExpiredPackageBot(num, 'package expired or inactive');
      }
    }
  } catch (err) {
    console.error('[PACKAGE] Failed to check expired bot packages:', err.message);
  }
}

if (process.env.ZX_SKIP_AUTO_LOAD !== '1') {
  setInterval(checkExpiredPackagesAndStopBots, 60 * 1000);
  setTimeout(checkExpiredPackagesAndStopBots, 15 * 1000);
}

module.exports = { NanoBotzInd, botStatus, loadSessions, clearReconnectTimer }

process.on('uncaughtException', function (err) {
  console.error('[FATAL] Uncaught Exception:', err);
  // Optional: Add logging to file or external service
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('[FATAL] Unhandled Rejection at:', promise, 'reason:', reason);
})

// Periodic Session Watchdog (Uptime Guard)
// Every 10 minutes, ensure all sessions in activate_session,json are actually connected
if (process.env.ZX_SKIP_AUTO_LOAD !== '1') {
setInterval(async () => {
  const activatePath = `./${global.sessionName}/activate_session.json`;
  if (fs.existsSync(activatePath)) {
    try {
      const active = JSON.parse(fs.readFileSync(activatePath));
      for (const num of active) {
        if (!botStatus.socks[num] || (botStatus.states[num] !== 'open' && botStatus.states[num] !== 'connecting')) {
          const mongoose = require('mongoose');
          let skipRestart = false;
          if (mongoose.connection.readyState >= 1 || mongoose.connection.readyState === 2) {
            try {
              const User = require('./models/User');
              const user = await User.findOne({ no_Bot: num });
              if (user) {
                if (user.checkExpiration()) await user.save();
                const pkg = user.paket ? user.paket.toLowerCase() : 'free';
                if (pkg === 'free') {
                  skipRestart = true;
                  console.log(chalk.red(`[WATCHDOG] Session ${num} package is free/expired. Removing from active loop.`));
                  const newActive = active.filter(n => n !== num);
                  fs.writeFileSync(activatePath, JSON.stringify(newActive));
                }
              }
            } catch (err) { }
          }

          if (!skipRestart) {
            console.log(chalk.blue(`[WATCHDOG] Session ${num} seems dead or stuck. Restarting...`));
            // Cleanup to allow fresh start
            if (botStatus.socks[num]) {
              try { botStatus.socks[num].end(undefined); } catch (e) { }
              delete botStatus.socks[num];
            }
            await NanoBotzInd(null, num).catch(e => { });
          }
        } else {
          // EVEN if connected, let's close it if their package expired WHILE connected.
          const mongoose = require('mongoose');
          if (mongoose.connection.readyState >= 1 || mongoose.connection.readyState === 2) {
            try {
              const User = require('./models/User');
              const user = await User.findOne({ no_Bot: num });
              if (user) {
                if (user.checkExpiration()) await user.save();
                const pkg = user.paket ? user.paket.toLowerCase() : 'free';
                if (pkg === 'free') {
                  console.log(chalk.red(`[WATCHDOG] Session ${num} package EXPIRED WHILE RUNNING. Stopping it.`));
                  try { botStatus.socks[num].end(undefined); } catch (e) { }
                  try { botStatus.socks[num].ws.close(); } catch (e) { }
                  delete botStatus.socks[num];
                  delete botStatus.states[num];

                  const newActive = active.filter(n => n !== num);
                  fs.writeFileSync(activatePath, JSON.stringify(newActive));
                }
              }
            } catch (err) { }
          }
        }
      }
    } catch (e) { }
  }
}, 10 * 60 * 1000);
}
