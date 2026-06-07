#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { spawn, spawnSync } = require('child_process');

const REPO_URL = 'https://github.com/IchanZX1/CloudBot01.git';
const DEFAULT_DIR_NAME = 'CloudBot01';
const CONFIG_FILE = '.wings-start.json';

function log(message) {
    console.log(`[START] ${message}`);
}

function run(command, args, options = {}) {
    const result = spawnSync(command, args, {
        cwd: options.cwd || process.cwd(),
        stdio: 'inherit',
        shell: process.platform === 'win32'
    });

    if (result.status !== 0) {
        throw new Error(`${command} ${args.join(' ')} gagal dijalankan.`);
    }
}

function commandExists(command) {
    const checker = process.platform === 'win32' ? 'where' : 'command';
    const args = process.platform === 'win32' ? [command] : ['-v', command];
    const result = spawnSync(checker, args, {
        stdio: 'ignore',
        shell: process.platform !== 'win32'
    });
    return result.status === 0;
}

function hasProjectFiles(dir) {
    return fs.existsSync(path.join(dir, 'package.json')) && fs.existsSync(path.join(dir, 'wings.js'));
}

function resolveAppDir() {
    if (process.env.CLOUDBOT_DIR) return path.resolve(process.env.CLOUDBOT_DIR);
    if (hasProjectFiles(process.cwd())) return process.cwd();
    return path.join(process.cwd(), DEFAULT_DIR_NAME);
}

function readConfig(appDir) {
    const configPath = path.join(appDir, CONFIG_FILE);
    if (!fs.existsSync(configPath)) return {};

    try {
        return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    } catch (err) {
        return {};
    }
}

function writeConfig(appDir, config) {
    fs.writeFileSync(path.join(appDir, CONFIG_FILE), JSON.stringify(config, null, 2));
}

function parseCommand(commandLine) {
    const parts = [];
    let current = '';
    let quote = null;

    for (const char of commandLine.trim()) {
        if ((char === '"' || char === "'") && !quote) {
            quote = char;
            continue;
        }
        if (char === quote) {
            quote = null;
            continue;
        }
        if (char === ' ' && !quote) {
            if (current) parts.push(current);
            current = '';
            continue;
        }
        current += char;
    }

    if (current) parts.push(current);
    return parts;
}

function sanitizeWingsCommand(commandLine) {
    const trimmed = String(commandLine || '').trim();
    if (!trimmed) return '';
    if (!/^node\s+wings\.js(\s|$)/.test(trimmed)) {
        throw new Error('Command harus diawali dengan: node wings.js');
    }
    if (!trimmed.includes('--uuid ') || !trimmed.includes('--token ') || !trimmed.includes('--master ')) {
        throw new Error('Command wings wajib memiliki --uuid, --token, dan --master.');
    }
    return trimmed;
}

function ask(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise(resolve => {
        rl.question(question, answer => {
            rl.close();
            resolve(answer);
        });
    });
}

async function ensureProject(appDir) {
    if (hasProjectFiles(appDir)) {
        log(`Project ditemukan di ${appDir}`);
        return;
    }

    if (!commandExists('git')) {
        throw new Error('Git belum tersedia di server ini. Install git terlebih dahulu.');
    }

    if (fs.existsSync(appDir) && fs.readdirSync(appDir).length > 0) {
        throw new Error(`Folder ${appDir} sudah ada dan tidak kosong, tapi bukan project CloudBot.`);
    }

    log(`Mengambil data dari ${REPO_URL}`);
    run('git', ['clone', REPO_URL, appDir], { cwd: process.cwd() });
}

function ensureDependencies(appDir) {
    if (!commandExists('npm')) {
        throw new Error('NPM belum tersedia di server ini. Install Node.js dan npm terlebih dahulu.');
    }

    const nodeModulesPath = path.join(appDir, 'node_modules');
    if (fs.existsSync(nodeModulesPath)) {
        log('Dependency sudah tersedia.');
        return;
    }

    log('Install dependency project. Ini bisa memakan waktu beberapa menit.');
    run('npm', ['install'], { cwd: appDir });
}

async function resolveWingsCommand(appDir) {
    const config = readConfig(appDir);
    const argCommand = process.argv.slice(2).join(' ');

    if (argCommand) {
        config.wingsCommand = sanitizeWingsCommand(argCommand);
        writeConfig(appDir, config);
        log('Command wings dari argumen berhasil disimpan.');
        return config.wingsCommand;
    }

    if (config.wingsCommand) return config.wingsCommand;

    console.log('');
    console.log('SETUP berhasil.');
    console.log('Silahkan kirim/paste command wings allocation, contoh:');
    console.log('node wings.js --uuid dab26ef9-5199-4616-8083-c5ff5014be0f --token b35ca7b4fe8396a1958a5c960761d173775559fd6a810f84152d7ddba1b741e8 --master https://zxcoderid.web.id --port 3101 --url http://IP-SERVER-WINGS:3101');
    console.log('');

    const answer = await ask('Command wings: ');
    config.wingsCommand = sanitizeWingsCommand(answer);
    writeConfig(appDir, config);
    log('Command wings berhasil disimpan.');
    return config.wingsCommand;
}

function startWings(appDir, commandLine) {
    const parts = parseCommand(commandLine);
    const command = parts.shift();

    log(`Menjalankan: ${commandLine}`);
    const child = spawn(command, parts, {
        cwd: appDir,
        stdio: 'inherit',
        shell: process.platform === 'win32'
    });

    child.on('exit', code => {
        process.exit(code || 0);
    });
}

async function main() {
    try {
        const appDir = resolveAppDir();
        await ensureProject(appDir);
        ensureDependencies(appDir);

        const commandLine = await resolveWingsCommand(appDir);
        console.log('');
        console.log('SETUP berhasil. Wings akan dijalankan sekarang.');
        startWings(appDir, commandLine);
    } catch (err) {
        console.error('[START] ERROR:', err.message);
        process.exit(1);
    }
}

main();
