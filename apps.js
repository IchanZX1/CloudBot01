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
const QRCode = require('qrcode');
const QRISPayment = require('./config/qris-payment/src');
const allocationManager = require('./lib/allocationManager');
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
const SESSION_COOKIE_NAME = 'session_id';
const SESSION_MAX_AGE = 30 * 24 * 60 * 60 * 1000;

function isSecureRequest(req) {
    return req.secure || req.headers['x-forwarded-proto'] === 'https' || process.env.COOKIE_SECURE === 'true';
}

function getSessionCookieOptions(req, maxAge = SESSION_MAX_AGE) {
    return {
        maxAge,
        httpOnly: true,
        sameSite: 'Strict',
        secure: isSecureRequest(req),
        path: '/'
    };
}

function setSessionCookie(req, res, sessionId) {
    res.cookie(SESSION_COOKIE_NAME, sessionId, getSessionCookieOptions(req));
}

function clearSessionCookies(req, res) {
    const baseOptions = { httpOnly: true, sameSite: 'Strict', path: '/' };
    res.clearCookie(SESSION_COOKIE_NAME, { ...baseOptions, secure: true });
    res.clearCookie(SESSION_COOKIE_NAME, { ...baseOptions, secure: false });
    res.clearCookie('connect.sid', { path: '/' });
    res.clearCookie('connect.sid', { path: '/', httpOnly: true, sameSite: 'Lax', secure: true });
    res.clearCookie('connect.sid', { path: '/', httpOnly: true, sameSite: 'Lax', secure: false });
}

function getBaseQrisString() {
    const qrisPath = path.join(__dirname, 'config', 'qris-payment', 'QrisString.txt');
    return fs.readFileSync(qrisPath, 'utf8').trim();
}

async function generateDynamicQrisData(amount) {
    const baseQrString = getBaseQrisString();
    const qris = new QRISPayment({
        merchantId: process.env.QRIS_MERCHANT_ID || 'ZXcoderID',
        baseQrString
    });
    const { qrString } = await qris.generateQR(amount);
    const qrImage = await QRCode.toDataURL(qrString, {
        errorCorrectionLevel: 'H',
        margin: 2,
        width: 700,
        color: {
            dark: '#000000',
            light: '#FFFFFF'
        }
    });

    return {
        qr_string: qrString,
        qr_image: qrImage,
        dynamic: true,
        generatedAt: new Date()
    };
}

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

async function ensureGoogleIdIndex() {
    try {
        const indexes = await User.collection.indexes();
        const googleIndexes = indexes.filter(index => {
            return index.key && index.key.googleId === 1 && Object.keys(index.key).length === 1;
        });

        for (const googleIndex of googleIndexes) {
            const hasPartialStringIndex = googleIndex.partialFilterExpression?.googleId?.$type === 'string';
            if (!hasPartialStringIndex) {
                await User.collection.dropIndex(googleIndex.name);
                console.log(`[MONGODB] Dropped legacy ${googleIndex.name} index.`);
            }
        }

        await User.updateMany(
            { $or: [{ googleId: null }, { googleId: '' }] },
            { $unset: { googleId: '' } }
        );

        await User.collection.createIndex(
            { googleId: 1 },
            {
                unique: true,
                name: 'googleId_1',
                partialFilterExpression: { googleId: { $type: 'string' } }
            }
        );
    } catch (err) {
        console.error('[MONGODB] Failed ensuring googleId index:', err.message);
    }
}

function isDuplicateGoogleIdError(err) {
    return err?.code === 11000 && (
        err?.keyPattern?.googleId === 1 ||
        Object.prototype.hasOwnProperty.call(err?.keyValue || {}, 'googleId') ||
        /index:\s*googleId_1/.test(err?.message || '')
    );
}

function isDuplicateEmailError(err) {
    return err?.code === 11000 && (
        err?.keyPattern?.email === 1 ||
        Object.prototype.hasOwnProperty.call(err?.keyValue || {}, 'email') ||
        /index:\s*email_1/.test(err?.message || '')
    );
}

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB Atlas');
        await ensureGoogleIdIndex();
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

const googleOAuthEnabled = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

// Passport setup
if (googleOAuthEnabled) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || '/auth/google/callback'
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails?.[0]?.value;
            if (!email) return done(null, false, { message: 'Email Google tidak tersedia.' });

            const googleId = profile.id;
            const displayName = profile.displayName || profile.name?.givenName || email.split('@')[0];
            const photo = profile.photos?.[0]?.value || '/img/default-profile.png';

            let user = await User.findOne({ $or: [{ googleId }, { email }] });

            if (user) {
                user.googleId = user.googleId || googleId;
                user.authProvider = user.authProvider === 'local' ? 'google' : user.authProvider;
                user.is_verified = true;
                if (!user.profilePic || user.profilePic === '/img/default-profile.png') user.profilePic = photo;
                await user.save();
            } else {
                const trialPlan = await Pricing.findOne({ name: 'Trial' });
                const trialDuration = trialPlan ? trialPlan.durationDays : 7;
                const expiredDate = moment().tz('Asia/Jakarta').add(trialDuration, 'days').toDate();

                user = new User({
                    username: displayName,
                    email,
                    googleId,
                    authProvider: 'google',
                    role: 'user',
                    paket: 'Trial',
                    _expired: expiredDate,
                    lastTrialClaim: new Date(),
                    is_verified: true,
                    profilePic: photo,
                    registerIP: null
                });
                await user.save();
            }

            return done(null, user);
        } catch (err) {
            return done(err, null);
        }
    }));
} else {
    console.warn('[GOOGLE OAUTH] GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET belum diset. Login Google dinonaktifkan.');
}
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
                clearSessionCookies(req, res);
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
            const dynamicQris = await generateDynamicQrisData(totalNominal);

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
                    ...dynamicQris
                }
            });
            await deposit.save();
        } else if (!deposit.paymentData?.dynamic || !deposit.paymentData?.qr_image) {
            const dynamicQris = await generateDynamicQrisData(deposit.nominal);
            deposit.paymentData = {
                ...(deposit.paymentData || {}),
                ...dynamicQris
            };
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

        setSessionCookie(req, res, newSessionId);

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

function normalizeWelcomeDesign(value) {
    const design = String(value || '').trim().toLowerCase();
    return allowedWelcomeDesigns.has(design) ? design : defaultGroupSettings.welcome_design;
}

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

function extractGroupInviteCode(url = '') {
    const clean = String(url || '').trim();
    const match = clean.match(/(?:chat\.whatsapp\.com\/|whatsapp\.com\/invite\/)([A-Za-z0-9_-]+)/i);
    return match ? match[1] : '';
}

function normalizeInviteGroupId(groupId = '') {
    const clean = String(groupId || '').trim();
    if (!clean) return '';
    return clean.endsWith('@g.us') ? clean : `${clean}@g.us`;
}

function getAcceptedInviteGroupId(value) {
    if (!value) return '';
    if (typeof value === 'string') return normalizeInviteGroupId(value);
    if (typeof value === 'object') {
        return normalizeInviteGroupId(value.gid || value.id || value.groupId || value.jid || value?.group?.id || '');
    }
    return '';
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

function syncGroupMuteByChatbotSetting(dbDir, groupId, chatbotEnabled) {
    setGroupEnabled(path.join(dbDir, 'mute.json'), groupId, chatbotEnabled === false);
}

async function getUserBotContext(req) {
    const botNum = (req.user.no_Bot || req.user.no_Wa || '').replace(/[^0-9]/g, '');
    const dbDir = path.join(__dirname, 'database', `data${botNum}`);
    const dbPath = path.join(dbDir, 'database.json');
    const { botStatus } = require('./index');
    const sock = botStatus.socks[botNum];
    return { botNum, dbDir, dbPath, sock };
}

function getOnlineBotAllocation(botNum) {
    const allocation = allocationManager.getBotAllocation(botNum);
    const lastSeen = allocation && allocation.lastSeen ? new Date(allocation.lastSeen).getTime() : 0;
    const online = Boolean(allocation && allocation.url && lastSeen && Date.now() - lastSeen <= allocationManager.HEARTBEAT_TIMEOUT_MS);
    return online ? allocation : null;
}

async function forwardToWings(botNum, endpoint, payload = {}, options = {}) {
    const allocation = getOnlineBotAllocation(botNum);
    if (!allocation) return null;
    return allocationManager.sendWorkerRequest(allocation, endpoint, {
        method: 'POST',
        data: { botNum, ...payload },
        timeout: options.timeout || 30000
    });
}

app.get('/api/bot/groups', async (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const { botNum, sock } = await getUserBotContext(req);
        if (!botNum) return res.status(400).json({ error: 'Nomor bot belum tersedia' });
        const remoteResult = await forwardToWings(botNum, '/api/wings/bot/groups');
        if (remoteResult) return res.json(remoteResult);
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

        const { botNum, dbDir, dbPath, sock } = await getUserBotContext(req);
        const remoteResult = await forwardToWings(botNum, '/api/wings/bot/group-settings/get', { groupId });
        if (remoteResult) return res.json(remoteResult);
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
            welcome_text: db.settings[groupId]?.welcome_text || welcomeTexts.find(item => item.id === groupId)?.text || '',
            goodbye_text: db.settings[groupId]?.goodbye_text || goodbyeTexts.find(item => item.id === groupId)?.text || '',
            sewa_group: normalizeGroupRental(db.settings[groupId]?.sewa_group)
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

        const { botNum, dbDir, dbPath, sock } = await getUserBotContext(req);
        const remoteResult = await forwardToWings(botNum, '/api/wings/bot/group-settings/save', { groupId, settings: req.body });
        if (remoteResult) return res.json(remoteResult);
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

        const boolKeys = ['chatbot_grup', 'auto_ai_grup', 'goodbye', 'welcome'];
        const previousSettings = db.settings[groupId] && typeof db.settings[groupId] === 'object' ? db.settings[groupId] : {};
        const nextSettings = { ...defaultGroupSettings, sewa_group: normalizeGroupRental(previousSettings.sewa_group) };
        boolKeys.forEach(key => {
            nextSettings[key] = !!req.body[key];
        });
        nextSettings.welcome_design = normalizeWelcomeDesign(req.body.welcome_design);
        nextSettings.welcome_text = String(req.body.welcome_text || '').trim();
        nextSettings.goodbye_text = String(req.body.goodbye_text || '').trim();

        db.settings[groupId] = { ...previousSettings, ...nextSettings };

        setGroupEnabled(path.join(dbDir, 'welcome.json'), groupId, nextSettings.welcome);
        setGroupEnabled(path.join(dbDir, 'left.json'), groupId, nextSettings.goodbye);
        syncGroupMuteByChatbotSetting(dbDir, groupId, nextSettings.chatbot_grup);
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

const configUpload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed (max 10MB)'));
        }
    }
});

app.get('/api/bot/group-invite-preview', async (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const inviteUrl = String(req.query.url || '').trim();
        const inviteCode = extractGroupInviteCode(inviteUrl);
        if (!inviteCode) return res.status(400).json({ error: 'URL invite group WhatsApp tidak valid' });

        const { botNum, sock } = await getUserBotContext(req);
        const remoteResult = await forwardToWings(botNum, '/api/wings/bot/group-invite-preview', { url: inviteUrl });
        if (remoteResult) return res.json(remoteResult);
        if (!sock || typeof sock.groupGetInviteInfo !== 'function') {
            return res.status(400).json({ error: 'Bot belum tersambung atau tidak dapat membaca invite group' });
        }

        const info = await sock.groupGetInviteInfo(inviteCode);
        const inviteGroupId = normalizeInviteGroupId(info?.id);
        const groupsObj = typeof sock.groupFetchAllParticipating === 'function' ? await sock.groupFetchAllParticipating() : {};
        const joined = inviteGroupId ? Object.prototype.hasOwnProperty.call(groupsObj || {}, inviteGroupId) : false;
        res.json({
            success: true,
            group: {
                id: inviteGroupId,
                subject: info?.subject || info?.name || 'Group WhatsApp',
                desc: info?.desc || '',
                size: Array.isArray(info?.participants) ? info.participants.length : (info?.size || 0),
                joined
            }
        });
    } catch (err) {
        console.error('[GROUP RENTAL] Failed to preview invite:', err);
        res.status(500).json({ error: 'Gagal mengambil nama group dari URL invite' });
    }
});

app.post('/api/bot/group-rental/:groupId', async (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const selectedGroupId = normalizeGroupId(req.params.groupId);

        const groupUrl = String(req.body.group_url || '').trim();
        const durationType = String(req.body.duration_type || '').trim();
        const customDate = String(req.body.custom_date || '').trim();
        const groupName = String(req.body.group_name || '').trim();
        const inviteCode = extractGroupInviteCode(groupUrl);

        if (!groupUrl) return res.status(400).json({ error: 'URL group wajib diisi' });
        if (!inviteCode) return res.status(400).json({ error: 'URL invite group WhatsApp tidak valid' });

        let expiredAt;
        if (['7', '15', '30'].includes(durationType)) {
            expiredAt = moment().tz('Asia/Jakarta').add(Number(durationType), 'days').endOf('day').toDate();
        } else if (durationType === 'custom' && customDate) {
            expiredAt = moment.tz(customDate, 'YYYY-MM-DD', 'Asia/Jakarta').endOf('day').toDate();
        }

        if (!expiredAt || Number.isNaN(expiredAt.getTime()) || expiredAt <= new Date()) {
            return res.status(400).json({ error: 'Durasi atau tanggal masa aktif tidak valid' });
        }

        const { botNum, dbDir, dbPath, sock } = await getUserBotContext(req);
        const remoteResult = await forwardToWings(botNum, '/api/wings/bot/group-rental/save', {
            groupId: selectedGroupId,
            rental: { group_url: groupUrl, duration_type: durationType, custom_date: customDate, group_name: groupName }
        }, { timeout: 45000 });
        if (remoteResult) return res.json(remoteResult);
        if (!sock) return res.status(400).json({ error: 'Bot belum tersambung. Silakan connect bot terlebih dahulu.' });

        let inviteInfo = null;
        if (typeof sock.groupGetInviteInfo === 'function') {
            inviteInfo = await sock.groupGetInviteInfo(inviteCode);
        }

        let targetGroupId = normalizeInviteGroupId(inviteInfo?.id) || selectedGroupId;
        let joinedByBot = false;

        const groupsObj = typeof sock.groupFetchAllParticipating === 'function' ? await sock.groupFetchAllParticipating() : {};
        const alreadyJoined = targetGroupId && Object.prototype.hasOwnProperty.call(groupsObj || {}, targetGroupId);

        if (!alreadyJoined) {
            if (typeof sock.groupAcceptInvite !== 'function') {
                return res.status(400).json({ error: 'Bot tidak mendukung join group otomatis dari URL invite' });
            }
            const joinedId = await sock.groupAcceptInvite(inviteCode);
            targetGroupId = getAcceptedInviteGroupId(joinedId) || targetGroupId;
            joinedByBot = true;
        }

        if (!targetGroupId) return res.status(400).json({ error: 'Group ID dari URL invite tidak valid' });

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

        writeJsonFile(dbPath, db);
        if (sock) {
            sock.db = db;
            sock.lastDbSync = Date.now();
        }

        res.json({
            success: true,
            message: joinedByBot ? 'Bot berhasil join dan sewa group berhasil disimpan' : 'Sewa group berhasil disimpan',
            joined: joinedByBot,
            groupId: targetGroupId,
            group: {
                id: targetGroupId,
                subject: db.settings[targetGroupId].sewa_group.group_name || inviteInfo?.subject || 'Group WhatsApp'
            },
            sewa_group: normalizeGroupRental(db.settings[targetGroupId].sewa_group)
        });
    } catch (err) {
        console.error('[GROUP RENTAL] Failed to save rental:', err);
        res.status(500).json({ error: 'Gagal menyimpan sewa group: ' + err.message });
    }
});

app.get('/api/bot/config', async (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const botNum = (req.user.no_Bot || req.user.no_Wa || '').replace(/[^0-9]/g, '');
    try {
        const remoteResult = await forwardToWings(botNum, '/api/wings/bot/config/get');
        if (remoteResult) return res.json(remoteResult);
    } catch (err) {
        console.error('[WINGS CONFIG] Failed to load remote config:', err.message);
    }
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
app.post('/api/bot/config', configUpload.single('thumbnail'), async (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    // Multer populates req.body with text fields when processing multipart/form-data
    const config = { ...req.body };
    const botNum = (req.user.no_Bot || req.user.no_Wa || '').replace(/[^0-9]/g, '');
    const dirPath = path.join(__dirname, 'session', `device${botNum}`);
    const configPath = path.join(dirPath, 'config.json');

    try {
        const remoteResult = await forwardToWings(botNum, '/api/wings/bot/config/save', {
            config,
            thumbnailBase64: req.file ? req.file.buffer.toString('base64') : null
        });
        if (remoteResult) return res.json(remoteResult);

        if (!fs.existsSync(dirPath)) {
            return res.status(400).json({ error: 'Bot belum connect. Silahkan connect terlebih dahulu.' });
        }

        let oldConfig = {};
        if (fs.existsSync(configPath)) {
            oldConfig = JSON.parse(fs.readFileSync(configPath));
        }

        const newConfig = { ...oldConfig, ...config };

        if (req.file) fs.writeFileSync(path.join(dirPath, 'thumb.jpg'), req.file.buffer);
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

    try {
        const remoteResult = await forwardToWings(botNum, '/api/wings/bot/settings/get');
        if (remoteResult) return res.json(remoteResult);
    } catch (err) {
        console.error('[WINGS SETTINGS] Failed to load remote settings:', err.message);
    }

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
        const remoteResult = await forwardToWings(botNum, '/api/wings/bot/settings/save', { settings: req.body });
        if (remoteResult) return res.json(remoteResult);

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
        if ('whatsapp_channel' in cleanBody) {
            const canEditWhatsappChannel = ['basic', 'starter'].includes(String(req.user.paket || '').toLowerCase());
            if (canEditWhatsappChannel) {
                const channelUrl = String(cleanBody.whatsapp_channel || '').trim();
                cleanBody.whatsapp_channel = /^https:\/\/whatsapp\.com\/channel\/[A-Za-z0-9_-]+\/?$/i.test(channelUrl) ? channelUrl : '';
            } else {
                delete cleanBody.whatsapp_channel;
            }
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
    const redirectToLogin = () => {
        clearSessionCookies(req, res);
        res.redirect('/login?success=Berhasil keluar!');
    };

    if (req.user) {
        try {
            await User.findByIdAndUpdate(req.user._id, { currentSessionId: null });
        } catch (e) {
            console.error('Logout error:', e);
        }
    }

    if (typeof req.logout === 'function') {
        return req.logout((err) => {
            if (err) console.error('Passport logout error:', err);
            if (req.session) {
                return req.session.destroy((sessionErr) => {
                    if (sessionErr) console.error('Session destroy error:', sessionErr);
                    redirectToLogin();
                });
            }
            redirectToLogin();
        });
    }

    if (req.session) {
        return req.session.destroy((sessionErr) => {
            if (sessionErr) console.error('Session destroy error:', sessionErr);
            redirectToLogin();
        });
    }

    redirectToLogin();
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
        setSessionCookie(req, res, sessionId);

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

        const userPayload = {
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
        };

        let newUser = new User(userPayload);
        try {
            await newUser.save();
        } catch (err) {
            if (!isDuplicateGoogleIdError(err)) throw err;

            console.warn('[MONGODB] Signup hit legacy googleId duplicate index. Repairing index and retrying once...');
            await ensureGoogleIdIndex();
            newUser = new User(userPayload);
            await newUser.save();
        }

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
        if (isDuplicateEmailError(err)) {
            return res.status(400).json({ error: 'Email sudah terdaftar!' });
        }
        if (isDuplicateGoogleIdError(err)) {
            return res.status(400).json({ error: 'Sistem login Google sedang diperbarui. Silakan coba daftar lagi.' });
        }
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
        const { botStatus } = require('./index');
        const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
        const allowedLimits = [12, 24, 48, 96];
        const requestedLimit = parseInt(req.query.limit, 10) || 24;
        const limit = allowedLimits.includes(requestedLimit) ? requestedLimit : 24;
        const search = String(req.query.search || '').trim();
        const status = ['all', 'active', 'inactive'].includes(req.query.status) ? req.query.status : 'all';
        const escapeRegex = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const allocations = allocationManager.listAllocations();
        const remoteBotStates = {};
        allocations.forEach(allocation => {
            if (!allocation.online) return;
            Object.entries(allocation.bots || {}).forEach(([botNum, bot]) => {
                const cleanNum = String(botNum || '').replace(/[^0-9]/g, '');
                if (!cleanNum || !bot) return;
                remoteBotStates[cleanNum] = bot.status || 'idle';
            });
        });

        const mergedBotStatus = {
            ...botStatus,
            states: {
                ...remoteBotStates,
                ...(botStatus.states || {})
            }
        };

        const activeBotNums = Object.entries(mergedBotStatus.states || {})
            .filter(([, state]) => state === 'open')
            .map(([num]) => num);

        const filters = [];
        if (search) {
            const regex = new RegExp(escapeRegex(search), 'i');
            filters.push({
                $or: [
                    { username: regex },
                    { email: regex },
                    { no_Wa: regex },
                    { no_Bot: regex },
                    { paket: regex },
                    { role: regex }
                ]
            });
        }

        if (status === 'active') {
            filters.push(activeBotNums.length ? { $or: [{ no_Bot: { $in: activeBotNums } }, { no_Wa: { $in: activeBotNums } }] } : { _id: null });
        } else if (status === 'inactive' && activeBotNums.length) {
            filters.push({ no_Bot: { $nin: activeBotNums }, no_Wa: { $nin: activeBotNums } });
        }

        const query = filters.length ? { $and: filters } : {};
        const [users, filteredUsers, totalUsers] = await Promise.all([
            User.find(query)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            User.countDocuments(query),
            User.countDocuments({})
        ]);
        const totalPages = Math.max(Math.ceil(filteredUsers / limit), 1);
        if (page > totalPages) {
            const params = new URLSearchParams({
                page: String(totalPages),
                limit: String(limit),
                status
            });
            if (search) params.set('search', search);
            return res.redirect('/admin/dashboard?' + params.toString());
        }

        let logContent = '';
        const logPath = path.join(__dirname, 'log_reportError.txt');
        if (fs.existsSync(logPath)) {
            const stats = fs.statSync(logPath);
            const maxLogBytes = 80 * 1024;
            const start = Math.max(stats.size - maxLogBytes, 0);
            const fd = fs.openSync(logPath, 'r');
            const buffer = Buffer.alloc(stats.size - start);
            fs.readSync(fd, buffer, 0, buffer.length, start);
            fs.closeSync(fd);
            logContent = (start > 0 ? '[Log dipotong: menampilkan bagian terbaru]\n\n' : '') + buffer.toString('utf8');
        } else {
            logContent = 'No logs available.';
        }

        const uptime = process.uptime();
        const uptimeStr = `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`;

        res.render('admin_dashboard', {
            title: 'Admin Panel',
            user: req.user,
            users: users,
            pagination: {
                page,
                limit,
                totalPages,
                filteredUsers,
                totalUsers,
                search,
                status
            },
            allocations,
            botStatus: mergedBotStatus,
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

app.post('/api/admin/allocations/create', isAdmin, (req, res) => {
    try {
        const allocation = allocationManager.createAllocation(req.body || {}, req);
        res.json({ success: true, allocation });
    } catch (err) {
        res.status(500).json({ error: 'Gagal membuat allocation: ' + err.message });
    }
});

app.post('/api/admin/allocations/delete/:uuid', isAdmin, (req, res) => {
    try {
        const deleted = allocationManager.deleteAllocation(req.params.uuid);
        if (!deleted) return res.status(404).json({ error: 'Allocation tidak ditemukan' });
        res.json({ success: true, message: 'Allocation deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Gagal menghapus allocation: ' + err.message });
    }
});

app.post('/api/admin/allocations/update/:uuid', isAdmin, (req, res) => {
    try {
        const allocation = allocationManager.updateAllocation(req.params.uuid, req.body || {});
        if (!allocation) return res.status(404).json({ error: 'Allocation tidak ditemukan' });
        res.json({ success: true, allocation, message: 'Allocation updated' });
    } catch (err) {
        res.status(500).json({ error: 'Gagal update allocation: ' + err.message });
    }
});

app.get('/api/admin/allocations/command/:uuid', isAdmin, (req, res) => {
    try {
        const command = allocationManager.getAllocationCommand(req.params.uuid, req);
        if (!command) return res.status(404).json({ error: 'Allocation tidak ditemukan' });
        res.json({ success: true, command });
    } catch (err) {
        res.status(500).json({ error: 'Gagal mengambil command allocation: ' + err.message });
    }
});

app.get('/api/admin/allocations/detail/:uuid', isAdmin, (req, res) => {
    try {
        const allocation = allocationManager.getAllocationDetails(req.params.uuid);
        if (!allocation) return res.status(404).json({ error: 'Allocation tidak ditemukan' });

        const bots = allocation.bots || {};
        const openBots = Object.entries(bots)
            .filter(([, bot]) => bot && bot.status === 'open')
            .map(([botNum]) => botNum);
        const activeSessionBots = Array.isArray(allocation.activeSessionBots)
            ? allocation.activeSessionBots
            : [];
        const assignedBots = Array.isArray(allocation.assignedBots)
            ? allocation.assignedBots
            : [];

        res.json({
            success: true,
            allocation,
            summary: {
                openBots,
                activeSessionBots,
                assignedBots,
                openCount: openBots.length,
                activeSessionCount: activeSessionBots.length,
                assignedCount: assignedBots.length,
                maxBots: allocation.maxBots
            }
        });
    } catch (err) {
        res.status(500).json({ error: 'Gagal mengambil detail allocation: ' + err.message });
    }
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

app.post('/api/wings/heartbeat', (req, res) => {
    const { uuid, token } = req.body || {};
    const allocation = allocationManager.updateHeartbeat(uuid, token, req.body || {});
    if (!allocation) return res.status(403).json({ error: 'Invalid allocation credentials' });
    res.json({ success: true, allocation });
});

app.post('/api/wings/restore-list', (req, res) => {
    const { uuid, token } = req.body || {};
    const botNums = allocationManager.getAssignedBots(uuid, token);
    if (!botNums) return res.status(403).json({ error: 'Invalid allocation credentials' });
    res.json({ success: true, botNums });
});
// ============================================================

// ==================== GOOGLE OAUTH ROUTES ====================
app.get('/auth/google',
    (req, res, next) => {
        if (!googleOAuthEnabled) {
            return res.redirect('/signup?error=Google OAuth belum dikonfigurasi. Tambahkan GOOGLE_CLIENT_ID dan GOOGLE_CLIENT_SECRET.');
        }
        next();
    },
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
    (req, res, next) => {
        if (!googleOAuthEnabled) {
            return res.redirect('/signup?error=Google OAuth belum dikonfigurasi.');
        }
        next();
    },
    passport.authenticate('google', { failureRedirect: '/login?error=Login Google gagal. Coba lagi.' }),
    async (req, res) => {
        try {
            const user = req.user;
            const sessionId = crypto.randomBytes(32).toString('hex');
            user.currentSessionId = sessionId;
            await user.save();

            setSessionCookie(req, res, sessionId);

            const redirectUrl = (user.email === process.env.ADMIN_EMAIL) ? '/admin/dashboard' : '/dashboard';
            return res.redirect(redirectUrl);
        } catch (err) {
            console.error('Google callback error:', err);
            return res.redirect('/login?error=Terjadi kesalahan saat login Google.');
        }
    }
);
// ==================== END GOOGLE OAUTH ROUTES ====================

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

