const fs = require('fs');
const path = require('path');
const os = require('os');
const axios = require('axios');
const crypto = require('crypto');

const DATA_DIR = path.join(__dirname, '..', 'data');
const ALLOCATION_PATH = path.join(DATA_DIR, 'allocations.json');
const HEARTBEAT_TIMEOUT_MS = 45 * 1000;

function ensureStore() {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(ALLOCATION_PATH)) fs.writeFileSync(ALLOCATION_PATH, JSON.stringify({ allocations: [] }, null, 2));
}

function readStore() {
    ensureStore();
    try {
        const data = JSON.parse(fs.readFileSync(ALLOCATION_PATH, 'utf8'));
        if (!Array.isArray(data.allocations)) data.allocations = [];
        return data;
    } catch (err) {
        return { allocations: [] };
    }
}

function writeStore(store) {
    ensureStore();
    fs.writeFileSync(ALLOCATION_PATH, JSON.stringify(store, null, 2));
}

function publicAllocation(allocation) {
    const now = Date.now();
    const lastSeen = allocation.lastSeen ? new Date(allocation.lastSeen).getTime() : 0;
    const online = Boolean(allocation.url && lastSeen && now - lastSeen <= HEARTBEAT_TIMEOUT_MS);
    return {
        uuid: allocation.uuid,
        name: allocation.name,
        port: allocation.port,
        url: allocation.url || null,
        maxBots: allocation.maxBots || 5,
        createdAt: allocation.createdAt,
        lastSeen: allocation.lastSeen || null,
        online,
        hostname: allocation.hostname || null,
        pid: allocation.pid || null,
        stats: allocation.stats || {},
        bots: allocation.bots || {},
        assignedBots: allocation.assignedBots || []
    };
}

function getLocalBaseUrl(req) {
    const configuredUrl = process.env.PUBLIC_URL || process.env.APP_URL || process.env.BASE_URL;
    if (configuredUrl) return configuredUrl.replace(/\/$/, '');

    const proto = req.headers['x-forwarded-proto'] || req.protocol || 'http';
    const host = req.get('host');
    if (!host || host.startsWith('0.0.0.0')) {
        return `http://127.0.0.1:${process.env.PORT || 3000}`;
    }
    return `${proto}://${host}`;
}

function buildWingsCommand(allocation, baseUrl) {
    return [
        'node wings.js',
        `--uuid ${allocation.uuid}`,
        `--token ${allocation.token}`,
        `--master ${baseUrl}`,
        `--port ${allocation.port}`
    ].join(' ');
}

function listAllocations() {
    const store = readStore();
    return store.allocations.map(publicAllocation);
}

function createAllocation({ name, port, maxBots }, req) {
    const store = readStore();
    const nextIndex = store.allocations.length + 1;
    const allocation = {
        uuid: crypto.randomUUID(),
        token: crypto.randomBytes(32).toString('hex'),
        name: String(name || `allocation${String(nextIndex).padStart(2, '0')}`).trim(),
        port: Number(port) || (3100 + nextIndex),
        maxBots: Number(maxBots) || 5,
        createdAt: new Date().toISOString(),
        assignedBots: [],
        bots: {},
        stats: {}
    };

    store.allocations.push(allocation);
    writeStore(store);

    return {
        ...publicAllocation(allocation),
        token: allocation.token,
        command: buildWingsCommand(allocation, getLocalBaseUrl(req))
    };
}

function deleteAllocation(uuid) {
    const store = readStore();
    const before = store.allocations.length;
    store.allocations = store.allocations.filter(allocation => allocation.uuid !== uuid);
    writeStore(store);
    return before !== store.allocations.length;
}

function updateAllocation(uuid, updates = {}) {
    const store = readStore();
    const allocation = store.allocations.find(item => item.uuid === uuid);
    if (!allocation) return null;

    if (updates.name !== undefined) {
        const name = String(updates.name || '').trim();
        if (name) allocation.name = name;
    }

    if (updates.port !== undefined) {
        const port = Number(updates.port);
        if (Number.isInteger(port) && port > 0 && port <= 65535) allocation.port = port;
    }

    if (updates.maxBots !== undefined) {
        const maxBots = Number(updates.maxBots);
        if (Number.isInteger(maxBots) && maxBots > 0 && maxBots <= 1000) allocation.maxBots = maxBots;
    }

    writeStore(store);
    return publicAllocation(allocation);
}

function verifyAllocation(uuid, token) {
    const store = readStore();
    return store.allocations.find(allocation => allocation.uuid === uuid && allocation.token === token) || null;
}

function getAssignedBots(uuid, token) {
    const allocation = verifyAllocation(uuid, token);
    if (!allocation) return null;
    return (allocation.assignedBots || []).map(botNum => String(botNum || '').replace(/[^0-9]/g, '')).filter(Boolean);
}

function updateHeartbeat(uuid, token, payload = {}) {
    const store = readStore();
    const allocation = store.allocations.find(item => item.uuid === uuid && item.token === token);
    if (!allocation) return null;

    allocation.url = payload.url || allocation.url;
    allocation.hostname = payload.hostname || os.hostname();
    allocation.pid = payload.pid || null;
    allocation.lastSeen = new Date().toISOString();
    allocation.stats = payload.stats || {};
    allocation.bots = payload.bots || {};

    const activeBots = Object.keys(allocation.bots || {});
    allocation.assignedBots = Array.from(new Set([...(allocation.assignedBots || []), ...activeBots]));

    writeStore(store);
    return publicAllocation(allocation);
}

function getBotAllocation(botNum) {
    const cleanNum = String(botNum || '').replace(/[^0-9]/g, '');
    if (!cleanNum) return null;

    const store = readStore();
    const allocation = store.allocations.find(item => (item.assignedBots || []).includes(cleanNum));
    return allocation || null;
}

function getCachedBotStatus(botNum) {
    const cleanNum = String(botNum || '').replace(/[^0-9]/g, '');
    const rawAllocation = getBotAllocation(cleanNum);
    if (!rawAllocation) return null;
    const allocation = publicAllocation(rawAllocation);

    const bot = allocation.bots && allocation.bots[cleanNum] ? allocation.bots[cleanNum] : {};
    const status = bot.status || 'idle';
    return {
        status,
        qr: bot.qr || null,
        pairingCode: bot.pairingCode || null,
        botNumber: cleanNum,
        socketReady: !!bot.socketReady,
        isConnected: status === 'open',
        allocation: {
            uuid: allocation.uuid,
            name: allocation.name,
            online: allocation.online
        },
        inbound: bot.inbound || 0,
        outbound: bot.outbound || 0
    };
}

function chooseAllocation() {
    const store = readStore();
    const now = Date.now();
    const online = store.allocations
        .filter(allocation => {
            const lastSeen = allocation.lastSeen ? new Date(allocation.lastSeen).getTime() : 0;
            const assignedCount = (allocation.assignedBots || []).length;
            return allocation.url && lastSeen && now - lastSeen <= HEARTBEAT_TIMEOUT_MS && assignedCount < (allocation.maxBots || 5);
        })
        .sort((a, b) => (Object.keys(a.bots || {}).length - Object.keys(b.bots || {}).length));

    return online[0] || null;
}

function markBotAssigned(uuid, botNum) {
    const cleanNum = String(botNum || '').replace(/[^0-9]/g, '');
    if (!uuid || !cleanNum) return;

    const store = readStore();
    const allocation = store.allocations.find(item => item.uuid === uuid);
    if (!allocation) return;

    allocation.assignedBots = Array.from(new Set([...(allocation.assignedBots || []), cleanNum]));
    writeStore(store);
}

function unassignBot(botNum) {
    const cleanNum = String(botNum || '').replace(/[^0-9]/g, '');
    if (!cleanNum) return;

    const store = readStore();
    store.allocations.forEach(allocation => {
        allocation.assignedBots = (allocation.assignedBots || []).filter(num => num !== cleanNum);
        if (allocation.bots) delete allocation.bots[cleanNum];
    });
    writeStore(store);
}

async function sendBotAction(allocation, action, botNum, method = 'pairing') {
    const url = `${allocation.url.replace(/\/$/, '')}/api/wings/bot/action`;
    try {
        const response = await axios.post(url, {
            uuid: allocation.uuid,
            action,
            botNum,
            method
        }, {
            headers: { 'X-Wings-Token': allocation.token },
            timeout: 20000
        });
        return response.data;
    } catch (err) {
        const status = err.response ? `HTTP ${err.response.status}` : (err.code || 'REQUEST_FAILED');
        const detail = err.response?.data?.error || err.message;
        throw new Error(`Wings ${action} request failed to ${url}: ${status} - ${detail}`);
    }
}

async function sendWorkerRequest(allocation, endpoint, { method = 'GET', data = null, timeout = 25000 } = {}) {
    const url = `${allocation.url.replace(/\/$/, '')}${endpoint}`;
    try {
        const response = await axios({
            url,
            method,
            data: {
                uuid: allocation.uuid,
                ...(data || {})
            },
            headers: { 'X-Wings-Token': allocation.token },
            timeout
        });
        return response.data;
    } catch (err) {
        const status = err.response ? `HTTP ${err.response.status}` : (err.code || 'REQUEST_FAILED');
        const detail = err.response?.data?.error || err.message;
        throw new Error(`Wings request failed to ${url}: ${status} - ${detail}`);
    }
}

module.exports = {
    HEARTBEAT_TIMEOUT_MS,
    buildWingsCommand,
    createAllocation,
    deleteAllocation,
    getBotAllocation,
    getAssignedBots,
    getCachedBotStatus,
    listAllocations,
    markBotAssigned,
    sendBotAction,
    sendWorkerRequest,
    unassignBot,
    updateAllocation,
    updateHeartbeat,
    verifyAllocation,
    chooseAllocation
};
