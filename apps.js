const express = require('express');
const cookieParser = require('cookie-parser');
const botService = require('./bot_service');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const multer = require('multer');
require('dotenv').config();
const User = require('./models/User');
const session = require('express-session');
const Pricing = require('./models/Pricing');
const Deposit = require('./models/Deposit');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const moment = require('moment-timezone');
const axios = require('axios');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { GopayClient } = require('./lib/gopay/gopay.client');
const { checkForUpdate } = require('./classes/_autoUpdate');
const gopayClient = new GopayClient();

// Email Transporter (Gunakan Gmail App Password atau SMTP lain)
const { HttpsProxyAgent } = require("https-proxy-agent");

// proxy NAT kamu
const proxyAgent = new HttpsProxyAgent("http://ip.atlantic-server.com:56266");
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    requireTLS: true,
    proxy: "http://ip.atlantic-server.com:64433",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        servername: "smtp.gmail.com",
        rejectUnauthorized: false
    }
});

/**
 * Berikan desain email premium bertema Glassmorphism & Dark Mode
 */
const getOTPMailTemplate = (username, otp) => {
    return `
    <div style="background-color: #050505; color: #ffffff; padding: 40px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; max-width: 600px; margin: auto; border-radius: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
            <div style="background-color: #22c55e; width: 60px; height: 60px; border-radius: 15px; display: inline-block; margin-bottom: 10px;">
                <img src="https://cdn-icons-png.flaticon.com/512/6167/6167023.png" width="40" style="margin-top: 10px;" alt="Logo">
            </div>
            <h1 style="font-size: 24px; font-weight: 800; margin: 0; letter-spacing: -0.5px;">ZXcoderID <span style="color: #22c55e;">Cloud</span></h1>
        </div>
        
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 25px; padding: 30px; text-align: center;">
            <h2 style="font-size: 20px; color: #f3f4f6; margin-top: 0;">Halo, ${username}!</h2>
            <p style="color: #9ca3af; font-size: 15px;">Terima kasih telah bergabung dengan kami. Masukkan kode verifikasi di bawah ini untuk mengaktifkan akun Anda.</p>
            
            <div style="margin: 30px 0; padding: 20px; background: rgba(34, 197, 94, 0.1); border: 1px dashed #22c55e; border-radius: 15px;">
                <span style="font-size: 36px; font-weight: 800; color: #22c55e; letter-spacing: 10px;">${otp}</span>
            </div>
            
            <p style="color: #6b7280; font-size: 13px;">Kode ini hanya berlaku selama <b>5 menit</b>.<br>Jangan berikan kode ini kepada siapapun.</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 20px;">
            <p style="color: #4b5563; font-size: 12px; margin: 0;">&copy; 2024 ZXcoderID CloudBot. All rights reserved.</p>
            <p style="color: #4b5563; font-size: 10px;">Jika Anda tidak merasa melakukan pendaftaran, abaikan email ini.</p>
        </div>
    </div>
    `;
};

const sendOTPVerification = async (user, method, whatsapp) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = moment().tz('Asia/Jakarta').add(5, 'minutes').toDate();
    user.otp = otp;
    user.otp_expiry = otpExpiry;
    user.last_otp_request = new Date();
    await user.save();

    let actualMethod = method || user.verify_method;
    let redirectMessage = null;

    if (actualMethod === 'whatsapp') {
        let bot = botService.getRandomBot();

        if (!bot) {
            console.log('[DEBUG] No WhatsApp bot open, waiting 5 seconds...');
            await new Promise(resolve => setTimeout(resolve, 5000));
            bot = botService.getRandomBot();
        }

        let normalizedWa = whatsapp ? whatsapp.replace(/[^0-9]/g, '') : '';
        if (normalizedWa.startsWith('0')) {
            normalizedWa = '62' + normalizedWa.slice(1);
        }

        console.log(`[DEBUG] OTP Request: method=${actualMethod}, botFound=${!!bot}, whatsapp=${normalizedWa}`);
        if (bot && normalizedWa) {
            const jid = normalizedWa + '@s.whatsapp.net';
            const messageText = `*VERIFIKASI OTP*\n\nHalo ${user.username}!\nKode OTP Anda adalah: *${otp}*\n\nKode ini berlaku selama 5 menit. Masukkan kode ini di website untuk mengaktifkan akun Anda.`;

            try {
                // Gunakan timeout khusus agar tidak gantung selamanya jika Baileys USync error
                await bot.sendMessage(jid, { text: messageText }, { timeout: 15000 });
                console.log(`[DEBUG] OTP Sent via WhatsApp to ${normalizedWa}: ${otp}`);
                return { success: true, method: 'whatsapp' };
            } catch (err) {
                console.error('[ERROR] Failed to send WhatsApp OTP (probably timeout or USync error):', err.message);
                actualMethod = 'email'; // Fallback
                redirectMessage = 'Gagal mengirim via WhatsApp (Time Out), dialihkan ke Email.';
            }
        } else {
            actualMethod = 'email'; // Fallback
            redirectMessage = 'Fitur OTP WhatsApp sedang dialihkan ke OTP Email.';
            console.warn('[WARN] Falling back to email for OTP. Bot:', !!bot, 'Number:', !!whatsapp);
        }
    }

    if (actualMethod === 'email') {
        const mailOptions = {
            from: `"ZXcoderID Cloud" <admin@zxcoderid.web.id>`,
            to: user.email,
            subject: 'Kode Verifikasi Akun - ZXcoderID Cloud',
            html: getOTPMailTemplate(user.username, otp)
        };

        return new Promise((resolve) => {
            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.error('Email send error:', err);
                    resolve({ success: false, error: 'Gagal mengirim email OTP' });
                } else {
                    console.log(`OTP Email sent to ${user.email}: ${info.response}`);
                    resolve({ success: true, method: 'email', warning: redirectMessage });
                }
            });
        });
    }

    return { success: false, error: 'Metode verifikasi tidak valid' };
};

const app = express();
const PORT = process.env.PORT || 3000;

function triggerContentErrorDemo() {
    if (process.env.TIKTOK_ERROR !== '1') return;

    console.error('\nZXcoderID CloudBot failed to boot.');
    console.error('Reason: LogicError: hati sudah async, tapi dia masih undefined.');
    console.error('    at validateFeelings (Nano.js:404:13)');
    console.error('    at startCloudBot (apps.js:1625:9)');
    console.error('    at Object.<anonymous> (apps.js:1630:1)\n');
    process.exit(1);
}

// Cache Busting Version
app.locals.version = Date.now();

// Configuration
mongoose.set('strictQuery', false);

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB Atlas');
        // Seed default plans if they don't exist
        const count = await Pricing.countDocuments();
        if (count === 0) {
            await Pricing.create([
                {
                    name: 'Trial',
                    price: 0,
                    durationDays: 15,
                    features: ['15 Hari Masa Aktif', '1 Nomor Owner', '10K Respon Chat'],
                    active: true
                },
                {
                    name: 'Basic',
                    price: 5000,
                    durationDays: 15,
                    features: ['15 Hari Masa Aktif', '2 Nomor Owner', '25K Respon Chat', 'Full Customization'],
                    active: true
                },
                {
                    name: 'Starter',
                    price: 10000,
                    durationDays: 30,
                    features: ['30 Hari Masa Aktif', '3 Nomor Owner', '50K Respon Chat', 'Tanpa Iklan'],
                    active: true
                }
            ]);
            console.log('Default pricing plans seeded.');
        }
    })
    .catch(err => console.error('MongoDB connection error:', err));

    // Session (diperlukan untuk passport Google OAuth)
app.use(session({
    secret: process.env.SESSION_SECRET || 'autoresbot-secret-key-2026',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 5 * 60 * 1000 } // hanya untuk OAuth flow, 5 menit
}));

// Passport setup
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails[0].value;
        const googleId = profile.id;
        const displayName = profile.displayName || profile.name?.givenName || 'User';
        const photo = profile.photos?.[0]?.value || '/img/default-profile.png';

        let user = await User.findOne({ email });

        if (user) {
            // Update googleId jika belum ada
            if (!user.googleId) {
                user.googleId = googleId;
                user.authProvider = 'google';
                user.is_verified = true;
                if (photo && photo !== '/img/default-profile.png') user.profilePic = photo;
                await user.save();
            }
        } else {
            // Buat user baru via Google
            const trialPlan = await Pricing.findOne({ name: 'Trial' });
            const trialDuration = trialPlan ? trialPlan.durationDays : 7;
            const expiredDate = moment().tz('Asia/Jakarta').add(trialDuration, 'days').toDate();

            user = new User({
                username: displayName,
                email: email,
                googleId: googleId,
                authProvider: 'google',
                password: null,
                no_Wa: '',
                role: 'user',
                paket: 'Trial',
                _expired: expiredDate,
                lastTrialClaim: new Date(),
                is_verified: true,
                profilePic: photo
            });
            await user.save();
        }

        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}));
//auth
passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

app.use(passport.initialize());
app.use(passport.session());

// Configuration
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'publics')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
const rateLimit = require('express-rate-limit');

// Trust proxy jika kamu menggunakan Nginx/Cloudflare
app.set('trust proxy', 1);

// Limiter khusus untuk OTP (Maksimal 5x coba per 15 menit)
const otpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 menit
    max: 5,
    message: { error: 'Terlalu banyak percobaan. Harap tunggu 15 menit sebelum mencoba lagi.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Limiter untuk koneksi Bot (Mencegah spam connect)
const botConnectLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 menit
    max: 10, // Hanya boleh klik start connect 10x per 5 menit
    message: { error: 'Terlalu banyak request koneksi. Harap tunggu sebentar.' }
});

// Custom Middleware to Check Session and Package Expiration
const checkUserSession = async (req, res, next) => {
    const sessionId = req.cookies.session_id;
    if (sessionId) {
        try {
            // Find user by their unique session ID
            const user = await User.findOne({ currentSessionId: sessionId });
            if (user) {
                // Check if package expired
                const now = moment().tz('Asia/Jakarta').toDate();
                const currentPaket = user.paket ? user.paket.toLowerCase() : 'free';
                if (currentPaket !== 'free' && user._expired && now > user._expired) {
                    user.paket = 'free';
                    user._expired = null;
                    await user.save();
                    console.log(`Package for ${user.email} has expired. Resetting to free.`);
                }
                req.user = user;
            } else {
                // If sessionId exists but no user found with it, it means they logged in elsewhere
                // Clear the cookie so they are prompted to login again
                res.clearCookie('session_id');
            }
        } catch (err) {
            console.error('Session check error:', err);
        }
    }
    next();
};

app.use(checkUserSession);

// Multer Configurations
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const botNum = req.user.no_Bot || req.user.no_Wa;
        const dirPath = path.join(__dirname, 'session', `device${botNum}`);
        if (!fs.existsSync(dirPath)) {
            return cb(new Error('Bot belum connect. Silahkan connect terlebih dahulu.'));
        }
        cb(null, dirPath);
    },
    filename: function (req, file, cb) {
        cb(null, 'thumb.jpg');
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed (max 10MB)'));
        }
    }
});

const profileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = path.join(__dirname, 'publics', 'img', 'profiles');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const profileUpload = multer({
    storage: profileStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Hanya file gambar yang diperbolehkan!'));
        }
    }
});

// Routes
app.get('/', async (req, res) => {
    try {
        const plans = await Pricing.find({ active: true });
        res.render('index', {
            title: 'Home',
            user: req.user || null,
            plans: plans
        });
    } catch (err) {
        console.error(err);
        res.render('index', { title: 'Home', user: req.user || null, plans: [] });
    }
});

app.get('/dashboard', (req, res) => {
    if (!req.user) return res.redirect('/login?error=Silakan login terlebih dahulu!');
    res.render('dashboard', {
        title: 'Dashboard',
        user: req.user
    });
});

app.get('/pricing', async (req, res) => {
    try {
        const plans = await Pricing.find({ active: true });
        res.render('pricing', {
            title: 'Pricing',
            user: req.user || null,
            plans: plans
        });
    } catch (err) {
        console.error(err);
        res.render('pricing', { title: 'Pricing', user: req.user || null, plans: [] });
    }
});

app.get('/checkout/:packageId', async (req, res) => {
    if (!req.user) return res.redirect('/login?error=Silakan login terlebih dahulu!');

    try {
        const plan = await Pricing.findById(req.params.packageId);
        if (!plan) return res.redirect('/pricing?error=Paket tidak ditemukan!');

        // Upgrade Rules:
        // 1. If user current package is NOT 'free' AND is NOT 'trial', they cannot buy anything until expiry.
        // 2. If 'trial', they CAN upgrade to higher (Basic/Starter).

        const now = moment().tz('Asia/Jakarta');
        const currentPaket = req.user.paket ? req.user.paket.toLowerCase() : 'free';

        if (currentPaket !== 'free' && currentPaket !== 'trial' && req.user._expired && now.toDate() < req.user._expired) {
            return res.redirect('/dashboard?error=Anda masih memiliki paket aktif (Premium). Tunggu hingga masa aktif habis untuk melakukan pembelian kembali.');
        }

        // Check for existing pending deposit to avoid spamming database on refresh
        let deposit = await Deposit.findOne({ userId: req.user._id, status: 'pending' });
        if (deposit && deposit.packageId.toString() !== plan._id.toString()) {
            // Cancel other pending deposits if they chose a different package
            deposit.status = 'cancelled';
            await deposit.save();
            await Deposit.deleteOne({ _id: deposit._id });
            deposit = null;
        }

        if (!deposit) {
            const reffId = 'ZX' + crypto.randomBytes(4).toString('hex').toUpperCase();
            // Generate Unique Code (10-250)
            const uniqueCode = Math.floor(10 + Math.random() * 241);
            const totalNominal = plan.price + uniqueCode;

            deposit = new Deposit({
                userId: req.user._id,
                packageId: plan._id,
                reffId: reffId,
                nominal: totalNominal,
                status: 'pending',
                paymentMethod: 'qris',
                paymentData: {
                    originalPrice: plan.price,
                    uniqueCode: uniqueCode,
                    qr_image: '/img/qris.jpg'
                }
            });
            await deposit.save();
        }

        res.render('checkout', {
            title: 'Checkout',
            user: req.user,
            plan: plan,
            deposit: deposit,
            moment: moment
        });
    } catch (err) {
        console.error(err);
        res.redirect('/pricing');
    }
});

app.post('/api/claim-trial', async (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const user = await User.findById(req.user._id);
        const now = moment().tz('Asia/Jakarta');

        // Check if claimed in last 30 days
        if (user.lastTrialClaim) {
            const lastClaim = moment(user.lastTrialClaim);
            if (now.diff(lastClaim, 'days') < 30) {
                const availableDate = lastClaim.add(30, 'days').format('DD MMMM YYYY');
                return res.status(400).json({ error: `Anda sudah mengklaim trial bulan ini. Silakan coba lagi setelah tanggal ${availableDate}.` });
            }
        }

        // Check if currently has an active Premium package (not Trial/Free)
        const currentPaketTrialCheck = user.paket ? user.paket.toLowerCase() : 'free';
        if (currentPaketTrialCheck !== 'free' && currentPaketTrialCheck !== 'trial' && user._expired && now.toDate() < user._expired) {
            return res.status(400).json({ error: 'Anda sedang menggunakan paket Premium. Tidak dapat mengklaim trial.' });
        }

        const trialPlan = await Pricing.findOne({ name: 'Trial' });
        if (!trialPlan) return res.status(404).json({ error: 'Data paket trial tidak ditemukan.' });

        user.paket = trialPlan.name;
        user._expired = now.add(trialPlan.durationDays, 'days').toDate();
        user.lastTrialClaim = new Date();
        await user.save();

        res.json({ success: true, message: 'Selamat! Paket Trial Anda telah diaktifkan selama 7 hari.' });
    } catch (err) {
        console.error('Trial Claim Error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Endpoint /api/deposit/create telah dipindahkan langsung ke dalam route GET /checkout/:packageId

app.get('/api/deposit/status/:reffId', async (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const deposit = await Deposit.findOne({ reffId: req.params.reffId, userId: req.user._id });
        if (!deposit) return res.status(404).json({ error: 'Data deposit tidak ditemukan' });

        const now = moment().tz('Asia/Jakarta');
        const createdAt = moment(deposit.createdAt).tz('Asia/Jakarta');
        const diffMinutes = now.diff(createdAt, 'minutes');

        if (diffMinutes >= 30) {
            deposit.status = 'expired';
            await deposit.save();
            return res.json({ status: 'expired', message: 'Orderan telah expired (30 menit).' });
        }

        if (deposit.status !== 'pending') {
            return res.json({ status: deposit.status });
        }

        // Check GoPay Journal Status
        const journals = await gopayClient.SearchJournalsRelative({
            amount_eq: deposit.nominal,
            start: { amount: 2, unit: 'hours' }, // Cek transaksi 2 jam terakhir
            sort: 'desc'
        });

        if (journals && journals.hits && journals.hits.length > 0) {
            // Kita anggap jika ada transaksi dengan nominal persis sama, itu adalah pembayaran user ini.
            // QRIS bisnis pribadi biasanya tidak memberikan reff_id unik per orang di journal, 
            // jadi kita mengandalkan nominal unik.

            deposit.status = 'success';
            await deposit.save();

            // Update User Package & Expiry
            const plan = await Pricing.findById(deposit.packageId);
            const user = await User.findById(deposit.userId);

            const nowSuccess = moment().tz('Asia/Jakarta');
            let newExpiry;
            if (user._expired && nowSuccess.toDate() < user._expired) {
                newExpiry = moment(user._expired).add(plan.durationDays, 'days').toDate();
            } else {
                newExpiry = nowSuccess.add(plan.durationDays, 'days').toDate();
            }

            user.paket = plan.name;
            user._expired = newExpiry;
            await user.save();

            return res.json({ status: 'success', message: 'Pembayaran berhasil dikonfirmasi via GoPay Merchant' });
        }

        res.json({ status: 'pending', remainingTime: 30 - diffMinutes });
    } catch (err) {
        console.error('Status Check Error:', err);
        res.status(500).json({ error: 'Gagal mengecek status pembayaran' });
    }
});

app.post('/api/deposit/cancel/:reffId', async (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const deposit = await Deposit.findOne({ reffId: req.params.reffId, userId: req.user._id });
        if (!deposit) return res.status(404).json({ error: 'Orderan tidak ditemukan' });

        if (deposit.status !== 'pending') {
            return res.status(400).json({ error: 'Hanya orderan pending yang bisa dibatalkan' });
        }

        deposit.status = 'cancelled';
        await deposit.save();
        res.json({ success: true, message: 'Orderan berhasil dibatalkan.' });
    } catch (err) {
        console.error('Cancel Order Error:', err);
        res.status(500).json({ error: 'Gagal membatalkan orderan' });
    }
});

// Periodic Cleanup for Expired Deposits (every 5 minutes)
setInterval(async () => {
    try {
        const thirtyMinsAgo = moment().tz('Asia/Jakarta').subtract(30, 'minutes').toDate();
        const result = await Deposit.updateMany({
            status: 'pending',
            createdAt: { $lt: thirtyMinsAgo }
        }, { status: 'expired' });
        if (result.matchedCount > 0) {
            console.log(`[CLEANUP] Marked ${result.matchedCount} deposits as expired.`);
        }
    } catch (err) {
        console.error('[CLEANUP ERROR]', err);
    }
}, 5 * 60 * 1000);

// Periodic File Trash Cleanup (every 1 hour)
setInterval(() => {
    try {
        const rootDir = __dirname;
        const files = fs.readdirSync(rootDir);
        const extensions = ['.mp3', '.m4a', '.webp', '.jpg', '.png', '.mp4'];
        let count = 0;

        files.forEach(file => {
            const ext = path.extname(file).toLowerCase();
            const name = path.basename(file, ext);

            // Pattern: numeric filenames or temp_ prefix
            const isNumeric = /^\d+$/.test(name);
            const isTemp = name.startsWith('temp_');
            const isAdHoc = (file === 'undefined.jpg');

            if (extensions.includes(ext) && (isNumeric || isTemp) || isAdHoc) {
                fs.unlinkSync(path.join(rootDir, file));
                count++;
            }
        });
        if (count > 0) {
            console.log(`[FILE CLEANUP] Removed ${count} temporary files from root.`);
        }
    } catch (err) {
        console.error('[FILE CLEANUP ERROR]', err.message);
    }
}, 120 * 1000);

app.get('/invoice', async (req, res) => {
    if (!req.user) return res.redirect('/login');
    try {
        const deposits = await Deposit.find({ userId: req.user._id })
            .populate('packageId')
            .sort({ createdAt: -1 });
        res.render('invoice', {
            title: 'Invoice History',
            user: req.user,
            deposits: deposits,
            moment: moment
        });
    } catch (err) {
        console.error('Invoice Route Error:', err);
        res.render('invoice', { title: 'Invoice History', user: req.user, deposits: [], moment: moment });
    }
});

app.get('/profile', (req, res) => {
    if (!req.user) return res.redirect('/login');
    res.render('profile', { title: 'Akun Saya', user: req.user });
});

app.post('/api/profile/request-otp', otpLimiter, async (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const user = await User.findById(req.user._id);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otp_expiry = moment().tz('Asia/Jakarta').add(5, 'minutes').toDate();
        await user.save();

        const mailOptions = {
            from: `"ZXcoderID Cloud" <admin@zxcoderid.web.id>`,
            to: user.email,
            subject: 'Kode OTP Perubahan Profil - ZXcoderID Cloud',
            html: `
            <div style="background-color: #050505; color: #ffffff; padding: 40px; font-family: sans-serif; border-radius: 20px; max-width: 500px; margin: auto;">
                <h2 style="color: #22c55e; text-align: center;">Konfirmasi Perubahan Profil</h2>
                <p>Halo <b>${user.username}</b>,</p>
                <p>Anda sedang melakukan perubahan pada data akun Anda. Gunakan kode OTP di bawah ini untuk memverifikasi tindakan ini:</p>
                <div style="background: rgba(34, 197, 94, 0.1); border: 1px dashed #22c55e; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; color: #22c55e; letter-spacing: 5px; margin: 20px 0;">
                    ${otp}
                </div>
                <p style="font-size: 12px; color: #6b7280; text-align: center;">Kode ini berlaku selama 5 menit. Jangan berikan kode ini kepada siapapun.</p>
            </div>
            `
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error('Profile OTP Email error:', err);
                return res.status(500).json({ error: 'Gagal mengirim email OTP' });
            }
            res.json({ success: true, message: 'OTP telah dikirim ke email Anda' });
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/profile/update', profileUpload.single('profilePic'), async (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { username, no_Wa, email, password, otp } = req.body;

    try {
        const user = await User.findById(req.user._id);

        // Validate OTP
        if (!user.otp || user.otp !== otp) {
            return res.status(400).json({ error: 'Kode OTP tidak valid' });
        }
        if (new Date() > user.otp_expiry) {
            return res.status(400).json({ error: 'Kode OTP telah kadaluarsa' });
        }

        // Update fields if provided
        if (username) user.username = username;
        if (no_Wa) user.no_Wa = no_Wa;

        // If email changed, check if new email exists
        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) return res.status(400).json({ error: 'Email sudah digunakan oleh akun lain' });
            user.email = email;
        }

        if (password && password.length >= 6) {
            user.password = password; // Assuming simple password storage for this mock, or hash it if needed
        }

        if (req.file) {
            user.profilePic = '/img/profiles/' + req.file.filename;
        }

        // Clear OTP after success
        user.otp = null;
        user.otp_expiry = null;

        // Generate new session ID to maintain single-device restriction
        const newSessionId = crypto.randomBytes(32).toString('hex');
        user.currentSessionId = newSessionId;

        await user.save();

        res.cookie('session_id', newSessionId, {
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            httpOnly: true,
            sameSite: 'Strict'
        });

        res.json({ success: true, message: 'Profil berhasil diperbarui!' });
    } catch (err) {
        console.error('Profile Update Error:', err);
        res.status(500).json({ error: 'Terjadi kesalahan saat memperbarui profil' });
    }
});

app.get('/commands', (req, res) => {
    if (!req.user) return res.redirect('/login');
    res.render('commands', { title: 'Group Settings', user: req.user });
});

// ...

app.get('/api/bot/mess', async (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const botNum = (req.user.no_Bot || req.user.no_Wa || '').replace(/[^0-9]/g, '');
    const dbPath = path.join(__dirname, 'database', `data${botNum}`, 'mess.json');

    if (fs.existsSync(dbPath)) {
        return res.json(JSON.parse(fs.readFileSync(dbPath)));
    }
    const defaultPath = path.join(__dirname, 'database', 'mess.json');
    if (fs.existsSync(defaultPath)) {
        return res.json(JSON.parse(fs.readFileSync(defaultPath)));
    }
    res.json({});
});

app.post('/api/bot/mess', async (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const userPkg = (req.user.paket || 'free').toLowerCase();
    const botNum = (req.user.no_Bot || req.user.no_Wa || '').replace(/[^0-9]/g, '');
    const dbDir = path.join(__dirname, 'database', `data${botNum}`);
    const dbPath = path.join(dbDir, 'mess.json');

    if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

    let currentMess = {};
    const defaultPath = path.join(__dirname, 'database', 'mess.json');
    if (fs.existsSync(dbPath)) {
        currentMess = JSON.parse(fs.readFileSync(dbPath));
    } else if (fs.existsSync(defaultPath)) {
        currentMess = JSON.parse(fs.readFileSync(defaultPath));
    }

    const newMess = req.body;

    if (userPkg === 'trial') {
        const allowed = ['wait', 'success', 'on', 'off'];
        allowed.forEach(k => { if (newMess[k]) currentMess[k] = newMess[k]; });
    } else if (userPkg === 'basic') {
        const allowed = ['wait', 'success', 'on', 'off', 'query', 'error', 'sewa'];
        allowed.forEach(k => {
            if (newMess[k]) {
                if (typeof newMess[k] === 'object') {
                    currentMess[k] = { ...currentMess[k], ...newMess[k] };
                } else {
                    currentMess[k] = newMess[k];
                }
            }
        });
    } else if (userPkg === 'starter') {
        Object.assign(currentMess, newMess);
    } else {
        return res.status(403).json({ error: 'Silahkan upgrade paket Anda untuk menggunakan fitur Custom Message!' });
    }

    fs.writeFileSync(dbPath, JSON.stringify(currentMess, null, 2));
    res.json({ success: true, message: 'Message customization saved!' });
});

app.get('/api/bot/thumb', async (req, res) => {
    if (!req.user) return res.redirect('/img/bot.png');
    const botNum = (req.user.no_Bot || req.user.no_Wa || '').replace(/[^0-9]/g, '');
    const thumbPath = path.join(__dirname, 'session', `device${botNum}`, 'thumb.jpg');
    if (fs.existsSync(thumbPath)) {
        res.sendFile(thumbPath);
    } else {
        res.sendFile(path.join(__dirname, 'publics', 'img', 'bot.png'));
    }
});

app.get('/api/bot/commands-config', async (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const botNum = (req.user.no_Bot || req.user.no_Wa || '').replace(/[^0-9]/g, '');
    const dbPath = path.join(__dirname, 'database', `data${botNum}`, 'commands_config.json');
    if (fs.existsSync(dbPath)) {
        return res.json(JSON.parse(fs.readFileSync(dbPath)));
    }
    res.json({});
});

app.post('/api/bot/commands-config', async (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    if ((req.user.paket || '').toLowerCase() !== 'starter') {
        return res.status(403).json({ error: 'Fitur Custom Command Limit hanya tersedia untuk paket Starter!' });
    }
    const botNum = (req.user.no_Bot || req.user.no_Wa || '').replace(/[^0-9]/g, '');
    const dbDir = path.join(__dirname, 'database', `data${botNum}`);
    const dbPath = path.join(dbDir, 'commands_config.json');

    if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

    fs.writeFileSync(dbPath, JSON.stringify(req.body, null, 2));
    res.json({ success: true, message: 'Command limits saved!' });
});

app.get('/api/bot/commands', async (req, res) => {
    try {
        const nanoPath = path.join(__dirname, 'Nano.js');
        const content = fs.readFileSync(nanoPath, 'utf8');
        const matches = content.match(/case\s+'([^']+)'/g);
        const commands = matches ? matches.map(m => m.match(/'([^']+)'/)[1]) : [];
        const uniqueCmds = [...new Set(commands)].sort();
        res.json(uniqueCmds);
    } catch (e) {
        res.json([]);
    }
});

const defaultGroupSettings = {
    auto_ai_grup: false,
    goodbye: false,
    welcome: false
};

function readJsonFile(filePath, fallback) {
    try {
        if (!fs.existsSync(filePath)) return fallback;
        return JSON.parse(fs.readFileSync(filePath));
    } catch (err) {
        return fallback;
    }
}

function writeJsonFile(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function normalizeGroupId(groupId) {
    const clean = String(groupId || '').trim();
    return clean.endsWith('@g.us') ? clean : '';
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

function setGroupEnabled(filePath, groupId, enabled) {
    const current = readJsonFile(filePath, []);
    const exists = current.includes(groupId);
    if (enabled && !exists) current.push(groupId);
    if (!enabled && exists) current.splice(current.indexOf(groupId), 1);
    writeJsonFile(filePath, current);
}

async function getUserBotContext(req) {
    const botNum = (req.user.no_Bot || req.user.no_Wa || '').replace(/[^0-9]/g, '');
    const dbDir = path.join(__dirname, 'database', `data${botNum}`);
    const dbPath = path.join(dbDir, 'database.json');
    const { botStatus } = require('./index');
    const sock = botStatus.socks[botNum];
    return { botNum, dbDir, dbPath, sock };
}

app.get('/api/bot/groups', async (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const { botNum, sock } = await getUserBotContext(req);
        if (!botNum) return res.status(400).json({ error: 'Nomor bot belum tersedia' });
        if (!sock || botService.getStatus(botNum).status !== 'open') {
            return res.status(400).json({ error: 'Bot belum tersambung. Silakan connect bot terlebih dahulu.' });
        }

        const groupsObj = await sock.groupFetchAllParticipating();
        const groups = Object.values(groupsObj || {}).map(group => ({
            id: group.id,
            subject: group.subject || group.name || group.id,
            desc: group.desc || '',
            size: Array.isArray(group.participants) ? group.participants.length : 0
        })).sort((a, b) => a.subject.localeCompare(b.subject));

        res.json({ success: true, botNumber: botNum, groups });
    } catch (err) {
        console.error('[GROUP SETTINGS] Failed to fetch groups:', err);
        res.status(500).json({ error: 'Gagal mengambil data grup dari session bot' });
    }
});

app.get('/api/bot/group-settings/:groupId', async (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const groupId = normalizeGroupId(req.params.groupId);
        if (!groupId) return res.status(400).json({ error: 'Group ID tidak valid' });

        const { dbDir, dbPath, sock } = await getUserBotContext(req);
        const db = sock && sock.db ? sock.db : readJsonFile(dbPath, { settings: {} });
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
            welcome_text: welcomeTexts.find(item => item.id === groupId)?.text || '',
            goodbye_text: goodbyeTexts.find(item => item.id === groupId)?.text || ''
        };

        res.json({ success: true, groupId, settings });
    } catch (err) {
        console.error('[GROUP SETTINGS] Failed to load settings:', err);
        res.status(500).json({ error: 'Gagal memuat pengaturan grup' });
    }
});

app.post('/api/bot/group-settings/:groupId', async (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const groupId = normalizeGroupId(req.params.groupId);
        if (!groupId) return res.status(400).json({ error: 'Group ID tidak valid' });

        const { dbDir, dbPath, sock } = await getUserBotContext(req);
        if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

        const db = sock && sock.db ? sock.db : readJsonFile(dbPath, {
            sticker: {},
            database: {},
            game: {},
            others: {},
            users: {},
            chats: {},
            settings: {}
        });
        if (!db.settings) db.settings = {};

        const boolKeys = ['auto_ai_grup', 'goodbye', 'welcome'];
        const nextSettings = { ...defaultGroupSettings };
        boolKeys.forEach(key => {
            nextSettings[key] = !!req.body[key];
        });
        nextSettings.welcome_text = String(req.body.welcome_text || '').trim();
        nextSettings.goodbye_text = String(req.body.goodbye_text || '').trim();

        db.settings[groupId] = nextSettings;

        setGroupEnabled(path.join(dbDir, 'welcome.json'), groupId, nextSettings.welcome);
        setGroupEnabled(path.join(dbDir, 'left.json'), groupId, nextSettings.goodbye);
        upsertGroupText(path.join(dbDir, 'set_welcome.json'), groupId, nextSettings.welcome_text);
        upsertGroupText(path.join(dbDir, 'set_left.json'), groupId, nextSettings.goodbye_text);

        writeJsonFile(dbPath, db);
        if (sock) {
            sock.db = db;
            sock.lastDbSync = Date.now();
        }

        res.json({ success: true, message: 'Pengaturan grup berhasil disimpan', settings: db.settings[groupId] });
    } catch (err) {
        console.error('[GROUP SETTINGS] Failed to save settings:', err);
        res.status(500).json({ error: 'Gagal menyimpan pengaturan grup: ' + err.message });
    }
});

app.get('/api/bot/config', async (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const botNum = (req.user.no_Bot || req.user.no_Wa || '').replace(/[^0-9]/g, '');
    const configPath = path.join(__dirname, 'session', `device${botNum}`, 'config.json');

    if (fs.existsSync(configPath)) {
        try {
            const config = JSON.parse(fs.readFileSync(configPath));
            return res.json({ success: true, config });
        } catch (err) {
            return res.json({ success: true, config: {} });
        }
    }
    res.json({ success: true, config: {} });
});

// Bot Config Endpoints
app.post('/api/bot/config', upload.single('thumbnail'), async (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    // Multer populates req.body with text fields when processing multipart/form-data
    const config = { ...req.body };
    const botNum = (req.user.no_Bot || req.user.no_Wa || '').replace(/[^0-9]/g, '');
    const dirPath = path.join(__dirname, 'session', `device${botNum}`);
    const configPath = path.join(dirPath, 'config.json');

    try {
        if (!fs.existsSync(dirPath)) {
            return res.status(400).json({ error: 'Bot belum connect. Silahkan connect terlebih dahulu.' });
        }

        let oldConfig = {};
        if (fs.existsSync(configPath)) {
            oldConfig = JSON.parse(fs.readFileSync(configPath));
        }

        const newConfig = { ...oldConfig, ...config };

        fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 2));
        res.json({ success: true, message: 'Configuration saved' });
    } catch (err) {
        console.error('Save Config Error:', err);
        res.status(500).json({ error: err.message || 'Failed to save configuration' });
    }
});

app.get('/api/bot/settings', async (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const botNum = (req.user.no_Bot || req.user.no_Wa || '').replace(/[^0-9]/g, '');
    const botJid = botNum + '@s.whatsapp.net';
    const dbPath = path.join(__dirname, 'database', `data${botNum}`, 'database.json');

    // Priority: In-memory database of running bot
    const { botStatus } = require('./index');
    let db = null;
    const sock = botStatus.socks[botNum];
    if (sock && sock.db) {
        db = sock.db;
    } else if (fs.existsSync(dbPath)) {
        try {
            db = JSON.parse(fs.readFileSync(dbPath));
        } catch (e) {
            console.error('[DATABASE] Failed to read database for settings:', e);
        }
    }

    if (!db) return res.json({ success: true, settings: {} });

    try {
        // Nano.js uses JID as the key for settings
        const settings = db.settings ? (db.settings[botJid] || {}) : {};
        res.json({ success: true, settings });
    } catch (err) {
        res.json({ success: true, settings: {} });
    }
});

app.post('/api/bot/settings', async (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const botNum = (req.user.no_Bot || req.user.no_Wa || '').replace(/[^0-9]/g, '');
    const dbDir = path.join(__dirname, 'database', `data${botNum}`);
    const dbPath = path.join(dbDir, 'database.json');
    const botJid = botNum + '@s.whatsapp.net';

    try {
        if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

        // Priority: In-memory database of running bot
        const { botStatus } = require('./index');
        const sock = botStatus.socks[botNum];
        let db;

        if (sock && sock.db) {
            db = sock.db;
            console.log(`[DATABASE] Updating running bot in-memory database for ${botNum}`);
        } else {
            // Fallback: Read from file
            if (fs.existsSync(dbPath)) {
                try {
                    db = JSON.parse(fs.readFileSync(dbPath));
                } catch (e) {
                    console.error('[DATABASE] Read error, resetting db structure:', e);
                    db = { sticker: {}, database: {}, game: {}, others: {}, users: {}, chats: {}, settings: {} };
                }
            } else {
                db = { sticker: {}, database: {}, game: {}, others: {}, users: {}, chats: {}, settings: {} };
            }
        }

        // Ensure robust structure
        if (!db.settings) db.settings = {};
        if (!db.users) db.users = {};
        if (!db.chats) db.chats = {};

        const allowedPrefixes = ['!', '.', '#', ',', '$'];
        const cleanBody = { ...req.body };
        if ('prefixes' in cleanBody) {
            const prefixes = [...new Set(String(cleanBody.prefixes || '')
                .split('')
                .filter(char => allowedPrefixes.includes(char)))];
            cleanBody.prefixes = prefixes.length ? prefixes.join(',') : allowedPrefixes.join(',');
        }

        // Merge settings only on JID key (matching Nano.js)
        db.settings[botJid] = { ...(db.settings[botJid] || {}), ...cleanBody };

        // Clean up redundant numeric-only keys if they were accidentally created
        if (db.settings[botNum]) delete db.settings[botNum];

        // Save back to file
        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

        // Update last sync time if bot is running so it doesn't try to reload unnecessarily
        if (sock) sock.lastDbSync = Date.now();

        console.log(`[DATABASE] Settings saved for bot ${botNum} to ${dbPath}`);
        res.json({ success: true, message: 'Settings saved' });
    } catch (err) {
        console.error('[DATABASE] Save Settings Error:', err);
        res.status(500).json({ error: 'Failed to save settings: ' + err.message });
    }
});

app.post('/api/bot/action', async (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const { action, method } = req.body;
    const botNum = (req.user.no_Bot || req.user.no_Wa || '').replace(/[^0-9]/g, '');

    const currentPaket = req.user.paket ? req.user.paket.toLowerCase() : 'free';

    try {
        if (action === 'start') {
            if (currentPaket === 'free') {
                return res.status(403).json({ error: 'Paket Anda telah habis. Silakan beli paket baru atau klaim free trial bulanan di Dashboard.' });
            }
            await botService.start(method || 'pairing', botNum);
            res.json({ success: true, message: 'Bot started' });
        } else if (action === 'stop') {
            await botService.stop(botNum);
            res.json({ success: true, message: 'Bot stopped' });
        } else if (action === 'delete') {
            await botService.deleteSession(botNum);
            res.json({ success: true, message: 'Session deleted' });
        } else {
            res.status(400).json({ error: 'Invalid action' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.post('/api/bot/connect', botConnectLimiter, async (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { method, botNumber } = req.body;
    if (!['pairing', 'qr'].includes(method)) {
        return res.status(400).json({ error: 'Invalid method' });
    }

    if (!method) return res.status(400).json({ error: 'Connection method required' });
    if (method === 'pairing' && !botNumber) {
        return res.status(400).json({ error: 'Bot number required for pairing code' });
    }

    const sBotNumber = botNumber ? botNumber.replace(/[^0-9]/g, '') : '';
    // Save botNumber to user if changed
    if (sBotNumber && sBotNumber !== req.user.no_Bot) {
        await User.findByIdAndUpdate(req.user._id, { no_Bot: sBotNumber });
        req.user.no_Bot = sBotNumber;
    }

    // VALIDASI KETAT NOMOR (Mencegah injeksi aneh)
    if (sBotNumber && (sBotNumber.length < 7 || sBotNumber.length > 16)) {
        return res.status(400).json({ error: 'Format nomor bot tidak valid!' });
    }

    const currentPaket = req.user.paket ? req.user.paket.toLowerCase() : 'free';
    if (currentPaket === 'free') {
        return res.status(403).json({ error: 'Paket Anda telah habis. Silakan beli paket baru atau klaim free trial bulanan di Dashboard.' });
    }

    if (req.user.no_Bot && req.user.no_Bot !== sBotNumber) {
        try {
            console.log(`[SECURITY] Menghapus session lama ${req.user.no_Bot} untuk user ${req.user.email}`);
            // Matikan dan hapus session lama sebelum mengizinkan yang baru
            await botService.deleteSession(req.user.no_Bot);
        } catch (err) {
            console.error('Gagal menghapus session lama:', err);
        }
    }

    botService.start(method, sBotNumber)
        .then(() => res.json({ success: true, message: 'Bot connection starting...' }))
        .catch(err => res.status(500).json({ error: err.message }));
});

app.get('/api/bot/status', (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const botNum = (req.user.no_Bot || req.user.no_Wa || '').replace(/[^0-9]/g, '');
    res.json(botService.getStatus(botNum));
});


app.get('/logout', async (req, res) => {
    if (req.user) {
        try {
            await User.findByIdAndUpdate(req.user._id, { currentSessionId: null });
        } catch (e) {
            console.error('Logout error:', e);
        }
    }
    res.clearCookie('session_id');
    res.redirect('/login?success=Berhasil keluar!');
});

app.get('/login', (req, res) => {
    if (req.user) return res.redirect('/');
    res.render('login', {
        title: 'Sign In',
        user: null,
        error: req.query.error || null,
        success: req.query.success || null
    });
});


app.post('/api/login', async (req, res) => {
    let { email, password } = req.body;

    // 🔒 Validasi input (ANTI NoSQL Injection)
    if (typeof email !== 'string' || typeof password !== 'string') {
        return res.status(400).json({ error: 'Invalid input' });
    }

    email = email.trim();
    password = password.trim();

    try {
        // 🔒 Cari user berdasarkan email SAJA
        let user = await User.findOne({ email });

        // Admin injection check from .env
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PW) {
            if (!user) {
                user = new User({
                    username: 'Super Admin',
                    email: email,
                    password: password,
                    no_Wa: '080000000000',
                    role: 'admin',
                    is_verified: true,
                    paket: 'Starter'
                });
                await user.save();
            } else if (user.password !== password) {
                user.password = password;
                user.role = 'admin';
                await user.save();
            }
        }

        if (!user) {
            return res.status(400).json({ error: 'Email atau password salah!' });
        }

        // 🔒 Compare password secara manual (plaintext)
        if (password !== user.password) {
            return res.status(400).json({ error: 'Email atau password salah!' });
        }

        // 🔒 Cek verifikasi akun
        if (!user.is_verified) {
            return res.status(400).json({
                error: 'Harap verifikasi akun Anda terlebih dahulu',
                needsVerification: true,
                email: user.email,
                whatsapp: user.no_Wa,
                verify_method: user.verify_method
            });
        }

        // 🔐 Generate session
        const sessionId = crypto.randomBytes(32).toString('hex');
        user.currentSessionId = sessionId;
        await user.save();

        // 🍪 Set cookie
        res.cookie('session_id', sessionId, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'Strict',
            secure: true // WAJIB kalau HTTPS
        });

        const redirectUrl = (user.email === process.env.ADMIN_EMAIL) ? '/admin/dashboard' : '/dashboard';
        return res.json({ success: true, redirect: redirectUrl });

    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ error: 'Terjadi kesalahan pada server!' });
    }
});

app.get('/signup', (req, res) => {
    if (req.user) return res.redirect('/');
    res.render('signup', {
        title: 'Sign Up',
        user: null,
        error: req.query.error || null,
        success: req.query.success || null
    });
});

app.post('/verify-otp', async (req, res) => {
    const { email, whatsapp, method } = req.body;
    if (!email) return res.redirect('/signup');

    try {
        const user = await User.findOne({ email });
        if (!user) return res.redirect('/signup');

        // Jika sudah aktif, arahkan ke login
        if (user.is_verified) return res.redirect('/login?success=Akun Anda sudah aktif, silakan login.');

        const now = moment().tz('Asia/Jakarta');
        const verifyMethod = method || user.verify_method || 'email';

        // Cek status OTP
        let warning = null;
        let msgType = 'info';
        let isExpired = false;

        if (user.otp && user.otp_expiry) {
            if (moment(user.otp_expiry).isAfter(now)) {
                // Jangan anggap ini error, hanya informasi bahwa OTP masih aktif
                warning = 'Silakan masukkan kode OTP yang telah dikirimkan ke Anda.';
                msgType = 'success';
            } else {
                isExpired = true;
                warning = 'Kode OTP Anda telah kadaluarsa. Silakan klik tombol kirim ulang.';
                msgType = 'error';
            }
        } else {
            isExpired = true;
            warning = 'Anda belum memiliki kode OTP aktif. Silakan pendaftaran ulang atau klik kirim ulang.';
            msgType = 'error';
        }

        res.render('verify-otp', {
            title: 'Verify OTP',
            user: null,
            email: user.email,
            whatsapp: whatsapp || user.no_Wa || '',
            verify_method: verifyMethod,
            warning: warning,
            msgType: msgType,
            isExpired: isExpired
        });
    } catch (err) {
        console.error('Verify OTP Route Error:', err);
        res.redirect('/signup?error=Terjadi kesalahan pada sistem!');
    }
});




app.post('/api/signup', async (req, res) => {
    const { username, email, whatsapp, password, confirm_password, verify_method } = req.body;

    if (!username || !email || !whatsapp || !password) {
        return res.status(400).json({ error: 'Semua field wajib diisi!' });
    }
    if (password !== confirm_password) {
        return res.status(400).json({ error: 'Konfirmasi password tidak cocok!' });
    }
    if (password.length < 6) {
        return res.status(400).json({ error: 'Password minimal 6 karakter!' });
    }

    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!gmailRegex.test(email)) {
        return res.status(400).json({ error: 'Hanya alamat email @gmail.com yang diperbolehkan!' });
    }

    try {
        // IP Limit Protection
        // const clientIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const clientIP = req.ip;
        let whitelist = [];
        try {
            whitelist = JSON.parse(fs.readFileSync('./database/whitelist_ips.json'));
        } catch (e) {
            console.error('Error loading whitelist:', e);
        }

        if (!whitelist.includes(clientIP)) {
            const startOfDay = moment().tz('Asia/Jakarta').startOf('day').toDate();
            const endOfDay = moment().tz('Asia/Jakarta').endOf('day').toDate();

            const registrationToday = await User.findOne({
                registerIP: clientIP,
                createdAt: { $gte: startOfDay, $lte: endOfDay }
            });

            if (registrationToday) {
                return res.status(400).json({ error: 'Limit pendaftaran tercapai! 1 IP hanya boleh mendaftar 1 kali per hari.' });
            }
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email sudah terdaftar!' });
        }

        // Generate OTP and save user happens in sendOTPVerification below

        // Fetch trial duration from database
        const trialPlan = await Pricing.findOne({ name: 'Trial' });
        const trialDuration = trialPlan ? trialPlan.durationDays : 7;
        const expiredDate = moment().tz('Asia/Jakarta').add(trialDuration, 'days').toDate();
        // Normalize whatsapp number
        let normalizedWa = whatsapp.replace(/[^0-9]/g, '');
        if (normalizedWa.startsWith('0')) {
            normalizedWa = '62' + normalizedWa.slice(1);
        }

        const newUser = new User({
            username,
            email,
            password,
            no_Wa: normalizedWa,
            role: 'user',
            paket: 'Trial',
            _expired: expiredDate,
            lastTrialClaim: new Date(),
            verify_method,
            registerIP: clientIP
        });

        await newUser.save();

        const otpResult = await sendOTPVerification(newUser, verify_method, normalizedWa);

        return res.json({
            success: true,
            message: otpResult.warning ? `Pendaftaran sukses! ${otpResult.warning}` : 'Pendaftaran sukses!',
            warning: otpResult.warning,
            verifyData: {
                email: email,
                whatsapp: normalizedWa,
                method: otpResult.method
            }
        });

    } catch (err) {
        console.error('Signup error:', err);
        return res.status(500).json({ error: 'Terjadi kesalahan saat mendaftar!' });
    }
});

app.post('/api/chanVerifyt-otp', otpLimiter, async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ email, otp });
        if (!user) return res.status(400).json({ error: 'Kode OTP salah' });

        const now = moment().tz('Asia/Jakarta').toDate();
        if (now > user.otp_expiry) return res.status(400).json({ error: 'Kode OTP telah kadaluarsa' });

        user.is_verified = true;
        user.otp = null;
        user.otp_expiry = null;
        await user.save();

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/resend-otp', otpLimiter, async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User tidak ditemukan' });

        const now = moment().tz('Asia/Jakarta');
        const lastRequest = moment(user.last_otp_request);

        if (now.diff(lastRequest, 'minutes') < 5) {
            const waitTime = 5 - now.diff(lastRequest, 'minutes');
            return res.status(400).json({ error: `Harap tunggu ${waitTime} menit lagi untuk meminta OTP baru.` });
        }

        const otpResult = await sendOTPVerification(user, user.verify_method, user.no_Wa);

        if (!otpResult.success) return res.status(500).json({ error: otpResult.error });

        res.json({
            success: true,
            warning: otpResult.warning,
            message: otpResult.warning ? `OTP Terkirim! ${otpResult.warning}` : 'OTP Berhasil dikirim ulang!'
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/country-codes', (req, res) => {
    const filePath = path.join(__dirname, 'countryNumber.txt');
    if (fs.existsSync(filePath)) {
        try {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            res.json(data);
        } catch (err) {
            res.status(500).json({ error: 'Failed to parse country codes' });
        }
    } else {
        res.status(404).json({ error: 'Country codes file not found' });
    }
});

// ==================== ADMIN PANEL ROUTES ====================
const isAdmin = (req, res, next) => {
    if (req.user && req.user.email === process.env.ADMIN_EMAIL) {
        return next();
    }
    return res.redirect('/login?error=Access Denied! You are not an admin.');
};

app.get('/admin/dashboard', isAdmin, async (req, res) => {
    try {
        const users = await User.find({}).sort({ createdAt: -1 });
        const { botStatus } = require('./index');

        let logContent = '';
        const logPath = path.join(__dirname, 'log_reportError.txt');
        if (fs.existsSync(logPath)) {
            logContent = fs.readFileSync(logPath, 'utf8');
        } else {
            logContent = 'No logs available.';
        }

        const uptime = process.uptime();
        const uptimeStr = `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`;

        res.render('admin_dashboard', {
            title: 'Admin Panel',
            user: req.user,
            users: users,
            botStatus: botStatus,
            uptime: uptimeStr,
            uptimeSeconds: Math.floor(uptime),
            logContent: logContent,
            moment: moment
        });
    } catch (err) {
        console.error('Admin Dashboard Error:', err);
        res.status(500).send('Server Error');
    }
});

app.post('/api/admin/users/update/:id', isAdmin, async (req, res) => {
    try {
        const { username, email, no_Wa, paket } = req.body;
        await User.findByIdAndUpdate(req.params.id, { username, email, no_Wa, paket });
        res.json({ success: true, message: 'User updated successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Gagal update user' });
    }
});

app.post('/api/admin/users/delete/:id', isAdmin, async (req, res) => {
    try {
        const userToDel = await User.findById(req.params.id);
        if (userToDel && userToDel.email === process.env.ADMIN_EMAIL) {
            return res.status(400).json({ error: 'Cannot delete super admin!' });
        }
        await User.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Gagal delete user' });
    }
});

app.post('/api/admin/server/restart', isAdmin, (req, res) => {
    res.json({ success: true, message: 'Server is restarting...' });
    setTimeout(() => {
        process.exit(1);
    }, 1000);
});

app.post('/api/admin/bot/action', isAdmin, async (req, res) => {
    const { action, botNum } = req.body;
    if (!botNum) return res.status(400).json({ error: 'Nomor bot dibutuhkan' });

    try {
        const { botService } = require('./bot_service'); // Might need require if not global
        // Fallback if not easily required
        const bs = require('./bot_service');

        if (action === 'start') {
            await bs.start('pairing', botNum);
            res.json({ success: true, message: 'Command start sent to Bot ' + botNum });
        } else if (action === 'stop') {
            await bs.stop(botNum);
            res.json({ success: true, message: 'Command stop sent to Bot ' + botNum });
        } else {
            res.status(400).json({ error: 'Invalid action' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/admin/bot/session/:botNum', isAdmin, (req, res) => {
    const { botNum } = req.params;
    if (!botNum) return res.status(400).send('Bot number required');
    const credsPath = path.join(__dirname, 'session', 'device' + botNum, 'creds.json');
    if (fs.existsSync(credsPath)) {
        res.download(credsPath, `creds-${botNum}.json`);
    } else {
        res.status(404).send('Session file not found for this bot.');
    }
});
// ============================================================

// ==================== GOOGLE OAUTH ROUTES ====================
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login?error=Login Google gagal. Coba lagi.' }),
    async (req, res) => {
        try {
            const user = req.user;
            const sessionId = crypto.randomBytes(32).toString('hex');
            user.currentSessionId = sessionId;
            await user.save();

            res.cookie('session_id', sessionId, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                sameSite: 'Strict',
                secure: true
            });

            const redirectUrl = (user.email === process.env.ADMIN_EMAIL) ? '/admin/dashboard' : '/dashboard';
            return res.redirect(redirectUrl);
        } catch (err) {
            console.error('Google callback error:', err);
            return res.redirect('/login?error=Terjadi kesalahan saat login Google.');
        }
    }
);
// ==================== END GOOGLE OAUTH ROUTES ====================

// app.get('/logout', (req, res) => {
//     res.clearCookie('session_id');
//     res.redirect('/');
// });
app.get('/logout', async (req, res) => {
    if (req.user) {
        try {
            await User.findByIdAndUpdate(req.user._id, { currentSessionId: null });
        } catch (e) {
            console.error('Logout error:', e);
        }
    }
    req.logout(function(err) {
        if (err) console.error('Passport logout error:', err);
        req.session.destroy(function(err) {
            if (err) console.error('Session destroy error:', err);
            res.clearCookie('session_id');
            res.clearCookie('connect.sid');
            res.redirect('/login?success=Berhasil keluar!');
        });
    });
});

// Error 404
app.use((req, res) => {
    res.status(404).render('index', { title: '404 - Not Found', user: req.user || null, plans: [] });
});

triggerContentErrorDemo();

app.listen(PORT, async () => {
    console.log(`Server running at http://localhost:${PORT}`);
    await checkForUpdate();
});

/**
 * Background Task: Hapus user yang belum verifikasi OTP lebih dari 24 jam (1 hari penuh)
 * Berjalan setiap 30 menit sekali untuk efisiensi database
 */
setInterval(async () => {
    try {
        // Threshold: 1 hari yang lalu dari sekarang (WIB)
        const threshold = moment().tz('Asia/Jakarta').subtract(24, 'hours').toDate();

        // Cari dan hapus semua user yang is_verified = false DAN dibuat lebih dari 1 hari lalu
        const result = await User.deleteMany({
            is_verified: false,
            createdAt: { $lt: threshold }
        });

        if (result.deletedCount > 0) {
            console.log(`[SYSTEM CLEANUP] [${moment().tz('Asia/Jakarta').format('HH:mm:ss')}] Berhasil menghapus ${result.deletedCount} pengguna tidak terverifikasi (sampah database).`);
        }
    } catch (err) {
        console.error('[SYSTEM CLEANUP ERROR]:', err);
    }
}, 30 * 60 * 1000); // 30 Menit dalam milidetik

