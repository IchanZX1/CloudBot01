const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const listPath = path.join(rootDir, 'backup.json');

function getJakartaTimestamp() {
    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Jakarta',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }).formatToParts(new Date()).reduce((acc, part) => {
        acc[part.type] = part.value;
        return acc;
    }, {});

    return `${parts.year}-${parts.month}-${parts.day}_${parts.hour}-${parts.minute}-${parts.second}_WIB`;
}

function ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}

function copyFile(src, dest) {
    ensureDir(path.dirname(dest));
    fs.copyFileSync(src, dest);
}

function removeFile(filePath) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
}

function copyDir(src, dest) {
    ensureDir(dest);
    for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else if (entry.isFile()) {
            copyFile(srcPath, destPath);
        }
    }
}

function removeDir(dirPath) {
    if (fs.existsSync(dirPath)) fs.rmSync(dirPath, { recursive: true, force: true });
}

function readBackupList() {
    if (!fs.existsSync(listPath)) {
        throw new Error(`File backup.json tidak ditemukan: ${listPath}`);
    }

    const data = JSON.parse(fs.readFileSync(listPath, 'utf8'));
    if (!Array.isArray(data)) throw new Error('backup.json harus berupa array nomor bot.');

    return [...new Set(data.map(item => String(item || '').replace(/[^0-9]/g, '')).filter(Boolean))];
}

function main() {
    const botNumbers = readBackupList();
    const backupDir = path.join(rootDir, `backup_${getJakartaTimestamp()}`);
    const report = {
        createdAt: new Date().toISOString(),
        timezone: 'Asia/Jakarta',
        backupDir,
        total: botNumbers.length,
        movedCreds: 0,
        movedDatabases: 0,
        missingCreds: [],
        missingDatabases: []
    };

    ensureDir(backupDir);

    for (const botNum of botNumbers) {
        const credsSrc = path.join(rootDir, 'session', `device${botNum}`, 'creds.json');
        const credsDest = path.join(backupDir, 'session', `device${botNum}`, 'creds.json');
        const dbSrc = path.join(rootDir, 'database', `data${botNum}`);
        const dbDest = path.join(backupDir, 'database', `data${botNum}`);

        if (fs.existsSync(credsSrc)) {
            copyFile(credsSrc, credsDest);
            removeFile(credsSrc);
            report.movedCreds++;
            console.log(`[CREDS] MOVED ${botNum}`);
        } else {
            report.missingCreds.push(botNum);
            console.log(`[CREDS] SKIP ${botNum} - creds.json tidak ditemukan`);
        }

        if (fs.existsSync(dbSrc) && fs.statSync(dbSrc).isDirectory()) {
            copyDir(dbSrc, dbDest);
            removeDir(dbSrc);
            report.movedDatabases++;
            console.log(`[DB] MOVED ${botNum}`);
        } else {
            report.missingDatabases.push(botNum);
            console.log(`[DB] SKIP ${botNum} - folder database tidak ditemukan`);
        }
    }

    fs.writeFileSync(path.join(backupDir, 'backup-report.json'), JSON.stringify(report, null, 2));

    console.log('');
    console.log('Backup selesai.');
    console.log(`Folder: ${backupDir}`);
    console.log(`Creds moved: ${report.movedCreds}/${report.total}`);
    console.log(`Database moved: ${report.movedDatabases}/${report.total}`);
}

try {
    main();
} catch (err) {
    console.error('[BACKUP] ERROR:', err.message);
    process.exit(1);
}
