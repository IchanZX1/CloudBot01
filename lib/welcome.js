const fs = require('fs');
const { Telegraph } = require('./uploader');
const { getRandom, smsg, isUrl, generateMessageTag, getBuffer, getSizeMedia, fetchJson, delay, sleep } = require('./myfunc');
const { isSetWelcome, getTextSetWelcome } = require('./setwelcome');
const { isSetLeft, getTextSetLeft } = require('./setleft');
let setting = JSON.parse(fs.readFileSync('./config.json'));
const welcome2 = setting.auto_welcomeMsg;
const leave2 = setting.auto_leaveMsg;
const {
  proto,
  jidDecode,
  jidNormalizedUser,
  generateForwardMessageContent,
  generateWAMessageFromContent,
  downloadContentFromMessage,
} = require('@whiskeysockets/baileys');
const moment = require('moment-timezone');

function readJson(filePath, fallback) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath));
  } catch (err) {
    return fallback;
  }
}

function getSessionDbDir(NanoBotz) {
  try {
    const botJid = NanoBotz.decodeJid(NanoBotz.user.id);
    const botNumber = botJid.split('@')[0];
    return `./database/data${botNumber}/`;
  } catch (err) {
    return './database/';
  }
}

function applyGroupPlaceholders(text, userJid, groupName, groupDesc) {
  return String(text || '')
    .replace(/@user/gi, `@${userJid.split('@')[0]}`)
    .replace(/@grup/gi, groupName || '')
    .replace(/@group/gi, groupName || '')
    .replace(/@desc/gi, groupDesc || '');
}

function normalizeWelcomeDesign(value) {
  return ['design1', 'design2', 'design3', 'design4'].includes(value) ? value : 'design1';
}

function buildWelcomeCanvasUrl(design, data) {
  const selected = normalizeWelcomeDesign(design);
  const defaultBackground = 'https://i.ibb.co/4YBNyvP/images-76.jpg';
  const sunsetBackground = 'https://i.ibb.co/4YBNyvP/mountain-sunset.jpg';
  const params = new URLSearchParams();

  if (selected === 'design1') {
    params.set('username', data.username);
    params.set('guildName', data.guildName);
    params.set('guildIcon', data.guildIcon);
    params.set('memberCount', String(data.memberCount));
    params.set('avatar', data.avatar);
    params.set('background', defaultBackground);
    params.set('quality', '80');
    return `https://api.siputzx.my.id/api/canvas/welcomev1?${params.toString()}`;
  }

  if (selected === 'design2') {
    params.set('username', data.username);
    params.set('guildName', data.guildName);
    params.set('memberCount', String(data.memberCount));
    params.set('avatar', data.avatar);
    params.set('background', defaultBackground);
    return `https://api.siputzx.my.id/api/canvas/welcomev2?${params.toString()}`;
  }

  if (selected === 'design3') {
    params.set('avatar', data.avatar);
    params.set('background', defaultBackground);
    params.set('description', data.description || `Welcome ${data.username}!`);
    return `https://api.siputzx.my.id/api/canvas/welcomev4?${params.toString()}`;
  }

  params.set('username', data.username);
  params.set('guildName', data.guildName);
  params.set('memberCount', String(data.memberCount));
  params.set('avatar', data.avatar);
  params.set('background', sunsetBackground);
  params.set('quality', '90');
  return `https://api.siputzx.my.id/api/canvas/welcomev5?${params.toString()}`;
}

module.exports.welcome = async (iswel, isleft, NanoBotz, anu) => {
  try {
    const sessionDbDir = getSessionDbDir(NanoBotz);
    const set_welcome_db = readJson(sessionDbDir + 'set_welcome.json', readJson('./database/set_welcome.json', []));
    const set_left_db = readJson(sessionDbDir + 'set_left.json', readJson('./database/set_left.json', []));
    const metadata = await NanoBotz.groupMetadata(anu.id);
    const participants = anu.participants;
    const memeg = metadata.participants.length;
    const groupName = metadata.subject;
    const groupDesc = metadata.desc;
    const groupSettings = NanoBotz.db && NanoBotz.db.settings ? (NanoBotz.db.settings[anu.id] || {}) : {};
    const welcomeDesign = normalizeWelcomeDesign(groupSettings.welcome_design);

    for (let num of participants) {
      const fkontaku = {
        key: {
          participant: `0@s.whatsapp.net`,
          ...(anu.id ? { remoteJid: `6283136505591-1614953337@g.us` } : {})
        },
        message: {
          'contactMessage': {
            'displayName': ``,
            'vcard': `BEGIN:VCARD\nVERSION:3.0\nN:XL;,;;;\nFN:,\nitem1.TEL;waid=${num.split('@')[0]}:${num.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
            'jpegThumbnail': setting.pathimg,
            thumbnail: setting.pathimg,
            sendEphemeral: true
          }
        }
      };

      let pp_user, ppgroup;
      try {
        pp_user = await NanoBotz.profilePictureUrl(num, 'image');
      } catch {
        pp_user = 'https://telegra.ph/file/c3f3d2c2548cbefef1604.jpg';
      }

      try {
        ppgroup = await NanoBotz.profilePictureUrl(anu.id, 'image');
      } catch {
        ppgroup = 'https://telegra.ph/file/c3f3d2c2548cbefef1604.jpg';
      }

      if (anu.action == 'add' && iswel) {
        const pushName = NanoBotz.getName(num);
        const savedWelcomeText = String(groupSettings.welcome_text || '').trim();
        let full_pesan;

        if (savedWelcomeText) {
          full_pesan = applyGroupPlaceholders(savedWelcomeText, num, groupName, groupDesc);
        } else if (isSetWelcome(anu.id, set_welcome_db)) {
          var get_teks_welcome = await getTextSetWelcome(anu.id, set_welcome_db);
          full_pesan = applyGroupPlaceholders(get_teks_welcome, num, groupName, groupDesc);
        } else {
          full_pesan = `Hallo @${num.split('@')[0]}\nSelamat Bergabung Di Group ${groupName}, Jangan Lupa Intro Ya!\nPatuhi Rules Yang Ada\n\n.\n${groupDesc}\n`;
        }

        const canvasWelcome = buildWelcomeCanvasUrl(welcomeDesign, {
          username: pushName,
          guildName: groupName,
          guildIcon: ppgroup,
          memberCount: memeg,
          avatar: pp_user,
          description: full_pesan.replace(/\s+/g, ' ').slice(0, 140)
        });

        await NanoBotz.sendMessage(anu.id, { image: { url: canvasWelcome }, caption: full_pesan, mentions: [num] });
      } else if (anu.action == 'remove' && isleft) {
        const pushName = NanoBotz.getName(num);
        const canvasLeft = `https://api.siputzx.my.id/api/canvas/goodbyev5?username=${encodeURIComponent(pushName)}&guildName=${encodeURIComponent(groupName)}&memberCount=${memeg}&avatar=${encodeURIComponent(pp_user)}&background=https%3A%2F%2Fi.ibb.co%2F4YBNyvP%2Fmountain-sunset.jpg&quality=90`;
        const savedGoodbyeText = String(groupSettings.goodbye_text || '').trim();
        if (savedGoodbyeText) {
          var full_pesan = applyGroupPlaceholders(savedGoodbyeText, num, groupName, groupDesc);
          await NanoBotz.sendMessage(anu.id, { image: { url: canvasLeft }, caption: full_pesan, mentions: [num] });
        } else if (isSetLeft(anu.id, set_left_db)) {
          var get_teks_left = await getTextSetLeft(anu.id, set_left_db);
          var full_pesan = applyGroupPlaceholders(get_teks_left, num, groupName, groupDesc);
          await NanoBotz.sendMessage(anu.id, { image: { url: canvasLeft }, caption: full_pesan, mentions: [num] });
        } else {
          var anubis = `Dadah @${num.split('@')[0]}\nSelamat Tinggal Dari Group ${groupName}\n!\nPatuhi Rules Yang Ada\n\n.\n${groupDesc}\n`;
          await NanoBotz.sendMessage(anu.id, { image: { url: canvasLeft }, caption: anubis, mentions: [num] });
        }
      } else if (anu.action == 'promote') {
        await NanoBotz.sendMessage(anu.id, {
          text: `Selamat @${num.split('@')[0]}\nKamu Telah Di promote Di ${groupName}\n`,
          mentions: [num]
        });
      } else if (anu.action == 'demote') {
        await NanoBotz.sendMessage(anu.id, {
          text: `Selamat Ya @${num.split('@')[0]}\nKamu telah Di Demote Dari ${groupName}\n`,
          mentions: [num]
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports.aDelete = async (setting, NanoBotz, m) => {
  if (setting.antiDelete) {
    try {
      const dataChat = global.dbc;
      const mess = dataChat.find((a) => a.id == m.id);
      const mek = mess.m;
      const participant = mek.key.remoteJid.endsWith('@g.us') ? mek.key.participant : mek.key.remoteJid;
      console.log(participant);
      const froms = mek.key.remoteJid;
      await NanoBotz.sendMessage(
        froms, {
        text: `「 *ANTI DELETE MESSAGE* 」
    
📛 *Name* : ${mek.pushName}
👤 *User* : @${mek.sender.split('@')[0]}
⏰ *Clock* : ${moment.tz('Asia/Jakarta').format('HH:mm:ss')} WIB 
✍️ *MessageType* : ${mek.mtype}
    `,
        mentions: [participant],
      }, {
        quoted: mek,
      }
      );

      await NanoBotz.copyNForward(froms, mek, true);
      await delay(4000);
      let messek = dataChat.find((a) => a.id == m.id);
      for (let [i, te] of dataChat.entries()) {
        if (te.id === m.id) {
          dataChat.splice(i, 1); // Tim is now removed from "users"
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
};

module.exports.oneTime = async (setting, NanoBotz, m) => {
  if (setting.antiViewOnce) {
    try {
      let teks = `「 *ANTI VIEWONCE MESSAGE* 」
      
📛 *Name* : ${m.pushName}
👤 *User* : @${m.sender.split('@')[0]}
⏰ *Clock* : ${moment.tz('Asia/Jakarta').format('HH:mm:ss')} WIB  
✍️ *MessageType* : ${m.mtype}
💬 *Caption* : ${m.msg.caption ? m.msg.caption : 'no caption'}`;

      await NanoBotz.sendTextWithMentions(m.chat, teks, m);
      await delay(500);

      NanoBotz.copyNForward(m.chat, true, {
        readViewOnce: true,
        quoted: m,
      });
    } catch (err) {
      console.log(err);
    }
  }
};
