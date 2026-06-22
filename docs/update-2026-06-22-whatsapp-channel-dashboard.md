# Update 2026-06-22 - WhatsApp Channel Config, Game Guard, dan Middleware

Dokumen ini merangkum perubahan yang dibuat pada update saat ini untuk alur dashboard, backend, runtime bot, dan middleware pesan.

## Ringkasan Perubahan

Perubahan utama mencakup:

- Middleware `index.js` untuk mencegah pesan bot sendiri dengan teks `Jawaban Salah!` masuk ke handler utama.
- Guard user database di `Nano.js` agar reward game tidak crash saat `db.users[m.sender]` belum tersedia.
- Command `tesre` untuk mengirim pesan forwarded newsletter style.
- Command `chekchid` untuk mengecek ID saluran WhatsApp dari link channel.
- Integrasi dashboard agar link saluran WhatsApp otomatis di-resolve oleh backend menjadi JID newsletter.
- Sinkronisasi hasil resolve ke `session/device<bot>/config.json` sebagai `idsal` dan `saluran` untuk `NanoBotz.userConfig`.
- Dukungan yang sama untuk mode Wings/remote worker.

## File Yang Berubah

### `index.js`

Menambahkan helper middleware:

- `normalizeMiddlewareText(text)`
- `extractMessageText(message)`
- `isSelfWrongAnswerMessage(rawMessage, serializedMessage)`

Tujuannya agar pesan dari bot sendiri dengan teks berikut tidak diproses lagi oleh handler:

```text
*Jawaban Salah!*
Jawaban Salah!
```

Guard ini membaca teks dari beberapa bentuk payload Baileys, termasuk:

- `conversation`
- `extendedTextMessage.text`
- caption media
- button/list/template response
- `ephemeralMessage`
- `viewOnceMessage`
- `viewOnceMessageV2`

Guard dipasang sebelum log message, sync config/db, akses mode, dan sebelum `require('./Nano.js')` dipanggil.

## `Nano.js`

### Guard User Database Untuk Game

Ditambahkan helper:

```js
getOrCreateDbUser(jid)
```

Helper ini memastikan user selalu tersedia sebelum kode game mengakses properti seperti:

```js
users.money += 10000
users.exp += 10
```

Masalah yang diperbaiki:

```text
TypeError: Cannot read properties of undefined (reading 'money')
```

Area game yang sudah memakai helper ini:

- `family100`
- `tebakkata`
- `tebakgambar`
- `tekateki`
- `siapaaku`
- `susunkata`
- `tebaklirik`

### Command `tesre`

Command `tesre` mengirim pesan dengan metadata forwarded newsletter style menggunakan `contextInfo.forwardedNewsletterMessageInfo`.

Contoh penggunaan:

```text
.tesre
```

Atau dengan teks custom:

```text
.tesre *[ UPDATE ]*

- Fix A
- Fix B
```

Command ini sekarang memakai channel per-user lebih dulu:

```js
NanoBotz.userConfig?.idsal || NanoBotz.userConfig?.channel_id || global.idsal
NanoBotz.userConfig?.saluran || NanoBotz.userConfig?.channel_name || global.saluran
```

### Command `chekchid`

Command `chekchid` dibuat untuk mengecek ID saluran WhatsApp dari link channel.

Contoh penggunaan:

```text
.chekchid https://whatsapp.com/channel/0029VbBVupfKbYMFuKLsIg2M
```

Command ini menggunakan API Baileys:

- `NanoBotz.newsletterLinkToId(channelUrl)`
- fallback `NanoBotz.newsletterMetadata('invite', inviteCode)`

Output berisi:

- ID saluran / newsletter JID
- invite code
- nama saluran jika tersedia
- subscriber jika tersedia
- verification jika tersedia

### Runtime User Config Untuk Channel

Helper reply utama sekarang menggunakan konfigurasi per device:

```js
NanoBotz.userConfig?.idsal
NanoBotz.userConfig?.saluran
```

Jika konfigurasi per device belum tersedia, bot fallback ke:

```js
global.idsal
global.saluran
```

## `views/dashboard.ejs`

Area konfigurasi saluran WhatsApp diperluas.

Field yang tersedia:

- `settings_whatsapp_channel`: link saluran WhatsApp.
- `settings_channel_name`: nama saluran custom yang akan ditampilkan pada forwarded newsletter info.

Ketentuan paket:

- Field hanya aktif untuk paket `Basic` dan `Starter`.
- Paket lain tetap melihat lock message dan input disabled.

Status yang ditampilkan di frontend:

```text
ID saluran aktif: <jid>@newsletter | Nama: <nama saluran>
```

## `publics/js/script.js`

Frontend dashboard sekarang:

- Memuat `settings.channel_name` atau `settings.saluran` ke input nama saluran.
- Mengirim `channel_name` bersama payload settings.
- Menampilkan hasil resolve dari backend setelah autosave selesai.
- Memperbarui hash autosave setelah backend mengisi nama saluran otomatis dari metadata.

Payload settings yang dikirim mencakup:

```json
{
  "whatsapp_channel": "https://whatsapp.com/channel/...",
  "channel_name": "Nama Saluran Custom"
}
```

## `apps.js`

Endpoint `/api/bot/settings` sekarang memproses link saluran WhatsApp sebelum menyimpan settings.

### Validasi Paket

Hanya paket berikut yang dapat menyimpan konfigurasi channel:

- `basic`
- `starter`

Jika paket tidak memenuhi syarat, field berikut dibuang dari payload:

- `whatsapp_channel`
- `channel_name`

### Resolve Channel ID

Backend mengekstrak invite code dari URL:

```text
https://whatsapp.com/channel/<inviteCode>
```

Lalu backend resolve ke newsletter JID menggunakan socket Baileys aktif:

- `sock.newsletterLinkToId(channelUrl)`
- fallback `sock.newsletterMetadata('invite', inviteCode)`

Jika bot belum connect, proses akan gagal dengan pesan error agar user connect bot terlebih dahulu.

### Data Yang Disimpan

Setelah link berhasil di-resolve, backend menyimpan data berikut ke `database/data<bot>/database.json` pada `db.settings[botJid]`:

```json
{
  "whatsapp_channel": "https://whatsapp.com/channel/...",
  "channel_id": "120363xxxx@newsletter",
  "channel_invite": "0029...",
  "channel_name": "Nama Saluran",
  "idsal": "120363xxxx@newsletter",
  "saluran": "Nama Saluran"
}
```

Backend juga menyimpan data yang sama ke:

```text
session/device<bot>/config.json
```

Tujuannya agar `NanoBotz.userConfig` langsung mempunyai:

```js
userConfig.idsal
userConfig.saluran
```

Jika bot sedang running, backend juga memperbarui:

```js
sock.userConfig
```

sehingga perubahan bisa dipakai tanpa menunggu restart penuh.

## `wings.js`

Mode Wings/remote worker mendapat logic yang sama seperti `apps.js`.

Endpoint yang berubah:

```text
POST /api/wings/bot/settings/save
```

Endpoint ini sekarang:

- Resolve link saluran WhatsApp.
- Simpan `channel_id`, `idsal`, dan `saluran` ke database settings.
- Update `session/device<bot>/config.json` di worker.
- Update `sock.userConfig` jika bot sedang aktif di worker.
- Mengembalikan `settings` final ke master/frontend.

## `settings.js`

Default global fallback channel diperbarui.

Field fallback:

```js
global.saluran
global.idsal
```

Nilai ini tetap dipakai hanya jika user/device belum mempunyai konfigurasi channel sendiri.

## Alur End-to-End

1. User membuka tab `Config` di dashboard.
2. User mengisi link saluran WhatsApp pada field `Saluran Whatsapp`.
3. User dapat mengisi nama saluran custom pada field nama saluran.
4. Autosave frontend mengirim payload ke `/api/bot/settings`.
5. Backend memvalidasi paket user.
6. Backend mengambil invite code dari link.
7. Backend memakai socket Baileys aktif untuk mencari newsletter JID.
8. Backend menyimpan hasil ke database settings dan `session/device<bot>/config.json`.
9. Jika bot sedang running, `sock.userConfig` langsung diupdate.
10. Frontend menerima `settings` final dan menampilkan ID saluran aktif.
11. Saat bot membalas pesan, `Nano.js` memakai `NanoBotz.userConfig.idsal` dan `NanoBotz.userConfig.saluran`.

## Catatan Operasional

- Bot harus sudah connect agar backend dapat resolve ID saluran dari link.
- Link yang diterima harus berbentuk:

```text
https://whatsapp.com/channel/<inviteCode>
https://www.whatsapp.com/channel/<inviteCode>
```

- Jika link dikosongkan, backend membersihkan konfigurasi channel dari settings dan `config.json`.
- Nama saluran custom dibatasi 80 karakter.
- Jika nama saluran custom kosong, backend memakai nama saluran dari metadata WhatsApp jika tersedia.

## Verifikasi Sintaks

File berikut sudah dicek dengan `node --check`:

```text
apps.js
wings.js
Nano.js
index.js
publics/js/script.js
```

Semua pengecekan sintaks berhasil.
