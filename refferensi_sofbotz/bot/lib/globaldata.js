const fs = require("fs-extra");
const { Pool } = require("pg");
const conf = require("../../config.json");

const dbPath = "./database/globaldata.json";

// 🧠 PostgreSQL connection
const db = new Pool({
  host: conf.server.db.host,
  user: conf.server.db.user,
  password: conf.server.db.password,
  database: conf.server.db.database,
  port: conf.server.db.port,
});

let globaldb = loadDB();

if (!fs.existsSync(dbPath)) {
  fs.ensureFileSync(dbPath);
  fs.writeFileSync(dbPath, JSON.stringify({ databotzz: {} }, null, 2));
}

// ====================== FILE SYSTEM HANDLER ======================
function loadDB() {
  try {
    const raw = fs.readFileSync(dbPath, "utf8");

    // kalau file kosong (""), langsung reset biar gak error JSON.parse
    if (!raw.trim()) throw new Error("File kosong");

    return JSON.parse(raw);
  } catch (err) {
    console.warn(
      `[GLOBALDB] ⚠️ File rusak atau kosong (${err.message}). Membuat ulang...`
    );
    const def = { databotzz: {} };
    fs.writeFileSync(dbPath, JSON.stringify(def, null, 2));
    return def;
  }
}

function saveGlobalDB() {
  try {
    fs.writeFileSync(dbPath + ".tmp", JSON.stringify(globaldb, null, 2));
    fs.renameSync(dbPath + ".tmp", dbPath);
  } catch (err) {
    console.error("[GLOBALDB] ❌ Error saving:", err.message);
  }
}

// ====================== GROUP DATA ======================
function getData(botId, groupId) {
  globaldb = loadDB();

  if (!botId || !groupId) return {};
  if (!globaldb.databotzz[botId]) globaldb.databotzz[botId] = {};
  if (!globaldb.databotzz[botId][groupId])
    globaldb.databotzz[botId][groupId] = {};
  return globaldb.databotzz[botId][groupId];
}

function setData(botId, groupId, key, value) {
  globaldb = loadDB();

  if (!botId || !groupId) return;
  if (!globaldb.databotzz[botId]) globaldb.databotzz[botId] = {};
  if (!globaldb.databotzz[botId][groupId])
    globaldb.databotzz[botId][groupId] = {};

  globaldb.databotzz[botId][groupId][key] = value;
  saveGlobalDB();

  console.log(
    `[GLOBALDB] ✅ Updated: ${botId} → ${groupId} → ${key}: ${value}`
  );
  return globaldb.databotzz[botId][groupId];
}

function delData(botId, groupId, key) {
  globaldb = loadDB();
  if (globaldb.databotzz?.[botId]?.[groupId]?.[key] !== undefined) {
    delete globaldb.databotzz[botId][groupId][key];
    saveGlobalDB();
  }
}

// ====================== GLOBAL (SYNC DB) ======================
function setGlobal(botId, key, value) {
  try {
    if (!botId) return;

    globaldb = loadDB();

    // pastikan struktur JSON lengkap
    if (!globaldb.databotzz) globaldb.databotzz = {};
    if (!globaldb.databotzz[botId]) globaldb.databotzz[botId] = {};

    // simpan value ke dalam key yang ditentukan
    globaldb.databotzz[botId][key] = value;

    // tulis ulang file JSON biar persist
    saveGlobalDB();

    console.log(
      `[GLOBALDB] 🌍 Updated global for ${botId} → ${key}: ${JSON.stringify(value)}`
    );
  } catch (err) {
    console.error(`[GLOBALDB] ❌ Gagal setGlobal untuk ${botId}:`, err.message);
  }
}

// 🔥 getGlobal versi hybrid (PostgreSQL + local fallback)
async function getGlobal(botId) {
  try {
    if (!botId) return {};

    // 🔍 Coba ambil dari database PostgreSQL dulu
    const res = await db.query(
      "SELECT global_disabled FROM bot WHERE id = $1",
      [botId]
    );
    if (res.rows.length > 0 && res.rows[0].global_disabled) {
      return { global_disabled: res.rows[0].global_disabled };
    }

    // 🔁 fallback ke file JSON lokal
    const raw = fs.readFileSync(dbPath, "utf8");

    // Kalau file kosong atau gak valid, langsung return {}
    if (!raw.trim()) {
      console.warn(
        `[GLOBALDB] ⚠️ File ${dbPath} kosong. Mengembalikan default object.`
      );
      return {};
    }

    const data = JSON.parse(raw);
    return data.databotzz?.[botId] || {};
  } catch (err) {
    console.error(
      `[GLOBALDB] ❌ Error loading global (${botId}):`,
      err.message
    );
    return {};
  }
}

function getAll() {
  globaldb = loadDB();
  return globaldb.databotzz;
}

// ====================== EXPORT ======================
module.exports = {
  getData,
  setData,
  delData,
  getAll,
  saveGlobalDB,
  setGlobal,
  getGlobal,
};
