const { createCanvas, GlobalFonts, loadImage } = require('@napi-rs/canvas');
const fs = require('fs');
const path = require('path');

class CanvasFFLobby {
  constructor(options = {}) {
    this.rootDir = options.rootDir || path.join(__dirname, '..', '..');
    this.fontsDir = options.fontsDir || path.join(this.rootDir, 'fonts');
    this.templateDir = options.templateDir || path.join(this.rootDir, 'lib', 'free fire');
    this.maxNameLength = options.maxNameLength || 25;

    this.singleTemplates = {
      blue: 'single_01.jpg',
      gold: 'single_02.jpg',
      red: 'single_03.jpg',
      single_01: 'single_01.jpg',
      single_02: 'single_02.jpg',
      single_03: 'single_03.jpg',
      single_04: 'single_04.jpg',
      single_05: 'single_05.jpg',
      single_06: 'single_06.jpg',
    };

    this.duoTemplates = {
      duo: 'duo_01.jpg',
      blue: 'duo_01.jpg',
      gold: 'duo_02.jpg',
      red: 'duo_04.jpg',
      duo_01: 'duo_01.jpg',
      duo_02: 'duo_02.jpg',
      duo_03: 'duo_03.jpg',
      duo_04: 'duo_04.jpg',
      duo_05: 'duo_05.jpg',
    };

    this.nameLayouts = {
      single: {
        default: {
          main: { x: 0.58, y: 0.805, maxWidth: 0.35, maxSize: 38, minSize: 24, color: '#ffd447' },
        },
        single_01: {
          main: { x: 0.58, y: 0.797, maxWidth: 0.37, maxSize: 46, minSize: 24, color: '#ffd447' },
        },
        single_02: {
          main: { x: 0.49, y: 0.797, maxWidth: 0.37, maxSize: 46, minSize: 24, color: '#ffd447' },
        },
        single_03: {
          main: { x: 0.52, y: 0.797, maxWidth: 0.37, maxSize: 46, minSize: 24, color: '#ffd447' },
        },
        single_04: {
          main: { x: 0.50, y: 0.797, maxWidth: 0.37, maxSize: 46, minSize: 24, color: '#ffd447' },
        },
        single_05: {
          main: { x: 0.52, y: 0.799, maxWidth: 0.37, maxSize: 46, minSize: 24, color: '#ffd447' },
        },
        single_06: {
          main: { x: 0.51, y: 0.797, maxWidth: 0.37, maxSize: 46, minSize: 24, color: '#ffd447' },
        },
      },
      duo: {
        default: {
          left: { x: 0.25, y: 0.79, maxWidth: 0.28, maxSize: 34, minSize: 22, color: '#ffd447' },
          right: { x: 0.76, y: 0.71, maxWidth: 0.25, maxSize: 34, minSize: 22, color: '#ffd447' },
        },
        duo_01: {
          left: { x: 0.22, y: 0.797, maxWidth: 0.37, maxSize: 46, minSize: 24, color: '#ffd447' },
          right: { x: 0.79, y: 0.72, maxWidth: 0.25, maxSize: 34, minSize: 22, color: '#ffd447' },
        },
        duo_02: {
          left: { x: 0.20, y: 0.797, maxWidth: 0.37, maxSize: 46, minSize: 24, color: '#ffd447' },
          right: { x: 0.79, y: 0.72, maxWidth: 0.25, maxSize: 36, minSize: 22, color: '#ffd447' },
        },
        duo_03: {
          left: { x: 0.20, y: 0.797, maxWidth: 0.37, maxSize: 46, minSize: 24, color: '#ffd447' },
          right: { x: 0.74, y: 0.72, maxWidth: 0.25, maxSize: 36, minSize: 22, color: '#ffd447' },
        },
        duo_04: {
          left: { x: 0.20, y: 0.797, maxWidth: 0.37, maxSize: 46, minSize: 24, color: '#ffd447' },
          right: { x: 0.79, y: 0.72, maxWidth: 0.25, maxSize: 36, minSize: 22, color: '#ffd447' },
        },
        duo_05: {
          left: { x: 0.22, y: 0.797, maxWidth: 0.37, maxSize: 46, minSize: 24, color: '#ffd447' },
          right: { x: 0.77, y: 0.72, maxWidth: 0.25, maxSize: 36, minSize: 22, color: '#ffd447' },
        },
      },
    };

    this.loadFonts();
  }

  loadFonts() {
    if (fs.existsSync(this.fontsDir)) GlobalFonts.loadFontsFromDir(this.fontsDir);
    GlobalFonts.loadSystemFonts();
  }

  listTemplates() {
    return {
      single: Object.keys(this.singleTemplates).filter((key) => key.startsWith('single_')),
      duo: Object.keys(this.duoTemplates).filter((key) => key.startsWith('duo_')),
    };
  }

  getTemplateType(template) {
    if (this.singleTemplates[template]) return 'single';
    if (this.duoTemplates[template]) return 'duo';
    return null;
  }

  validateName(name, label = 'Nama') {
    const clean = String(name || '').trim();
    if (!clean) throw new Error(`${label} tidak boleh kosong.`);
    if (clean.length > this.maxNameLength) {
      throw new Error(`${label} maksimal ${this.maxNameLength} karakter.`);
    }
    return clean;
  }

  resolveTemplate(type, templateOrTheme) {
    const map = type === 'duo' ? this.duoTemplates : this.singleTemplates;
    const fallback = type === 'duo' ? map.duo : map.blue;
    const selected = templateOrTheme || fallback;
    const fileName = map[selected] || selected;
    const filePath = path.isAbsolute(fileName) ? fileName : path.join(this.templateDir, fileName);

    if (!fs.existsSync(filePath)) {
      throw new Error(`Template tidak ditemukan: ${filePath}`);
    }

    return filePath;
  }

  templateKey(templatePath) {
    return path.basename(templatePath, path.extname(templatePath));
  }

  getLayout(type, key, slot) {
    return {
      ...this.nameLayouts[type].default[slot],
      ...(this.nameLayouts[type][key]?.[slot] || {}),
    };
  }

  toPixel(value, total) {
    return Math.abs(value) <= 1 ? value * total : value;
  }

  fitFontSize(text, maxWidth, maxSize, minSize) {
    return Math.min(maxSize, Math.max(minSize, maxWidth / Math.max(text.length, 1)));
  }

  drawNameText(ctx, text, x, y, fontSize, color = '#ffd447') {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `800 ${fontSize}px "Rajdhani", "Russo One", "Orbitron", sans-serif`;
    ctx.lineJoin = 'round';
    ctx.lineWidth = Math.max(3, fontSize * 0.08);
    ctx.strokeStyle = 'rgba(40,20,0,0.85)';
    ctx.shadowColor = 'rgba(0,0,0,0.85)';
    ctx.shadowBlur = 5;
    ctx.strokeText(text, x, y);
    ctx.shadowColor = '#ffbd22';
    ctx.shadowBlur = 4;
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  drawNameByLayout(ctx, text, layout, W, H) {
    const x = this.toPixel(layout.x, W);
    const y = this.toPixel(layout.y, H);
    const maxWidth = this.toPixel(layout.maxWidth, W);
    const fontSize = this.fitFontSize(text, maxWidth, layout.maxSize, layout.minSize);
    this.drawNameText(ctx, text, x, y, fontSize, layout.color);
  }

  async renderSingle(nickname, options = {}) {
    const name = this.validateName(nickname, 'Nama');
    const templatePath = this.resolveTemplate('single', options.template || options.theme || 'single_01');
    const templateImage = await loadImage(templatePath);
    const W = templateImage.width;
    const H = templateImage.height;
    const canvas = createCanvas(W, H);
    const ctx = canvas.getContext('2d');
    const key = this.templateKey(templatePath);

    ctx.drawImage(templateImage, 0, 0, W, H);
    this.drawNameByLayout(ctx, name, this.getLayout('single', key, 'main'), W, H);

    return canvas.toBuffer('image/png');
  }

  async renderDuo(nickname1, nickname2, options = {}) {
    const leftName = this.validateName(nickname1, 'Nama kiri');
    const rightName = this.validateName(nickname2, 'Nama kanan');
    const templatePath = this.resolveTemplate('duo', options.template || options.theme || 'duo_01');
    const templateImage = await loadImage(templatePath);
    const W = templateImage.width;
    const H = templateImage.height;
    const canvas = createCanvas(W, H);
    const ctx = canvas.getContext('2d');
    const key = this.templateKey(templatePath);

    ctx.drawImage(templateImage, 0, 0, W, H);
    this.drawNameByLayout(ctx, leftName, this.getLayout('duo', key, 'left'), W, H);
    this.drawNameByLayout(ctx, rightName, this.getLayout('duo', key, 'right'), W, H);

    return canvas.toBuffer('image/png');
  }
}

module.exports = CanvasFFLobby;
