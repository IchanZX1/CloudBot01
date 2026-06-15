const { NanoBotzInd, botStatus, clearReconnectTimer } = require('./index');
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const allocationManager = require('./lib/allocationManager');

function allocationIsOnline(allocation) {
    const lastSeen = allocation && allocation.lastSeen ? new Date(allocation.lastSeen).getTime() : 0;
    return Boolean(allocation && allocation.url && lastSeen && Date.now() - lastSeen <= allocationManager.HEARTBEAT_TIMEOUT_MS);
}

class BotService {
    async start(method, botNumber) {
        botNumber = botNumber ? String(botNumber).replace(/[^0-9]/g, '') : '';
        if (process.env.ZX_WINGS_WORKER !== '1') {
            const currentAllocation = allocationManager.getBotAllocation(botNumber);
            const allocation = allocationIsOnline(currentAllocation)
                ? currentAllocation
                : allocationManager.chooseAllocation();

            if (allocation) {
                try {
                    const result = await allocationManager.sendBotAction(allocation, 'start', botNumber, method || 'pairing');
                    allocationManager.markBotAssigned(allocation.uuid, botNumber);
                    return result;
                } catch (err) {
                    console.error(`[ALLOCATION] Failed starting bot ${botNumber} on ${allocation.name || allocation.uuid}. Falling back to local server:`, err.message);
                    allocationManager.unassignBot(botNumber);
                }
            }
        }

        return this.startLocal(method, botNumber);
    }

    async startLocal(method, botNumber) {
        // Trigger the start logic from index.js
        return NanoBotzInd(method, botNumber);
    }

    getStatus(num = null) {
        num = num ? String(num).replace(/[^0-9]/g, '') : '';
        const remoteStatus = process.env.ZX_WINGS_WORKER !== '1'
            ? allocationManager.getCachedBotStatus(num)
            : null;
        if (remoteStatus) return remoteStatus;

        const sock = num ? (botStatus.socks[num] || null) : null;
        const socketReady = !!(sock && ((sock.ws && sock.ws.readyState === 1) || sock.user));
        let statusObj = {
            status: num ? (botStatus.states[num] || 'idle') : 'idle',
            qr: num ? (botStatus.qrs[num] || null) : null,
            pairingCode: num ? (botStatus.pairingCodes[num] || null) : null,
            botNumber: num || null,
            socketReady,
            isConnected: num ? (botStatus.states[num] === 'open' && socketReady) : false
        };

        // Mock network flow for UI
        if (statusObj.status === 'open') {
            statusObj.inbound = Math.floor(Math.random() * 50) + 10;
            statusObj.outbound = Math.floor(Math.random() * 50) + 10;
        } else {
            statusObj.inbound = 0;
            statusObj.outbound = 0;
        }
        return statusObj;
    }

    async stop(botNumber) {
        botNumber = botNumber ? botNumber.replace(/[^0-9]/g, '') : '';
        if (process.env.ZX_WINGS_WORKER !== '1') {
            const allocation = allocationManager.getBotAllocation(botNumber);
            if (allocationIsOnline(allocation)) {
                const result = await allocationManager.sendBotAction(allocation, 'stop', botNumber);
                allocationManager.updateBotCache(allocation.uuid, botNumber, { status: 'stopped', socketReady: false });
                return result;
            }
        }

        return this.stopLocal(botNumber);
    }

    async stopLocal(botNumber) {
        botNumber = botNumber ? botNumber.replace(/[^0-9]/g, '') : '';
        if (typeof clearReconnectTimer === 'function') clearReconnectTimer(botNumber);
        botStatus.states[botNumber] = 'stopped';
        const sock = botStatus.socks[botNumber];
        if (sock) {
            try { sock.end(undefined); } catch (e) { }
            try { sock.ws.close(); } catch (e) { }
            try { sock.ev.removeAllListeners(); } catch (e) { }
            delete botStatus.socks[botNumber];
        }
        delete botStatus.qrs[botNumber];
        delete botStatus.pairingCodes[botNumber];

        try {
            const { stop } = require('./lib/spinner');
            stop(botNumber, `Bot ${botNumber} Stopped`);
            console.log(`\nBot ${botNumber} has been stopped totally. Not reconnecting.`);
        } catch (e) { }

        try {
            const activatePath = path.join(__dirname, 'session', 'activate_session.json');
            if (fs.existsSync(activatePath)) {
                let active = JSON.parse(fs.readFileSync(activatePath));
                active = active.filter(n => n !== botNumber);
                fs.writeFileSync(activatePath, JSON.stringify(active));
            }
        } catch (err) { }

        return { success: true };
    }

    async deleteSession(botNumber) {
        botNumber = botNumber ? botNumber.replace(/[^0-9]/g, '') : '';
        if (process.env.ZX_WINGS_WORKER !== '1') {
            const allocation = allocationManager.getBotAllocation(botNumber);
            if (allocationIsOnline(allocation)) {
                try {
                    await allocationManager.sendBotAction(allocation, 'delete', botNumber);
                } catch (err) {
                    console.error(`[ALLOCATION] Failed deleting remote session ${botNumber} on ${allocation.name || allocation.uuid}:`, err.message);
                    throw err;
                } finally {
                    allocationManager.updateBotCache(allocation.uuid, botNumber, { status: 'deleted', socketReady: false });
                    allocationManager.unassignBot(botNumber);
                }
                return { success: true };
            }
            allocationManager.unassignBot(botNumber);
        }
        botStatus.states[botNumber] = 'deleted';
        if (typeof clearReconnectTimer === 'function') clearReconnectTimer(botNumber);
        const sock = botStatus.socks[botNumber];
        if (sock) {
            try { await sock.logout(); } catch (e) { }
            try { sock.end(undefined); } catch (e) { }
            try { sock.ws.close(); } catch (e) { }
            try { sock.ev.removeAllListeners(); } catch (e) { }
            delete botStatus.socks[botNumber];
        }

        try {
            const { stop } = require('./lib/spinner');
            stop(botNumber, `Bot ${botNumber} Deleted`);
        } catch (e) { }

        try {
            const sessionPath = path.join(__dirname, 'session', `device${botNumber}`);
            if (fs.existsSync(sessionPath)) {
                rimraf.sync(sessionPath);
            }
            const dbPath = path.join(__dirname, 'database', `data${botNumber}`);
            if (fs.existsSync(dbPath)) {
                rimraf.sync(dbPath);
            }
        } catch (err) {
            console.error('Error deleting session or database', err);
        }
        return { success: true };
    }

    getRandomBot() {
        const connectedBots = Object.entries(botStatus.socks).filter(([num, sock]) => botStatus.states[num] === 'open');
        console.log(`[DEBUG] getRandomBot: found ${connectedBots.length} open bots. Total socks: ${Object.keys(botStatus.socks).length}. States:`, botStatus.states);
        if (connectedBots.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * connectedBots.length);
        return connectedBots[randomIndex][1];
    }

    getBot(num) {
        return botStatus.socks[num] || botStatus.sock || this.getRandomBot();
    }

    getBotStrict(num) {
        num = num ? String(num).replace(/[^0-9]/g, '') : '';
        return num ? (botStatus.socks[num] || null) : null;
    }

    getLocalStatuses() {
        const statuses = {};
        const nums = new Set([
            ...Object.keys(botStatus.states || {}),
            ...Object.keys(botStatus.socks || {})
        ]);

        nums.forEach(num => {
            const sock = botStatus.socks[num] || null;
            const socketReady = !!(sock && ((sock.ws && sock.ws.readyState === 1) || sock.user));
            statuses[num] = {
                status: botStatus.states[num] || 'idle',
                qr: botStatus.qrs[num] || null,
                pairingCode: botStatus.pairingCodes[num] || null,
                socketReady,
                inbound: socketReady ? Math.floor(Math.random() * 50) + 10 : 0,
                outbound: socketReady ? Math.floor(Math.random() * 50) + 10 : 0
            };
        });

        return statuses;
    }

    get bot() {
        const bots = Object.entries(botStatus.socks).filter(([num, sock]) => botStatus.states[num] === 'open');
        if (bots.length > 0) return bots[0][1];
        return null; // Return null if no bot is open
    }
}


module.exports = new BotService();
