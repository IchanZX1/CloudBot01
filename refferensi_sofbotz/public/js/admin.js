const socket = io()

const DASHBOARD_API = "http://waguri.caliphdev.com:9014/api/dashboard/stats"
const DASHBOARD_KEY = "DASHBOARD-KEY-123456789"

document.addEventListener("DOMContentLoaded", () => {
  initStatusToggle()
  initPlanToggle()
  initSearch()
  initStartAll()
  loadDashboardStats()
  setInterval(loadDashboardStats, 20000)
})

function confirmDialog(title, text, confirmText = "Ya, Lanjutkan!") {
  return Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#6366f1",
    cancelButtonColor: "#ef4444",
    confirmButtonText: confirmText
  })
}

function successToast(title = "Berhasil") {
  return Swal.fire({
    title,
    icon: "success",
    timer: 1500,
    showConfirmButton: false
  })
}

function errorToast(text = "Terjadi kesalahan di server.") {
  return Swal.fire({
    title: "Gagal",
    text,
    icon: "error"
  })
}

async function loadDashboardStats() {
  try {
    const res = await fetch(`${DASHBOARD_API}?apikey=${DASHBOARD_KEY}`, {
      method: "GET"
    })

    if (!res.ok) return

    const data = await res.json()
    if (!data) return

    animateStat("stat-total-user", data.total_user || 0)
    animateStat("stat-total-bot", data.total_bot || 0)
    animateStat("stat-online", data.bot_online || 0)
    animateStat("stat-offline", data.bot_offline || 0)

  } catch (e) {
    console.warn("Dashboard API error:", e.message)
  }
}

function animateStat(id, newValue) {
  const el = document.getElementById(id)
  if (!el || typeof newValue !== "number") return

  const start = parseInt(el.textContent) || 0
  const duration = 500
  const startTime = performance.now()

  function update(currentTime) {
    const progress = Math.min((currentTime - startTime) / duration, 1)
    const value = Math.floor(start + (newValue - start) * progress)
    el.textContent = value
    if (progress < 1) requestAnimationFrame(update)
  }

  requestAnimationFrame(update)
}

function initStatusToggle() {
  document.querySelectorAll('[id^="toggleAction-"]').forEach(btn => {

    btn.addEventListener("click", () => {

      const id = btn.id.replace("toggleAction-", "")
      const currentText = btn.querySelector("span").textContent.trim()

      confirmDialog("Ubah status layanan?", id, "Ya, Ubah")
        .then(result => {
          if (!result.isConfirmed) return
          socket.emit("status", { act: currentText, id })
        })
    })
  })
}

function initPlanToggle() {
  document.querySelectorAll('[id^="togglePrem-"]').forEach(btn => {

    btn.addEventListener("click", () => {

      const id = btn.id.replace("togglePrem-", "")
      const currentText = btn.querySelector("span").textContent.trim()

      confirmDialog("Ubah status langganan?", id, "Ya, Ubah")
        .then(result => {
          if (!result.isConfirmed) return
          socket.emit("plan", { act: currentText, id })
        })
    })
  })
}

function deleteAccount(id, email) {
  confirmDialog("Hapus akun?", email, "Ya, Hapus")
    .then(result => {
      if (!result.isConfirmed) return
      socket.emit("deleteaccount", { id, email })
    })
}

function bannedAccount(id, email) {
  confirmDialog("Banned user?", email, "Ya, Banned")
    .then(result => {
      if (!result.isConfirmed) return
      socket.emit("bannedaccount", { id, email })
    })
}

function unbannedAccount(email) {
  confirmDialog("Unban user?", email, "Ya, Unban")
    .then(result => {
      if (!result.isConfirmed) return
      socket.emit("unbannedaccount", { email })
    })
}

function setExpire(id) {
  const input = document.getElementById("expInput-" + id)
  const value = input.value.trim()

  if (!value) {
    Swal.fire({
      title: "Input kosong!",
      text: "Contoh: 7d",
      icon: "warning"
    })
    return
  }

  socket.emit("setExpire", { id, duration: value })
  input.value = ""
}

socket.on("updateStatus", success => {
  if (success) {
    successToast()
    setTimeout(() => location.reload(), 800)
  } else {
    errorToast()
  }
})

function initSearch() {
  const searchInput = document.getElementById("search")
  if (!searchInput) return

  searchInput.addEventListener("input", () => {
    const term = searchInput.value.toLowerCase().trim()
    const cards = document.querySelectorAll("#users-section .service-card")

    cards.forEach(card => {
      const text = card.innerText.toLowerCase()
      card.style.display = text.includes(term) ? "" : "none"
    })
  })
}

function loginAsUser(botId) {
  confirmDialog("Login sebagai User?", botId, "Ya, Login")
    .then(result => {
      if (!result.isConfirmed) return

      fetch("/admin/impersonate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ botId })
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            successToast("Berhasil Login")
            setTimeout(() => window.open(data.redirectUrl, "_blank"), 800)
          } else {
            errorToast(data.message)
          }
        })
        .catch(() => errorToast("Kesalahan jaringan"))
    })
}

function initStartAll() {
  const btn = document.getElementById("start-all-btn")
  if (!btn) return

  btn.addEventListener("click", () => {

    confirmDialog("Mulai Semua Bot?", "Perintah START akan dikirim.", "Ya, Jalankan")
      .then(result => {

        if (!result.isConfirmed) return

        Swal.fire({
          title: "Memproses...",
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading()
        })

        const cards = document.querySelectorAll("#users-section .service-card")
        const promises = []

        cards.forEach(card => {
          const toggleBtn = card.querySelector('[id^="toggleAction-"]')
          if (!toggleBtn) return

          const id = toggleBtn.id.replace("toggleAction-", "")

          promises.push(
            fetch("/controls", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id, cmd: "start" })
            }).then(res => res.json())
          )
        })

        Promise.all(promises).then(results => {
          const successCount = results.filter(r => r.status === true).length
          const failCount = results.length - successCount

          Swal.fire({
            title: "Selesai",
            html: `<b>${successCount}</b> bot berhasil dijalankan${failCount > 0 ? `<br><b>${failCount}</b> gagal.` : ""}`,
            icon: "success"
          }).then(() => location.reload())
        })
      })
  })
}

function logoutAdmin() {
  confirmDialog("Logout admin?", "Sesi akan dihapus.", "Ya, Logout")
    .then(result => {
      if (!result.isConfirmed) return

      fetch("/admin/logout", { method: "POST" })
        .then(() => window.location.href = "/admindimzbotz")
        .catch(() => errorToast())
    })
}