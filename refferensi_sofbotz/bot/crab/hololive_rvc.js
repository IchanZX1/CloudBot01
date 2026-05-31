async function hololive(audio, model = "zeta", pitch = 0) {
  let models;
  const WebSocket = require("ws");
  //   https://huggingface.co/spaces/Qwen/Qwen-VL-Plus
  const ws = new WebSocket(
    "wss://iqbalzz-hololive-rvc-models-v2.hf.space/queue/join"
  );
  if (model == "zeta") {
    models = 24;
  } else if ((model = "moona")) {
    models = 0;
  } else if ((model = "iofi")) {
    models = 4;
  } else if ((model = "risu")) {
    models = 8;
  } else if ((model = "ollie")) {
    models = 12;
  } else if ((model = "reine")) {
    models = 16;
  } else if ((model = "anya")) {
    models = 20;
  } else if ((model = "kobo")) {
    models = 28;
  } else if ((model = "kaela")) {
    models = 32;
  } else {
    return "Model tidak tersedia!. Gunakan zeta, moona, iofi, risu, ollie, reine, anya, kobo, kaela";
  }
  const hash = Math.random().toString(36).substring(2);

  return new Promise((resolve, reject) => {
    let sessionHash = hash;

    ws.on("open", () => {
      console.log("Connected to server");
      ws.send(
        JSON.stringify({
          msg: "send_hash",
          fn_index: models,
          session_hash: sessionHash,
        })
      );
    });

    ws.on("message", async (message) => {
      const json = JSON.parse(message);
      const msg = json.msg;

      if (msg === "send_hash") {
        ws.send(
          JSON.stringify({
            data: [
              "Upload audio",
              "",
              {
                data: "data:audio/mp3;base64," + audio,
                name: new Date().getTime() + ".mp3",
              },
              "",
              "en-US-AnaNeural-Female",
              pitch,
              "pm",
              0.4,
              1,
              0,
              1,
              0.23,
            ],
            event_data: null,
            fn_index: models,
            session_hash: sessionHash,
          })
        );
      } else if (msg === "process_starts") {
      } else if (msg === "process_completed") {
        resolve(
          json
            ? "https://iqbalzz-hololive-rvc-models-v2.hf.space/file=" +
                json.output.data[1].name
            : 404
        );
        ws.close();
      }
    });

    ws.on("error", (err) => {
      console.error(`WebSocket error: ${err}`);
      reject(err);
    });
  });
}

// hololive().then((data) => console.log(data)).catch((err) => console.error(err));
module.exports = { hololive };
