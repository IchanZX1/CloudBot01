const fs = require("fs");
const path = require("path");

// =================================================================
// 💰 Durasi Cooldown (dalam milidetik)
// Kamu bisa mengubah durasi cooldown di sini
// =================================================================
const COOLDOWN_DURATIONS = {
  daily: 24 * 60 * 60 * 1000, // 24 jam
  mining: 30 * 60 * 1000, // 30 menit
  work: 60 * 60 * 1000, // 1 jam
  // Tambahkan tipe cooldown lain jika perlu
};

function getExpPath(botId) {
  const dir = "./database";
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, `${botId}.json`);
}

function loadExpData(botId) {
  const file = getExpPath(botId);
  if (!fs.existsSync(file)) fs.writeFileSync(file, "{}");
  return JSON.parse(fs.readFileSync(file));
}

function saveExpData(botId, data) {
  fs.writeFileSync(getExpPath(botId), JSON.stringify(data, null, 2));
}

// =================================================================
// 🟢 FUNGSI BARU: Untuk memeriksa cooldown
// =================================================================
/**
 * Memeriksa apakah user sedang dalam masa cooldown.
 * @param {string} botId ID bot.
 * @param {string} userJid JID user.
 * @param {('daily'|'mining'|'work')} type Tipe cooldown.
 * @returns {{onCooldown: boolean, remaining: number, formatted: string}}
 */
function checkCooldown(botId, userJid, type) {
  const data = loadExpData(botId);
  const user = data[userJid];

  // Jika user atau objek cooldown tidak ada, anggap tidak cooldown
  if (!user || !user.cooldown || !user.cooldown[type]) {
    return { onCooldown: false, remaining: 0, formatted: "0 detik" };
  }

  const lastTime = user.cooldown[type];
  const duration = COOLDOWN_DURATIONS[type];
  const now = Date.now();
  const elapsed = now - lastTime;

  if (elapsed < duration) {
    const remaining = duration - elapsed;
    return {
      onCooldown: true,
      remaining: remaining,
      formatted: formatDuration(remaining),
    };
  }

  return { onCooldown: false, remaining: 0, formatted: "0 detik" };
}

// =================================================================
// 🟢 FUNGSI BARU: Untuk mengatur/memulai cooldown
// =================================================================
/**
 * Mengatur waktu cooldown untuk user.
 * @param {string} botId ID bot.
 * @param {string} userJid JID user.
 * @param {('daily'|'mining'|'work')} type Tipe cooldown.
 */
function setCooldown(botId, userJid, type) {
  const data = loadExpData(botId);
  // Pastikan user dan objek cooldown ada
  if (data[userJid] && data[userJid].cooldown) {
    data[userJid].cooldown[type] = Date.now();
    saveExpData(botId, data);
  }
}

// =================================================================
// 🟢 FUNGSI BARU (HELPER): Untuk format sisa waktu
// =================================================================
/**
 * Mengubah milidetik menjadi format yang mudah dibaca (jam, menit, detik).
 * @param {number} ms Milidetik.
 * @returns {string}
 */
function formatDuration(ms) {
  if (ms < 0) ms = 0;
  const time = {
    jam: Math.floor(ms / 3600000),
    menit: Math.floor((ms % 3600000) / 60000),
    detik: Math.floor((ms % 60000) / 1000),
  };
  return Object.entries(time)
    .filter((val) => val[1] !== 0)
    .map(([key, val]) => `${val} ${key}`)
    .join(" ");
}

function addExp(botId, userJid, amount = 2, isTebakGame = false) {
  const data = loadExpData(botId);

  if (!data[userJid]) {
    data[userJid] = {
      exp: 0,
      level: 1,
      coins: 0,
      lastExp: 0,
      nextExpTime: 0,
      dailyCount: 0,
      lastDay: new Date().getDate(),
      cooldown: {
        daily: 0,
        mining: 0,
        work: 0,
      },
    };
  }

  if (!data[userJid].cooldown) {
    data[userJid].cooldown = { daily: 0, mining: 0, work: 0 };
  }

  const user = data[userJid];
  const now = Date.now();
  const today = new Date().getDate();

  if (user.lastDay !== today) {
    user.dailyCount = 0;
    user.lastDay = today;
  }

  if (!isTebakGame) {
    if (now < (user.nextExpTime || 0)) return user;
    if (user.dailyCount >= 120) return user;
  }

  const randomExp = Math.floor(Math.random() * 2) + 1;
  const randomCoin = Math.floor(Math.random() * 4) + 1;
  user.coins = (user.coins || 0) + randomCoin;

  if (isTebakGame) {
    user.exp += amount;
  } else {
    user.exp += randomExp;
  }

  user.lastExp = now;
  user.dailyCount += 1;

  if (!isTebakGame) {
    user.nextExpTime = now + 600000;
  }

  const newLevel = Math.floor(user.exp / 100) + 1;
  if (newLevel > user.level) user.level = newLevel;

  saveExpData(botId, data);
  return user;
}

function addCoins(botId, userJid, amount = 1) {
  const data = loadExpData(botId); // Ambil data exp.json

  // Jika user belum punya data, buat baru
  if (!data[userJid]) {
    data[userJid] = {
      exp: 0,
      level: 1,
      coins: 0,
      lastExp: 0,
      nextExpTime: 0,
      dailyCount: 0,
      lastDay: new Date().getDate(),
      cooldown: {
        daily: 0,
        mining: 0,
        work: 0,
      },
    };
  }

  // Tambahkan coin
  data[userJid].coins = (data[userJid].coins || 0) + amount;

  // Simpan ke file
  saveExpData(botId, data);

  return data[userJid]; // Optional: kembalikan data user
}

function getUserExp(botId, userJid) {
  const data = loadExpData(botId);
  return (
    data[userJid] || {
      exp: 0,
      level: 1,
      coins: 0,
      lastExp: 0,
      nextExpTime: 0,
      dailyCount: 0,
      lastDay: new Date().getDate(),
      cooldown: { daily: 0, mining: 0, work: 0 },
    }
  );
}

/**
 * ⚔️ Fantasy Rank System
 */
function getRank(level) {
  if (level < 5) return "🥉 *Newbie Bot*";
  if (level < 10) return "🥈 *Adept Warrior*";
  if (level < 15) return "🥇 *Battle Mage*";
  if (level < 20) return "💎 *Shadow Knight*";
  if (level < 25) return "🔥 *Dragon Slayer*";
  if (level < 30) return "🌌 *Ethereal Lord*";
  if (level < 40) return "⚔️ *Mythic Overlord*";
  if (level < 50) return "🌠 *Celestial Guardian*";
  if (level < 75) return "🕊️ *Divine Archon*";
  if (level < 100) return "💫 *Chrono Sage*";
  if (level < 150) return "🌙 *Arcane Warden*";
  if (level < 200) return "🌀 *Phantom Emperor*";
  if (level < 250) return "🔥 *Infernal Warlord*";
  if (level < 300) return "❄️ *Frost Monarch*";
  if (level < 350) return "🌋 *Crimson Tyrant*";
  if (level < 400) return "⚡ *Stormbringer Titan*";
  if (level < 450) return "🌌 *Cosmic Conqueror*";
  if (level < 500) return "🪐 *Eternal Dominator*";
  if (level < 600) return "👁️ *Void Emperor*";
  if (level < 700) return "🦋 *Transcendent Deity*";
  if (level < 800) return "💀 *Oblivion Monarch*";
  if (level < 900) return "🩸 *Abyssal Sovereign*";
  if (level < 1000) return "🌠 *Galactic Paragon*";
  if (level < 1500) return "⚔️ *Supreme Celestial God*";
  if (level < 2000) return "🔥 *Primordial Creator*";
  if (level < 3000) return "💎 *Eternal Reality Weaver*";
  if (level < 4000) return "🌌 *Infinite Ascendant*";
  if (level < 5000) return "👑 *Omniversal Lord*";
  if (level < 10000) return "💫 *Origin of All Realms*";
  return "🌌👑 *Supreme Eternal Deity*";
}

/**
 * 📊 Progress bar visual
 */
function getProgressBar(exp, expPerLevel = 100, barLength = 12, level = 1) {
  const currentLevelExp = Math.floor(exp / expPerLevel) * expPerLevel;
  const progress = exp - currentLevelExp;
  const percentage = Math.min(100, Math.floor((progress / expPerLevel) * 100));

  const filledBlocks = Math.round((percentage / 100) * barLength);
  const emptyBlocks = barLength - filledBlocks;

  let bar;
  if (level <= 9) {
    const filled = "▰".repeat(filledBlocks);
    const empty = "▱".repeat(emptyBlocks);
    bar = `${filled}${empty} ${percentage}%`;
  } else {
    let filledEmoji = "🟩";
    let emptyEmoji = "⬜️";
    if (level >= 10 && level < 25) filledEmoji = "🟦";
    else if (level >= 25 && level < 50) filledEmoji = "🟪";
    else if (level >= 50 && level < 100) filledEmoji = "🟨";
    else if (level >= 100 && level < 500) filledEmoji = "🟧";
    else if (level >= 500) filledEmoji = "🟥";
    bar = `${filledEmoji.repeat(filledBlocks)}${emptyEmoji.repeat(emptyBlocks)} ${percentage}%`;
  }

  return bar;
}

// =================================================================
// ⚠️ PENTING: Tambahkan fungsi baru ke sini
// =================================================================
module.exports = {
  addExp,
  addCoins,
  getUserExp,
  loadExpData,
  saveExpData,
  getRank,
  getProgressBar,
  checkCooldown, // <-- TAMBAHKAN INI
  setCooldown, // <-- TAMBAHKAN INI
};
