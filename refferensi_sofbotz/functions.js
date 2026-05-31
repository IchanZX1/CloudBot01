const nodeMailer = require("nodemailer");
const conf = require("./config.json");

async function sendEmail(target, subject, isHtml, content) {
  console.log("\n===============================");
  console.log("[MAIL DEBUG] 🚀 Mulai proses kirim email...");
  console.log(`[MAIL DEBUG] Target: ${target}`);
  console.log(`[MAIL DEBUG] Subject: ${subject}`);
  console.log(`[MAIL DEBUG] Mode: ${isHtml ? "HTML" : "TEXT"}`);

  try {
    const transporter = nodeMailer.createTransport({
      host: conf.email.transport.host,
      port: conf.email.transport.port,
      secure: conf.email.transport.secure,
      auth: {
        user: conf.email.transport.auth.user,
        pass: conf.email.transport.auth.pass,
      },
    });

    console.log("[MAIL DEBUG] 🔌 Mencoba koneksi ke Gmail...");
    const verified = await transporter.verify();
    console.log("[MAIL DEBUG] ✅ Koneksi sukses:", verified);

    const options = {
      from: '"Soft Botz" <no-reply@softbotz.my.id>',
      to: target,
      subject: subject,
    };

    if (isHtml) options.html = content;
    else options.text = content;

    console.log("[MAIL DEBUG] 📤 Mengirim email...");
    const send = await transporter.sendMail(options);

    console.log("[MAIL DEBUG] ✅ Email berhasil dikirim!");
    console.log(`[MAIL DEBUG] Response: ${send.response || "OK"}`);
    console.log("===============================\n");

    return { status: true, data: send };
  } catch (err) {
    console.log("===============================");
    console.log("[MAIL ERROR] ❌ Gagal mengirim email!");
    console.log("[MAIL ERROR] Pesan:", err.message);
    if (err.code === "EAUTH") {
      console.log(
        "[MAIL ERROR] ⚠️ Autentikasi gagal — mungkin App Password salah / Gmail belum diizinkan."
      );
    } else if (err.message.includes("Quota")) {
      console.log(
        "[MAIL ERROR] 🚫 Gmail limit tercapai (mungkin 500 email/hari)!"
      );
    } else if (
      err.message.includes("suspended") ||
      err.message.includes("disabled")
    ) {
      console.log(
        "[MAIL ERROR] 🔒 Akun Gmail mungkin disuspend karena spam OTP!"
      );
    }
    console.log("[MAIL ERROR] Detail:", err);
    console.log("===============================");
    return { status: false, data: err };
  }
}

async function sendOtp(target, otp) {
  console.log(`[OTP DEBUG] 📩 Mengirim OTP ke ${target}...`);
  const emailContent = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verifikasi Akun Soft Botz</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
  <style>
    body {
      background: linear-gradient(135deg, #6a11cb 0%, #8e2de2 100%);
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
      padding: 10px;
    }

    .container-box {
      width: 100%;
      max-width: 480px;
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
      overflow: hidden;
      animation: fadeIn 0.5s ease-in-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(15px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .header {
      background: linear-gradient(135deg, #7b2ff7, #f107a3);
      color: #fff;
      text-align: center;
      padding: 20px 10px;
    }

    .header h2 {
      font-weight: 700;
      margin: 0;
      font-size: 20px;
    }

    .otp-box {
      font-size: 36px;
      font-weight: bold;
      color: #7b2ff7;
      letter-spacing: 3px;
      padding: 15px 25px;
      border: 2px dashed #7b2ff7;
      border-radius: 10px;
      background: #f8f9fa;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      transition: all 0.3s;
      cursor: pointer;
    }

    .otp-box small {
      font-size: 12px;
      color: #888;
    }

    .btn-copy {
      margin-top: 15px;
      background: linear-gradient(90deg, #7b2ff7, #f107a3);
      color: #fff;
      border: none;
      padding: 8px 16px;
      border-radius: 25px;
      transition: 0.3s;
      font-weight: 500;
      font-size: 14px;
    }

    .btn-copy:hover {
      background: linear-gradient(90deg, #6a11cb, #a12de2);
      transform: scale(1.05);
    }

    .info-table td {
      padding: 8px 6px;
      font-size: 14px;
    }

    .info-table td i {
      font-size: 17px;
      color: #7b2ff7;
      margin-right: 6px;
    }

    .divider {
      height: 2px;
      background: linear-gradient(90deg, transparent, #7b2ff7, transparent);
      margin: 20px 0;
    }

    .social-icons a {
      margin: 0 8px;
      font-size: 26px;
      color: #7b2ff7;
      transition: 0.3s;
    }

    .social-icons a:hover {
      color: #f107a3;
      transform: scale(1.15);
    }

    .footer-info {
      background: #f8f8f8;
      padding: 12px 15px;
      border-top: 1px solid #ddd;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .footer-text {
      font-size: 12px;
      color: #444;
      line-height: 1.5;
    }

    .footer-logo {
      max-width: 45px;
      border-radius: 8px;
      box-shadow: 0 3px 6px rgba(0,0,0,0.1);
    }

    a {
      color: #7b2ff7;
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
      color: #4a00e0;
    }
  </style>
</head>
<body>
  <div class="container-box">
    <div class="header">
      <h2>Kode Verifikasi Akun Soft Botz</h2>
    </div>

    <div class="p-3 text-center">
      <div class="otp-box" id="otpBox">
        <span id="otpValue">${otp}</span>
        <small>Klik tombol di bawah untuk salin</small>
      </div>

      <button class="btn-copy" onclick="copyOTP()">
        <i class="bi bi-clipboard-check"></i> Salin OTP
      </button>

      <div class="mt-4 text-start">
        <table class="table info-table w-100">
          <tbody>
            <tr>
              <td><i class="bi bi-envelope-fill"></i> <strong>Email</strong></td>
              <td>${target}</td>
            </tr>
            <tr>
              <td><i class="bi bi-key-fill"></i> <strong>Kode</strong></td>
              <td>${otp}</td>
            </tr>
            <tr>
              <td><i class="bi bi-shield-check"></i> <strong>Layanan</strong></td>
              <td>Didukung oleh Google</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="divider"></div>
      <p class="mb-2">Ikuti sosial media kami:</p>
      <div class="social-icons">
        <a href="https://chat.whatsapp.com/H8L7vKdAWwO4Ki169PTCXP"><i class="bi bi-whatsapp"></i></a>
        <a href="https://instagram.com/banh_dims0"><i class="bi bi-instagram"></i></a>
        <a href="https://t.me/sansdimz"><i class="bi bi-telegram"></i></a>
        <a href="https://youtube.com/@prodbydimzxd?si=d9i4NcEzVB7SU3HG"><i class="bi bi-youtube"></i></a>
      </div>

      <div class="mt-3 text-center text-muted" style="font-size: 12px;">
        <p><strong>Soft Botz</strong> © 2025<br>
        Website: <a href="https://softbotz.my.id">softbotz.my.id</a> | Email: nguyenfergo@gmail.com</p>
        <p>Pesan ini otomatis, mohon jangan membalas apapun.</p>
      </div>
    </div>

    <div class="footer-info">
      <img src="https://pomf2.lain.la/f/x99g8ygx.png" alt="Logo" class="footer-logo">
      <div class="footer-text">
        <strong>Soft Botz</strong><br>
        Website: <a href="https://softbotz.my.id">softbotz.my.id</a><br>
        Email: nguyenfergo@gmail.com<br>
        WA: +62 896-0373-2786
      </div>
    </div>
  </div>

  <script>
    function copyOTP() {
      const otp = document.getElementById("otpValue").textContent.trim();
      navigator.clipboard.writeText(otp).then(() => {
        const btn = document.querySelector(".btn-copy");
        btn.innerHTML = '<i class="bi bi-check-circle-fill"></i> OTP Tersalin!';
        btn.style.background = 'linear-gradient(90deg, #28a745, #00c851)';
        setTimeout(() => {
          btn.innerHTML = '<i class="bi bi-clipboard-check"></i> Salin OTP';
          btn.style.background = 'linear-gradient(90deg, #7b2ff7, #f107a3)';
        }, 2000);
      }).catch(() => {
        alert("Gagal menyalin kode OTP, coba manual.");
      });
    }
  </script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
`;

  try {
    const result = await sendEmail(
      target,
      "Kode OTP Verifikasi Soft Botz",
      true,
      emailContent
    );
    return result;
  } catch (error) {
    console.log(`[OTP DEBUG] ❌ Error kirim OTP:`, error.message);
    return { status: false, data: error };
  }
}

function generateOTP() {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < 6; i++) otp += digits[Math.floor(Math.random() * 10)];
  return otp;
}

function getLimit() {
  const now = new Date();
  now.setDate(now.getDate() + 7);
  const bulan = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  return `${now.getDate()} ${bulan[now.getMonth()]} ${now.getFullYear()} pukul ${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")}`;
}

module.exports = { sendEmail, sendOtp, generateOTP, getLimit };
