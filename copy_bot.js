const fs = require('fs-extra');
const path = require('path');

async function copyBot() {
  const sourceDir = 'd:\\Website TopUp\\ZXcoderID CloudBot';
  const destDir = path.join(sourceDir, 'Nano-Botz');

  const excludes = [
    'Nano-Botz',
    'node_modules',
    'views',
    'publics',
    'models',
    'apps.js',
    'bot_service.js',
    'connect.html',
    'copy_bot.js',
    '.git',
    'session',
    'ZXcoderID CloudBot.zip'
  ];

  await fs.ensureDir(destDir);

  const items = await fs.readdir(sourceDir);
  for (const item of items) {
    if (excludes.includes(item)) continue;
    // skip dynamic data folders like data1234 inside the root folder if any, but don't skip database or data
    if (item.startsWith('data') && !isNaN(parseInt(item.replace('data', '')))) continue; 
    if (item.startsWith('session')) continue; // skip sessions

    const srcPath = path.join(sourceDir, item);
    const destPath = path.join(destDir, item);
    console.log(`Copying ${item}...`);
    await fs.copy(srcPath, destPath);
  }

  // Now process index.js to remove mongoose website integration
  const indexPath = path.join(destDir, 'index.js');
  if (await fs.pathExists(indexPath)) {
    let indexCode = await fs.readFile(indexPath, 'utf8');

    const mongooseBlockRegex = /const mongoose = require\('mongoose'\);[\s\S]*?catch \(err\) \{\s*console\.error\("Error checking user package for bot " \+ targetNum, err\);\s*\}\s*\}/;
    
    indexCode = indexCode.replace(mongooseBlockRegex, '');
    
    await fs.writeFile(indexPath, indexCode);
  }

  // Update package.json to remove mongoose, express, ejs
  const pkgPath = path.join(destDir, 'package.json');
  if (await fs.pathExists(pkgPath)) {
    const pkg = await fs.readJson(pkgPath);
    if (pkg.dependencies) {
      delete pkg.dependencies['mongoose'];
      delete pkg.dependencies['express'];
      delete pkg.dependencies['ejs'];
    }
    await fs.writeJson(pkgPath, pkg, { spaces: 2 });
  }
  
  console.log('Copy complete!');
}

copyBot().catch(console.error);
