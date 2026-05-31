const fs = require("fs");
const path = require("path");

function initLimit(botId, defaultLimit = global.limitawal.free) {
  const file = getLimitFile(botId);
  let db = {};

  if (fs.existsSync(file)) {
    db = JSON.parse(fs.readFileSync(file));
  }

  // kalau kosong atau masih default lama, update
  if (!db.__default || db.__default !== defaultLimit) {
    db.__default = defaultLimit;
    saveLimitDB(botId, db);
  }
}

function getLimitFile(botId) {
  const dir = "./database/limits";
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const safeId = botId && botId !== "null" ? botId : "default";
  return path.join(dir, `limit_${safeId}.json`);
}

function loadLimitDB(botId) {
  const file = getLimitFile(botId);
  if (fs.existsSync(file)) {
    return JSON.parse(fs.readFileSync(file));
  } else {
    const init = {};
    fs.writeFileSync(file, JSON.stringify(init, null, 2));
    return init;
  }
}

function saveLimitDB(botId, db) {
  const file = getLimitFile(botId);
  fs.writeFileSync(file, JSON.stringify(db, null, 2));
}

// ✅ ambil limit user tanpa reset, pake default dari DB/dash kalau ada
function getLimit(botId, userId, defaultLimit = global.limitawal.free) {
  let db = loadLimitDB(botId);
  if (!db[userId]) {
    db[userId] = { limit: defaultLimit }; // default bisa 100, 500, dll tergantung DB
    saveLimitDB(botId, db);
  }
  return db[userId].limit;
}

// ✅ kurangi limit user
function reduceLimit(botId, userId, defaultLimit = global.limitawal.free) {
  let db = loadLimitDB(botId);
  if (!db[userId]) db[userId] = { limit: defaultLimit };
  if (db[userId].limit > 0) db[userId].limit -= 1;
  saveLimitDB(botId, db);
  return db[userId].limit;
}

// ✅ set manual limit user
function setLimit(botId, userId, value) {
  let db = loadLimitDB(botId);
  db[userId] = { limit: value };
  saveLimitDB(botId, db);
  return db[userId].limit;
}

// ✅ cek apakah user masih punya limit
function hasLimit(botId, userId, defaultLimit = global.limitawal.free) {
  return getLimit(botId, userId, defaultLimit) > 0;
}

// ✅ reset semua user dalam 1 bot
function resetAllUserLimit(botId, newLimit) {
  let db = loadLimitDB(botId);
  for (let user in db) {
    if (user !== "__default") {
      db[user].limit = newLimit;
    }
  }
  db.__default = newLimit;
  saveLimitDB(botId, db);
  return newLimit;
}

function checkLimit(botId, userId, defaultLimit = global.limitawal.free) {
  let db = loadLimitDB(botId);
  if (!db[userId]) db[userId] = { limit: defaultLimit };
  return db[userId].limit;
}

module.exports = {
  initLimit,
  getLimit,
  reduceLimit,
  setLimit,
  hasLimit,
  resetAllUserLimit,
  checkLimit,
  loadLimitDB,
  saveLimitDB,
};
