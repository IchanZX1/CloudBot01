const { dirname } = require("path");
const path = require("path");
const crypto = require("crypto");
const { ffmpeg } = require("./converter.js");
const webp = require("node-webpmux");

const tmp = path.join(__dirname, "../tmp");
/**
 * Image to Sticker
 * @param {Buffer} img Image Buffer
 * @param {String} url Image URL
 */
async function sticker4(img, url) {
  if (url) {
    let res = await fetch(url);
    if (res.status !== 200) throw await res.text();

    img = await res.buffer();
  }

  return await ffmpeg(
    img,
    [
      "-vf",
      "scale=512:512:flags=lanczos:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000,setsar=1",
    ],
    "jpeg",
    "webp"
  );
}

async function canvas(code, type = "png", quality = 0.92) {
  let res = await fetch(
    "https://nurutomo.herokuapp.com/api/canvas?" +
      queryURL({
        type,
        quality,
      }),
    {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
        "Content-Length": code.length,
      },
      body: code,
    }
  );
  let image = await res.buffer();
  return image;
}

function queryURL(queries) {
  return new URLSearchParams(Object.entries(queries));
}

/**
 * Add WhatsApp JSON Exif Metadata
 * Taken from https://github.com/pedroslopez/whatsapp-web.js/pull/527/files
 * @param {Buffer} webpSticker
 * @param {String} packname
 * @param {String} author
 * @param {String} categories
 * @param {Object} extra
 * @returns
 */
async function addExif(
  webpSticker,
  packname,
  author,
  categories = [""],
  extra = {}
) {
  const img = new webp.Image();
  const stickerPackId = crypto.randomBytes(32).toString("hex");
  const plink =
    "https://play.google.com/store/apps/details?id=com.snowcorp.stickerly.android";
  const alink =
    "https://itunes.apple.com/app/sticker-maker-studio/id1443326857";
  const json = {
    "sticker-pack-id": stickerPackId,
    "sticker-pack-name": packname,
    "sticker-pack-publisher": author,
    "android-app-store-link": plink,
    "Ios-app-store-link": alink,
    emojis: categories,
    ...extra,
  };
  let exifAttr = Buffer.from([
    0x49, 0x49, 0x2a, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57,
    0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00,
  ]);
  let jsonBuffer = Buffer.from(JSON.stringify(json), "utf8");
  let exif = Buffer.concat([exifAttr, jsonBuffer]);
  exif.writeUIntLE(jsonBuffer.length, 14, 4);
  await img.load(webpSticker);
  img.exif = exif;
  return await img.save(null);
}

/**
 * Image/Video to Sticker
 * @param {Buffer} img Image/Video Buffer
 * @param {String} url Image/Video URL
 * @param {...String}
 */
async function sticker(img, url, packname, author, categories) {
  const sticker = await sticker4(img, url);
  const r = await addExif(sticker, packname, author, categories || ["🤖"]);

  return r;

  /*let lastError, stiker
  for (let func of [
    sticker3, global.support.ffmpeg && sticker6, sticker5,
    global.support.ffmpeg && global.support.ffmpegWebp && sticker4,
    global.support.ffmpeg && (global.support.convert || global.support.magick || global.support.gm) && sticker2,
    sticker1
  ].filter(f => f)) {
    try {
      stiker = await func(img, url, ...args)
      if (stiker.includes('WEBP')) {
        try {
          return await addExif(stiker, ...args)
        } catch (e) {
          console.error(e)
          return stiker
        }
      }
      if (stiker.includes('html')) continue
      throw stiker.toString()
    } catch (err) {
      lastError = err
      continue
    }
  }
  console.error(lastError)
  return lastError*/
}

const support = {
  ffmpeg: true,
  ffprobe: true,
  ffmpegWebp: true,
  convert: true,
  magick: true,
  gm: true,
  find: false,
};

module.exports = {
  sticker,
  addExif,
  support,
};
