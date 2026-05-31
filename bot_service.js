const { NanoBotzInd, botStatus } = require('./index');
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');

class BotService {
    async start(method, botNumber) {
        // Trigger the start logic from index.js
        return NanoBotzInd(method, botNumber);
    }

    getStatus(num = null) {
        if (num) num = num.replace(/[^0-9]/g, '');
        let statusObj = { ...botStatus };
        if (num) {
            const sock = botStatus.socks[num] || null;
            const socketReady = !!(sock && ((sock.ws && sock.ws.readyState === 1) || sock.user));
            statusObj = {
                status: botStatus.states[num] || 'idle',
                qr: botStatus.qrs[num] || null,
                pairingCode: botStatus.pairingCodes[num] || null,
                botNumber: num,
                socketReady,
                isConnected: botStatus.states[num] === 'open' && socketReady
            };
        }
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
        botStatus.states[botNumber] = 'deleted';
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

    get bot() {
        const bots = Object.entries(botStatus.socks).filter(([num, sock]) => botStatus.states[num] === 'open');
        if (bots.length > 0) return bots[0][1];
        return null; // Return null if no bot is open
    }
}


module.exports = new BotService();
