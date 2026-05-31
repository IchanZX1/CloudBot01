// ▶️ Jalankan pertama kali saat start
let isChecking = false;

async function checkForUpdate() {
  const simpleGit = require('simple-git');
  const fs = require('fs');

  const repoDir = process.cwd();
  const git = simpleGit(repoDir);

  const token = process.env.TOKEN_GH;

  if (isChecking) return;
  isChecking = true;

  try {
    // 🔐 inject token ke remote (runtime)
    await git.remote([
      'set-url',
      'origin',
      `https://IchanZX1:${token}@github.com/IchanZX1/CloudBot01.git`
    ]);

    // ambil update terbaru
    await git.fetch();

    const localCommit = await git.revparse(['HEAD']);
    const remoteCommit = await git.revparse(['origin/main']);

    if (localCommit !== remoteCommit) {
      console.log('Update terdeteksi, updating...');

      await git.reset(['--hard', 'origin/main']);

      console.log('Restart server dalam 10 detik...');
      setTimeout(() => {
        process.exit(1);
      }, 10000);
    } else {
      console.log('[ AUTO UPDATE ] SCRIPT SUDAH VERSI TERBARU');
    }

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    isChecking = false;
  }
}

module.exports = { checkForUpdate };