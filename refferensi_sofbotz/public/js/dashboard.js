document.addEventListener("DOMContentLoaded", () => {
  const socket = io();
  const botStatusElement = document.getElementById("botStatus");
  const logsContainer = document.getElementById("logs-container");
  const controlsData = document.getElementById("controlsData");
  const botId = controlsData?.value;
  const phoneInput = document.getElementById("phoneInput");

  if (botId) {
    const MAX_LOGS_IN_CACHE = 200;

    function loadLogsFromCache() {
      const cachedLogs = sessionStorage.getItem(`logs-${botId}`);
      if (cachedLogs && logsContainer) {
        logsContainer.innerHTML = cachedLogs;
        logsContainer.scrollTop = logsContainer.scrollHeight;
      }
    }

    function saveLogsToCache() {
      if (logsContainer) {
        while (logsContainer.children.length > MAX_LOGS_IN_CACHE) {
          logsContainer.removeChild(logsContainer.firstChild);
        }
        sessionStorage.setItem(`logs-${botId}`, logsContainer.innerHTML);
      }
    }

    function addSystemLog(message, specialClass = null) {
      if (!logsContainer) return;
      const logEntry = document.createElement("div");
      logEntry.innerHTML = `<span>[SYSTEM]</span> ${message}`;
      logEntry.style.fontStyle = "italic";
      logEntry.style.opacity = "0.8";
      if (specialClass) {
        logEntry.classList.add(specialClass);
      }
      logsContainer.appendChild(logEntry);
      logsContainer.scrollTop = logsContainer.scrollHeight;
    }

    function addOfflineMessage() {
      if (!logsContainer) return;
      if (!logsContainer.querySelector(".log-offline-message")) {
        const offlineDiv = document.createElement("div");
        offlineDiv.classList.add("log-offline-message");
        offlineDiv.innerHTML = `<span>[SYSTEM]</span> Bot is currently offline. No logs available.`;
        logsContainer.appendChild(offlineDiv);
      }
    }

    async function fetchAndDisplayHistoricalLogs() {
      try {
        const response = await fetch(`/api/bot/logs/${botId}`);
        const data = await response.json();
        if (data.success) {
          logsContainer.innerHTML = "";
          addSystemLog("Retrieving historical logs...");
          if (data.logs && data.logs.trim() !== "") {
            const logLines = data.logs.split("\n");
            logLines.forEach((line) => {
              if (line.trim() !== "") {
                const logEntry = document.createElement("div");
                const messageContent = line
                  .replace(/</g, "&lt;")
                  .replace(/>/g, "&gt;");
                logEntry.innerHTML = ` ${messageContent}`;
                logsContainer.appendChild(logEntry);
              }
            });
          } else {
            addSystemLog("[SYSTEM] No historical logs found for this bot.");
          }
          logsContainer.scrollTop = logsContainer.scrollHeight;
        } else {
          console.error("Failed to fetch historical logs:", data.message);
          addSystemLog(
            `[SYSTEM] Error fetching historical logs: ${data.message}`,
            "error-log"
          );
        }
      } catch (error) {
        console.error("Error during fetch of historical logs:", error);
        addSystemLog(
          `[SYSTEM] Error during fetch of historical logs: ${error.message}`,
          "error-log"
        );
      }
    }

    loadLogsFromCache();

    socket.on("connect", () => {
      console.log("Connected to server");
      socket.emit("join", `bot-${botId}`);
      fetchAndDisplayHistoricalLogs();
    });

    socket.on("status_update", (data) => {
      if (data.id === botId && botStatusElement) {
        const newStatus = data.status.toLowerCase();
        const oldStatus = botStatusElement.textContent.toLowerCase();
        botStatusElement.textContent = data.status;

        updateBotControls(data.status);

        if (
          oldStatus === "offline" &&
          newStatus !== "offline" &&
          logsContainer
        ) {
          const offlineMsg = logsContainer.querySelector(
            ".log-offline-message"
          );
          if (offlineMsg) {
            logsContainer.removeChild(offlineMsg);

            addSystemLog("Bot connected. Waiting for logs...");
          }
        } else if (newStatus === "offline" && logsContainer) {
          addOfflineMessage();
        }
      }
    });

    socket.on("log_message", (data) => {
      if (data.id === botId && logsContainer) {
        const offlineMsg = logsContainer.querySelector(".log-offline-message");
        if (offlineMsg) {
          logsContainer.removeChild(offlineMsg);
        }

        const logEntry = document.createElement("div");
        const timestamp = `<span>[${new Date().toLocaleTimeString("id-ID")}]</span>`;

        const messageContent =
          typeof data.message === "string"
            ? data.message.replace(/</g, "&lt;").replace(/>/g, "&gt;")
            : JSON.stringify(data.message);
        logEntry.innerHTML = `${timestamp} ${messageContent}`;
        logsContainer.appendChild(logEntry);
        logsContainer.scrollTop = logsContainer.scrollHeight;

        saveLogsToCache();
      }
    });

    socket.on("phoneEdit", (data) => {
      let newPhoneNumber = "";
      if (typeof data === "string" || typeof data === "number") {
        newPhoneNumber = String(data);
      } else if (data && data.id === botId && data.phone) {
        newPhoneNumber = String(data.phone);
      }
      if (newPhoneNumber && phoneInput) {
        console.log("Phone number updated via socket:", newPhoneNumber);
        phoneInput.value = newPhoneNumber;
        originalPhoneNumber = newPhoneNumber;
        setDisplayMode();
      } else {
        console.warn("Received phoneEdit event with unexpected data:", data);
      }
    });

    socket.on("phoneEditError", (data) => {
      if (data.id === botId && phoneInput) {
        console.error("Server reported phone update error:", data.message);
        Swal.fire(
          "Server Error!",
          data.message || "Failed to update phone number.",
          "error"
        );
        phoneInput.value = originalPhoneNumber;
        setDisplayMode();
      }
    });

    // --- Connect Bot Section Logic ---
    const connectMethodSwitch = document.getElementById("connectMethodSwitch");
    const switchText = document.querySelector(".switch-text");
    const pairingCodeSection = document.getElementById("pairingCodeSection");
    const qrCodeSection = document.getElementById("qrCodeSection");
    const pairingCodeResult = document.getElementById("pairingCodeResult");
    const qrCodeResult = document.getElementById("qrCodeResult");

    if (
      connectMethodSwitch &&
      switchText &&
      pairingCodeSection &&
      qrCodeSection &&
      pairingCodeResult &&
      qrCodeResult
    ) {
      console.log("Connect Bot elements found. botId:", botId);
      console.log("connectMethodSwitch:", connectMethodSwitch);
      console.log("pairingCodeSection:", pairingCodeSection);
      console.log("qrCodeSection:", qrCodeSection);
      console.log("pairingCodeResult:", pairingCodeResult);
      console.log("qrCodeResult:", qrCodeResult);

      const updateConnectDisplay = () => {
        const isPairing = connectMethodSwitch.checked; // checked = Pairing
        switchText.textContent = isPairing ? "Pairing Code" : "QR Code";
        if (isPairing) {
          pairingCodeSection.classList.remove("hidden");
          qrCodeSection.classList.add("hidden");
        } else {
          pairingCodeSection.classList.add("hidden");
          qrCodeSection.classList.remove("hidden");
        }
        console.log(
          "Switch changed. isPairing:",
          isPairing,
          "qrCodeSection hidden:",
          qrCodeSection.classList.contains("hidden")
        );
      };

      updateConnectDisplay();

      connectMethodSwitch.addEventListener("change", updateConnectDisplay);

      socket.on("qr_code_update", (data) => {
        console.log("qr_code_update received:", data);
        if (data.id === botId && data.qr) {
          try {
            const qrHtml = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(data.qr)}" class="width: 100%">`;
            qrCodeResult.innerHTML = qrHtml;
          } catch (e) {
            console.error("Error generating QR Code:", e);
            addSystemLog(
              "Error generating QR code. Check console.",
              "error-log"
            );
          }
        } else {
          console.warn(
            "qr_code_update data invalid or not for this bot:",
            data
          );
        }
      });

      socket.on("pairing_code_update", (data) => {
        console.log("pairing_code_update received:", data);
        if (data.id === botId && data.code) {
          const codeHtml = `<div class="pairing-code" style="font-weight: bold; font-size: 1.2em; letter-spacing: 2px; background-color: #e0e0e0; color: #333; padding: 10px; border-radius: 5px; text-align: center; margin: 5px 0;">${data.code}</div>`;
          pairingCodeResult.innerHTML = codeHtml;
        } else {
          console.warn(
            "pairing_code_update data invalid or not for this bot:",
            data
          );
        }
      });
    } else {
      console.error("One or more Connect Bot elements not found!");
      console.log("connectMethodSwitch:", !!connectMethodSwitch);
      console.log("switchText:", !!switchText);
      console.log("pairingCodeSection:", !!pairingCodeSection);
      console.log("qrCodeSection:", !!qrCodeSection);
      console.log("pairingCodeResult:", !!pairingCodeResult);
      console.log("qrCodeResult:", !!qrCodeResult);
    }
  }

  const botIdCard = document.getElementById("botIdCard");
  const botIdValue = document.getElementById("botIdValue");
  const botControlBtn = document.getElementById("botControlBtn");
  const botControlMenu = document.getElementById("botControlMenu");
  const startBtn = document.getElementById("start");
  const stopBtn = document.getElementById("stop");
  const reloadBtn = document.getElementById("reload");

  function updateBotControls(status) {
    if (!botControlBtn || !startBtn || !stopBtn || !reloadBtn) return;

    const isOnline =
      status.toLowerCase() === "online" || status.toLowerCase() === "running";

    botControlBtn.innerHTML = `<i class="fas fa-cog"></i> ${isOnline ? "Running" : "Offline"}`;
    botControlBtn.classList.toggle("online", isOnline);

    startBtn.disabled = isOnline;
    stopBtn.disabled = !isOnline;
    reloadBtn.disabled = !isOnline;

    startBtn.classList.toggle("active", isOnline);
    stopBtn.classList.remove("active");
  }

  const initialStatus = botStatusElement.textContent;
  updateBotControls(initialStatus);

  const copyLogsBtn = document.getElementById("copy-logs-btn");
  if (copyLogsBtn) {
    copyLogsBtn.addEventListener("click", function () {
      const logsContainer = document.getElementById("logs-container");
      const logsText = logsContainer.innerText;
      navigator.clipboard
        .writeText(logsText)
        .then(() => {
          Swal.fire({
            icon: "success",
            title: "Copied!",
            text: "Logs have been copied.",
            timer: 1500,
            showConfirmButton: false,
            toast: true,
            position: "top-end",
          });
        })
        .catch((err) => {
          console.error("Failed to copy logs: ", err);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Failed to copy logs.",
          });
        });
    });
  }

  const editSaveBtn = document.getElementById("phone-edit-save-btn");
  const botIdForPhone = controlsData?.value;
  let originalPhoneNumber = phoneInput?.value;

  if (botIdCard && botIdValue) {
    botIdCard.addEventListener("click", () => {
      navigator.clipboard
        .writeText(botIdValue.textContent.trim())
        .then(() => {
          Swal.fire({
            icon: "success",
            title: "Copied!",
            text: "Bot ID has been copied.",
            timer: 1500,
            showConfirmButton: false,
            toast: true,
            position: "top-end",
          });
        })
        .catch((err) => {
          console.error("Copy failed: ", err);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Failed to copy.",
          });
        });
    });
  }

  const blurredElements = document.querySelectorAll(".blurred");
  blurredElements.forEach((element) => {
    element.addEventListener(
      "click",
      () => {
        element.classList.remove("blurred");
      },
      { once: true }
    );
  });

  if (botControlBtn && botControlMenu) {
    botControlBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      botControlMenu.classList.toggle("show");
    });
    document.addEventListener("click", (e) => {
      if (
        !botControlMenu.contains(e.target) &&
        e.target !== botControlBtn &&
        botControlMenu.classList.contains("show")
      ) {
        botControlMenu.classList.remove("show");
      }
    });
    botControlMenu.addEventListener("click", (e) => {
      e.stopPropagation();
    });
    botControlMenu.querySelectorAll(".btn-menu-item").forEach((button) => {
      button.addEventListener("click", function () {
        const action = this.name;
        const botIdForAction = controlsData.value;
        if (!botIdForAction) {
          Swal.fire("Error!", "Bot ID not found.", "error");
          return;
        }
        let confirmationText = `You are about to ${action.replace("_", " ")} the bot.`;
        if (action === "deleteSession") {
          confirmationText =
            "This will log the bot out. You'll need to pairing code again.";
        }
        Swal.fire({
          title: "Are you sure?",
          text: confirmationText,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#7f5af0",
          cancelButtonColor: "#d33",
          confirmButtonText: `Yes, ${action.replace("_", " ")} it!`,
        }).then((result) => {
          if (result.isConfirmed) {
            if (logsContainer) addSystemLog(`Executing action: ${action}...`);

            const connectMethodSwitch = document.getElementById(
              "connectMethodSwitch"
            );
            const connectMethod =
              connectMethodSwitch && connectMethodSwitch.checked
                ? "pairing"
                : "qr";

            fetch(`/controls`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                cmd: action,
                id: botIdForAction,
                connectMethod: action === "start" ? connectMethod : undefined,
              }),
            })
              .then(async (response) => {
                const isJson = response.headers
                  .get("content-type")
                  ?.includes("application/json");
                const data = isJson
                  ? await response.json()
                  : await response.text();

                if (!response.ok) {
                  const errorMessage =
                    isJson && data.message
                      ? data.message
                      : !isJson && data
                        ? data
                        : `Server error: ${response.status}`;
                  throw new Error(errorMessage);
                }
                return data;
              })
              .then((data) => {
                const message =
                  typeof data === "object" && data.message
                    ? data.message
                    : typeof data === "string"
                      ? data
                      : "Action completed.";
                Swal.fire("Success!", message, "success");

                let specialClass = null;
                if (
                  action === "start" ||
                  action === "stop" ||
                  action === "reload"
                ) {
                  specialClass = "online-blinking";
                }
                if (logsContainer)
                  addSystemLog(
                    `Action ${action} successful: ${message}`,
                    specialClass
                  );

                if (
                  botStatusElement &&
                  (action === "start" || action === "stop")
                ) {
                  botStatusElement.textContent =
                    action === "start" ? "Starting..." : "Offline";

                  if (action === "stop" && logsContainer) {
                    logsContainer.innerHTML = "";
                    addOfflineMessage();
                  }
                }
              })
              .catch((err) => {
                console.error(`Fetch error during ${action}:`, err);
                Swal.fire(
                  "Error!",
                  err.message || `Failed to execute ${action}.`,
                  "error"
                );
                if (logsContainer)
                  addSystemLog(`Action ${action} failed: ${err.message}`);
              });
          }
        });
        botControlMenu.classList.remove("show");
      });
    });
  }

  if (editSaveBtn && phoneInput && botIdForPhone) {
    const icon = editSaveBtn.querySelector("i");
    const text = editSaveBtn.querySelector("span");

    function setDisplayMode() {
      phoneInput.setAttribute("readonly", true);
      icon.classList.remove("fa-save");
      icon.classList.add("fa-pencil-alt");
      text.textContent = "Edit";
      editSaveBtn.setAttribute("title", "Edit Number");
      phoneInput.style.cursor = "default";
    }

    function setEditMode() {
      originalPhoneNumber = phoneInput.value;
      phoneInput.removeAttribute("readonly");
      phoneInput.focus();
      phoneInput.setSelectionRange(
        phoneInput.value.length,
        phoneInput.value.length
      );
      icon.classList.remove("fa-pencil-alt");
      icon.classList.add("fa-save");
      text.textContent = "Simpan";
      editSaveBtn.setAttribute("title", "Save Number");
      phoneInput.style.cursor = "text";
    }

    function savePhoneNumber() {
      const newPhoneNumber = phoneInput.value.trim();
      if (!/^\\d+$/.test(newPhoneNumber)) {
        Swal.fire("Invalid Input", "Digits only.", "warning");
        return;
      }
      if (newPhoneNumber === originalPhoneNumber) {
        setDisplayMode();
        return;
      }
      Swal.fire({
        title: "Confirm phone",
        text: `Save: ${newPhoneNumber}?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#7f5af0",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes!",
      }).then((res) => {
        if (res.isConfirmed) {
          socket.emit("phoneEdit", {
            id: botIdForPhone,
            phone: newPhoneNumber,
          });
          console.log(
            `Emitting phoneEdit: id=${botIdForPhone}, phone=${newPhoneNumber}`
          );
          setDisplayMode();
        } else {
          phoneInput.value = originalPhoneNumber;
          setDisplayMode();
        }
      });
    }

    editSaveBtn.addEventListener("click", () => {
      if (phoneInput.hasAttribute("readonly")) {
        setEditMode();
      } else {
        savePhoneNumber();
      }
    });
    phoneInput.addEventListener("input", function (e) {
      this.value = this.value.replace(/[^0-9]/g, "");
    });
    phoneInput.addEventListener("keydown", function (e) {
      /* ... Enter & Escape ... */ if (
        e.key === "Enter" &&
        !this.hasAttribute("readonly")
      ) {
        e.preventDefault();
        savePhoneNumber();
      }
      if (e.key === "Escape" && !this.hasAttribute("readonly")) {
        this.value = originalPhoneNumber;
        setDisplayMode();
        this.blur();
      }
    });
    phoneInput.addEventListener("blur", function (e) {
      /* ... blur handler ... */ if (
        document.activeElement !== editSaveBtn &&
        !this.hasAttribute("readonly")
      ) {
        setTimeout(() => {
          if (
            document.activeElement !== editSaveBtn &&
            !this.hasAttribute("readonly")
          ) {
            this.value = originalPhoneNumber;
            setDisplayMode();
          }
        }, 150);
      }
    });
  }

  const themeToggleButton = document.getElementById("theme-toggle");
  const currentTheme = localStorage.getItem("theme") || "dark";
  document.body.classList.toggle("light-theme", currentTheme === "light");
  if (themeToggleButton) {
    themeToggleButton.addEventListener("click", () => {
      document.body.classList.toggle("light-theme");
      let theme = document.body.classList.contains("light-theme")
        ? "light"
        : "dark";
      localStorage.setItem("theme", theme);
    });
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
          direction: "none",
          random: true,
          straight: false,
          out_mode: "out",
          attract: { enable: false },
        },
      },
      detectRetina: true,
    });
  } else {
    console.warn("tsParticles not loaded.");
  }

  const notificationPopup = document.getElementById("notification-popup");
  const closePopupButton = document.getElementById("close-popup");

  if (notificationPopup && closePopupButton) {
    closePopupButton.addEventListener("click", () => {
      notificationPopup.classList.add("disappearing");

      notificationPopup.addEventListener(
        "animationend",
        () => {
          if (notificationPopup.parentNode) {
            notificationPopup.parentNode.removeChild(notificationPopup);
          }
        },
        { once: true }
      );
    });
  }
  const openChatBtn = document.getElementById("open-support-chat-btn");
  const closeChatBtn = document.getElementById("close-support-chat-btn");
  const chatPopup = document.getElementById("support-chat-popup");
  const chatForm = document.getElementById("support-chat-form");
  const chatInput = document.getElementById("support-chat-input");
  const chatMessages = document.getElementById("support-chat-messages");
  const sendChatButton = chatForm
    ? chatForm.querySelector('button[type="submit"]')
    : null;
  let typingBubble = null;
  let isWaitingResponse = false;

  if (openChatBtn && chatPopup && closeChatBtn) {
    openChatBtn.addEventListener("click", () => {
      chatPopup.style.display = "flex";

      if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight;
    });

    closeChatBtn.addEventListener("click", () => {
      chatPopup.style.display = "none";
    });
  }

  if (chatForm && chatInput && chatMessages && socket && sendChatButton) {
    chatForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (isWaitingResponse) return;

      const messageText = chatInput.value.trim();
      if (!messageText) return;

      addChatMessage(messageText, "user");
      chatInput.value = "";
      chatInput.disabled = true;
      sendChatButton.disabled = true;
      isWaitingResponse = true;

      socket.emit("ai-support-chat", messageText);
      console.log("Sent ai-support-chat:", messageText);

      showTypingIndicator();

      chatMessages.scrollTop = chatMessages.scrollHeight;
    });

    socket.on("ai-support-response", (aiMessage) => {
      console.log("Received ai-support-response:", aiMessage);
      removeTypingIndicator();

      const formattedMsg = aiMessage
        .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
        .replace(/`(.*?)`/g, "<code>$1</code>")
        .replace(
          /(https?:\/\/[^\s]+)/g,
          '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
        )
        .replace(/\n/g, "<br>");

      addChatMessage(formattedMsg, "ai");

      chatInput.disabled = false;
      sendChatButton.disabled = false;
      isWaitingResponse = false;
      chatMessages.scrollTop = chatMessages.scrollHeight;
    });
  }

  function addChatMessage(htmlContent, sender) {
    if (!chatMessages) return;
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", `${sender}-message`);
    messageDiv.innerHTML = htmlContent;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function showTypingIndicator() {
    if (!chatMessages || typingBubble) return;
    typingBubble = document.createElement("div");
    typingBubble.classList.add("message", "ai-message", "typing");
    typingBubble.innerHTML =
      '\n            <span class="dot"></span>\n            <span class="dot"></span>\n            <span class="dot"></span>\n        ';
    chatMessages.appendChild(typingBubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function removeTypingIndicator() {
    if (typingBubble && chatMessages && chatMessages.contains(typingBubble)) {
      chatMessages.removeChild(typingBubble);
    }
    typingBubble = null;
  }
});
