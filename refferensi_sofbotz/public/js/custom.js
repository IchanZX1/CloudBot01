document.addEventListener("DOMContentLoaded", () => {
  const themeToggleButton = document.getElementById("theme-toggle");
  const currentTheme = localStorage.getItem("theme") || "dark";
  document.body.classList.toggle("light-theme", currentTheme === "light");

  if (themeToggleButton) {
    themeToggleButton.addEventListener("click", () => {
      document.body.classList.toggle("light-theme");
      localStorage.setItem(
        "theme",
        document.body.classList.contains("light-theme") ? "light" : "dark"
      );
    });
  }

  const fileInput = document.getElementById("thumbnail");
  const fileChosen = document.getElementById("file-chosen");

  if (fileInput && fileChosen) {
    fileInput.addEventListener("change", () => {
      const file = fileInput.files[0];
      if (!file) {
        fileChosen.textContent = "No file chosen";
        return;
      }

      if (file.size > 1 * 1024 * 1024) {
        alert("File is too large! Maximum size is 1MB.");
        fileInput.value = "";
        fileChosen.textContent = "No file chosen";
        return;
      }

      fileChosen.textContent = file.name;
    });
  }

  ["botname", "ownername", "packname", "stauthor", "gc", "channel"].forEach(
    (id) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener("input", () => {
        el.value = el.value.slice(0, 25);
      });
    }
  );

  ["ownernum", "botnumber"].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;

    el.addEventListener("input", () => {
      el.value = el.value.replace(/\D/g, "");
    });

    el.addEventListener("blur", () => {
      if (!el.value) return;
      if (!/^62[1-9][0-9]{8,12}$/.test(el.value)) {
        alert("Nomor WhatsApp tidak valid.\nGunakan format: 628xxxxxxxxxx");
        el.value = "";
        el.focus();
      }
    });
  });

  const errBox = document.querySelector(".error-message");
  if (errBox) {
    setTimeout(() => {
      errBox.style.opacity = "0";
      setTimeout(() => errBox.remove(), 400);
    }, 5000);
  }

  if (typeof tsParticles !== "undefined") {
    tsParticles.load("tsparticles", {
      fpsLimit: 60,
      interactivity: {
        events: {
          onHover: { enable: true, mode: "grab" },
          onClick: { enable: true, mode: "push" },
          resize: true,
        },
        modes: {
          grab: { distance: 140, line_linked: { opacity: 1 } },
          push: { particles_nb: 4 },
        },
      },
      particles: {
        number: { value: 60, density: { enable: true, value_area: 800 } },
        color: { value: "#ffffff" },
        shape: { type: "circle" },
        opacity: { value: 0.4, random: true },
        size: { value: 2, random: true },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#ffffff",
          opacity: 0.2,
          width: 1,
        },
        move: {
          enable: true,
          speed: 1.5,
          random: true,
          out_mode: "out",
        },
      },
      detectRetina: true,
    });
  }
});

function orderWA(el) {
  const plan = el.dataset.plan;
  const harga = el.dataset.harga;
  const email = el.dataset.email;
  const botId = el.dataset.botid;

  const message = `
*Hai Admin....., Saya Mau Beli Langganan Soft Botz (>ω<)*



*Plan      :*    ${plan}
*Harga   :*    Rp${harga}
*Metode Pembayaran:*
*Bot ID   :*    ${botId}
*Email    :*    ${email}
  `.trim();

  const url = "https://wa.me/6289603732786?text=" + encodeURIComponent(message);
  window.open(url, "_blank");
}

function orderIG() {
  window.open("https://instagram.com/banh_dims0", "_blank");
}
