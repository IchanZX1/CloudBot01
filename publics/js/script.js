/**
 * ZXcoderID CloudBot - Global Scripts
 */

// Scroll Reveal Logic
function reveal() {
    var reveals = document.querySelectorAll(".reveal");
    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 100;
        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add("active");
        } else {
            reveals[i].classList.remove("active");
        }
    }
}

// Function to handle POST-based navigation (more secure for OTP data)
function postRedirect(url, params) {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = url;
    for (const key in params) {
        if (params.hasOwnProperty(key)) {
            const hiddenField = document.createElement('input');
            hiddenField.type = 'hidden';
            hiddenField.name = key;
            hiddenField.value = params[key];
            form.appendChild(hiddenField);
        }
    }
    document.body.appendChild(form);
    form.submit();
}
window.addEventListener("scroll", reveal);

// Toast Notification System
function showToast(message, type = 'error') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    const bgColor = type === 'error' ? 'bg-red-500/20' : 'bg-green-500/20';
    const borderColor = type === 'error' ? 'border-red-500' : 'border-green-500';
    const textColor = type === 'error' ? 'text-red-500' : 'text-green-500';
    const icon = type === 'error' ? 'bi-exclamation-triangle-fill' : 'bi-check-circle-fill';

    toast.className = `glass ${bgColor} ${borderColor} ${textColor} border-l-4 p-3 md:p-4 rounded-xl md:rounded-2xl flex items-center space-x-3 md:space-x-4 popup-float shadow-2xl w-full md:min-w-[300px] md:w-auto`;
    toast.innerHTML = `
        <i class="bi ${icon} text-lg md:text-xl"></i>
        <div class="flex-grow">
            <p class="font-bold text-[10px] md:text-sm uppercase tracking-widest">${type === 'error' ? 'Gagal' : 'Sukses'}</p>
            <p class="text-[10px] md:text-xs opacity-80 leading-tight">${message}</p>
        </div>
    `;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-20px)';
        toast.style.transition = 'all 0.5s ease';
        setTimeout(() => toast.remove(), 500);
    }, 4000);
}

// Shake Element
function shakeElement(id) {
    const el = document.getElementById(id);
    if (el) {
        el.classList.add('animate-shake');
        setTimeout(() => el.classList.remove('animate-shake'), 400);
    }
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const icon = document.getElementById('menu-icon');
    if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden');
        setTimeout(() => menu.classList.add('active'), 10);
        icon.classList.replace('bi-list', 'bi-x-lg');
    } else {
        menu.classList.remove('active');
        setTimeout(() => menu.classList.add('hidden'), 300);
        icon.classList.replace('bi-x-lg', 'bi-list');
    }
}

// --- Page Specific Logic ---

document.addEventListener('DOMContentLoaded', () => {
    reveal();

    // -- Navigation (Active Link) --
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });

    // -- Index Page --
    if (document.getElementById('claim-trial-btn')) {
        window.claimTrial = async function () {
            try {
                const res = await fetch('/api/claim-trial', { method: 'POST' });
                const data = await res.json();
                if (data.success) {
                    showToast(data.message, 'success');
                    setTimeout(() => window.location.href = '/dashboard', 1500);
                } else {
                    showToast(data.error, 'error');
                }
            } catch (err) {
                showToast('Terjadi kesalahan koneksi!', 'error');
            }
        };
    }

    // -- Invoice Page --
    let mCountdownInterval;
    let mStatusPolling;
    if (document.getElementById('invoice-modal')) {
        window.showInvoiceDetail = function (el) {
            const data = JSON.parse(el.getAttribute('data-deposit'));
            const modal = document.getElementById('invoice-modal');
            const modalBox = document.getElementById('modal-box');
            
            // Elements
            const pendingSection = document.getElementById('m-pending-section');
            const cancelContainer = document.getElementById('m-cancel-container');
            const paidRow = document.getElementById('m-paid-row');
            const paidLabel = document.getElementById('m-paid-label');
            const paidTime = document.getElementById('m-paid');
            const mCountdown = document.getElementById('m-countdown');
            const mQrisImg = document.getElementById('m-qris-img');

            // Clear previous interval
            if (mCountdownInterval) clearInterval(mCountdownInterval);
            if (mStatusPolling) clearInterval(mStatusPolling);

            // Store current reffId for cancel/download
            window.activeInvoiceId = data.reffId;

            const formatFullDate = (date) => {
                if (!date) return '-';
                return new Date(date).toLocaleString('id-ID', {
                    day: '2-digit', month: 'long', year: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                }).replace(/\./g, ':');
            };

            const statusBadges = {
                'success': '<span class="px-6 py-2 rounded-full text-xs font-black bg-green-500/10 text-green-500 border border-green-500/20 uppercase tracking-widest"><i class="bi bi-patch-check-fill mr-2"></i>PAID</span>',
                'pending': '<span class="px-6 py-2 rounded-full text-xs font-black bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 uppercase tracking-widest"><i class="bi bi-clock-history mr-2"></i>PENDING</span>',
                'failed': '<span class="px-6 py-2 rounded-full text-xs font-black bg-red-500/10 text-red-500 border border-red-500/20 uppercase tracking-widest"><i class="bi bi-x-circle-fill mr-2"></i>FAILED</span>',
                'expired': '<span class="px-6 py-2 rounded-full text-xs font-black bg-gray-500/10 text-gray-400 border border-white/5 uppercase tracking-widest"><i class="bi bi-calendar-x mr-2"></i>EXPIRED</span>',
                'cancelled': '<span class="px-6 py-2 rounded-full text-xs font-black bg-white/5 text-gray-500 border border-white/5 uppercase tracking-widest"><i class="bi bi-trash mr-2"></i>CANCELLED</span>'
            };

            const updateStatusUI = (status, updatedAt) => {
                document.getElementById('modal-status-badge').innerHTML = statusBadges[status] || statusBadges['failed'];
                if (status === 'success') {
                    pendingSection.classList.add('hidden');
                    cancelContainer.classList.add('hidden');
                    paidRow.classList.remove('hidden');
                    paidLabel.innerText = 'Dibayar';
                    paidLabel.className = 'text-gray-500';
                    paidTime.innerText = formatFullDate(updatedAt || new Date());
                    paidTime.className = 'text-green-500 font-bold';
                    
                    if (typeof confetti === 'function') {
                        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#22c55e', '#ffffff'] });
                    }
                } else if (status === 'expired') {
                    pendingSection.classList.add('hidden');
                    cancelContainer.classList.add('hidden');
                    paidRow.classList.remove('hidden');
                    paidLabel.innerText = 'Keterangan';
                    paidLabel.className = 'text-red-500 font-bold';
                    paidTime.innerText = 'Waktu pembayaran Anda telah habis';
                    paidTime.className = 'text-red-500 italic';
                    
                    if (mCountdownInterval) clearInterval(mCountdownInterval);
                    if (mStatusPolling) clearInterval(mStatusPolling);
                } else if (status === 'cancelled') {
                    pendingSection.classList.add('hidden');
                    cancelContainer.classList.add('hidden');
                    paidRow.classList.remove('hidden');
                    paidLabel.innerText = 'Keterangan';
                    paidLabel.className = 'text-gray-500';
                    paidTime.innerText = 'Pesanan dibatalkan';
                    paidTime.className = 'text-gray-500 italic';
                }
            };

            document.getElementById('m-trx').innerText = '#' + data.reffId;
            document.getElementById('m-total').innerText = 'Rp ' + data.nominal.toLocaleString('id-ID');
            document.getElementById('m-package').innerText = (data.packageId?.name || 'Unknown') + ' Plan';
            document.getElementById('m-created').innerText = formatFullDate(data.createdAt);

            if (data.status === 'success') {
                updateStatusUI('success', data.updatedAt);
            } else if (data.status === 'expired') {
                updateStatusUI('expired');
            } else if (data.status === 'pending') {
                pendingSection.classList.remove('hidden');
                cancelContainer.classList.remove('hidden');
                paidRow.classList.remove('hidden');
                paidLabel.innerText = 'Keterangan';
                paidLabel.className = 'text-yellow-500 font-bold';
                paidTime.innerText = 'Belum dibayarkan';
                paidTime.className = 'text-yellow-500 italic';
                
                if (data.paymentData && data.paymentData.qr_image) {
                    mQrisImg.src = data.paymentData.qr_image;
                    window.activeQRUrl = data.paymentData.qr_image;
                }

                mStatusPolling = setInterval(async () => {
                    try {
                        const res = await fetch(`/api/deposit/status/${data.reffId}`);
                        const result = await res.json();
                        if (result.status === 'success') {
                            clearInterval(mStatusPolling);
                            clearInterval(mCountdownInterval);
                            updateStatusUI('success', new Date());
                            showToast('Pembayaran Berhasil!', 'success');
                        } else if (result.status === 'expired') {
                            clearInterval(mStatusPolling);
                            clearInterval(mCountdownInterval);
                            updateStatusUI('expired');
                        }
                    } catch (e) { }
                }, 10000);

                const startTime = new Date(data.createdAt).getTime();
                const expiryTime = startTime + (30 * 60 * 1000);
                
                const updateCountdown = () => {
                    const now = new Date().getTime();
                    const diff = expiryTime - now;

                    if (diff <= 0) {
                        mCountdown.innerText = "EXPIRED";
                        clearInterval(mCountdownInterval);
                        clearInterval(mStatusPolling);
                        updateStatusUI('expired');
                        return;
                    }

                    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                    const s = Math.floor((diff % (1000 * 60)) / 1000);
                    mCountdown.innerText = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
                };
                
                updateCountdown();
                mCountdownInterval = setInterval(updateCountdown, 1000);
            } else {
                updateStatusUI('cancelled');
            }

            modal.classList.remove('opacity-0', 'pointer-events-none');
            modal.classList.add('opacity-100', 'pointer-events-auto');
            modalBox.classList.remove('scale-95');
            modalBox.classList.add('scale-100');
        };

        window.closeInvoiceModal = function () {
            if (mCountdownInterval) clearInterval(mCountdownInterval);
            if (mStatusPolling) clearInterval(mStatusPolling);
            const modal = document.getElementById('invoice-modal');
            const modalBox = document.getElementById('modal-box');
            modal.classList.remove('opacity-100', 'pointer-events-auto');
            modal.classList.add('opacity-0', 'pointer-events-none');
            modalBox.classList.remove('scale-100');
            modalBox.classList.add('scale-95');
        };

        window.copyTrxId = function () {
            const trxId = document.getElementById('m-trx').innerText.replace('#', '');
            navigator.clipboard.writeText(trxId).then(() => {
                showToast('ID Transaksi berhasil disalin!', 'success');
            });
        };

        window.downloadQR = function() {
            if (!window.activeQRUrl) return;
            const link = document.createElement('a');
            link.href = window.activeQRUrl;
            link.download = `QRIS-${window.activeInvoiceId || 'payment'}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };

        window.cancelOrderFromInvoice = async function() {
            if (!window.activeInvoiceId) return;
            
            const confirmed = await Swal.fire({
                title: 'Batalkan Pesanan?',
                text: 'Yakin ingin membatalkan transaksi ini?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#22c55e', // Green as requested
                cancelButtonColor: '#333',
                confirmButtonText: 'Ya, Batalkan',
                cancelButtonText: 'Tutup',
                background: '#121212',
                color: '#fff'
            });

            if (confirmed.isConfirmed) {
                try {
                    const res = await fetch(`/api/deposit/cancel/${window.activeInvoiceId}`, { method: 'POST' });
                    const result = await res.json();
                    if (result.success) {
                        showToast('Pesanan berhasil dibatalkan', 'success');
                        setTimeout(() => location.reload(), 1000);
                    } else {
                        showToast(result.error || 'Gagal membatalkan', 'error');
                    }
                } catch (e) {
                    showToast('Terjadi kesalahan koneksi', 'error');
                }
            }
        };
    }

    // -- Profile Page --
    if (document.getElementById('profile-card')) {
        let isFlipped = false;
        window.flipCard = function () {
            const card = document.getElementById('profile-card');
            isFlipped = !isFlipped;
            card.style.transform = isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)';
        };

        window.togglePassword = function () {
            const input = document.getElementById('password');
            const icon = document.getElementById('pass-icon');
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.replace('bi-eye', 'bi-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.replace('bi-eye-slash', 'bi-eye');
            }
        };

        window.previewImage = function (input) {
            if (input.files && input.files[0]) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    document.getElementById('preview-avatar').src = e.target.result;
                    document.getElementById('card-avatar').src = e.target.result;
                }
                reader.readAsDataURL(input.files[0]);
            }
        };

        window.handleUpdate = async function (event) {
            event.preventDefault();
            const form = event.target;

            Swal.fire({
                title: 'Meminta OTP...',
                text: 'Kami mengirimkan kode khusus ke email Anda untuk validasi keamanan.',
                allowOutsideClick: false,
                background: '#121212',
                color: '#fff',
                didOpen: () => { Swal.showLoading(); }
            });

            try {
                const otpReq = await fetch('/api/profile/request-otp', { method: 'POST' });
                const otpRes = await otpReq.json();
                if (!otpRes.success) throw new Error(otpRes.error || 'Gagal mengirim OTP');

                const { value: otp } = await Swal.fire({
                    title: 'Verifikasi Akun',
                    text: 'Masukkan 6 digit kode OTP yang dikirim ke email Anda',
                    input: 'text',
                    inputPlaceholder: '000000',
                    background: '#121212',
                    color: '#fff',
                    confirmButtonColor: '#22c55e',
                    confirmButtonText: 'Konfirmasi & Simpan',
                    showCancelButton: true,
                    cancelButtonText: 'Batal',
                    inputAttributes: { 'maxlength': 6 },
                    preConfirm: (val) => {
                        if (!val || val.length !== 6) Swal.showValidationMessage('Kode harus 6 digit');
                        return val;
                    }
                });

                if (!otp) return;

                Swal.fire({ title: 'Menyimpan...', background: '#121212', color: '#fff', didOpen: () => { Swal.showLoading(); } });

                const formData = new FormData(form);
                formData.append('otp', otp);

                const updateReq = await fetch('/api/profile/update', { method: 'POST', body: formData });
                const updateRes = await updateReq.json();

                if (updateRes.success) {
                    document.getElementById('card-username').textContent = formData.get('username');
                    document.getElementById('card-email').textContent = formData.get('email');
                    document.getElementById('card-wa').textContent = formData.get('no_Wa');

                    await Swal.fire({ icon: 'success', title: 'Berhasil!', text: updateRes.message, background: '#121212', color: '#fff', confirmButtonColor: '#22c55e' });

                    if (formData.get('email') !== document.getElementById('card-email').getAttribute('data-original')) {
                        window.location.reload();
                    }
                } else {
                    throw new Error(updateRes.error || 'Gagal memperbarui profil');
                }
            } catch (err) {
                Swal.fire({ icon: 'error', title: 'Maaf', text: err.message, background: '#121212', color: '#fff', confirmButtonColor: '#22c55e' });
            }
        };
    }

    // -- Commands Configuration Page --
    if (document.getElementById('command-list')) {
        const commandList = document.getElementById('command-list');
        const searchInput = document.getElementById('cmd-search');
        const form = document.getElementById('command-limits-form');
        const saveBtn = document.getElementById('save-btn');
        let allCommands = [];

        async function fetchConfig() {
            try {
                const [cmdsRes, limitsRes] = await Promise.all([
                    fetch('/api/bot/commands'),
                    fetch('/api/bot/commands-config')
                ]);
                allCommands = await cmdsRes.json();
                const limits = await limitsRes.json();
                renderCommands(allCommands, limits);
            } catch (err) {
                commandList.innerHTML = '<div class="col-span-full text-red-500 text-center py-10">Failed to load data. Please refresh.</div>';
            }
        }

        function renderCommands(cmds, limits = {}) {
            if (cmds.length === 0) {
                commandList.innerHTML = '<div class="col-span-full text-gray-500 text-center py-10">No commands found.</div>';
                return;
            }

            commandList.innerHTML = cmds.map(cmd => `
                <div class="cmd-item group glass p-4 md:p-5 rounded-2xl md:rounded-3xl border border-white/5 hover:border-green-500/30 transition-all bg-white/[0.02] hover:bg-white/[0.05]" data-cmd="${cmd}">
                    <div class="flex items-center justify-between mb-3">
                        <div class="flex items-center space-x-2">
                            <div class="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-green-500 transition-colors">
                                <i class="bi bi-terminal text-xs md:text-sm"></i>
                            </div>
                            <span class="text-xs md:text-sm font-bold text-white tracking-tight">${cmd}</span>
                        </div>
                        <span class="bg-white/5 text-[8px] md:text-[9px] font-extrabold text-gray-500 px-2 py-0.5 rounded-full uppercase tracking-tighter">Command</span>
                    </div>
                    <div class="relative">
                        <input type="number" name="limit_${cmd}" value="${limits[cmd] || 0}" 
                            class="w-full bg-black/40 border border-white/5 rounded-xl py-2.5 md:py-3 px-3 md:px-4 text-sm md:text-base font-extrabold text-green-500 focus:outline-none focus:border-green-500/50 transition-all"
                            min="0" placeholder="0">
                        <span class="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-[9px] md:text-[10px] text-gray-600 font-bold uppercase tracking-widest pointer-events-none">COST</span>
                    </div>
                </div>
            `).join('');
        }

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const term = e.target.value.toLowerCase();
                document.querySelectorAll('.cmd-item').forEach(item => {
                    const cmd = item.getAttribute('data-cmd').toLowerCase();
                    item.classList.toggle('hidden', !cmd.includes(term));
                });
            });
        }

        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                saveBtn.disabled = true;
                saveBtn.innerHTML = '<i class="bi bi-arrow-repeat animate-spin mr-2"></i>SAVING...';
                const formData = new FormData(form);
                const limits = {};
                for (let [key, value] of formData.entries()) {
                    if (key.startsWith('limit_')) {
                        limits[key.replace('limit_', '')] = parseInt(value) || 0;
                    }
                }
                try {
                    const response = await fetch('/api/bot/commands-config', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(limits)
                    });
                    const result = await response.json();
                    if (result.success) showToast('Configuration saved successfully!', 'success');
                    else showToast(result.error || 'Failed to save configuration', 'error');
                } catch (err) {
                    showToast('Connection error occurred!', 'error');
                } finally {
                    saveBtn.disabled = false;
                    saveBtn.innerHTML = 'SAVE CONFIGURATION';
                }
            });
        }
        fetchConfig();
    }

    // -- Dashboard Page --
    if (document.getElementById('connect-page')) {
        const qrBtn = document.getElementById('qr-btn');
        const pairingBtn = document.getElementById('pairing-btn');
        const methodInput = document.getElementById('connect-method');
        const sameNumCheckbox = document.getElementById('same-num');
        const botNumberInput = document.getElementById('bot-number');
        const ownerNumberInput = document.getElementById('owner-num');
        const connectForm = document.getElementById('connect-form');
        const configForm = document.getElementById('config-form');
        const editMsgForm = document.getElementById('editmsg-form');
        const tabConnect = document.getElementById('tab-connect');
        const tabConfig = document.getElementById('tab-config');
        const tabEditMsg = document.getElementById('tab-editmsg');
        const statusContent = document.getElementById('status-content');
        const statusBadge = document.getElementById('status-badge');
        const submitBtn = document.getElementById('submit-connect');
        const submitConfigBtn = document.getElementById('submit-config');
        const editMsgActualForm = document.getElementById('editmsg-actual-form');
        const submitEditMsgBtn = document.getElementById('submit-editmsg');
        const waLogsContainer = document.getElementById('wa-logs-container');

        let pollingInterval = null;
        let flowChart = null;
        let lastLoggedStatus = null;

        function getSelectedBotNumber() {
            const countrySelect = document.getElementById('country-code');
            const countryCode = countrySelect ? countrySelect.value : '+62';
            let rawNum = (botNumberInput?.value || '').replace(/[^0-9]/g, '');
            if (rawNum.startsWith('0')) rawNum = rawNum.slice(1);
            return (countryCode + rawNum).replace(/[^0-9]/g, '');
        }

        function writeWaLog(message, type = 'info') {
            if (!waLogsContainer) return;

            const placeholder = waLogsContainer.querySelector('.opacity-50');
            if (placeholder) placeholder.remove();

            const colorMap = {
                success: 'text-green-400',
                warning: 'text-yellow-400',
                error: 'text-red-400',
                info: 'text-gray-300'
            };
            const row = document.createElement('div');
            row.className = colorMap[type] || colorMap.info;
            const time = new Date().toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            }).replace(/\./g, ':');
            row.textContent = `[${time}] ${message}`;
            waLogsContainer.appendChild(row);
            waLogsContainer.scrollTop = waLogsContainer.scrollHeight;

            const maxRows = 120;
            while (waLogsContainer.children.length > maxRows) {
                waLogsContainer.removeChild(waLogsContainer.firstElementChild);
            }
        }

        function logConnectionStatus(data) {
            const status = data.status || 'idle';
            const botNumber = data.botNumber || getSelectedBotNumber() || 'unknown';
            const signature = `${botNumber}:${status}:${data.isConnected ? 'connected' : 'not-connected'}:${data.socketReady ? 'ready' : 'not-ready'}`;
            if (signature === lastLoggedStatus) return;
            lastLoggedStatus = signature;

            if (status === 'open' && data.isConnected) {
                writeWaLog(`CONNECTED bot ${botNumber} tersambung dan socket WhatsApp aktif.`, 'success');
            } else if (status === 'open') {
                writeWaLog(`VERIFYING bot ${botNumber} status open, menunggu socket benar-benar ready.`, 'warning');
            } else if (status === 'qr') {
                writeWaLog(`QR_READY bot ${botNumber} menunggu scan QR WhatsApp.`, 'info');
            } else if (status === 'pairing') {
                writeWaLog(`PAIRING_READY bot ${botNumber} menunggu kode pairing dimasukkan.`, 'info');
            } else if (status === 'connecting') {
                writeWaLog(`CONNECTING bot ${botNumber} sedang membuka koneksi WhatsApp.`, 'info');
            } else if (status === 'stopped') {
                writeWaLog(`STOPPED bot ${botNumber} koneksi dihentikan atau belum aktif.`, 'warning');
            } else if (status === 'deleted') {
                writeWaLog(`DELETED session bot ${botNumber} telah dihapus.`, 'warning');
            } else if (status === 'error') {
                writeWaLog(`ERROR bot ${botNumber} gagal terkoneksi.`, 'error');
            } else {
                writeWaLog(`IDLE bot ${botNumber} belum tersambung.`, 'info');
            }
        }

        async function loadCountryCodes() {
            const countrySelect = document.getElementById('country-code');
            if (!countrySelect) return;
            try {
                const res = await fetch('/api/country-codes');
                const countries = await res.json();
                countrySelect.innerHTML = countries.map(c => 
                    `<option value="${c.code}" ${c.code === '+62' ? 'selected' : ''}>${c.country} (${c.code})</option>`
                ).join('');

                // Try to detect prefix from existing bot number
                const currentVal = botNumberInput.value.replace(/[^0-9]/g, '');
                if (currentVal) {
                    // Find the matching country code (longest first to avoid overlap like +1 vs +1-xxx)
                    const sortedCountries = [...countries].sort((a,b) => b.code.length - a.code.length);
                    for (const c of sortedCountries) {
                        const cleanCode = c.code.replace(/[^0-9]/g, '');
                        if (currentVal.startsWith(cleanCode)) {
                            countrySelect.value = c.code;
                            botNumberInput.value = currentVal.slice(cleanCode.length);
                            break;
                        }
                    }
                }
            } catch (err) { console.error('Failed to load country codes', err); }
        }
        loadCountryCodes();

        function switchTab(tab) {
            [tabConnect, tabConfig, tabEditMsg].forEach(btn => {
                btn.classList.remove('bg-green-500', 'text-black');
                btn.classList.add('text-gray-400', 'hover:text-white');
            });
            [connectForm, configForm, editMsgForm].forEach(form => form.classList.add('hidden'));

            if (tab === 'connect') {
                tabConnect.classList.add('bg-green-500', 'text-black');
                connectForm.classList.remove('hidden');
            } else if (tab === 'config') {
                tabConfig.classList.add('bg-green-500', 'text-black');
                configForm.classList.remove('hidden');
                loadConfig();
            } else if (tab === 'editmsg') {
                tabEditMsg.classList.add('bg-green-500', 'text-black');
                editMsgForm.classList.remove('hidden');
                loadEditMsg();
            }
        }

        tabConnect?.addEventListener('click', () => switchTab('connect'));
        tabConfig?.addEventListener('click', () => switchTab('config'));
        tabEditMsg?.addEventListener('click', () => switchTab('editmsg'));

        async function loadEditMsg() {
            const userPkg = document.getElementById('msg-group-1')?.getAttribute('data-package')?.toLowerCase();
            if (userPkg === 'basic' || userPkg === 'starter') {
                document.getElementById('msg-group-2')?.classList.remove('hidden');
                document.getElementById('msg-group-4')?.classList.remove('hidden'); // Sewa customization
            }
            if (userPkg === 'starter') {
                document.getElementById('msg-group-3')?.classList.remove('hidden');
            }

            try {
                const response = await fetch('/api/bot/mess');
                const mess = await response.json();
                ['wait', 'success', 'on', 'off'].forEach(f => { if (mess[f]) editMsgActualForm[f].value = mess[f]; });
                if (mess.query) {
                    if (mess.query.text) editMsgActualForm['query.text'].value = mess.query.text;
                    if (mess.query.link) editMsgActualForm['query.link'].value = mess.query.link;
                }
                if (mess.error?.fitur) editMsgActualForm['error.fitur'].value = mess.error.fitur;
                if (mess.only) {
                    ['group', 'private', 'owner', 'admin', 'badmin', 'premium'].forEach(f => {
                        if (mess.only[f]) editMsgActualForm[`only.${f}`].value = mess.only[f];
                    });
                }
                if (mess.sewa) {
                    ['caption', 'list_title', 'payment_text', 'owner_text'].forEach(f => {
                        if (mess.sewa[f]) editMsgActualForm[`sewa.${f}`].value = mess.sewa[f];
                    });
                }
            } catch (err) { }
        }

        editMsgActualForm?.addEventListener('submit', async (e) => {
            e.preventDefault();
            submitEditMsgBtn.disabled = true;
            submitEditMsgBtn.innerHTML = '<i class="bi bi-arrow-repeat animate-spin mr-2"></i>Saving...';
            const formData = new FormData(editMsgActualForm);
            const data = {};
            for (let [key, value] of formData.entries()) {
                if (key.includes('.')) {
                    const [parent, child] = key.split('.');
                    if (!data[parent]) data[parent] = {};
                    data[parent][child] = value;
                } else data[key] = value;
            }
            try {
                const messRes = await fetch('/api/bot/mess', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
                const messResult = await messRes.json();
                if (messResult.success) showToast('Pesan berhasil disimpan!', 'success');
                else showToast(messResult.error || 'Gagal menyimpan pesan', 'error');
            } catch (err) { showToast('Terjadi kesalahan koneksi!', 'error'); }
            finally { submitEditMsgBtn.disabled = false; submitEditMsgBtn.innerHTML = 'Save Custom Messages'; }
        });

        qrBtn?.addEventListener('click', () => {
            methodInput.value = 'qr';
            qrBtn.classList.add('border-green-500'); qrBtn.classList.remove('border-white/5', 'text-gray-400');
            pairingBtn.classList.remove('border-green-500'); pairingBtn.classList.add('border-white/5', 'text-gray-400', 'hover:text-white');
        });

        pairingBtn?.addEventListener('click', () => {
            methodInput.value = 'pairing';
            pairingBtn.classList.add('border-green-500'); pairingBtn.classList.remove('border-white/5', 'text-gray-400', 'hover:text-white');
            qrBtn.classList.remove('border-green-500'); qrBtn.classList.add('border-white/5', 'text-gray-400');
        });

        sameNumCheckbox?.addEventListener('change', () => {
            ownerNumberInput.value = sameNumCheckbox.checked ? botNumberInput.value : ownerNumberInput.value;
            ownerNumberInput.readOnly = sameNumCheckbox.checked;
            ownerNumberInput.classList.toggle('opacity-50', sameNumCheckbox.checked);
        });

        botNumberInput?.addEventListener('input', () => { if (sameNumCheckbox.checked) ownerNumberInput.value = botNumberInput.value; });

        async function loadConfig() {
            try {
                const [configRes, settingsRes] = await Promise.all([
                    fetch('/api/bot/config'),
                    fetch('/api/bot/settings')
                ]);
                const configData = await configRes.json();
                const settingsData = await settingsRes.json();

                if (configData.success && configData.config) {
                    const config = configData.config;
                    ['botname', 'ownernumber', 'wm', 'packname', 'author', 'creator'].forEach(f => {
                        if (configForm[f]) configForm[f].value = config[f] || '';
                    });
                }

                if (settingsData.success && settingsData.settings) {
                    const settings = settingsData.settings;
                    const featureList = ['public', 'anticall', 'autobio', 'onlygrub', 'onlypc', 'autoread', 'autoshalat'];
                    featureList.forEach(feat => {
                        const cb = configForm[`settings_${feat}`];
                        if (cb) cb.checked = !!settings[feat];
                    });
                    if (configForm['settings_sholat_city']) configForm['settings_sholat_city'].value = settings.sholat_city || '';
                    if (configForm['settings_prefixes']) configForm['settings_prefixes'].value = settings.prefixes || '!,.,#,,,$';
                }
            } catch (err) { }
        }

        configForm?.addEventListener('submit', async (e) => {
            e.preventDefault();
            submitConfigBtn.disabled = true;
            submitConfigBtn.innerHTML = '<i class="bi bi-arrow-repeat animate-spin mr-2"></i>Saving...';

            const configFormData = new FormData(configForm);
            const settings = {};
            const featureList = ['public', 'anticall', 'autobio', 'onlygrub', 'onlypc', 'autoread', 'autoshalat'];

            featureList.forEach(feat => {
                settings[feat] = !!configForm[`settings_${feat}`]?.checked;
            });
            settings.sholat_city = configForm['settings_sholat_city']?.value || '';
            settings.prefixes = configForm['settings_prefixes']?.value || '!,.,#,,,$';

            try {
                const [configRes, settingsRes] = await Promise.all([
                    fetch('/api/bot/config', { method: 'POST', body: configFormData }),
                    fetch('/api/bot/settings', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(settings)
                    })
                ]);

                const configJson = await configRes.json();
                const settingsJson = await settingsRes.json();

                if (configJson.success && settingsJson.success) {
                    showToast('Konfigurasi & Fitur berhasil disimpan!', 'success');
                } else {
                    showToast(configJson.error || settingsJson.error || 'Terjadi kesalahan saat menyimpan', 'error');
                }
            } catch (err) {
                showToast('Terjadi kesalahan koneksi!', 'error');
            } finally {
                submitConfigBtn.disabled = false;
                submitConfigBtn.innerHTML = 'Save Configuration';
            }
        });

        connectForm?.addEventListener('submit', async (e) => {
            e.preventDefault();
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="bi bi-arrow-repeat animate-spin mr-2"></i>Connecting...';

            const countryCode = document.getElementById('country-code').value;
            let rawNum = botNumberInput.value.replace(/[^0-9]/g, '');
            if (rawNum.startsWith('0')) rawNum = rawNum.slice(1);
            const fullBotNumber = (countryCode + rawNum).replace(/[^0-9]/g, '');
            writeWaLog(`START_REQUEST bot ${fullBotNumber} memakai metode ${methodInput.value.toUpperCase()}.`, 'info');

            try {
                const response = await fetch('/api/bot/connect', { 
                    method: 'POST', 
                    headers: { 'Content-Type': 'application/json' }, 
                    body: JSON.stringify({ 
                        method: methodInput.value, 
                        botNumber: fullBotNumber 
                    }) 
                });
                const data = await response.json();
                if (data.success) {
                    writeWaLog(`START_ACCEPTED bot ${fullBotNumber} proses koneksi dimulai oleh server.`, 'success');
                    showToast('Proses koneksi dimulai...', 'success');
                    startStatusPolling();
                }
                else {
                    writeWaLog(`START_REJECTED bot ${fullBotNumber}: ${data.error || 'Gagal memulai koneksi'}`, 'error');
                    showToast(data.error || 'Gagal memulai koneksi', 'error');
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = 'Start Connect';
                }
            } catch (err) {
                writeWaLog(`START_FAILED bot ${fullBotNumber} request koneksi gagal dikirim.`, 'error');
                showToast('Terjadi kesalahan koneksi!', 'error');
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Start Connect';
            }
        });

        function startStatusPolling() {
            if (pollingInterval) clearInterval(pollingInterval);
            const checkStatus = async () => {
                try {
                    const response = await fetch('/api/bot/status');
                    const data = await response.json();
                    logConnectionStatus(data);
                    updateStatusUI(data);
                    const isTerminal = ['error', 'deleted', 'stopped', 'idle'].includes(data.status);
                    submitBtn.disabled = !isTerminal;
                    submitBtn.innerHTML = isTerminal ? 'Start Connect' : (data.isConnected ? 'Connected' : 'Processing...');
                    submitBtn.classList.toggle('text-green-500', !!data.isConnected);
                    submitBtn.classList.toggle('opacity-50', !isTerminal);
                    if (isTerminal && flowChart) { flowChart.destroy(); flowChart = null; }
                } catch (err) { }
            };
            checkStatus();
            pollingInterval = setInterval(checkStatus, 3000);
        }

        function updateStatusUI(data) {
            statusBadge.innerText = (data.status || 'IDLE').toUpperCase();
            statusBadge.className = 'px-3 py-1 rounded-full bg-white/5 text-[10px] font-bold text-gray-500';
            if (data.status === 'open' && data.isConnected) statusBadge.className = 'px-3 py-1 rounded-full bg-green-500/10 text-[10px] font-bold text-green-400 border border-green-500/20';
            else if (['connecting', 'qr', 'pairing'].includes(data.status)) statusBadge.className = 'px-3 py-1 rounded-full bg-yellow-500/10 text-[10px] font-bold text-yellow-400 border border-yellow-500/20';
            else if (data.status === 'error') statusBadge.className = 'px-3 py-1 rounded-full bg-red-500/10 text-[10px] font-bold text-red-400 border border-red-500/20';
            switch (data.status) {
                case 'connecting':
                    if (flowChart) { flowChart.destroy(); flowChart = null; }
                    statusContent.innerHTML = '<div class="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div><p class="mt-4 text-xs text-gray-500">Menyiapkan koneksi...</p>';
                    break;
                case 'qr':
                    if (flowChart) { flowChart.destroy(); flowChart = null; }
                    if (data.qr) statusContent.innerHTML = `<img src="${data.qr}" class="w-full aspect-square p-2 bg-white rounded-xl shadow-2xl" alt="QR Code"><p class="mt-4 text-xs text-green-500 font-bold">Silakan scan QR Code ini</p>`;
                    break;
                case 'pairing':
                    if (flowChart) { flowChart.destroy(); flowChart = null; }
                    if (data.pairingCode) {
                        statusContent.innerHTML = `
                            <div class="flex flex-col items-center justify-center w-full min-h-[150px]">
                                <p class="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-4">Your Pairing Code</p>
                                <div class="w-full max-w-[280px] mx-auto text-center 
                                    text-xl md:text-2xl font-mono font-black tracking-widest
                                    text-green-400 bg-green-500/5 py-4 px-2
                                    rounded-2xl border border-green-500/20
                                    shadow-[0_0_30px_rgba(34,197,94,0.1)]
                                    break-all flex items-center justify-center relative group">
                                    <span id="p-code-val">${data.pairingCode}</span>
                                </div>
                                <button onclick="copyPairingCode('${data.pairingCode}')" 
                                    class="mt-4 flex items-center space-x-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-bold hover:bg-green-500 hover:text-black transition-all">
                                    <i class="bi bi-clipboard"></i>
                                    <span>SALIN KODE</span>
                                </button>
                                <p class="mt-4 text-[9px] text-green-500/60 font-medium uppercase tracking-tighter">Masukkan kode ini di WhatsApp Anda</p>
                            </div>`;
                    }
                    break;
                case 'open':
                case 'stopped':
                    const isStopped = data.status === 'stopped';
                    if (!document.getElementById('network-chart')) {
                        statusContent.innerHTML = `
                            <div class="w-full">
                                <div class="rounded-2xl border border-white/10 bg-[#536370]/70 overflow-hidden shadow-inner ${isStopped ? 'opacity-60 grayscale' : ''}">
                                    <div class="px-4 py-3 flex items-center justify-between border-b border-white/10">
                                        <div>
                                            <p id="chart-title" class="text-sm font-extrabold text-white">${isStopped ? 'Bot Dihentikan' : 'Network'}</p>
                                            <p class="text-[10px] text-white/70 mt-1">Realtime traffic flow</p>
                                        </div>
                                        <div class="flex items-center gap-3">
                                            <span class="flex items-center gap-1 text-[10px] text-yellow-300 font-bold"><i class="bi bi-cloud-download-fill"></i><span id="traffic-in">0</span></span>
                                            <span class="flex items-center gap-1 text-[10px] text-cyan-300 font-bold"><i class="bi bi-cloud-upload-fill"></i><span id="traffic-out">0</span></span>
                                        </div>
                                    </div>
                                    <div class="h-[190px] md:h-[210px] px-2 py-3">
                                        <canvas id="network-chart" class="w-full h-full"></canvas>
                                    </div>
                                </div>
                            </div>
                            <div class="grid grid-cols-3 gap-2 mt-4 w-full">
                                <button id="btn-start-bot" onclick="doStartBot()" class="min-h-[42px] px-2 py-2 bg-green-500/10 text-green-500 border border-green-500/30 text-[10px] font-extrabold rounded-xl disabled:opacity-40" ${!isStopped ? 'disabled' : ''}>START</button>
                                <button id="btn-stop-bot" onclick="doStopBot()" class="min-h-[42px] px-2 py-2 bg-red-500/10 text-red-500 border border-red-500/30 text-[10px] font-extrabold rounded-xl disabled:opacity-40" ${isStopped ? 'disabled' : ''}>STOP</button>
                                <button id="btn-delete-session" onclick="doDeleteSession()" class="min-h-[42px] px-2 py-2 bg-white/5 text-gray-300 border border-white/10 text-[10px] font-extrabold rounded-xl"><i class="bi bi-trash mr-1"></i>SESSION</button>
                            </div>
                        `;
                        const ctx = document.getElementById('network-chart').getContext('2d');
                        flowChart = new Chart(ctx, {
                            type: 'line',
                            data: {
                                labels: [], datasets: [
                                    { label: 'Inbound', borderColor: '#fbbf24', backgroundColor: 'rgba(251, 191, 36, 0.10)', data: [], tension: 0.35, fill: true, pointRadius: 0, borderWidth: 3 },
                                    { label: 'Outbound', borderColor: '#22d3ee', backgroundColor: 'rgba(34, 211, 238, 0.08)', data: [], tension: 0.35, fill: true, pointRadius: 0, borderWidth: 3 }
                                ]
                            },
                            options: {
                                responsive: true,
                                maintainAspectRatio: false,
                                animation: { duration: 250 },
                                layout: { padding: { left: 6, right: 8, top: 4, bottom: 0 } },
                                scales: {
                                    x: { display: false },
                                    y: {
                                        min: 0,
                                        ticks: {
                                            color: 'rgba(255,255,255,0.85)',
                                            font: { size: 10 },
                                            maxTicksLimit: 4,
                                            callback: value => value === 0 ? '0 Bytes' : `${value} KiB`
                                        },
                                        grid: { color: 'rgba(255,255,255,0.15)' },
                                        border: { display: false }
                                    }
                                },
                                plugins: { legend: { display: false }, tooltip: { enabled: false } }
                            }
                        });
                    }
                    if (flowChart) {
                        const time = new Date().toLocaleTimeString();
                        flowChart.data.labels.push(time);
                        flowChart.data.datasets[0].data.push(isStopped ? 0 : (data.inbound || 0));
                        flowChart.data.datasets[1].data.push(isStopped ? 0 : (data.outbound || 0));
                        if (flowChart.data.labels.length > 20) { flowChart.data.labels.shift(); flowChart.data.datasets[0].data.shift(); flowChart.data.datasets[1].data.shift(); }
                        flowChart.update();
                        document.getElementById('traffic-in').innerText = isStopped ? 0 : (data.inbound || 0);
                        document.getElementById('traffic-out').innerText = isStopped ? 0 : (data.outbound || 0);
                    }
                    break;
                case 'error':
                    if (flowChart) { flowChart.destroy(); flowChart = null; }
                    statusContent.innerHTML = '<i class="bi bi-exclamation-octagon text-7xl text-red-500 mb-6 font-bold"></i><p class="text-red-500 text-xs font-bold leading-relaxed">Koneksi Gagal. Silakan coba lagi.</p>';
                    break;
                case 'deleted':
                    if (flowChart) { flowChart.destroy(); flowChart = null; }
                    statusContent.innerHTML = '<i class="bi bi-trash text-6xl text-gray-500 mb-4"></i><p class="text-gray-500 text-xs font-bold leading-relaxed">Session bot telah dihapus.</p>';
                    break;
                case 'idle':
                default:
                    if (flowChart) { flowChart.destroy(); flowChart = null; }
                    statusContent.innerHTML = '<i class="bi bi-qr-code text-6xl text-gray-600 mb-4"></i><p id="status-text" class="text-gray-500 text-xs text-center leading-relaxed font-medium">QR Code atau Pairing Code akan muncul di sini.</p>';
                    break;
            }
        }

        window.doStartBot = () => triggerBotAction('start', document.getElementById('btn-start-bot'));
        window.doStopBot = () => triggerBotAction('stop', document.getElementById('btn-stop-bot'));
        window.doDeleteSession = () => triggerBotAction('delete', document.getElementById('btn-delete-session'));

        async function triggerBotAction(action, btn) {
            if (btn) { btn.disabled = true; btn.innerHTML = '<i class="bi bi-arrow-repeat animate-spin"></i>...'; }
            try {
                const res = await fetch('/api/bot/action', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action, method: methodInput.value }) });
                const result = await res.json();
                if (result.success) { showToast('Sukses: ' + action, 'success'); setTimeout(() => location.reload(), 500); }
                else { showToast('Gagal: ' + result.error, 'error'); if (btn) { btn.disabled = false; btn.innerText = action.toUpperCase(); } }
            } catch (e) { showToast('Kesalahan request', 'error'); if (btn) { btn.disabled = false; btn.innerText = action.toUpperCase(); } }
        }

        window.copyPairingCode = function (code) {
            navigator.clipboard.writeText(code).then(() => {
                showToast('Kode Pairing berhasil disalin!', 'success');
            });
        };

        startStatusPolling();
    }

    // -- Login Page --
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="bi bi-arrow-repeat animate-spin mr-2"></i>Verifying...';
            fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(new FormData(this)) })
                .then(async res => {
                    const data = await res.json();
                    if (res.ok && data.success) { showToast('Login Berhasil!', 'success'); startLoading(data.redirect || '/dashboard'); }
                    else if (data.needsVerification) { 
                        showToast(data.error, 'error'); 
                        setTimeout(() => { 
                            postRedirect('/verify-otp', {
                                email: data.email,
                                whatsapp: data.whatsapp,
                                method: data.verify_method
                            });
                        }, 1500); 
                    }
                    else { showToast(data.error || 'Email atau password salah!', 'error'); shakeElement('login-card'); submitBtn.disabled = false; submitBtn.innerHTML = originalText; }
                }).catch(() => { showToast('Koneksi bermasalah!', 'error'); shakeElement('login-card'); submitBtn.disabled = false; submitBtn.innerHTML = originalText; });
        });

        function startLoading(redirectUrl) {
            const preloader = document.getElementById('preloader');
            if (!preloader) { window.location.href = redirectUrl; return; }
            preloader.style.display = 'flex';
            document.body.style.overflow = 'hidden';

            // Trigger mascot animation
            const botImg = preloader.querySelector('.bot-img');
            const waterContainer = preloader.querySelector('.water-container');

            if (botImg) botImg.classList.add('squishy-active');
            if (waterContainer) {
                waterContainer.parentElement.classList.add('water-splash-active');
                // Create drops
                for (let i = 0; i < 6; i++) {
                    const drop = document.createElement('div');
                    drop.className = 'water-drop';
                    const angle = (i / 6) * Math.PI * 2;
                    const distance = 40 + Math.random() * 40;
                    drop.style.left = '50%';
                    drop.style.top = '50%';
                    drop.style.setProperty('--tx', `${Math.cos(angle) * distance}px`);
                    drop.style.setProperty('--ty', `${Math.sin(angle) * distance - 50}px`);
                    waterContainer.appendChild(drop);
                }
            }

            let width = 0;
            const timer = setInterval(() => {
                if (width >= 100) { clearInterval(timer); window.location.href = redirectUrl; }
                else { width += 5; document.getElementById('progress-bar').style.width = width + '%'; document.getElementById('progress-percent').innerText = width + '%'; }
            }, 50);
        }
    }

    // -- Signup Page --
    const signupForm = document.querySelector('form[action="/signup"]:not(#signup-form)');
    if (signupForm) {
        signupForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const btn = document.getElementById('btn-submit');
            const originalText = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = '<i class="bi bi-arrow-repeat animate-spin mr-2"></i>Mendaftar...';

            const formData = new FormData(this);
            const email = formData.get('email');
            const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

            if (!gmailRegex.test(email)) {
                showToast('Hanya alamat email @gmail.com yang diperbolehkan!', 'error');
                shakeElement('signup-card');
                btn.disabled = false;
                btn.innerHTML = originalText;
                return;
            }

            try {
                const res = await fetch('/api/signup', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(formData) });
                const data = await res.json();
                if (res.ok && data.success) { 
                    showToast(data.message || 'Pendaftaran berhasil!', 'success'); 
                    setTimeout(() => { 
                        if (data.verifyData) {
                            postRedirect('/verify-otp', data.verifyData);
                        } else {
                            window.location.href = '/login';
                        }
                    }, 1500); 
                }
                else { showToast(data.error || 'Terjadi kesalahan', 'error'); shakeElement('signup-card'); }
            } catch (err) { showToast('Terjadi kesalahan server', 'error'); shakeElement('signup-card'); }
            finally { btn.disabled = false; btn.innerHTML = originalText; }
        });
    }

    // -- Verify OTP Page --
    const verifyForm = document.getElementById('verify-form');
    if (verifyForm) {
        const inputs = document.querySelectorAll('.otp-input');
        const btnResend = document.getElementById('btn-resend');
        const countdownEl = document.getElementById('countdown');
        const email = document.getElementById('user-email').value;

        inputs.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                const value = e.target.value.replace(/\D/g, '');
                e.target.value = value.slice(-1);
                if (value.length === 1 && index < inputs.length - 1) inputs[index + 1].focus();
            });
            input.addEventListener('paste', (e) => {
                e.preventDefault();
                const pasted = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '').slice(0, inputs.length);
                pasted.split('').forEach((digit, digitIndex) => {
                    inputs[digitIndex].value = digit;
                });
                const nextIndex = Math.min(pasted.length, inputs.length - 1);
                inputs[nextIndex]?.focus();
            });
            input.addEventListener('keydown', (e) => { if (e.key === 'Backspace' && e.target.value.length === 0 && index > 0) inputs[index - 1].focus(); });
        });

        let isExpiredOnLoad = document.getElementById('is-expired')?.value === 'true';
        let timeLeft = isExpiredOnLoad ? 0 : 300; // 5 minutes standard

        if (isExpiredOnLoad) {
            btnResend.disabled = false;
            countdownEl.innerText = "Sekarang";
        }

        const timer = setInterval(() => {
            if (timeLeft <= 0) {
                clearInterval(timer);
                btnResend.disabled = false;
                countdownEl.innerText = "Sekarang";
                return;
            }
            timeLeft--;
            countdownEl.innerText = `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`;
        }, 1000);

        verifyForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const otp = Array.from(inputs).map(i => i.value).join('');
            if (otp.length < 6) { showToast('Kode OTP harus 6 digit!', 'error'); return; }
            try {
                const res = await fetch('/api/chanVerifyt-otp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, otp }) });
                const data = await res.json();
                if (data.success) { showToast('Verifikasi Berhasil!', 'success'); setTimeout(() => window.location.href = '/login?success=Akun berhasil diverifikasi, silakan login', 1500); }
                else showToast(data.error || 'OTP salah atau kadaluarsa', 'error');
            } catch (err) { showToast('Terjadi kesalahan server', 'error'); }
        });

        btnResend?.addEventListener('click', async () => {
            try {
                const res = await fetch('/api/resend-otp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
                const data = await res.json();
                if (data.success) { showToast('OTP Baru telah dikirim!', 'success'); btnResend.disabled = true; timeLeft = 900; }
                else showToast(data.error || 'Gagal mengirim ulang OTP', 'error');
            } catch (err) { showToast('Terjadi kesalahan server', 'error'); }
        });
    }

});
