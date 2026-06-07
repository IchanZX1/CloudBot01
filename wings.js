process.env.ZX_WINGS_WORKER = '1';
process.env.ZX_SKIP_AUTO_LOAD = '1';

const express = require('express');
const axios = require('axios');
const os = require('os');
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

if (!uuid || !token) {
    console.error('[WINGS] UUID dan token wajib diisi. Jalankan command yang digenerate dari admin dashboard.');
    process.exit(1);
}

const app = express();
app.use(express.json());

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
        bots: botService.getLocalStatuses()
    };
}

async function sendHeartbeat() {
    try {
        await axios.post(`${master}/api/wings/heartbeat`, heartbeatPayload(), { timeout: 15000 });
    } catch (err) {
        console.error('[WINGS] Gagal heartbeat ke master:', err.message);
    }
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
    res.json({ success: true, uuid, hostname: os.hostname(), stats: statsPayload(), bots: botService.getLocalStatuses() });
});

app.post('/api/wings/bot/action', requireMaster, async (req, res) => {
    const { action, botNum, method } = req.body;
    if (!botNum) return res.status(400).json({ error: 'Nomor bot dibutuhkan' });

    try {
        if (action === 'start') {
            await botService.startLocal(method || 'pairing', botNum);
            await sendHeartbeat();
            return res.json({ success: true, message: `Bot ${botNum} started on ${uuid}` });
        }

        if (action === 'stop') {
            await botService.stopLocal(botNum);
            await sendHeartbeat();
            return res.json({ success: true, message: `Bot ${botNum} stopped on ${uuid}` });
        }

        return res.status(400).json({ error: 'Invalid action' });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
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
});
