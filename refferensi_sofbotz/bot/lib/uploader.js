let axios = require("axios");
let FormData = require("form-data");
let { fromBuffer } = require("file-type");
let fetch = require("node-fetch");
let fs = require("fs");
let cheerio = require("cheerio");
let FakeUseragent = require("fake-useragent");

async function quax(path) {
  let data = new FormData();
  data.append("files[]", fs.createReadStream(path));
  data.append("expiry", "30");

  let config = {
    method: "POST",
    url: "https://qu.ax/upload.php",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36",
      "sec-ch-ua-platform": '"Android"',
      "sec-ch-ua":
        '"Not;A=Brand";v="99", "Google Chrome";v="139", "Chromium";v="139"',
      dnt: "1",
      "sec-ch-ua-mobile": "?1",
      origin: "https://qu.ax",
      "sec-fetch-site": "same-origin",
      "sec-fetch-mode": "cors",
      "sec-fetch-dest": "empty",
      referer: "https://qu.ax/",
      "accept-language": "id,en-US;q=0.9,en;q=0.8,ja;q=0.7",
      priority: "u=1, i",
    },
    data: data,
  };

  const api = await axios.request(config);
  return api.data;
}

async function drizzup(filePath) {
  const form = new FormData();
  form.append("file", fs.createReadStream(filePath));
  form.append("expire_value", "24");
  form.append("expire_unit", "hours");
  const res = await axios.post("https://lunara.softbotz.my.id/upload", form, {
    headers: form.getHeaders(),
    maxBodyLength: Infinity,
    maxContentLength: Infinity,
  });
  return res.data.file_url;
}

async function uploadPomf(filePath) {
  try {
    const form = new FormData();
    form.append("files[]", fs.createReadStream(filePath));

    const response = await axios.post(
      "https://pomf2.lain.la/upload.php",
      form,
      {
        headers: {
          ...form.getHeaders(),
          "User-Agent": FakeUseragent(),
          Connection: "keep-alive",
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        timeout: 60000,
      }
    );

    if (
      response.data &&
      response.data.files &&
      response.data.files.length > 0
    ) {
      return response.data.files[0].url;
    } else {
      throw new Error("Gagal mengunggah.");
    }
  } catch (err) {
    console.error("Error upload:", err.message);
    return null;
  }
}

async function uptoibb(path) {
  return new Promise(async (resolve, reject) => {
    require("imgbb-uploader")("10db8b8b7e698abcf5466a6bbc592c24", path).then(
      (res) => {
        resolve(res.url);
      }
    );
  });
}

async function shojib(buffer) {
  try {
    return await new Promise(async (resolve, reject) => {
      if (!Buffer.isBuffer(buffer)) return reject("invalid buffer input!");
      const form = new FormData();
      form.append("file", buffer, {
        filename: `${Math.random().toString(32).slice(2)}.png`,
        contentType: "image/png",
      });
      axios
        .post("https://chat-gpt.photos/api/uploadImage", form, {
          headers: {
            ...form.getHeaders(),
          },
        })
        .then((res) => {
          if (!res.data?.location) return reject("failed upload media to cdn!");
          resolve({
            success: true,
            image: res.data.location,
          });
        })
        .catch(reject);
    });
  } catch (e) {
    return {
      success: false,
      errors: [e],
    };
  }
}

async function UploadFileUgu(input) {
  return new Promise(async (resolve, reject) => {
    const form = new FormData();
    form.append("files[]", fs.createReadStream(input));
    await axios({
      url: "https://uguu.se/upload.php",
      method: "POST",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
        ...form.getHeaders(),
      },
      data: form,
    })
      .then((data) => {
        resolve(data.data.files[0]);
      })
      .catch((err) => reject(err));
  });
}

function webp2mp4File(path) {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append("new-image-url", "");
    form.append("new-image", fs.createReadStream(path));
    axios({
      method: "post",
      url: "https://ezgif.com/webp-to-mp4",
      data: form,
      headers: {
        "Content-Type": `multipart/form-data; boundary=${form._boundary}`,
      },
    })
      .then(({ data }) => {
        const FormDataThen = new FormData();
        const $ = cheerio.load(data);
        const file = $('input[name="file"]').attr("value");
        FormDataThen.append("file", file);
        FormDataThen.append("convert", "Convert WebP to MP4!");
        axios({
          method: "post",
          url: "https://ezgif.com/webp-to-mp4/" + file,
          data: FormDataThen,
          headers: {
            "Content-Type": `multipart/form-data; boundary=${FormDataThen._boundary}`,
          },
        })
          .then(({ data }) => {
            const $ = cheerio.load(data);
            const result =
              "https:" +
              $("div#output > p.outfile > video > source").attr("src");
            resolve({
              status: true,
              message: "Created By Dimas Botzz",
              result: result,
            });
          })
          .catch(reject);
      })
      .catch(reject);
  });
}

function UpHardianto(path) {
  return new Promise(async (resolve, reject) => {
    var form = new FormData();
    form.append("recfile", fs.createReadStream(path));
    await axios(`https://uploader.hardianto.xyz/upload`, {
      method: "POST",
      data: form,
      headers: {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9,id;q=0.8",
        "content-type": `multipart/form-data; boundary=${form._boundary}`,
      },
    })
      .then(({ data }) => {
        console.log(data.file);
        resolve(data.file);
      })
      .catch((e) => console.log(e));
  });
}

async function floNime(medianya, options = {}) {
  const { ext } = (await fromBuffer(medianya)) || options.ext;
  var form = new FormData();
  form.append("file", medianya, "tmp." + ext);
  let jsonnya = await fetch("https://flonime.my.id/upload", {
    method: "POST",
    body: form,
  }).then((response) => response.json());
  return jsonnya;
}

async function uploaderSSA(buffer) {
  try {
    const { ext } = await fromBuffer(buffer);
    let form = new FormData();
    form.append("file", buffer, "tmp." + ext);
    const { data } = await axios.post(
      "https://upload.ssateam.my.id/upload",
      form,
      {
        headers: {
          accept: "application/json",
          ...form.getHeaders(),
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data;
  } catch (e) {
    console.log(e);
  }
}

module.exports = {
  drizzup,
  quax,
  uptoibb,
  shojib,
  UploadFileUgu,
  webp2mp4File,
  UpHardianto,
  floNime,
  uploaderSSA,
  uploadPomf,
};
