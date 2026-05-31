const express = require("express");
const rateLimit = require("express-rate-limit");
const socketIo = require("socket.io");
const { v4: uuidv4 } = require("uuid");
const fsEx = require("fs-extra");
const axios = require("axios");
const fs = require("fs");
const pm2 = require("pm2");
const chalk = require("chalk");
const cron = require("node-cron");
const path = require("path");
const conf = require("./config.json");
const initPassport = require("./google/passport");
const dashboardRoutes = require("./dashboard");
const { sendOtp, generateOTP } = require("./functions.js");
const { systemPrompt } = require("./prompt");
const { Pool } = require("pg");
const session = require("express-session");
const http = require("http");
const PORT = process.env.PORT || 9014;
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const moment = require("moment-timezone");
require("moment/locale/id");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const pgSession = require("connect-pg-simple")(session);

global.__BOT_LOG_RING__ = {};
global.__BOT_LOG_VIEWERS__ = {};

const debug = (...args) => {
  if (
    process.env.NODE_ENV === "development" ||
    process.env.LEVEL === "debug" ||
    process.env.LEVEL === "trace"
  ) {
    console.trace("[DEBUG]", ...args);
  }
};

const botLogsDir = path.join(__dirname, "bot", "logs");
fsEx.ensureDirSync(botLogsDir);
const qrCodeData = new Map();
pm2.launchBus((err, bus) => {
  if (err) return console.error("PM2 bus error:", err);

  console.log("[PM2] Log bus connected");

  const logRing = {};
  const logViewers = {};
  const MAX_LOG = 200;

  global.__BOT_LOG_RING__ = logRing;
  global.__BOT_LOG_VIEWERS__ = logViewers;

  bus.on("log:out", (packet) => {
    if (!packet?.process?.name || !packet?.data) return;

    const botId = packet.process.name;
    const log = packet.data.toString().trim();
    if (!log) return;

    if (!logRing[botId]) logRing[botId] = [];
    logRing[botId].push(log);

    if (logRing[botId].length > MAX_LOG) {
      logRing[botId].shift();
    }

    if (!logViewers[botId]) return;

    io.to(`bot-${botId}`).emit("log_message", {
      id: botId,
      message: log,
    });
  });

  bus.on("log:err", () => {});

  bus.on("process:event", (packet) => {
    if (packet.event === "exit" && packet.process?.name) {
      const botId = packet.process.name;

      db.query("UPDATE bot SET status = 'offline' WHERE id = $1", [botId]);

      io.to(`bot-${botId}`).emit("status_update", {
        id: botId,
        status: "offline",
      });
    }
  });

  bus.on("process:msg", (packet) => {
    if (!packet?.data?.type || !packet?.process?.name) return;

    const botId = packet.process.name;

    if (packet.data.type === "qrCodeResult") {
      qrCodeData.set(botId, packet.data.qr);
      io.to(`bot-${botId}`).emit("qr_code_update", {
        id: botId,
        qr: packet.data.qr,
      });
    }

    if (packet.data.type === "pairingCodeResult") {
      io.to(`bot-${botId}`).emit("pairing_code_update", {
        id: botId,
        code: packet.data.code,
      });
    }
  });
});

app.use((req, res, next) => {
  const blockedExt = [".ejs", ".html"];

  if (blockedExt.some((ext) => req.path.toLowerCase().endsWith(ext))) {
    return res.status(404).send("Not Found");
  }

  next();
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const db = new Pool({
  host: conf.server.db.host,
  user: conf.server.db.user,
  password: conf.server.db.password,
  database: conf.server.db.database,
  port: conf.server.db.port,
});

const passport = initPassport(db);

db.connect((err, client, release) => {
  console.log("menghubungkan ke database:", conf.server.db.database);
  if (err) {
    console.error("gagal terhubung ke database:", conf.server.db.database);
    if (err.code === "ECONNREFUSED") {
      console.log("database tidak dapat dijangkau atau sedang tidak aktif");
      console.log("web server dihentikan");
      process.exit();
    }
  } else {
    console.log("berhasil terhubung ke database:", conf.server.db.database);
    release();
    cekExp();
  }
});

const logCache = {};
const resetLimiter = rateLimit({
  windowMs: 5 * 60 * 60 * 1000,
  max: 5,
  keyGenerator: (req) =>
    req.body.email ? req.body.email.toLowerCase() : req.ip,

  handler: (req, res) => {
    req.rateLimitError =
      "Permintaan reset password/OTP hanya bisa dilakukan 5x dalam 5 jam.";
    return res.redirect("/changepassword");
  },
});

/** LIMIT OTP 1 MENIT */
const otpLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 3,
  message: "Terlalu banyak permintaan OTP. Coba lagi nanti.",
});

const thumb = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "bot/dbsrc/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const base = path.basename(file.originalname, ext);
    cb(null, `${base}-${Date.now()}${ext}`);
  },
});

const thumbUpload = multer({
  storage: thumb,
  limits: { fileSize: 1 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    const allowed = /jpg|jpeg|png/;
    const ext = path.extname(file.originalname).toLowerCase();
    const mime = file.mimetype;

    if (allowed.test(ext) && allowed.test(mime)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Hanya boleh upload file JPG, JPEG, atau PNG dengan ukuran maks 1MB"
        )
      );
    }
  },
});

const sessionMiddleware = session({
  store: new pgSession({
    pool: db,
    tableName: "user_sessions",
  }),
  secret: "ganti-dengan-secret-yang-sangat-panjang-dan-acak-banget-disini",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  },
});

app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
});

dashboardRoutes(app, db);

function isAuth(req, res, next) {
  debug("Session:", req.session);
  if (req.session && req.session.loggedin) return next();
  res.redirect("/login");
}

async function getAISupportResponse(userMessage) {
  try {
    const options = {
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      temperature: 0.7,
      max_tokens: 256,
    };

    const res = await axios.post(
      "https://api.deepenglish.com/api/gpt_open_ai/chatnew",
      options,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer UFkOfJaclj61OxoD7MnQknU1S2XwNdXMuSZA+EZGLkc=",
        },
      }
    );

    if (res.data.success) {
      return { success: true, answer: res.data.message };
    } else {
      return {
        success: false,
        answer: "Maaf, AI sedang sibuk. Coba lagi nanti ya.",
      };
    }
  } catch (error) {
    console.error("AI Support Error:", error.response?.data || error.message);
    return {
      success: false,
      answer: "Waduh, sepertinya ada masalah koneksi ke server AI.",
    };
  }
}

const NODES = [
  { name: "Soft Botz Core-1", id: "server_id_panelmu" },
  { name: "Soft Botz Core-2", comingSoon: true }
];

async function getServerStats(identifier) {
  const API_KEY = "isi sendiri";
  const PANEL_URL = "https://clients.caliphdev.com";

  try {
    const headers = {
      Authorization: `Bearer ${API_KEY}`,
      Accept: "application/json"
    };

    const serverDetail = await axios.get(
      `${PANEL_URL}/api/client/servers/${identifier}`,
      { headers, timeout: 7000 }
    );

    const maxMB = serverDetail.data?.attributes?.limits?.memory;

    const resource = await axios.get(
      `${PANEL_URL}/api/client/servers/${identifier}/resources`,
      { headers, timeout: 7000 }
    );

    const r = resource.data?.attributes?.resources;
    if (!r) throw new Error("Invalid resource data");

    const usedMB = Math.round((r.memory_bytes || 0) / 1024 / 1024);

    const percent = maxMB
      ? Math.min(100, Math.round((usedMB / maxMB) * 100))
      : 0;

    let status;
    let availability;

    if (percent < 50) {
      status = "Available";
      availability = "Slot Available";
    } else if (percent < 80) {
      status = "Limited";
      availability = "Limited Slot";
    } else {
      status = "Full";
      availability = "Full";
    }

    return {
      percent,
      usedMB,
      maxMB,
      status,
      availability,
      offline: false,
      comingSoon: false
    };

  } catch (err) {
    return {
      percent: 0,
      usedMB: 0,
      maxMB: 0,
      status: "Offline",
      availability: "Offline",
      offline: true,
      comingSoon: false
    };
  }
}

app.get("/", async (req, res) => {

  const servers = await Promise.all(
    NODES.map(async (n) => {

      if (n.comingSoon) {
        return {
          name: n.name,
          percent: 0,
          usedMB: 0,
          maxMB: 0,
          status: "Coming Soon",
          availability: "Coming Soon",
          offline: true,
          comingSoon: true
        };
      }

      const data = await getServerStats(n.id);

      return {
        name: n.name,
        ...data
      };
    })
  );

  res.render("index", { servers });
});

app.get("/not_found404", (req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

app.get("/report", isAuth, async (req, res) => {
  try {
    const userId = req.session.uid;

    const userRes = await db.query(
      "SELECT id, username, email FROM users WHERE id = $1",
      [userId]
    );

    const botRes = await db.query("SELECT id FROM bot WHERE uid = $1", [
      userId,
    ]);

    if (userRes.rows.length === 0 || botRes.rows.length === 0) {
      return res.redirect("/dashboard");
    }

    res.render("report", {
      user: userRes.rows[0],
      bot: botRes.rows[0],
      query: req.query,
    });
  } catch (err) {
    console.error(err);
    res.redirect("/dashboard");
  }
});

app.post("/report", isAuth, async (req, res) => {
  const userId = req.session.uid;
  const { report } = req.body;

  function escapeMarkdown(text) {
    return text.replace(/([_*[\]()~`>#+\-=|{}.!])/g, "\\$1");
  }

  if (!report || report.trim().length < 5) {
    return res.redirect("/report");
  }

  try {
    const userRes = await db.query(
      "SELECT username, email FROM users WHERE id = $1",
      [userId]
    );

    const botRes = await db.query("SELECT id FROM bot WHERE uid = $1", [
      userId,
    ]);

    if (userRes.rows.length === 0 || botRes.rows.length === 0) {
      return res.redirect("/dashboard");
    }

    const user = userRes.rows[0];
    const bot = botRes.rows[0];

    const now =
      new Date().toLocaleString("id-ID", {
        timeZone: "Asia/Jakarta",
        dateStyle: "long",
        timeStyle: "short",
      }) + " WIB";

    const message = `
🚨 *BUG REPORT - SOFT BOTZ*

👤 Username:
\`${user.username}\`
📧 Email:
\`${user.email}\`
🤖 Bot ID:
\`${bot.id}\`
🕒 Date:
${now}

📝 *Report:*
${escapeMarkdown(report)}
`;

    await axios.post(
      `https://api.telegram.org/bot${conf.telegram.bot_token}/sendMessage`,
      {
        chat_id: conf.telegram.chat_id,
        text: message,
        parse_mode: "Markdown",
      }
    );

    res.redirect("/report?success=1");
  } catch (err) {
    console.error(err);
    res.redirect("/report");
  }
});

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    req.session.loggedin = true;
    req.session.uid = req.user.id;
    res.redirect("/dashboard");
  }
);

app.get("/donasi", (req, res) => {
  res.render("donasi");
});

app.get("/info", isAuth, (req, res) => {
  res.render("info");
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "about.html"));
});

app.get("/policy", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "policy.html"));
});

app.get("/login", (req, res) => {
  const errorMsg = req.session.err || "";
  req.session.err = null;
  res.render("login", { err: errorMsg });
});

app.get("/request-otp", (req, res) => {
  res.render("requestotp", { err: "" });
});

app.get("/changepassword", (req, res) => {
  const err = req.rateLimitError || "";
  req.rateLimitError = null;

  res.render("changepassword", {
    showOtpForm: false,
    err,
  });
});

app.post("/request-otp", resetLimiter, otpLimiter, async (req, res) => {
  const { email } = req.body;
  if (!email) return res.render("requestotp", { err: "Masukkan email!" });

  try {
    const client = await db.connect();
    const result = await client.query("SELECT id FROM users WHERE email = $1", [
      email,
    ]);
    if (!result.rows.length) {
      client.release();
      return res.render("requestotp", { err: "Email tidak terdaftar!" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpToken = crypto.randomBytes(24).toString("hex");
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    await client.query(
      `UPDATE users SET otp = $1, otp_token = $2, otp_expired = $3 WHERE email = $4`,
      [otp, otpToken, expires, email]
    );
    client.release();

    const sendResult = await sendOtp(email, otp);

    if (sendResult.status) {
      console.log(`[SERVER DEBUG] OTP berhasil dikirim ke ${email}`);
      return res.redirect(`/changepassword?token=${otpToken}`);
    } else {
      console.log(`[SERVER DEBUG] OTP gagal dikirim ke ${email}`);
      console.error(sendResult.data);
      return res.render("requestotp", { err: "Gagal mengirim OTP ke email!" });
    }
  } catch (err) {
    console.error("Error saat request OTP:", err);
    return res.render("requestotp", { err: "Terjadi kesalahan server!" });
  }
});

app.post("/changepassword", resetLimiter, async (req, res) => {
  const { action, email, otp, newPassword } = req.body;

  if (action === "sendOtp") {
    if (!email) {
      return res.render("changepassword", {
        showOtpForm: false,
        err: "Masukkan email!",
      });
    }

    try {
      const client = await db.connect();

      const result = await client.query(
        "SELECT id FROM users WHERE email = $1",
        [email]
      );

      if (!result.rows.length) {
        client.release();
        return res.render("changepassword", {
          showOtpForm: false,
          err: "Email tidak terdaftar!",
        });
      }

      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expires = new Date(Date.now() + 10 * 60 * 1000);

      await client.query(
        "UPDATE users SET otp = $1, otp_expired = $2 WHERE email = $3",
        [otpCode, expires, email]
      );

      client.release();

      const sendResult = await sendOtp(email, otpCode);
      if (!sendResult.status) {
        return res.render("changepassword", {
          showOtpForm: false,
          err: "Gagal mengirim OTP!",
        });
      }

      return res.render("changepassword", {
        showOtpForm: true,
        email,
        err: "OTP telah dikirim ke email kamu!",
      });
    } catch (err) {
      console.error(err);
      return res.render("changepassword", {
        showOtpForm: false,
        err: "Terjadi kesalahan server!",
      });
    }
  }

  if (action === "resetPassword") {
    if (!email || !otp || !newPassword) {
      return res.render("changepassword", {
        showOtpForm: true,
        email,
        err: "Semua field wajib diisi!",
      });
    }

    try {
      const client = await db.connect();

      const userRes = await client.query(
        "SELECT otp, otp_expired FROM users WHERE email = $1",
        [email]
      );

      if (!userRes.rows.length) {
        client.release();
        return res.render("changepassword", {
          showOtpForm: false,
          err: "Email tidak ditemukan!",
        });
      }

      const user = userRes.rows[0];

      if (new Date(user.otp_expired) < new Date()) {
        client.release();
        return res.render("changepassword", {
          showOtpForm: true,
          email,
          err: "OTP sudah kadaluarsa!",
        });
      }

      if (otp !== user.otp) {
        client.release();
        return res.render("changepassword", {
          showOtpForm: true,
          email,
          err: "OTP salah!",
        });
      }

      const hashedPass = await bcrypt.hash(newPassword, 10);

      await client.query(
        "UPDATE users SET password = $1, otp = '000000', otp_expired = NULL WHERE email = $2",
        [hashedPass, email]
      );

      if (req.sessionID) {
        await client.query("DELETE FROM user_sessions WHERE sid = $1", [
          req.sessionID,
        ]);
      }

      client.release();

      req.session.destroy(() => {
        return res.redirect("/login");
      });
    } catch (err) {
      console.error(err);
      return res.render("changepassword", {
        showOtpForm: true,
        email,
        err: "Terjadi kesalahan server!",
      });
    }

    return;
  }

  return res.redirect("/changepassword");
});

app.get("/register", (req, res) => {
  const errorMsg = req.session.err || "";
  req.session.err = null;
  res.render("register", { err: errorMsg });
});

app.get("/langganan", isAuth, async (req, res) => {
  const userId = req.session.uid;

  try {
    const userResult = await db.query("SELECT * FROM users WHERE id = $1", [
      userId,
    ]);

    const botResult = await db.query("SELECT * FROM bot WHERE uid = $1", [
      userId,
    ]);

    if (userResult.rows.length === 0) {
      return res.redirect("/login");
    }

    const user = userResult.rows[0];
    const bot = botResult.rows.length > 0 ? botResult.rows[0] : null;

    res.render("pricing", {
      user,
      bot,
    });
  } catch (err) {
    console.error("Error fetching pricing data:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/custom", isAuth, (req, res) => {
  const id = req.session.uid;

  db.query("SELECT * FROM bot WHERE uid = $1", [id], (err, result) => {
    if (err) {
      console.error("Gagal ambil data bot:", err);
      return res.render("custom", { bot: null, defaults: conf.defaults });
    }

    const bot =
      result.rows.length > 0
        ? result.rows[0]
        : {
            botname: "",
            phone: "",
            owner: "",
            ownernum: "",
            gc_link: "",
            channel_link: "",
            limit_value: 0,
            sticker_package: "",
            sticker_author: "",
            thumbnail: "default",
            global_disabled: {}
          };

    if (typeof bot.global_disabled === "string") {
      try {
        bot.global_disabled = JSON.parse(bot.global_disabled);
      } catch {
        bot.global_disabled = {};
      }
    } else if (!bot.global_disabled) {
      bot.global_disabled = {};
    }

    res.render("custom", { bot, defaults: conf.defaults });
  });
});

app.get("/dashboard", isAuth, async (req, res) => {
  const id = req.session.uid;

  let notificationText = "";
  try {
    const infoPath = path.join(__dirname, "info.json");
    if (fs.existsSync(infoPath)) {
      const data = await fs.promises.readFile(infoPath, "utf8");
      notificationText = JSON.parse(data).text || "";
    }
  } catch (e) {
    console.error("Gagal membaca file notifikasi:", e);
  }

  db.query("SELECT * FROM bot WHERE uid = $1", [id], (err, result) => {
    if (err) {
      console.error("DB error:", err);
      return res
        .status(500)
        .send("Terjadi kesalahan pada server. Silakan coba lagi nanti");
    }

    if (result.rows.length === 0) {
      return res.redirect("/");
    }

    const bot = result.rows[0];

    if (typeof bot.global_disabled === "string") {
      try {
        bot.global_disabled = JSON.parse(bot.global_disabled);
      } catch {
        bot.global_disabled = {};
      }
    } else if (!bot.global_disabled) {
      bot.global_disabled = {};
    }

    bot.phone = bot.phone || conf.defaults.phone || "";
    bot.owner = bot.owner || conf.defaults.owner;
    bot.ownernum = bot.ownernum || conf.defaults.ownernum;
    bot.botname = bot.botname || conf.defaults.botname;
    bot.thumbnail = bot.thumbnail || conf.defaults.thumbnail;
    bot.status = bot.status || "offline";

    const ms = new Date(bot.expired).getTime() - Date.now();
    bot.role = getRoleByExp(ms);

    let roleIcon;
    if (bot.role.includes("Eternal Mangekyou")) {
      roleIcon =
        '<img src="https://upload.wikimedia.org/wikipedia/commons/a/aa/Mangekyou_Sharingan_Sasuke_%28Eternal%29.svg" class="sharingan-icon" alt="Eternal Mangekyou Icon">';
    } else if (bot.role.includes("Supreme")) {
      roleIcon =
        '<div class="supreme-logo-container"><img src="https://upload.wikimedia.org/wikipedia/commons/2/28/Supreme_Logo.svg" alt="Supreme Logo"></div>';
    } else if (bot.role.includes("Paragon")) {
      roleIcon =
        '<div class="paragon-logo-container"><img src="https://upload.wikimedia.org/wikipedia/commons/archive/1/17/20160402051041%21Yin_yang.svg" alt="Paragon Logo"></div>';
    } else {
      roleIcon = '<i class="fa-solid fa-crown"></i>';
    }

    const expiredDate = moment(bot.expired).tz("Asia/Jakarta");
    if (expiredDate.isBefore(moment())) {
      bot.expired = `⛔ ${expiredDate.locale("id").format("D MMMM YYYY HH:mm")}`;
      bot.status = "expired";
    } else {
      bot.expired = `${expiredDate.locale("id").format("D MMMM YYYY HH:mm")}`;
    }

    if (bot.isactive === false || bot.status === "expired") {
      bot.showUpgrade = true;
    }

    const credsPath = path.join(
      __dirname,
      "bot",
      "session",
      bot.id,
      "creds.json"
    );
    const showConnectBotSection = !fs.existsSync(credsPath);

    res.render("dashboard", {
      bot,
      notificationText,
      roleIcon,
      showConnectBotSection,
    });
  });
});

app.get("/profile", isAuth, async (req, res) => {
  const userId = req.session.uid;

  try {
    const userResult = await db.query("SELECT * FROM users WHERE id = $1", [
      userId,
    ]);
    const botResult = await db.query("SELECT * FROM bot WHERE uid = $1", [
      userId,
    ]);

    if (userResult.rows.length === 0) {
      return res.redirect("/login");
    }

    const user = userResult.rows[0];
    const bot = botResult.rows.length > 0 ? botResult.rows[0] : {};
    const ms = bot.expired ? new Date(bot.expired).getTime() - Date.now() : 0;
    const roleName = getRoleByExp(ms);
    user.created_at_formatted = moment(user.created_at)
      .tz("Asia/Jakarta")
      .locale("id")
      .format("D MMMM YYYY");
    bot.created_at_formatted = bot.created_at
      ? moment(bot.created_at)
          .tz("Asia/Jakarta")
          .locale("id")
          .format("D MMMM YYYY")
      : "N/A";
    const renew_count = 0;
    res.render("profile", { user, bot, roleName, renew_count });
  } catch (err) {
    console.error("Error fetching profile data:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        res.status(400).send("Unable to log out");
      } else {
        res.redirect("/login");
      }
    });
  } else {
    res.end();
  }
});

app.get("/informasi", (req, res) => {
  res.sendFile(__dirname + "/views/informasi.html");
});

app.get("/chat", (req, res) => {
  res.sendFile(__dirname + "/views/chat.html");
});

app.get("/admindimzbotz", (req, res) => {
  res.render("admin_login");
});

app.post("/admin_login", (req, res) => {
  const reqUser = req.body.username;
  const reqPassword = req.body.password;

  fs.readFile("./config.json", "utf8", (err, data) => {
    if (err) {
      console.error("Gagal membaca config.json:", err);
      return res.render("admin_login", { err: "Terjadi kesalahan server" });
    }

    const admin = JSON.parse(data).admin;

    if (reqUser === admin.username && reqPassword === admin.password) {
      req.session.isAdmin = true;

      db.query(
        "SELECT b.*, u.email AS owner_email FROM bot b LEFT JOIN users u ON b.uid = u.id",
        (err, bots) => {
          if (err) {
            console.error("Error fetching bots:", err);
            return res.render("admin", { bot: [], bans: [] });
          }

          db.query("SELECT * FROM banned", (err2, bans) => {
            if (err2) {
              console.error("Error fetching banned:", err2);
              return res.render("admin", { bot: bots.rows, bans: [] });
            }
            res.render("admin", { bot: bots.rows, bans: bans.rows });
          });
        }
      );
    } else if (reqUser !== admin.username) {
      res.render("admin_login", { err: "username salah" });
    } else {
      res.render("admin_login", { err: "password salah" });
    }
  });
});

app.post("/admindimzbotz", (req, res) => {
  const search = req.body.search?.trim();

  const query = `
    SELECT b.*, u.email AS owner_email
    FROM bot b
    LEFT JOIN users u ON b.uid = u.id
    WHERE b.id ILIKE $1 OR u.email ILIKE $1 OR b.phone ILIKE $1
  `;

  db.query(query, [`%${search}%`], (err, result) => {
    if (err) {
      console.error("Error fetching data:", err);
      return res.render("admin", { bot: [], bans: [] });
    }

    const bots = result.rows.map((bot) => {
      if (bot.expired) {
        bot.expired = moment(bot.expired)
          .tz("Asia/Jakarta")
          .format("DD MMMM YYYY [pukul] h:mm a");
      }
      return bot;
    });

    db.query("SELECT * FROM banned", (err2, bans) => {
      if (err2) {
        console.error("Error fetching banned data on search:", err2);
        return res.render("admin", { bot: bots, bans: [] });
      }
      res.render("admin", { bot: bots, bans: bans.rows });
    });
  });
});

app.post("/admin/logout", isAdmin, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Gagal menghapus sesi:", err);
      return res
        .status(500)
        .json({ success: false, message: "Gagal logout dari server." });
    }

    res.clearCookie("connect.sid");
    return res.json({ success: true });
  });
});

app.post("/custom", isAuth, async (req, res) => {
  const userId = req.session.uid;

  const limitText = (v, max = 25) => (v ? String(v).trim().slice(0, max) : "");

  const normalizeWA = (v) => {
    if (!v) return "";
    const clean = String(v).replace(/\D/g, "");
    if (!/^62\d{9,14}$/.test(clean)) return "";
    return clean;
  };

  const botName = limitText(req.body.botName);
  const owner = limitText(req.body.owner);
  const ownernum = normalizeWA(req.body.ownernum);
  const phone = normalizeWA(req.body.phone);
  const gc = limitText(req.body.gc, 100);
  const channel = limitText(req.body.channel, 100);
  const stickerPackage = limitText(req.body.stickerPackage);
  const stickerAuthor = limitText(req.body.stickerAuthor);
  const limitValue = parseInt(req.body.limit) || conf.defaults.limit;

  if (!botName || !owner || !phone || !stickerPackage || !stickerAuthor) {
    try {
      const result = await db.query("SELECT * FROM bot WHERE uid = $1", [
        userId,
      ]);
      const botData = result.rows.length > 0 ? result.rows[0] : null;
      return res.render("custom", {
        bot: botData,
        defaults: conf.defaults,
        err: "Semua kolom dengan tanda * wajib diisi!",
      });
    } catch (dbErr) {
      console.error(dbErr);
      return res.render("custom", {
        bot: null,
        defaults: conf.defaults,
        err: "Gagal mengambil data bot.",
      });
    }
  }

  try {
    const result = await db.query(
      "SELECT expired, id, global_disabled FROM bot WHERE uid = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.render("custom", {
        bot: null,
        defaults: conf.defaults,
        err: "Data bot tidak ditemukan.",
      });
    }

    const botId = result.rows[0].id;
    const expiredDate = new Date(result.rows[0].expired);
    const daysLeft = Math.ceil(
      (expiredDate - Date.now()) / (1000 * 60 * 60 * 24)
    );
    const isTrial = daysLeft <= 1;

    let disabled;

    if (isTrial) {
  disabled = {
    menfess: false,
    confess: false,
    autoTyping: true,
    autoRecord: true,
    online: false,
  };
} else {
  const disableTyping = !!req.body.disableTyping;
  const disableRecord = !!req.body.disableRecord;

  let finalTyping = disableTyping;
  let finalRecord = disableRecord;

  if (!finalTyping && !finalRecord) {
    finalRecord = true;
  }

  disabled = {
    menfess: !!req.body.disableMenfess,
    confess: !!req.body.disableConfess,
    autoTyping: finalTyping,
    autoRecord: finalRecord,
    online: !!req.body.disableOnline,
  };
}

    const sql = `
      UPDATE bot SET 
        phone = $1,
        owner = $2,
        ownernum = $3,
        gc_link = $4,
        channel_link = $5,
        limit_value = $6,
        sticker_package = $7,
        botname = $8,
        sticker_author = $9,
        global_disabled = $10
      WHERE uid = $11
    `;

    await db.query(sql, [
      phone,
      owner,
      ownernum,
      gc,
      channel,
      limitValue,
      stickerPackage,
      botName,
      stickerAuthor,
      JSON.stringify(disabled),
      userId,
    ]);

    if (req.body.limit) {
      const limitFile = path.join(
        __dirname,
        "bot/database/limits",
        `limit_${botId}.json`
      );
      if (fs.existsSync(limitFile)) {
        await fs.promises.unlink(limitFile);
      }
    }

    res.render("success");
  } catch (err) {
    console.error(err);
    try {
      const result = await db.query("SELECT * FROM bot WHERE uid = $1", [
        userId,
      ]);
      const botData = result.rows.length > 0 ? result.rows[0] : null;
      res.render("custom", {
        bot: botData,
        defaults: conf.defaults,
        err: "Terjadi kesalahan saat menyimpan data.",
      });
    } catch (dbErr) {
      console.error(dbErr);
      res.render("custom", {
        bot: null,
        defaults: conf.defaults,
        err: "Gagal mengambil data bot setelah error.",
      });
    }
  }
});

app.post(
  "/thumbnail",
  isAuth,
  thumbUpload.single("thumbnail"),
  async (req, res) => {
    const userId = req.session.uid;
    let thumbnailPath = req.file
      ? `dbsrc/${req.file.filename}`
      : "Media2/theme/thumb.jpg";

    try {
      await db.query("UPDATE bot SET thumbnail = $1 WHERE uid = $2", [
        thumbnailPath,
        userId,
      ]);
      res.render("success");
    } catch (err) {
      console.error("Gagal update thumbnail:", err);
      res.redirect("/custom");
    }
  }
);

app.get("/thumbnail", isAuth, (req, res) => {
  const userId = req.session.uid;

  db.query(
    "SELECT thumbnail FROM bot WHERE uid = $1",
    [userId],
    (err, result) => {
      if (err || result.rows.length === 0) {
        return res.send({
          status: false,
          message: "Bot tidak ditemukan atau Anda tidak memiliki izin.",
        });
      }

      const { thumbnail } = result.rows[0];
      res.sendFile(path.join(__dirname, `./bot/Media2/theme/thumb.jpg`));
    }
  );
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length === 0) {
      req.session.err = "Email tidak terdaftar";
      return res.redirect("/login");
    }

    const user = result.rows[0];

    if (user.otp !== "000000") {
      const otp = await generateOTP();
      try {
        await db.query(
          "UPDATE users SET otp = $1, otp_expired = NOW() + interval '5 minutes' WHERE email = $2",
          [otp, email]
        );
        const sendResult = await sendOtp(email, otp);
        if (sendResult.status) {
          return res.render("otp", { email });
        } else {
          req.session.err = "Gagal mengirim email verifikasi, coba lagi.";
          return res.redirect("/login");
        }
      } catch (err2) {
        console.error("Gagal update OTP:", err2);
        req.session.err = "Terjadi kesalahan saat memproses OTP.";
        return res.redirect("/login");
      }
    } else {
      let validPass = false;
      if (/^\$2[aby]\$/.test(user.password)) {
        validPass = await bcrypt.compare(password, user.password);
      } else {
        validPass = password === user.password;
      }

      if (!validPass) {
        req.session.err = "Password salah";
        return res.redirect("/login");
      }

      req.session.regenerate((err) => {
        if (err) {
          console.error("Session regeneration error:", err);
          req.session.err = "Terjadi kesalahan server saat membuat sesi.";
          return res.redirect("/login");
        }
        req.session.loggedin = true;
        req.session.uid = user.id;
        req.session.save((err) => {
          if (err) {
            console.error("Session save error:", err);
            req.session.err = "Terjadi kesalahan server saat menyimpan sesi.";
            return res.redirect("/login");
          }
          res.redirect("/dashboard");
        });
      });
    }
  } catch (err) {
    console.error("Error login:", err);
    req.session.err = "Terjadi kesalahan pada server.";
    return res.redirect("/login");
  }
});

app.post("/register", async (req, res) => {
  const { username, email, password, confirm_password } = req.body;
  const otp = await generateOTP();

  if (!username || !email || !password || !confirm_password) {
    req.session.err = "Semua field wajib diisi";
    return res.redirect("/register");
  }

  const allowedDomains = ["gmail.com", "yahoo.com"];
  const emailDomain = email.split("@")[1];

  if (!allowedDomains.includes(emailDomain)) {
    req.session.err =
      "Hanya pendaftaran menggunakan email @gmail.com atau @yahoo.com yang diizinkan.";
    return res.redirect("/register");
  }

  if (password !== confirm_password) {
    req.session.err = "Password dan konfirmasi tidak sama!";
    return res.redirect("/register");
  }

  if (password.length < 6) {
    req.session.err = "Password minimal 6 karakter";
    return res.redirect("/register");
  }

  try {
    const banRes = await db.query("SELECT * FROM banned WHERE email = $1", [
      email,
    ]);
    if (banRes.rows.length > 0) {
      return res.render("banned");
    }

    const userRes = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (userRes.rows.length === 0) {
      const hashedPass = await bcrypt.hash(password, 10);
      const userId = uuidv4();

      await db.query(
        "INSERT INTO users (id, username, email, password, otp, otp_expired) VALUES ($1, $2, $3, $4, $5, NOW() + interval '5 minutes')",
        [userId, username, email, hashedPass, otp]
      );

      const sendResult = await sendOtp(email, otp);

      if (sendResult.status) {
        return res.render("otp", { email });
      } else {
        console.error("Gagal kirim email:", sendResult.data);
        req.session.err = "Gagal kirim email OTP";
        return res.redirect("/register");
      }
    } else {
      const user = userRes.rows[0];

      if (user.otp !== "000000") {
        await db.query(
          "UPDATE users SET otp = $1, otp_expired = NOW() + interval '5 minutes' WHERE email = $2",
          [otp, email]
        );

        const sendResult = await sendOtp(email, otp);

        if (sendResult.status) {
          return res.render("otp", { email });
        } else {
          console.error("Gagal kirim email:", sendResult.data);
          req.session.err = "Gagal kirim email OTP";
          return res.redirect("/register");
        }
      } else {
        req.session.err = "Email sudah terdaftar";
        return res.redirect("/register");
      }
    }
  } catch (e) {
    console.error("Register error:", e);
    req.session.err = "Internal error";
    return res.redirect("/register");
  }
});

app.post("/verifyotp", async (req, res) => {
  const { otp, email } = req.body;

  if (!otp || !email) {
    return res.render("otp", { email, err: "OTP dan email wajib diisi." });
  }

  try {
    const result = await db.query(
      "SELECT * FROM users WHERE email = $1 AND otp = $2 AND otp_expired > NOW()",
      [email, otp]
    );

    if (result.rows.length === 0) {
      const userCheck = await db.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);

      if (userCheck.rows.length === 0) {
        return res.render("otp", { email, err: "Email tidak ditemukan." });
      }

      if (userCheck.rows[0].otp !== otp) {
        return res.render("otp", { email, err: "Kode OTP salah!" });
      }

      return res.render("otp", {
        email,
        err: "Kode OTP sudah kedaluwarsa!",
      });
    }

    const user = result.rows[0];

    if (!user.id) {
      console.error("User ID kosong, sistem lama rusak.");
      return res.render("otp", {
        email,
        err: "Akun tidak valid. Silakan daftar ulang.",
      });
    }

    await db.query(
      "UPDATE users SET otp = '000000', otp_expired = NULL WHERE email = $1",
      [email]
    );

    const expired = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);
    const botId = uuidv4();

    await db.query(
      `INSERT INTO bot (id, uid, expired, status, isactive, thumbnail, owner, botname, sticker_package, sticker_author, limit_value) 
       VALUES ($1, $2, $3, 'offline', true, $4, $5, $6, $7, $8, $9)`,
      [
        botId,
        user.id,
        expired,
        conf.defaults.thumbnail,
        conf.defaults.owner,
        conf.defaults.botname,
        conf.defaults.stickerPackage,
        conf.defaults.stickerAuthor,
        conf.defaults.limit,
      ]
    );

    req.session.regenerate((err) => {
      if (err) {
        console.error("Session regeneration error:", err);
        return res.render("otp", {
          email,
          err: "Gagal membuat sesi aman.",
        });
      }

      req.session.loggedin = true;
      req.session.uid = user.id;

      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          return res.render("otp", {
            email,
            err: "Gagal menyimpan sesi.",
          });
        }

        res.redirect("/dashboard");
      });
    });
  } catch (err) {
    console.error("Error saat verifikasi OTP:", err);
    res.render("otp", {
      email,
      err: "Terjadi kesalahan pada server.",
    });
  }
});

app.post("/controls", isAuth, (req, res) => {
  const { id, cmd, connectMethod } = req.body;
  const userId = req.session.uid;

  db.query(
    "SELECT * FROM bot WHERE id = $1 AND uid = $2",
    [id, userId],
    (err, result) => {
      if (err || result.rows.length === 0) {
        return res.send({
          status: false,
          message: "Bot tidak ditemukan atau Anda tidak memiliki izin.",
        });
      }

      const bot = result.rows[0];
      const now = new Date();
      const expired = new Date(bot.expired);
      const phone = (bot.phone || "").trim();
      const logFilePath = path.join(botLogsDir, `${id}.log`);

      const resetLog = () => {
        try {
          if (fs.existsSync(logFilePath)) {
            fs.unlinkSync(logFilePath);
            console.log(`[LOG] Log bot ${id} berhasil dihapus`);
          }
        } catch (e) {
          console.error(`[LOG] Gagal hapus log bot ${id}:`, e.message);
        }
        if (logCache[id]) delete logCache[id];
      };

      if (!phone || phone.toLowerCase() === "default") {
        return res.send({
          status: false,
          message:
            "Nomor WhatsApp bot belum diisi. Silakan isi Phone Number sebelum menjalankan bot.",
        });
      }

      if (bot.status === "expired" && expired > now) {
        db.query(
          "UPDATE bot SET status = 'offline', isactive = true WHERE id = $1",
          [id]
        );
        bot.status = "offline";
        bot.isactive = true;
      }

      if (cmd === "start") {
        if (!bot.isactive || expired <= now) {
          return res.send({
            status: false,
            message:
              "Bot sudah expired atau tidak aktif, silakan perpanjang langganan :(",
          });
        }

        resetLog();

        const args = {
          sessionName: `session/${id}`,
          phoneNumber: bot.phone || "",
          botname: bot.botname || conf.defaults.botname,
          thumbnail: bot.thumbnail || conf.defaults.thumbnail,
          limit: parseInt(bot.limit_value) || conf.defaults.limit,
          owner: bot.owner || conf.defaults.owner,
          ownernum: bot.ownernum || conf.defaults.ownernum,
          gc: bot.gc_link || conf.defaults.gc,
          channel: bot.channel_link || conf.defaults.channel,
          sticker: bot.sticker_package || conf.defaults.stickerPackage,
          author: bot.sticker_author || conf.defaults.stickerAuthor,
          id: bot.id,
          connectMethod: connectMethod || "pairing",
        };

        let safeArgs = "{}";
        try {
          safeArgs = JSON.stringify(args);
        } catch {}

        return pm2.start(
          {
            script: "index.js",
            name: id,
            cwd: path.join(__dirname, "bot/"),
            args: [safeArgs],
            exec_mode: "fork",
            max_memory_restart: "500M",
          },
          (err) => {
            if (err) {
              console.error("PM2 start error:", err);
              return res.send({
                status: false,
                message: `Gagal menjalankan bot dengan id ${id}`,
              });
            }

            db.query(
              "UPDATE bot SET status = 'online' WHERE id = $1",
              [id],
              () => {
                io.to(`bot-${id}`).emit("status_update", {
                  id,
                  status: "online",
                });
              }
            );

            res.send({
              status: true,
              message: `🟢 ${bot.botname || id} berhasil dijalankan!`,
            });
          }
        );
      } else if (cmd === "stop") {
        return pm2.stop(id, (err) => {
          if (err) {
            return res.send({
              status: false,
              message: `Gagal menghentikan bot dengan id ${id}`,
            });
          }

          resetLog();

          db.query(
            "UPDATE bot SET status = 'offline' WHERE id = $1",
            [id],
            () => {
              io.to(`bot-${id}`).emit("status_update", {
                id,
                status: "offline",
              });
            }
          );

          res.send({
            status: true,
            message: `🛑 Bot ${id} berhasil dihentikan`,
          });
        });
      } else if (cmd === "reload") {
        return pm2.reload(id, (err) => {
          if (err) {
            return res.send({
              status: false,
              message: `Gagal me-reload bot dengan id ${id}`,
            });
          }

          resetLog();

          res.send({
            status: true,
            message: `🔄 Bot ${id} berhasil di-reload`,
          });
        });
      } else if (cmd === "deleteSession") {
        const sessionPath = path.join(__dirname, "bot", "session", id);

        resetLog();

        if (!fs.existsSync(sessionPath)) {
          return res.send({
            status: true,
            message: "Sesi tidak ditemukan, log tetap dibersihkan.",
          });
        }

        return fsEx
          .remove(sessionPath)
          .then(() => {
            res.send({
              status: true,
              message: "Sesi berhasil dihapus.",
            });
          })
          .catch(() => {
            res
              .status(500)
              .send({ status: false, message: "Gagal menghapus sesi." });
          });
      } else {
        return res.send({
          status: false,
          message: "Command tidak dikenali.",
        });
      }
    }
  );
});

function isAdmin(req, res, next) {
  if (typeof res === "function" && !next) {
    const sock = req;
    if (!sock.request.session.isAdmin) {
      console.warn(
        `[SECURITY] User ${sock.request.session.uid} mencoba mengakses fitur admin, tapi dia bukan admin.`
      );
      sock.emit(
        "_message4u_",
        "Who the f--- are you? Stop messing around with the console >:("
      );
    } else {
      res();
    }
    return;
  }
  if (req.session && req.session.isAdmin) return next();
  res.redirect("/admindimzbotz");
}

io.on("connection", (sock) => {
  const session = sock.request.session;

  if (!session || (!session.loggedin && !session.isAdmin)) {
    return sock.disconnect();
  }

  sock.isAdmin = session.isAdmin || false;
  const userId = session.uid;

  function authorizeAndExecute(botId, callback) {
    db.query(
      "SELECT id, uid FROM bot WHERE id = $1 AND uid = $2",
      [botId, userId],
      (err, result) => {
        if (err || result.rows.length === 0) return;
        callback(result.rows[0]);
      }
    );
  }

  sock.on("join", (room) => {
    sock.join(room);

    const botId = room.replace("bot-", "");
    const ring = global.__BOT_LOG_RING__ || {};
    const viewers = global.__BOT_LOG_VIEWERS__;

    viewers[botId] = (viewers[botId] || 0) + 1;

    pm2.describe(botId, (err, desc) => {
      let status = "offline";
      if (desc && desc[0]?.pm2_env?.status) {
        status = desc[0].pm2_env.status;
      }

      db.query("UPDATE bot SET status = $1 WHERE id = $2 AND status != $1", [
        status,
        botId,
      ]);

      io.to(`bot-${botId}`).emit("status_update", {
        id: botId,
        status,
      });

      if (ring[botId]?.length) {
        sock.emit("log_bulk", {
          id: botId,
          logs: ring[botId],
        });
      } else {
        sock.emit("log_message", {
          id: botId,
          message: "[SYSTEM] Belum ada log.",
        });
      }
    });
  });

  sock.on("leave", (room) => {
    const botId = room.replace("bot-", "");
    const viewers = global.__BOT_LOG_VIEWERS__;
    viewers[botId] = Math.max((viewers[botId] || 1) - 1, 0);
    sock.leave(room);
  });

  sock.on("disconnect", () => {
    const viewers = global.__BOT_LOG_VIEWERS__;
    for (const id in viewers) {
      viewers[id] = Math.max(viewers[id] - 1, 0);
    }
  });

  sock.on("phoneEdit", (data) => {
    authorizeAndExecute(data.id, (bot) => {
      db.query(
        "UPDATE bot SET phone = $1 WHERE id = $2",
        [data.phone, bot.id],
        () => {
          sock.emit("phoneEdit", data.phone);
        }
      );
    });
  });

  sock.on("status", (data) => {
    if (!sock.isAdmin) return;

    const active = data.act === "Aktifkan";

    if (active) {
      const exp = new Date();
      exp.setDate(exp.getDate() + 7);

      db.query(
        "UPDATE bot SET isactive = true, expired = $1 WHERE id = $2",
        [exp.toISOString(), data.id],
        () => sock.emit("updateStatus", true)
      );
    } else {
      db.query("UPDATE bot SET isactive = false WHERE id = $2", [data.id], () =>
        sock.emit("updateStatus", true)
      );
    }
  });

  sock.on("plan", (data) => {
    if (!sock.isAdmin) return;
    const prem = data.act === "Premium";
    db.query("UPDATE bot SET isprem = $1 WHERE id = $2", [prem, data.id], () =>
      sock.emit("updateStatus", true)
    );
  });

  sock.on("search", (data) => {
    if (!sock.isAdmin) return;
    db.query("SELECT * FROM bot WHERE id = $1", [data], (err, r) => {
      sock.emit("searchResult", {
        status: !err,
        data: err ? null : r.rows,
      });
    });
  });

  sock.on("deleteaccount", (data) => {
    if (!sock.isAdmin) return;

    db.query("SELECT uid FROM bot WHERE id = $1", [data.id], (err, r) => {
      if (!r?.rows?.length) return;
      const uid = r.rows[0].uid;

      pm2.delete(data.id, () => {
        db.query("DELETE FROM users WHERE id = $1", [uid], () => {
          sock.emit("updateStatus", true);
        });
      });
    });
  });

  sock.on("bannedaccount", (data) => {
    if (!sock.isAdmin) return;

    db.query("SELECT uid FROM bot WHERE id = $1", [data.id], (err, r) => {
      if (!r?.rows?.length) return;
      const uid = r.rows[0].uid;

      pm2.delete(data.id, () => {
        db.query("SELECT email FROM users WHERE id = $1", [uid], (e, ur) => {
          if (!ur?.rows?.length) return;

          db.query(
            "INSERT INTO banned (email) VALUES ($1) ON CONFLICT DO NOTHING",
            [ur.rows[0].email],
            () => {
              db.query("DELETE FROM users WHERE id = $1", [uid], () =>
                sock.emit("updateStatus", true)
              );
            }
          );
        });
      });
    });
  });

  sock.on("unbannedaccount", (data) => {
    if (!sock.isAdmin) return;
    db.query("DELETE FROM banned WHERE email = $1", [data.email], () =>
      sock.emit("updateStatus", true)
    );
  });

  sock.on("ai-support-chat", async (text) => {
    if (!text || typeof text !== "string") return;
    sock.emit("ai-support-typing");
    await new Promise((r) => setTimeout(r, 500));
    const res = await getAISupportResponse(text.trim());
    sock.emit(
      "ai-support-response",
      res.success ? res.answer : "AI sedang sibuk"
    );
  });

  sock.on("setExpire", (data) => {
    if (!sock.isAdmin) return;
    const { id, duration } = data;
    if (!id || !duration) return;

    db.query("SELECT expired FROM bot WHERE id = $1", [id], (e, r) => {
      if (!r?.rows?.length) return;

      let base = new Date(r.rows[0].expired);
      if (base < new Date()) base = new Date();

      const m = duration.match(/([+-]?)(\d+)([mhdMyw])/);
      if (!m) return;

      const n = parseInt(m[2]) * (m[1] === "-" ? -1 : 1);

      if (m[3] === "m") base.setMinutes(base.getMinutes() + n);
      if (m[3] === "h") base.setHours(base.getHours() + n);
      if (m[3] === "d") base.setDate(base.getDate() + n);
      if (m[3] === "w") base.setDate(base.getDate() + n * 7);
      if (m[3] === "M") base.setMonth(base.getMonth() + n);
      if (m[3] === "y") base.setFullYear(base.getFullYear() + n);

      db.query(
        "UPDATE bot SET expired = $1, status = 'offline', isactive = true WHERE id = $2",
        [base.toISOString(), id],
        () => sock.emit("updateStatus", true)
      );
    });
  });
});

function getRoleByExp(ms) {
  const days = ms / (1000 * 60 * 60 * 24);

  // ≤ 1 hari → Trial
  if (days <= 1) {
    return '<span class="badge bg-secondary">Guest Pass Trial</span>';
  }

  // ≤ 30 hari → 1 bulan
  if (days <= 30) {
    return '<span class="badge" style="background: linear-gradient(to right, #000000, #b31217);"><span class="gleam-container">Pathfinder</span></span>';
  }

  // ≤ 60 hari → 2 bulan
  if (days <= 60) {
    return '<span class="badge" style="background: linear-gradient(to right, #21D4FD, #B721FF);">Vanguard</span>';
  }

  // ≤ 90 hari → 3 bulan
  if (days <= 90) {
    return '<span class="badge" style="background: linear-gradient(to right, #f6d365, #fda085); color: #000;">Paragon</span>';
  }

  // ≤ 120 hari → 4 bulan
  if (days <= 120) {
    return '<span class="badge" style="background: linear-gradient(to right, #d31027, #ea384d);">Supreme</span>';
  }

  // ≤ 240 hari → 8 bulan
  if (days <= 240) {
    return '<span class="badge legend-badge" style="background: linear-gradient(to right, #434343, #000000);">Legend</span>';
  }

  // > 240 hari → Di atas 8 bulan
  return '<span class="badge" style="background: linear-gradient(to right, #6a11cb, #2575fc);">Eternal Mangekyou</span>';
}

function cekExp() {
  const nowInJakarta = moment().tz("Asia/Jakarta");
  const nowISO = nowInJakarta.toISOString();

  db.query(
    "UPDATE bot SET isactive = false, status = 'expired' WHERE isactive = true AND expired <= $1 RETURNING id",
    [nowISO],
    (err, result) => {
      if (err) {
        console.error("\n[CEK EXP] Gagal menjalankan pengecekan expired:", err);
      }

      if (result && result.rows.length > 0) {
        result.rows.forEach((bot) => {
          console.log(
            chalk.red(
              `\n[CEK EXP] Bot dengan id ${bot.id} telah dinonaktifkan karena expired.`
            )
          );
        });
      }

      const formattedTime = nowInJakarta.format("DD MMMM YYYY [pukul] h:mm a");

      process.stdout.write("\r");
      process.stdout.write(chalk.green(formattedTime));
    }
  );

  setTimeout(cekExp, 60000);
}

app.post("/admin/impersonate", isAdmin, async (req, res) => {
  const { botId } = req.body;
  if (!botId) {
    return res
      .status(400)
      .json({ success: false, message: "Bot ID tidak ditemukan." });
  }

  try {
    const botResult = await db.query("SELECT uid FROM bot WHERE id = $1", [
      botId,
    ]);
    if (botResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Bot dengan ID tersebut tidak ditemukan.",
      });
    }
    const targetUserId = botResult.rows[0].uid;
    req.session.isAdmin = false;
    req.session.loggedin = true;
    req.session.uid = targetUserId;
    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return res
          .status(500)
          .json({ success: false, message: "Gagal mengubah sesi." });
      }
      res.json({ success: true, redirectUrl: "/dashboard" });
    });
  } catch (error) {
    console.error("Impersonate error:", error);
    res
      .status(500)
      .json({ success: false, message: "Terjadi kesalahan server." });
  }
});

cron.schedule("*/1 * * * *", () => {
  const nowInJakarta = moment().tz("Asia/Jakarta");

  db.query(
    "SELECT id, expired, status FROM bot WHERE status != 'expired'",
    (err, res) => {
      if (err) return console.error("[CRON] DB Error:", err.message);
      if (!res.rows.length) return;

      res.rows.forEach((bot) => {
        const expiryDateInJakarta = moment(bot.expired).tz("Asia/Jakarta");

        if (expiryDateInJakarta.isBefore(nowInJakarta)) {
          console.log(
            `[AUTO] Bot ${bot.id} terdeteksi expired pada ${expiryDateInJakarta.format()}`
          );

          pm2.delete(bot.id, () => {
            db.query(
              "UPDATE bot SET status = 'expired', isactive = false WHERE id = $1",
              [bot.id],
              (dbErr) => {
                if (dbErr)
                  console.error(`[DB] Gagal update ${bot.id}:`, dbErr.message);
                else
                  console.log(
                    `[DB] Bot ${bot.id} ditandai expired & dihentikan.`
                  );
              }
            );
          });
        }
      });
    }
  );
});

// ================== DISCORD ENDPOINTS ==================
app.use("/api/admin", express.json());
function verifyAdminKey(req, res, next) {
  const apiKey = req.headers["x-api-key"];
  const adminKey =
    conf.admin?.apikey || "apikey-1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa-drizzy24";

  if (!apiKey) {
    return res.status(401).json({ success: false, message: "Missing API key" });
  }

  if (apiKey !== adminKey) {
    console.warn(`[SECURITY] Akses ditolak dari IP ${req.ip}`);
    return res
      .status(403)
      .json({ success: false, message: "Forbidden: invalid API key" });
  }

  next();
}

app.get("/api/admin/status", verifyAdminKey, async (req, res) => {
  try {
    const uptime = process.uptime();

    const bots = await db.query("SELECT COUNT(*) FROM bot");
    const users = await db.query("SELECT COUNT(*) FROM users");
    const bans = await db.query("SELECT COUNT(*) FROM banned");

    return res.json({
      success: true,
      uptime: `${Math.floor(uptime)}s`,
      totalBots: parseInt(bots.rows[0].count),
      totalUsers: parseInt(users.rows[0].count),
      totalBanned: parseInt(bans.rows[0].count),
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[API STATUS ERROR]", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.get("/api/admin/list", verifyAdminKey, async (req, res) => {
  try {
    const bots = await db.query(`
      SELECT b.id, u.email, b.status, b.isactive, b.isprem, b.expired
      FROM bot b
      LEFT JOIN users u ON b.uid = u.id
      ORDER BY b.expired ASC
    `);
    res.json({
      success: true,
      users: bots.rows.map((b) => ({
        idbot: b.id,
        email: b.email,
        status: b.status,
        active: b.isactive,
        role: b.isprem ? "Premium" : "Free",
        expired: moment(b.expired)
          .tz("Asia/Jakarta")
          .format("DD MMM YYYY HH:mm"),
      })),
    });
  } catch (err) {
    console.error("[API LIST ERROR]", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.delete("/api/admin/del", verifyAdminKey, async (req, res) => {
  const { email } = req.query;
  if (!email)
    return res
      .status(400)
      .json({ success: false, message: "email wajib diisi" });

  try {
    await db.query("DELETE FROM users WHERE email = $1", [email]);
    await db.query("DELETE FROM bot WHERE uid NOT IN (SELECT id FROM users)");
    res.json({
      success: true,
      message: `Data dengan email ${email} berhasil dihapus.`,
    });
  } catch (err) {
    console.error("[API DELETE ERROR]", err);
    res
      .status(500)
      .json({ success: false, message: "Gagal menghapus data user." });
  }
});

app.post("/api/admin/unban", verifyAdminKey, async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res
        .status(400)
        .json({ success: false, message: "email wajib diisi" });
    const result = await db.query(
      "DELETE FROM banned WHERE email = $1 RETURNING *",
      [email]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: `Email ${email} tidak ditemukan di daftar banned.`,
      });
    }

    res.json({
      success: true,
      message: `✅ Email ${email} berhasil di-unban.`,
      unbanned: email,
    });
  } catch (err) {
    console.error("[API UNBAN ERROR]", err);
    res.status(500).json({ success: false, message: "Gagal unban user." });
  }
});

app.post("/api/admin/ban", verifyAdminKey, async (req, res) => {
  try {
    const { email, reason } = req.body;

    if (!email)
      return res
        .status(400)
        .json({ success: false, message: "email wajib diisi" });

    const alasan = reason || "Banned via API";
    await db.query(
      "INSERT INTO banned (email) VALUES ($1) ON CONFLICT DO NOTHING",
      [email]
    );
    const userRes = await db.query("SELECT id FROM users WHERE email = $1", [
      email,
    ]);

    if (userRes.rows.length > 0) {
      const uid = userRes.rows[0].id;
      await db.query("DELETE FROM bot WHERE uid = $1", [uid]);

      await db.query("DELETE FROM users WHERE id = $1", [uid]);
    }

    console.log(`[ADMIN BAN] ${email} | ${alasan}`);

    res.json({
      success: true,
      message: `🚫 Email ${email} berhasil dibanned.`,
      reason: alasan,
    });
  } catch (err) {
    console.error("[API BAN ERROR]", err);
    res.status(500).json({ success: false, message: "Gagal ban user." });
  }
});

app.post("/api/admin/extend", verifyAdminKey, async (req, res) => {
  try {
    const { idbot, duration } = req.body;

    if (!idbot || !duration) {
      return res.status(400).json({
        success: false,
        message:
          "idbot dan duration wajib diisi (contoh: idbot: 'xxxx', duration: '7d')",
      });
    }

    const botRes = await db.query("SELECT expired FROM bot WHERE id = $1", [
      idbot,
    ]);
    if (!botRes.rows.length) {
      return res
        .status(404)
        .json({ success: false, message: "Bot tidak ditemukan" });
    }

    const match = duration.match(/(-?)(\d+)([mhdwMy])/);
    if (!match) {
      return res.status(400).json({
        success: false,
        message:
          "Format durasi tidak valid (gunakan: 30m, 12h, 7d, -1w, 1M, 1y)",
      });
    }

    const isNegative = match[1] === "-";
    const num = parseInt(match[2]);
    const type = match[3];

    let expiryDate;
    const currentExpiry = new Date(botRes.rows[0].expired);

    if (currentExpiry < new Date()) {
      expiryDate = new Date();
    } else {
      expiryDate = currentExpiry;
    }

    const multiplier = isNegative ? -1 : 1;

    switch (type) {
      case "m":
        expiryDate.setMinutes(expiryDate.getMinutes() + num * multiplier);
        break;
      case "h":
        expiryDate.setHours(expiryDate.getHours() + num * multiplier);
        break;
      case "d":
        expiryDate.setDate(expiryDate.getDate() + num * multiplier);
        break;
      case "w":
        expiryDate.setDate(expiryDate.getDate() + num * 7 * multiplier);
        break;
      case "M":
        expiryDate.setMonth(expiryDate.getMonth() + num * multiplier);
        break;
      case "y":
        expiryDate.setFullYear(expiryDate.getFullYear() + num * multiplier);
        break;
    }

    const expiredISO = expiryDate.toISOString();

    await db.query(
      "UPDATE bot SET expired = $1, isactive = true, status = 'offline' WHERE id = $2",
      [expiredISO, idbot]
    );

    console.log(
      `[ADMIN EXTEND] Bot ${idbot} diperpanjang ${duration} → ${expiredISO}`
    );

    res.json({
      success: true,
      message: `⏳ Masa aktif bot ${idbot} diubah (${duration})`,
      newExpiry: moment(expiredISO)
        .tz("Asia/Jakarta")
        .format("DD MMM YYYY HH:mm:ss"),
    });
  } catch (err) {
    console.error("[API EXTEND ERROR]", err);
    res
      .status(500)
      .json({ success: false, message: "Gagal memperpanjang masa aktif bot" });
  }
});

app.get("/api/admin/cekban", verifyAdminKey, async (req, res) => {
  try {
    const result = await db.query(
      "SELECT email FROM banned ORDER BY email ASC"
    );

    if (!result.rows.length) {
      return res.json({ success: true, total: 0, list: [] });
    }

    res.json({
      success: true,
      total: result.rows.length,
      list: result.rows.map((r) => r.email),
    });
  } catch (err) {
    console.error("[API CEKBAN ERROR]", err);
    res
      .status(500)
      .json({ success: false, message: "Gagal mengambil data banned" });
  }
});

app.post("/api/admin/set-notification", verifyAdminKey, async (req, res) => {
  try {
    const { text } = req.body;

    if (typeof text !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Input 'text' harus berupa string." });
    }

    const dataToStore = JSON.stringify({ text: text });
    await fs.promises.writeFile(
      path.join(__dirname, "info.json"),
      dataToStore,
      "utf8"
    );

    console.log(`[ADMIN NOTIF] Teks notifikasi diubah menjadi: "${text}"`);
    res.json({ success: true, message: "Teks notifikasi berhasil diupdate." });
  } catch (err) {
    console.error("[API SET-NOTIFICATION ERROR]", err);
    res
      .status(500)
      .json({ success: false, message: "Gagal menyimpan notifikasi." });
  }
});

app.get("/api/bot/logs/:botId", isAuth, async (req, res) => {
  const botId = req.params.botId;
  const userId = req.session.uid;
  const logFilePath = path.join(botLogsDir, `${botId}.log`);

  try {
    const result = await db.query("SELECT uid FROM bot WHERE id = $1", [botId]);
    if (result.rows.length === 0 || result.rows[0].uid !== userId) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized access to bot logs." });
    }

    if (fs.existsSync(logFilePath)) {
      const logs = await fs.promises.readFile(logFilePath, "utf8");
      res.json({ success: true, logs: logs });
    } else {
      res.json({ success: true, logs: "No logs found for this bot yet." });
    }
  } catch (error) {
    console.error(
      `[API LOGS ERROR] Gagal membaca log untuk bot ${botId}:`,
      error
    );
    res
      .status(500)
      .json({ success: false, message: "Failed to retrieve logs." });
  }
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
    return res.render("custom", {
      err: "Ukuran file terlalu besar! Maksimal 1MB.",
    });
  } else if (err.message.includes("Hanya boleh upload gambar")) {
    return res.render("custom", { err: err.message });
  }
  next(err);
});

app.get("/api/system/ram", (req, res) => {
  const MAX_RAM_MB = 1024; // 1GB (samain dengan limit server kamu)

  const mem = process.memoryUsage();
  const usedMB = mem.rss / 1024 / 1024;

  let percent = Math.round((usedMB / MAX_RAM_MB) * 100);
  if (percent > 100) percent = 100;
  if (percent < 0) percent = 0;

  res.json({
    success: true,
    percent
  });
});

app.use((req, res) => {
  res.redirect("/not_found404");
});

server.listen(PORT, () => {
  console.log("web server sedang berjalan di port :", PORT);
});
