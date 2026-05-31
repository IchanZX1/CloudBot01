const axios = require('axios');
const moment = require('moment-timezone');
const { createCanvas, loadImage } = require('@napi-rs/canvas'); // Menggunakan node-canvas
const fs = require('fs');
const path = require('path');

/**
 * Fungsi untuk mengambil data jadwal sholat berdasarkan nama kota
 */
async function getJadwalSholat(city) {
    try {
        // 1. Cari ID Kota
        const searchRes = await axios.get(`https://api.myquran.com/v2/sholat/kota/cari/${city}`);
        if (!searchRes.data || !searchRes.data.data || searchRes.data.data.length === 0) {
            throw new Error("Kota tidak ditemukan");
        }
        const cityId = searchRes.data.data[0].id;
        const cityName = searchRes.data.data[0].lokasi;

        // 2. Ambil Jadwal hari ini
        const now = moment().tz('Asia/Jakarta');
        const today = now.format('YYYY/MM/DD');
        const jadwalRes = await axios.get(`https://api.myquran.com/v2/sholat/jadwal/${cityId}/${today}`);

        if (jadwalRes.data && jadwalRes.data.data && jadwalRes.data.data.jadwal) {
            return {
                jadwal: jadwalRes.data.data.jadwal,
                location: cityName,
                date: jadwalRes.data.data.jadwal.tanggal
            };
        }
        throw new Error("Gagal mengambil jadwal");
    } catch (e) {
        console.error("Error API:", e.message);
        return null;
    }
}

/**
 * Fungsi pembantu untuk menggambar kotak dengan sudut tumpul (Rounded Rectangle)
 */
function drawRoundedRect(ctx, x, y, width, height, radius, fillStyle) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fillStyle = fillStyle;
    ctx.fill();
}

/**
 * Fungsi untuk membuat image menggunakan node-canvas
 */
async function createSholatCanvas() {
    const city = "Semarang";
    console.log(`Sedang memproses jadwal sholat untuk: ${city}...`);

    const data = await getJadwalSholat(city);
    if (!data) return;

    const { jadwal, location, date } = data;

    try {
        const backgroundPath = path.join(__dirname, './data/image/background_sholat.jpg');
        if (!fs.existsSync(backgroundPath)) {
            console.error("Error: File 'background_sholat.jpg' tidak ditemukan.");
            return;
        }

        // 1. Inisialisasi Canvas
        const width = 1024;
        const height = 600;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        // 2. Gambar Background
        const background = await loadImage(backgroundPath);
        ctx.drawImage(background, 0, 0, width, height);

        // 3. Overlay Gelap (Agar teks terbaca)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.fillRect(0, 0, width, height);

        // 4. Judul Utama
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 55px Arial';
        ctx.fillText("JADWAL SHOLAT", 512, 90);

        // 5. Lokasi (Warna Emas)
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 35px Arial';
        ctx.fillText(location, 512, 140);

        // 6. Tanggal
        ctx.fillStyle = '#e0e0e0';
        ctx.font = '22px Arial';
        ctx.fillText(date, 512, 185);

        // 7. Container Jadwal (Glassmorphism Effect)
        drawRoundedRect(ctx, 200, 220, 624, 330, 20, 'rgba(0, 0, 0, 0.6)');

        // 8. List Waktu Sholat
        const times = [
            { label: "Imsak", value: jadwal.imsak },
            { label: "Subuh", value: jadwal.subuh },
            { label: "Dzuhur", value: jadwal.dzuhur },
            { label: "Ashar", value: jadwal.ashar },
            { label: "Maghrib", value: jadwal.maghrib },
            { label: "Isya", value: jadwal.isya }
        ];

        let currentY = 275;
        const gap = 48;

        times.forEach(item => {
            // Label (Kiri)
            ctx.textAlign = 'left';
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 28px Arial';
            ctx.fillText(item.label, 250, currentY);

            // Titik Dua (Tengah)
            ctx.textAlign = 'center';
            ctx.font = '28px Arial';
            ctx.fillText(":", 512, currentY);

            // Jam (Kanan)
            ctx.textAlign = 'right';
            ctx.fillText(item.value, 770, currentY);

            currentY += gap;
        });

        // 9. Watermark
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.font = '14px Arial';
        ctx.fillText("© ZXcoderID CloudBot", 512, 585);

        // 10. Simpan Gambar
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync("hasil_jadwal_sholat.png", buffer);

        console.log("Selesai! Gambar telah disimpan sebagai 'hasil_jadwal_sholat.png'");
    } catch (err) {
        console.error("Terjadi kesalahan:", err);
    }
}

createSholatCanvas();