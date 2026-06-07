process.env.ZX_WINGS_WORKER = '1';
process.env.ZX_SKIP_AUTO_LOAD = '1';

const express = require('express');
const axios = require('axios');
const os = require('os');
const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone');
const { URL } = require('url');
const botService = require('./bot_service');

function getArg(name, fallback = '') {
    const index = process.argv.indexOf(`--${name}`);
    if (index !== -1 && process.argv[index + 1]) return process.argv[index + 1];
    return process.env[`WINGS_${name.toUpperCase()}`] || fallback;
}

const uuid = getArg('uuid');
const token = getArg('token');
const master = getArg('master', 'http://localhost:3000').replace(/\/$/, '');
const port = Number(getArg('port', '3101'));
const publicUrl = getArg('url', `http://localhost:${port}`).replace(/\/$/, '');
const restoreDelayMs = Math.max(Number(getArg('restore-delay', '8000')) || 8000, 1000);
const restoreTimeoutMs = Math.max(Number(getArg('restore-timeout', '300000')) || 300000, 60000);
const autoRestoreEnabled = getArg('auto-restore', '1') !== '0';

if (!uuid || !token) {
    console.error('[WINGS] UUID dan token wajib diisi. Jalankan command yang digenerate dari admin dashboard.');
    process.exit(1);
}

const app = express();
app.use(express.json({ limit: '15mb' }));

const defaultGroupSettings = {
    chatbot_grup: true,
    auto_ai_grup: false,
    goodbye: false,
    welcome: false,
    welcome_design: 'design1',
    sewa_group: {
        enabled: false,
        group_url: '',
        group_name: '',
        duration_type: '',
        expired_at: null
    }
};
const allowedWelcomeDesigns = new Set(['design1', 'design2', 'design3', 'design4']);

function normalizeBotNum(botNum) {
    return String(botNum || '').replace(/[^0-9]/g, '');
}

function getBotPaths(botNum) {
    const cleanNum = normalizeBotNum(botNum);
    return {
        botNum: cleanNum,
        sessionDir: path.join(__dirname, 'session', `device${cleanNum}`),
        dbDir: path.join(__dirname, 'database', `data${cleanNum}`),
        dbPath: path.join(__dirname, 'database', `data${cleanNum}`, 'database.json')
    };
}

function readJsonFile(filePath, fallback) {
    try {
        if (!fs.existsSync(filePath)) return fallback;
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (err) {
        return fallback;
    }
}

function writeJsonFile(filePath, data) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function getDb(botNum) {
    const { dbPath } = getBotPaths(botNum);
    const sock = botService.getBot(normalizeBotNum(botNum));
    if (sock && sock.db) return { db: sock.db, sock };
    return {
        db: readJsonFile(dbPath, { sticker: {}, database: {}, game: {}, others: {}, users: {}, chats: {}, settings: {} }),
        sock
    };
}

function saveDb(botNum, db, sock) {
    const { dbPath } = getBotPaths(botNum);
    writeJsonFile(dbPath, db);
    if (sock) {
        sock.db = db;
        sock.lastDbSync = Date.now();
    }
}

function normalizeGroupId(groupId) {
    const clean = String(groupId || '').trim();
    return clean.endsWith('@g.us') ? clean : '';
}

function normalizeInviteGroupId(groupId = '') {
    const clean = String(groupId || '').trim();
    if (!clean) return '';
    return clean.endsWith('@g.us') ? clean : `${clean}@g.us`;
}

function extractGroupInviteCode(url = '') {
    const clean = String(url || '').trim();
    const match = clean.match(/(?:chat\.whatsapp\.com\/|whatsapp\.com\/invite\/)([A-Za-z0-9_-]+)/i);
    return match ? match[1] : '';
}

function getAcceptedInviteGroupId(value) {
    if (!value) return '';
    if (typeof value === 'string') return normalizeInviteGroupId(value);
    if (typeof value === 'object') return normalizeInviteGroupId(value.gid || value.id || value.groupId || value.jid || value?.group?.id || '');
    return '';
}

function normalizeWelcomeDesign(value) {
    const design = String(value || '').trim().toLowerCase();
    return allowedWelcomeDesigns.has(design) ? design : defaultGroupSettings.welcome_design;
}

function normalizeGroupRental(value = {}) {
    const expiredAt = value.expired_at ? new Date(value.expired_at) : null;
    const validExpiredAt = expiredAt && !Number.isNaN(expiredAt.getTime()) ? expiredAt.toISOString() : null;
    return {
        enabled: !!(value.enabled && validExpiredAt && new Date(validExpiredAt) > new Date()),
        group_url: String(value.group_url || '').trim(),
        group_name: String(value.group_name || '').trim(),
        duration_type: String(value.duration_type || '').trim(),
        expired_at: validExpiredAt
    };
}

function setGroupEnabled(filePath, groupId, enabled) {
    const current = readJsonFile(filePath, []);
    const exists = current.includes(groupId);
    if (enabled && !exists) current.push(groupId);
    if (!enabled && exists) current.splice(current.indexOf(groupId), 1);
    writeJsonFile(filePath, current);
}

function upsertGroupText(filePath, groupId, text) {
    const current = readJsonFile(filePath, []);
    const idx = current.findIndex(item => item.id === groupId);
    const safeText = String(text || '').trim();
    if (!safeText) {
        if (idx >= 0) current.splice(idx, 1);
    } else if (idx >= 0) {
        current[idx].text = safeText;
    } else {
        current.push({ id: groupId, text: safeText });
    }
    writeJsonFile(filePath, current);
}

function statsPayload() {
    const memory = process.memoryUsage();
    return {
        cpuLoad: os.loadavg()[0],
        memoryRss: memory.rss,
        memoryHeapUsed: memory.heapUsed,
        uptime: process.uptime(),
        platform: os.platform()
    };
}

function heartbeatPayload() {
    return {
        uuid,
        token,
        url: publicUrl,
        hostname: os.hostname(),
        pid: process.pid,
        stats: statsPayload(),
        bots: botService.getLocalStatuses(),
        activeSessionBots: readActiveSessionBots()
    };
}

function readActiveSessionBots() {
    const activatePath = path.join(__dirname, 'session', 'activate_session.json');
    try {
        if (!fs.existsSync(activatePath)) return [];
        const active = JSON.parse(fs.readFileSync(activatePath, 'utf8'));
        return Array.isArray(active)
            ? active.map(botNum => normalizeBotNum(botNum)).filter(Boolean)
            : [];
    } catch (err) {
        return [];
    }
}

async function sendHeartbeat() {
    try {
        await axios.post(`${master}/api/wings/heartbeat`, heartbeatPayload(), { timeout: 15000 });
    } catch (err) {
        console.error('[WINGS] Gagal heartbeat ke master:', err.message);
    }
}

async function fetchRestoreList() {
    const response = await axios.post(`${master}/api/wings/restore-list`, { uuid, token }, { timeout: 15000 });
    return Array.isArray(response.data?.botNums) ? response.data.botNums : [];
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function restoreAssignedBots() {
    if (!autoRestoreEnabled) {
        console.log('[WINGS] Auto restore disabled.');
        return;
    }

    let botNums = [];
    try {
        botNums = await fetchRestoreList();
    } catch (err) {
        console.error('[WINGS] Gagal mengambil daftar auto-restore dari master:', err.message);
        return;
    }

    if (!botNums.length) {
        console.log('[WINGS] Tidak ada bot assigned untuk auto-restore.');
        return;
    }

    console.log(`[WINGS] Auto-restore ${botNums.length} bot assigned dengan delay ${restoreDelayMs}ms dan timeout ${restoreTimeoutMs}ms.`);
    for (const botNum of botNums) {
        try {
            const status = botService.getStatus(botNum);
            if (['open', 'connecting', 'qr', 'pairing'].includes(status.status)) {
                console.log(`[WINGS] Skip restore ${botNum}; status saat ini ${status.status}.`);
            } else {
                console.log(`[WINGS] Restoring bot ${botNum}...`);
                await botService.startLocal(null, botNum);
                await sendHeartbeat();
                scheduleStartCleanup(botNum);
            }
        } catch (err) {
            console.error(`[WINGS] Gagal restore bot ${botNum}:`, err.message);
        }
        await sleep(restoreDelayMs);
    }
}

function scheduleStartCleanup(botNum) {
    setTimeout(async () => {
        try {
            const status = botService.getStatus(botNum);
            if (status.isConnected || status.status === 'open') return;

            if (['connecting', 'qr', 'pairing', 'idle'].includes(status.status)) {
                console.log(`[WINGS] Start cleanup ${botNum}; status ${status.status} lebih dari ${restoreTimeoutMs}ms tanpa koneksi masuk.`);
                await botService.stopLocal(botNum);
                await sendHeartbeat();
            }
        } catch (err) {
            console.error(`[WINGS] Gagal cleanup start bot ${botNum}:`, err.message);
        }
    }, restoreTimeoutMs);
}

function requireMaster(req, res, next) {
    const requestToken = req.headers['x-wings-token'];
    const requestUuid = req.body.uuid || req.query.uuid;
    if (requestToken !== token || requestUuid !== uuid) {
        return res.status(403).json({ error: 'Invalid wings token' });
    }
    next();
}

app.get('/health', (req, res) => {
    res.json({ success: true, uuid, hostname: os.hostname(), stats: statsPayload(), bots: botService.getLocalStatuses(), activeSessionBots: readActiveSessionBots() });
});

app.post('/api/wings/bot/action', requireMaster, async (req, res) => {
    const { action, botNum, method } = req.body;
    if (!botNum) return res.status(400).json({ error: 'Nomor bot dibutuhkan' });

    try {
        if (action === 'start') {
            await botService.startLocal(method || 'pairing', botNum);
            scheduleStartCleanup(botNum);
            await sendHeartbeat();
            return res.json({ success: true, message: `Bot ${botNum} started on ${uuid}` });
        }

        if (action === 'stop') {
            await botService.stopLocal(botNum);
            await sendHeartbeat();
            return res.json({ success: true, message: `Bot ${botNum} stopped on ${uuid}` });
        }

        if (action === 'delete') {
            await botService.deleteSession(botNum);
            await sendHeartbeat();
            return res.json({ success: true, message: `Bot ${botNum} session deleted on ${uuid}` });
        }

        return res.status(400).json({ error: 'Invalid action' });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

app.post('/api/wings/bot/config/get', requireMaster, (req, res) => {
    const { sessionDir } = getBotPaths(req.body.botNum);
    const config = readJsonFile(path.join(sessionDir, 'config.json'), {});
    res.json({ success: true, config });
});

app.post('/api/wings/bot/config/save', requireMaster, (req, res) => {
    const { sessionDir } = getBotPaths(req.body.botNum);
    if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir, { recursive: true });
    const configPath = path.join(sessionDir, 'config.json');
    const oldConfig = readJsonFile(configPath, {});
    writeJsonFile(configPath, { ...oldConfig, ...(req.body.config || {}) });
    if (req.body.thumbnailBase64) {
        fs.writeFileSync(path.join(sessionDir, 'thumb.jpg'), Buffer.from(req.body.thumbnailBase64, 'base64'));
    }
    res.json({ success: true, message: 'Configuration saved on wings' });
});

app.post('/api/wings/bot/settings/get', requireMaster, (req, res) => {
    const botNum = normalizeBotNum(req.body.botNum);
    const botJid = `${botNum}@s.whatsapp.net`;
    const { db } = getDb(botNum);
    res.json({ success: true, settings: db.settings ? (db.settings[botJid] || {}) : {} });
});

app.post('/api/wings/bot/settings/save', requireMaster, (req, res) => {
    const botNum = normalizeBotNum(req.body.botNum);
    const botJid = `${botNum}@s.whatsapp.net`;
    const { db, sock } = getDb(botNum);
    if (!db.settings) db.settings = {};
    if (!db.users) db.users = {};
    if (!db.chats) db.chats = {};
    db.settings[botJid] = { ...(db.settings[botJid] || {}), ...(req.body.settings || {}) };
    if (db.settings[botNum]) delete db.settings[botNum];
    saveDb(botNum, db, sock);
    res.json({ success: true, message: 'Settings saved on wings' });
});

app.post('/api/wings/bot/groups', requireMaster, async (req, res) => {
    const sock = botService.getBot(normalizeBotNum(req.body.botNum));
    if (!sock || typeof sock.groupFetchAllParticipating !== 'function') {
        return res.status(400).json({ error: 'Bot belum tersambung di wings.' });
    }
    const groupsObj = await sock.groupFetchAllParticipating();
    const groups = Object.values(groupsObj || {}).map(group => ({
        id: group.id,
        subject: group.subject || group.name || group.id,
        desc: group.desc || '',
        size: Array.isArray(group.participants) ? group.participants.length : 0
    })).sort((a, b) => a.subject.localeCompare(b.subject));
    res.json({ success: true, botNumber: normalizeBotNum(req.body.botNum), groups });
});

app.post('/api/wings/bot/group-settings/get', requireMaster, (req, res) => {
    const groupId = normalizeGroupId(req.body.groupId);
    if (!groupId) return res.status(400).json({ error: 'Group ID tidak valid' });
    const { dbDir } = getBotPaths(req.body.botNum);
    const { db } = getDb(req.body.botNum);
    if (!db.settings) db.settings = {};
    const welcomeList = readJsonFile(path.join(dbDir, 'welcome.json'), []);
    const leftList = readJsonFile(path.join(dbDir, 'left.json'), []);
    const welcomeTexts = readJsonFile(path.join(dbDir, 'set_welcome.json'), []);
    const goodbyeTexts = readJsonFile(path.join(dbDir, 'set_left.json'), []);
    const settings = {
        ...defaultGroupSettings,
        ...(db.settings[groupId] || {}),
        welcome: welcomeList.includes(groupId) || !!db.settings[groupId]?.welcome,
        goodbye: leftList.includes(groupId) || !!db.settings[groupId]?.goodbye,
        welcome_text: db.settings[groupId]?.welcome_text || welcomeTexts.find(item => item.id === groupId)?.text || '',
        goodbye_text: db.settings[groupId]?.goodbye_text || goodbyeTexts.find(item => item.id === groupId)?.text || '',
        sewa_group: normalizeGroupRental(db.settings[groupId]?.sewa_group)
    };
    res.json({ success: true, groupId, settings });
});

app.post('/api/wings/bot/group-settings/save', requireMaster, (req, res) => {
    const groupId = normalizeGroupId(req.body.groupId);
    if (!groupId) return res.status(400).json({ error: 'Group ID tidak valid' });
    const { dbDir } = getBotPaths(req.body.botNum);
    const { db, sock } = getDb(req.body.botNum);
    if (!db.settings) db.settings = {};
    const body = req.body.settings || {};
    const boolKeys = ['chatbot_grup', 'auto_ai_grup', 'goodbye', 'welcome'];
    const previousSettings = db.settings[groupId] && typeof db.settings[groupId] === 'object' ? db.settings[groupId] : {};
    const nextSettings = { ...defaultGroupSettings, sewa_group: normalizeGroupRental(previousSettings.sewa_group) };
    boolKeys.forEach(key => { nextSettings[key] = !!body[key]; });
    nextSettings.welcome_design = normalizeWelcomeDesign(body.welcome_design);
    nextSettings.welcome_text = String(body.welcome_text || '').trim();
    nextSettings.goodbye_text = String(body.goodbye_text || '').trim();
    db.settings[groupId] = { ...previousSettings, ...nextSettings };
    setGroupEnabled(path.join(dbDir, 'welcome.json'), groupId, nextSettings.welcome);
    setGroupEnabled(path.join(dbDir, 'left.json'), groupId, nextSettings.goodbye);
    setGroupEnabled(path.join(dbDir, 'mute.json'), groupId, nextSettings.chatbot_grup === false);
    upsertGroupText(path.join(dbDir, 'set_welcome.json'), groupId, nextSettings.welcome_text);
    upsertGroupText(path.join(dbDir, 'set_left.json'), groupId, nextSettings.goodbye_text);
    saveDb(req.body.botNum, db, sock);
    res.json({ success: true, message: 'Pengaturan grup berhasil disimpan di wings', settings: db.settings[groupId] });
});

app.post('/api/wings/bot/group-invite-preview', requireMaster, async (req, res) => {
    const inviteCode = extractGroupInviteCode(req.body.url);
    if (!inviteCode) return res.status(400).json({ error: 'URL invite group WhatsApp tidak valid' });
    const sock = botService.getBot(normalizeBotNum(req.body.botNum));
    if (!sock || typeof sock.groupGetInviteInfo !== 'function') return res.status(400).json({ error: 'Bot belum tersambung di wings.' });
    const info = await sock.groupGetInviteInfo(inviteCode);
    const inviteGroupId = normalizeInviteGroupId(info?.id);
    const groupsObj = typeof sock.groupFetchAllParticipating === 'function' ? await sock.groupFetchAllParticipating() : {};
    const joined = inviteGroupId ? Object.prototype.hasOwnProperty.call(groupsObj || {}, inviteGroupId) : false;
    res.json({ success: true, group: { id: inviteGroupId, subject: info?.subject || info?.name || 'Group WhatsApp', desc: info?.desc || '', size: Array.isArray(info?.participants) ? info.participants.length : (info?.size || 0), joined } });
});

app.post('/api/wings/bot/group-rental/save', requireMaster, async (req, res) => {
    const selectedGroupId = normalizeGroupId(req.body.groupId);
    const body = req.body.rental || {};
    const groupUrl = String(body.group_url || '').trim();
    const durationType = String(body.duration_type || '').trim();
    const customDate = String(body.custom_date || '').trim();
    const groupName = String(body.group_name || '').trim();
    const inviteCode = extractGroupInviteCode(groupUrl);
    if (!groupUrl) return res.status(400).json({ error: 'URL group wajib diisi' });
    if (!inviteCode) return res.status(400).json({ error: 'URL invite group WhatsApp tidak valid' });
    let expiredAt;
    if (['7', '15', '30'].includes(durationType)) expiredAt = moment().tz('Asia/Jakarta').add(Number(durationType), 'days').endOf('day').toDate();
    else if (durationType === 'custom' && customDate) expiredAt = moment.tz(customDate, 'YYYY-MM-DD', 'Asia/Jakarta').endOf('day').toDate();
    if (!expiredAt || Number.isNaN(expiredAt.getTime()) || expiredAt <= new Date()) return res.status(400).json({ error: 'Durasi atau tanggal masa aktif tidak valid' });
    const sock = botService.getBot(normalizeBotNum(req.body.botNum));
    if (!sock) return res.status(400).json({ error: 'Bot belum tersambung di wings.' });
    const inviteInfo = typeof sock.groupGetInviteInfo === 'function' ? await sock.groupGetInviteInfo(inviteCode) : null;
    let targetGroupId = normalizeInviteGroupId(inviteInfo?.id) || selectedGroupId;
    let joinedByBot = false;
    const groupsObj = typeof sock.groupFetchAllParticipating === 'function' ? await sock.groupFetchAllParticipating() : {};
    const alreadyJoined = targetGroupId && Object.prototype.hasOwnProperty.call(groupsObj || {}, targetGroupId);
    if (!alreadyJoined) {
        if (typeof sock.groupAcceptInvite !== 'function') return res.status(400).json({ error: 'Bot tidak mendukung join group otomatis dari URL invite' });
        const joinedId = await sock.groupAcceptInvite(inviteCode);
        targetGroupId = getAcceptedInviteGroupId(joinedId) || targetGroupId;
        joinedByBot = true;
    }
    if (!targetGroupId) return res.status(400).json({ error: 'Group ID dari URL invite tidak valid' });
    const { db, sock: dbSock } = getDb(req.body.botNum);
    if (!db.settings) db.settings = {};
    const previousSettings = db.settings[targetGroupId] && typeof db.settings[targetGroupId] === 'object' ? db.settings[targetGroupId] : {};
    db.settings[targetGroupId] = {
        ...defaultGroupSettings,
        ...previousSettings,
        sewa_group: {
            enabled: true,
            group_url: groupUrl,
            group_name: groupName || inviteInfo?.subject || inviteInfo?.name || '',
            duration_type: durationType,
            expired_at: expiredAt.toISOString()
        }
    };
    saveDb(req.body.botNum, db, dbSock);
    res.json({ success: true, message: joinedByBot ? 'Bot berhasil join dan sewa group berhasil disimpan di wings' : 'Sewa group berhasil disimpan di wings', joined: joinedByBot, groupId: targetGroupId, group: { id: targetGroupId, subject: db.settings[targetGroupId].sewa_group.group_name || inviteInfo?.subject || 'Group WhatsApp' }, sewa_group: normalizeGroupRental(db.settings[targetGroupId].sewa_group) });
});

app.listen(port, async () => {
    try {
        new URL(master);
    } catch (err) {
        console.warn('[WINGS] Master URL tampaknya tidak valid:', master);
    }

    console.log(`[WINGS] Allocation ${uuid} online di ${publicUrl}`);
    console.log(`[WINGS] Register ke master ${master}`);
    await sendHeartbeat();
    setInterval(sendHeartbeat, 15000);
    setTimeout(() => {
        restoreAssignedBots().catch(err => console.error('[WINGS] Auto restore error:', err.message));
    }, 3000);
});
