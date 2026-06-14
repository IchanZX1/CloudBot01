const axios = require('axios');
const moment = require('moment-timezone');

async function Orkut(amount) {
    try {
        const response = await axios.post("https://zx-tools-auth.vercel.app/api/mutasi", {
            username: process.env.usernameOrkut,
            authToken: process.env.AuthOrkut
        });
        
        if (!response.data || !response.data.success || !response.data.data) return { success: false };
        
        const mutasi = response.data.data;
        const now = moment().tz('Asia/Jakarta');
        
        const match = mutasi.find(item => {
            const kredit = parseInt(item.kredit.replace(/\./g, ''));
            const itemDate = moment(item.tanggal, 'DD/MM/YYYY HH:mm:ss').tz('Asia/Jakarta', true);
            const diffMinutes = Math.abs(now.diff(itemDate, 'minutes'));
            
            return item.status === 'IN' && kredit === parseInt(amount) && diffMinutes <= 15;
        });
        
        if (match) {
            return { success: true, data: { status: 'PAID' } };
        } else {
            return { success: true, data: { status: 'UNPAID' } };
        }
    } catch (e) {
        console.error("Error checkMutasiOrkut:", e.message);
        return { success: false, error: e.message };
    }
}

module.exports = { Orkut };
